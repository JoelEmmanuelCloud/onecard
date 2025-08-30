import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { supabase } from '@/lib/supabase'
import { sendPaymentSuccessEmail, sendCardActivatedEmail } from '@/lib/emailNotifications'

export async function POST(request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-paystack-signature')

    // Verify webhook signature
    const hash = createHash('sha512')
      .update(JSON.stringify(JSON.parse(body)), 'utf-8')
      .digest('hex')

    if (hash !== signature) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    const event = JSON.parse(body)
    console.log('Webhook event received:', event.event)

    // Handle different webhook events
    switch (event.event) {
      case 'charge.success':
        await handleChargeSuccess(event.data)
        break

      case 'subscription.create':
        await handleSubscriptionCreate(event.data)
        break

      case 'subscription.disable':
        await handleSubscriptionDisable(event.data)
        break

      case 'invoice.create':
        await handleInvoiceCreate(event.data)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data)
        break

      case 'subscription.not_renew':
        await handleSubscriptionNotRenew(event.data)
        break

      default:
        console.log('Unhandled webhook event:', event.event)
    }

    return NextResponse.json({ message: 'Webhook processed successfully' })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleChargeSuccess(data) {
  try {
    console.log('Processing successful charge:', data.reference)

    // Update payment record
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: 'completed',
        amount: data.amount / 100,
        currency: data.currency,
        completed_at: new Date().toISOString(),
        paystack_data: data
      })
      .eq('reference', data.reference)

    if (updateError) {
      console.error('Error updating payment:', updateError)
      return
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', data.customer.email)
      .single()

    if (!profile) {
      console.error('User profile not found for email:', data.customer.email)
      return
    }

    const metadata = data.metadata || {}

    // Handle card purchase
    if (metadata.card_purchase === 'true' || metadata.card_purchase === true) {
      await processCardPurchase(data, profile, metadata)
    }

    // Handle subscription payment
    if (metadata.subscription === 'true' || metadata.subscription === true) {
      await processSubscriptionPayment(data, profile, metadata)
    }

    // Send payment success email
    await sendPaymentSuccessEmail(data.customer.email, {
      name: profile.full_name || data.customer.first_name || 'Customer',
      planName: metadata.plan_type || 'Basic Plan',
      amount: (data.amount / 100).toFixed(2),
      transactionId: data.reference,
      dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`
    })

    console.log('Charge success processed successfully')

  } catch (error) {
    console.error('Error handling charge success:', error)
  }
}

async function processCardPurchase(data, profile, metadata) {
  try {
    // Generate unique card ID
    const cardId = generateCardId()

    // Create card record
    const { error: cardError } = await supabase
      .from('cards')
      .insert([{
        card_id: cardId,
        user_id: profile.user_id,
        is_activated: false,
        payment_reference: data.reference,
        plan_type: metadata.plan_type || 'basic'
      }])

    if (cardError) {
      console.error('Error creating card record:', cardError)
      return
    }

    // Log card purchase
    await supabase
      .from('activity_logs')
      .insert([{
        user_id: profile.user_id,
        activity_type: 'card_purchased',
        details: {
          card_id: cardId,
          amount: data.amount / 100,
          plan_type: metadata.plan_type
        }
      }])

    console.log('Card purchase processed:', cardId)

  } catch (error) {
    console.error('Error processing card purchase:', error)
  }
}

async function processSubscriptionPayment(data, profile, metadata) {
  try {
    // Calculate expiry date based on billing cycle
    const expiryDate = new Date()
    const billingCycle = metadata.billing_cycle || 'monthly'
    
    if (billingCycle === 'annual') {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1)
    } else {
      expiryDate.setMonth(expiryDate.getMonth() + 1)
    }

    // Update or create subscription
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .upsert([{
        user_id: profile.user_id,
        plan_type: metadata.plan_type || 'premium',
        status: 'active',
        paystack_subscription_id: data.authorization?.authorization_code,
        payment_reference: data.reference,
        billing_cycle: billingCycle,
        started_at: new Date().toISOString(),
        expires_at: expiryDate.toISOString(),
        last_payment_at: new Date().toISOString()
      }])

    if (subscriptionError) {
      console.error('Error updating subscription:', subscriptionError)
      return
    }

    // Log subscription activity
    await supabase
      .from('activity_logs')
      .insert([{
        user_id: profile.user_id,
        activity_type: 'subscription_payment',
        details: {
          amount: data.amount / 100,
          plan_type: metadata.plan_type,
          billing_cycle: billingCycle
        }
      }])

    console.log('Subscription payment processed successfully')

  } catch (error) {
    console.error('Error processing subscription payment:', error)
  }
}

async function handleSubscriptionCreate(data) {
  try {
    console.log('Processing subscription creation:', data.subscription_code)

    // Get customer information
    const customer = data.customer
    
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', customer.email)
      .single()

    if (!profile) {
      console.error('User profile not found for subscription creation')
      return
    }

    // Create subscription record
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert([{
        user_id: profile.user_id,
        plan_type: 'premium',
        status: 'active',
        paystack_subscription_id: data.subscription_code,
        created_at: new Date().toISOString()
      }])

    if (subscriptionError) {
      console.error('Error creating subscription:', subscriptionError)
    }

    console.log('Subscription created successfully')

  } catch (error) {
    console.error('Error handling subscription creation:', error)
  }
}

async function handleSubscriptionDisable(data) {
  try {
    console.log('Processing subscription disable:', data.subscription_code)

    // Update subscription status
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString()
      })
      .eq('paystack_subscription_id', data.subscription_code)

    if (updateError) {
      console.error('Error disabling subscription:', updateError)
      return
    }

    // Get user information
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select(`
        *,
        profiles (email, full_name)
      `)
      .eq('paystack_subscription_id', data.subscription_code)
      .single()

    if (subscription?.profiles) {
      // Send subscription cancellation email
      await sendSubscriptionCancelledEmail(subscription.profiles.email, {
        name: subscription.profiles.full_name,
        cancelledAt: new Date().toLocaleDateString()
      })
    }

    console.log('Subscription disabled successfully')

  } catch (error) {
    console.error('Error handling subscription disable:', error)
  }
}

async function handleInvoiceCreate(data) {
  try {
    console.log('Processing invoice creation:', data.invoice_code)

    // Log invoice creation for record keeping
    await supabase
      .from('invoices')
      .insert([{
        invoice_code: data.invoice_code,
        subscription_code: data.subscription?.subscription_code,
        amount: data.amount / 100,
        currency: data.currency,
        status: data.status,
        due_date: data.due_date,
        paystack_data: data,
        created_at: new Date().toISOString()
      }])

  } catch (error) {
    console.error('Error handling invoice creation:', error)
  }
}

async function handleInvoicePaymentFailed(data) {
  try {
    console.log('Processing failed invoice payment:', data.invoice_code)

    // Update invoice status
    await supabase
      .from('invoices')
      .update({
        status: 'failed',
        failed_at: new Date().toISOString()
      })
      .eq('invoice_code', data.invoice_code)

    // Get subscription and user information
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select(`
        *,
        profiles (email, full_name)
      `)
      .eq('paystack_subscription_id', data.subscription?.subscription_code)
      .single()

    if (subscription?.profiles) {
      // Send payment failed email
      await sendPaymentFailedEmail(subscription.profiles.email, {
        name: subscription.profiles.full_name,
        amount: (data.amount / 100).toFixed(2),
        dueDate: new Date(data.due_date).toLocaleDateString(),
        retryUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`
      })
    }

  } catch (error) {
    console.error('Error handling invoice payment failed:', error)
  }
}

async function handleSubscriptionNotRenew(data) {
  try {
    console.log('Processing subscription not renew:', data.subscription_code)

    // Mark subscription as expiring
    await supabase
      .from('subscriptions')
      .update({
        status: 'expiring',
        will_not_renew: true
      })
      .eq('paystack_subscription_id', data.subscription_code)

    // Send expiration warning email
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select(`
        *,
        profiles (email, full_name)
      `)
      .eq('paystack_subscription_id', data.subscription_code)
      .single()

    if (subscription?.profiles) {
      await sendSubscriptionExpiringEmail(subscription.profiles.email, {
        name: subscription.profiles.full_name,
        expiryDate: new Date(subscription.expires_at).toLocaleDateString(),
        renewUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`
      })
    }

  } catch (error) {
    console.error('Error handling subscription not renew:', error)
  }
}

// Helper functions
function generateCardId() {
  const prefix = '1NC'
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substr(2, 4).toUpperCase()
  return `${prefix}${timestamp}${random}`
}

async function sendSubscriptionCancelledEmail(email, data) {
  try {
    await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject: '❌ Subscription Cancelled',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Hi ${data.name}!</h2>
            <p>Your 1necard subscription has been cancelled as of ${data.cancelledAt}.</p>
            <p>You can reactivate your subscription anytime from your dashboard.</p>
            <p>Thank you for using 1necard!</p>
          </div>
        `
      })
    })
  } catch (error) {
    console.error('Error sending cancellation email:', error)
  }
}

async function sendPaymentFailedEmail(email, data) {
  try {
    await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject: '⚠️ Payment Failed - Action Required',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Hi ${data.name}!</h2>
            <p>We were unable to process your subscription payment of $${data.amount}.</p>
            <p><strong>Due Date:</strong> ${data.dueDate}</p>
            <p>Please update your payment method to avoid service interruption.</p>
            <a href="${data.retryUrl}" style="background: #1E90FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Update Payment Method
            </a>
          </div>
        `
      })
    })
  } catch (error) {
    console.error('Error sending payment failed email:', error)
  }
}