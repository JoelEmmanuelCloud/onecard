import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { reference } = await request.json()

    if (!reference) {
      return NextResponse.json(
        { error: 'Payment reference is required' },
        { status: 400 }
      )
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!paystackResponse.ok) {
      throw new Error('Failed to verify payment with Paystack')
    }

    const paymentData = await paystackResponse.json()

    if (!paymentData.status) {
      return NextResponse.json(
        { error: 'Payment verification failed', details: paymentData.message },
        { status: 400 }
      )
    }

    const payment = paymentData.data

    // Check if payment was successful
    if (payment.status !== 'success') {
      return NextResponse.json(
        { error: 'Payment was not successful', status: payment.status },
        { status: 400 }
      )
    }

    // Update payment record in database
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: 'completed',
        amount: payment.amount / 100, // Convert from kobo to naira/dollars
        currency: payment.currency,
        completed_at: new Date().toISOString(),
        paystack_data: payment
      })
      .eq('reference', reference)

    if (updateError) {
      console.error('Error updating payment record:', updateError)
      return NextResponse.json(
        { error: 'Failed to update payment record' },
        { status: 500 }
      )
    }

    // Handle different payment types
    if (payment.metadata) {
      const metadata = payment.metadata

      // Handle card purchase
      if (metadata.card_purchase) {
        await handleCardPurchase(payment, metadata)
      }

      // Handle subscription
      if (metadata.subscription) {
        await handleSubscription(payment, metadata)
      }

      // Send confirmation email
      await sendPaymentConfirmationEmail(payment)
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      payment: {
        reference: payment.reference,
        amount: payment.amount / 100,
        currency: payment.currency,
        status: payment.status,
        paid_at: payment.paid_at,
      }
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Payment verification failed', details: error.message },
      { status: 500 }
    )
  }
}

async function handleCardPurchase(payment, metadata) {
  try {
    // Get user information
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', payment.customer.email)
      .single()

    if (profile) {
      // Generate card ID for physical card
      const cardId = `1NC${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`

      // Create card record
      await supabase
        .from('cards')
        .insert([{
          card_id: cardId,
          user_id: profile.user_id,
          is_activated: false,
          payment_reference: payment.reference
        }])

      // Send card purchase confirmation email
      const emailData = {
        to: payment.customer.email,
        template: 'cardPurchased',
        data: {
          name: profile.full_name || payment.customer.email,
          cardId: cardId,
          amount: payment.amount / 100,
          planType: metadata.plan_type || 'Basic Card'
        }
      }

      await sendEmail(emailData)
    }
  } catch (error) {
    console.error('Error handling card purchase:', error)
  }
}

async function handleSubscription(payment, metadata) {
  try {
    // Get user information
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', payment.customer.email)
      .single()

    if (profile) {
      // Calculate subscription expiry date
      const expiryDate = new Date()
      const billingCycle = metadata.billing_cycle || 'monthly'
      
      if (billingCycle === 'annual') {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1)
      } else {
        expiryDate.setMonth(expiryDate.getMonth() + 1)
      }

      // Create or update subscription
      await supabase
        .from('subscriptions')
        .upsert([{
          user_id: profile.user_id,
          plan_type: metadata.plan_type || 'premium',
          status: 'active',
          paystack_subscription_id: payment.authorization?.authorization_code,
          payment_reference: payment.reference,
          started_at: new Date().toISOString(),
          expires_at: expiryDate.toISOString()
        }])
    }
  } catch (error) {
    console.error('Error handling subscription:', error)
  }
}

async function sendPaymentConfirmationEmail(payment) {
  try {
    const emailResponse = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: payment.customer.email,
        subject: '✅ Payment Confirmed - Thank you!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0A0E27 0%, #1E90FF 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1>✅ Payment Confirmed!</h1>
              <p>Thank you for your purchase</p>
            </div>
            <div style="background: white; padding: 40px 20px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2>Hi ${payment.customer.first_name || 'there'}!</h2>
              <p>Your payment has been successfully processed.</p>
              <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3>Payment Details</h3>
                <p><strong>Amount:</strong> ${payment.currency.toUpperCase()} ${(payment.amount / 100).toLocaleString()}</p>
                <p><strong>Reference:</strong> ${payment.reference}</p>
                <p><strong>Date:</strong> ${new Date(payment.paid_at).toLocaleDateString()}</p>
              </div>
              <p>If you have any questions, please contact our support team.</p>
              <p>Best regards,<br>The Onecard Team</p>
            </div>
          </div>
        `
      })
    })

    if (!emailResponse.ok) {
      console.error('Failed to send payment confirmation email')
    }
  } catch (error) {
    console.error('Error sending payment confirmation email:', error)
  }
}

async function sendEmail(emailData) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    })

    return response.ok
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}