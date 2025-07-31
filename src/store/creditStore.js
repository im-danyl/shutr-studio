import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const useCreditStore = create((set, get) => ({
  // State
  credits: null,
  loading: false,
  transactions: [],
  lastUpdated: null,

  // Actions
  // Fetch user's current credit balance
  fetchCredits: async (userId) => {
    if (!userId) return null

    try {
      set({ loading: true })
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('credits')
        .eq('id', userId)
        .single()

      if (error) throw error

      const credits = data?.credits || 0
      set({ 
        credits, 
        loading: false, 
        lastUpdated: new Date().toISOString() 
      })
      
      return credits
    } catch (error) {
      console.error('Error fetching credits:', error)
      set({ loading: false })
      return null
    }
  },

  // Fetch user's credit transaction history
  fetchTransactions: async (userId, limit = 10) => {
    if (!userId) return []

    try {
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      set({ transactions: data || [] })
      return data || []
    } catch (error) {
      console.error('Error fetching credit transactions:', error)
      return []
    }
  },

  // Check if user has enough credits for a generation
  checkCreditsAvailable: (requiredCredits) => {
    const { credits } = get()
    return credits !== null && credits >= requiredCredits
  },

  // Consume credits for generation (atomic operation)
  consumeCredits: async (userId, variantCount, generationId) => {
    if (!userId) {
      throw new Error('User ID required')
    }

    try {
      set({ loading: true })

      // Use the atomic consume_credits function from database
      const { data, error } = await supabase.rpc('consume_credits', {
        p_user_id: userId,
        p_variant_count: variantCount,
        p_generation_id: generationId
      })

      if (error) throw error

      if (!data.success) {
        throw new Error(data.error || 'Failed to consume credits')
      }

      // Update local state with new balance
      set({ 
        credits: data.remaining_credits,
        loading: false,
        lastUpdated: new Date().toISOString()
      })

      // Refresh transactions to show the new consumption
      await get().fetchTransactions(userId, 10)

      return {
        success: true,
        remainingCredits: data.remaining_credits
      }
    } catch (error) {
      console.error('Error consuming credits:', error)
      set({ loading: false })
      throw error
    }
  },

  // Refund credits (in case of generation failure)
  refundCredits: async (userId, amount, generationId) => {
    if (!userId) {
      throw new Error('User ID required')
    }

    try {
      set({ loading: true })

      // Use the refund_credits function from database
      const { data, error } = await supabase.rpc('refund_credits', {
        p_user_id: userId,
        p_amount: amount,
        p_generation_id: generationId
      })

      if (error) throw error

      if (!data.success) {
        throw new Error('Failed to refund credits')
      }

      // Refresh credit balance and transactions
      await get().fetchCredits(userId)
      await get().fetchTransactions(userId, 10)

      set({ loading: false })

      return { success: true }
    } catch (error) {
      console.error('Error refunding credits:', error)
      set({ loading: false })
      throw error
    }
  },

  // Add credits (for testing or admin functions)
  addCredits: async (userId, amount, transactionType = 'manual_add') => {
    if (!userId) {
      throw new Error('User ID required')
    }

    try {
      set({ loading: true })

      // Update user profile credits
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ credits: supabase.raw(`credits + ${amount}`) })
        .eq('id', userId)

      if (updateError) throw updateError

      // Record transaction
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert([{
          user_id: userId,
          amount: amount,
          transaction_type: transactionType
        }])

      if (transactionError) throw transactionError

      // Refresh balance and transactions
      await get().fetchCredits(userId)
      await get().fetchTransactions(userId, 10)

      set({ loading: false })

      return { success: true }
    } catch (error) {
      console.error('Error adding credits:', error)
      set({ loading: false })
      throw error
    }
  },

  // Reset store state (for logout)
  reset: () => {
    set({
      credits: null,
      loading: false,
      transactions: [],
      lastUpdated: null
    })
  },

  // Utility functions
  getCreditsWithRefresh: async (userId, forceRefresh = false) => {
    const { credits, lastUpdated } = get()
    
    // If we have cached credits and they're recent (less than 5 minutes), use them
    if (!forceRefresh && credits !== null && lastUpdated) {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      if (new Date(lastUpdated) > fiveMinutesAgo) {
        return credits
      }
    }
    
    // Otherwise, fetch fresh data
    return await get().fetchCredits(userId)
  },

  // Calculate generation cost
  calculateCost: (variantCount) => {
    return variantCount // 1 credit per variant
  }
}))

export default useCreditStore