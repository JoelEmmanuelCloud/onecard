import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============= AUTH FUNCTIONS =============

export const signUp = async (email, password, userData) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })
  return { data, error }
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`
  })
  return { data, error }
}

export const updatePassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  })
  return { data, error }
}

// ============= PROFILE FUNCTIONS =============

export const createProfile = async (profileData) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([profileData])
    .select()
  return { data, error }
}

export const updateProfile = async (userId, profileData) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('user_id', userId)
    .select()
  return { data, error }
}

export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  return { data, error }
}

export const getProfileByUsername = async (username) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()
  return { data, error }
}

export const deactivateProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ is_active: false })
    .eq('user_id', userId)
    .select()
  return { data, error }
}

export const activateProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ is_active: true })
    .eq('user_id', userId)
    .select()
  return { data, error }
}

// ============= CARD FUNCTIONS =============

export const createCard = async (cardData) => {
  const { data, error } = await supabase
    .from('cards')
    .insert([cardData])
    .select()
  return { data, error }
}

export const activateCard = async (cardId, userId) => {
  const { data, error } = await supabase
    .from('cards')
    .update({ 
      user_id: userId, 
      is_activated: true, 
      activated_at: new Date().toISOString() 
    })
    .eq('card_id', cardId)
    .select()
  return { data, error }
}

export const getCardByCardId = async (cardId) => {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('card_id', cardId)
    .single()
  return { data, error }
}

export const getUserCards = async (userId) => {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

// ============= ANALYTICS FUNCTIONS =============

export const trackProfileView = async (viewData) => {
  const { data, error } = await supabase
    .from('profile_views')
    .insert([{
      profile_id: viewData.profileId,
      viewer_ip: viewData.viewerIp || 'anonymous',
      viewer_location: viewData.viewerLocation,
      device_type: viewData.deviceType,
      referrer: viewData.referrer,
      action_type: viewData.actionType || 'profile_view',
      viewed_at: new Date().toISOString()
    }])
  return { data, error }
}

export const getProfileAnalytics = async (profileId, timeRange = '30d') => {
  const startDate = new Date()
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from('profile_views')
    .select('*')
    .eq('profile_id', profileId)
    .gte('viewed_at', startDate.toISOString())
    .order('viewed_at', { ascending: false })
  
  return { data, error }
}

export const getProfileViewsCount = async (profileId) => {
  const { count, error } = await supabase
    .from('profile_views')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', profileId)
  return { count, error }
}

// ============= PAYMENT FUNCTIONS =============

export const createPaymentRecord = async (paymentData) => {
  const { data, error } = await supabase
    .from('payments')
    .insert([{
      user_id: paymentData.userId,
      reference: paymentData.reference,
      amount: paymentData.amount,
      currency: paymentData.currency || 'NGN',
      status: paymentData.status || 'pending',
      plan_type: paymentData.planType,
      payment_type: paymentData.paymentType, // 'card' or 'subscription'
      metadata: paymentData.metadata,
      created_at: new Date().toISOString()
    }])
    .select()
  return { data, error }
}

export const updatePaymentStatus = async (reference, status, completedAt = null) => {
  const { data, error } = await supabase
    .from('payments')
    .update({ 
      status,
      completed_at: completedAt || (status === 'completed' ? new Date().toISOString() : null)
    })
    .eq('reference', reference)
    .select()
  return { data, error }
}

export const getPaymentByReference = async (reference) => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('reference', reference)
    .single()
  return { data, error }
}

export const getUserPayments = async (userId) => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

// ============= SUBSCRIPTION FUNCTIONS =============

export const createSubscription = async (subscriptionData) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .insert([{
      user_id: subscriptionData.userId,
      plan_type: subscriptionData.planType,
      status: subscriptionData.status || 'active',
      paystack_subscription_id: subscriptionData.paystackSubscriptionId,
      started_at: subscriptionData.startedAt || new Date().toISOString(),
      expires_at: subscriptionData.expiresAt,
      created_at: new Date().toISOString()
    }])
    .select()
  return { data, error }
}

export const updateSubscription = async (userId, updateData) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .update(updateData)
    .eq('user_id', userId)
    .select()
  return { data, error }
}

export const getUserSubscription = async (userId) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()
  return { data, error }
}

export const cancelSubscription = async (userId) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .update({ 
      status: 'cancelled',
      cancelled_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .select()
  return { data, error }
}

export const getExpiringSubscriptions = async (daysAhead = 7) => {
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + daysAhead)

  const { data, error } = await supabase
    .from('subscriptions')
    .select(`
      *,
      profiles (
        user_id,
        first_name,
        last_name,
        full_name,
        email
      )
    `)
    .eq('status', 'active')
    .lte('expires_at', futureDate.toISOString())
  
  return { data, error }
}

// ============= EMAIL FUNCTIONS =============

export const logEmail = async (emailData) => {
  const { data, error } = await supabase
    .from('email_logs')
    .insert([{
      user_id: emailData.userId,
      recipient: emailData.recipient,
      template: emailData.template,
      template_data: emailData.templateData,
      status: emailData.status,
      error_message: emailData.errorMessage,
      sent_at: new Date().toISOString()
    }])
  return { data, error }
}

export const getEmailPreferences = async (userId) => {
  const { data, error } = await supabase
    .from('email_preferences')
    .select('*')
    .eq('user_id', userId)
    .single()
  return { data, error }
}

export const updateEmailPreferences = async (userId, preferences) => {
  const { data, error } = await supabase
    .from('email_preferences')
    .upsert([{
      user_id: userId,
      welcome_emails: preferences.welcomeEmails ?? true,
      activity_notifications: preferences.activityNotifications ?? true,
      weekly_reports: preferences.weeklyReports ?? true,
      marketing_emails: preferences.marketingEmails ?? false,
      payment_notifications: preferences.paymentNotifications ?? true,
      security_alerts: preferences.securityAlerts ?? true,
      updated_at: new Date().toISOString()
    }], {
      onConflict: 'user_id'
    })
    .select()
  return { data, error }
}

export const addToEmailOptOut = async (email, optOutType = 'all') => {
  const { data, error } = await supabase
    .from('email_opt_outs')
    .upsert([{
      email,
      opt_out_type: optOutType,
      opted_out_at: new Date().toISOString()
    }], {
      onConflict: 'email'
    })
  return { data, error }
}

export const isEmailOptedOut = async (email) => {
  const { data, error } = await supabase
    .from('email_opt_outs')
    .select('opt_out_type')
    .eq('email', email)
    .single()
  return { data, error }
}

// ============= ADMIN FUNCTIONS =============

export const getAllUsers = async (limit = 100, offset = 0) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      subscriptions (*),
      cards (*)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  return { data, error }
}

export const getUsersCount = async () => {
  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
  return { count, error }
}

export const getRevenueStats = async () => {
  const { data, error } = await supabase
    .from('payments')
    .select('amount, currency, created_at')
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
  return { data, error }
}

export const getSystemStats = async () => {
  const [
    usersResult,
    activeCardsResult,
    paymentsResult,
    viewsResult
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('cards').select('*', { count: 'exact', head: true }).eq('is_activated', true),
    supabase.from('payments').select('amount').eq('status', 'completed'),
    supabase.from('profile_views').select('*', { count: 'exact', head: true })
  ])

  const totalRevenue = paymentsResult.data?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0

  return {
    totalUsers: usersResult.count || 0,
    activeCards: activeCardsResult.count || 0,
    totalRevenue: totalRevenue / 100, // Convert from cents to dollars
    totalViews: viewsResult.count || 0
  }
}

// ============= STORAGE FUNCTIONS =============

export const uploadProfileImage = async (userId, file) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/profile_${Date.now()}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('profile-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) return { data: null, error }

  const { data: urlData } = supabase.storage
    .from('profile-images')
    .getPublicUrl(fileName)

  return { data: { ...data, publicUrl: urlData.publicUrl }, error: null }
}

export const deleteProfileImage = async (filePath) => {
  const { data, error } = await supabase.storage
    .from('profile-images')
    .remove([filePath])
  return { data, error }
}

// ============= TEAM FUNCTIONS =============

export const createTeam = async (teamData) => {
  const { data, error } = await supabase
    .from('teams')
    .insert([{
      name: teamData.name,
      company: teamData.company,
      owner_id: teamData.ownerId,
      settings: teamData.settings || {},
      created_at: new Date().toISOString()
    }])
    .select()
  return { data, error }
}

export const addTeamMember = async (teamId, userId, role = 'member') => {
  const { data, error } = await supabase
    .from('team_members')
    .insert([{
      team_id: teamId,
      user_id: userId,
      role: role,
      joined_at: new Date().toISOString()
    }])
    .select()
  return { data, error }
}

export const getUserTeams = async (userId) => {
  const { data, error } = await supabase
    .from('team_members')
    .select(`
      *,
      teams (*)
    `)
    .eq('user_id', userId)
  return { data, error }
}

// ============= UTILITY FUNCTIONS =============

export const generateUsername = async (firstName, lastName) => {
  // Create full name and base username
  const fullName = `${firstName} ${lastName}`.trim()
  let baseUsername = fullName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 20)

  // If the generated username is too short, try different combinations
  if (baseUsername.length < 3) {
    baseUsername = `${firstName}${lastName}`.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20)
  }

  let username = baseUsername
  let counter = 1

  while (true) {
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single()

    if (!data) break

    username = `${baseUsername}${counter}`
    counter++
  }

  return username
}

// Alternative helper function that takes full name (for backward compatibility)
export const generateUsernameFromFullName = async (fullName) => {
  let baseUsername = fullName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 20)

  let username = baseUsername
  let counter = 1

  while (true) {
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single()

    if (!data) break

    username = `${baseUsername}${counter}`
    counter++
  }

  return username
}

export const isUsernameAvailable = async (username) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single()

  return !data && error?.code === 'PGRST116'
}

// Helper function to get full name display
export const getDisplayName = (profile, format = 'full') => {
  if (!profile) return ''
  
  const { first_name, last_name, full_name } = profile
  
  switch (format) {
    case 'first':
      return first_name || ''
    case 'last':
      return last_name || ''
    case 'firstLast':
      return `${first_name || ''} ${last_name || ''}`.trim()
    case 'lastFirst':
      return `${last_name || ''}, ${first_name || ''}`.trim()
    case 'initials':
      return `${first_name?.[0] || ''}${last_name?.[0] || ''}`.toUpperCase()
    case 'firstInitial':
      return `${first_name || ''} ${last_name?.[0] || ''}`.trim()
    default:
      return full_name || `${first_name || ''} ${last_name || ''}`.trim()
  }
}

// Helper function to create profile data with proper name handling
export const createProfileData = (userData) => {
  const { firstName, lastName, ...otherData } = userData
  const fullName = `${firstName || ''} ${lastName || ''}`.trim()
  
  return {
    first_name: firstName || '',
    last_name: lastName || '',
    full_name: fullName,
    ...otherData
  }
}

// Export default client for direct use
export default supabase