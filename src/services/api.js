import { supabase } from '../lib/supabase'

// WorkItems
export const workItemsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('work_items')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getByParent(parentId) {
    const { data, error } = await supabase
      .from('work_items')
      .select('*')
      .eq('parent_id', parentId)
      .order('order', { ascending: true })

    if (error) throw error
    return data
  },

  async getByTeam(teamId) {
    const { data, error } = await supabase
      .from('work_items')
      .select('*')
      .eq('team_id', teamId)
      .order('status', { ascending: true })

    if (error) throw error
    return data
  },

  async create(item) {
    const { data, error } = await supabase
      .from('work_items')
      .insert([item])
      .select()

    if (error) throw error
    return data[0]
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('work_items')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  async delete(id) {
    const { error } = await supabase
      .from('work_items')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async deleteChildren(parentId) {
    const { error } = await supabase
      .from('work_items')
      .delete()
      .eq('parent_id', parentId)

    if (error) throw error
  }
}

// Teams
export const teamsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('teams')
      .select('*')

    if (error) throw error
    return data
  }
}

// Users
export const usersApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('users')
      .select('*')

    if (error) throw error
    return data
  },

  async getByTeam(teamId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('team_id', teamId)

    if (error) throw error
    return data
  }
}

// 실시간 구독
export const setupRealtimeListeners = {
  workItems(callback) {
    const subscription = supabase
      .channel('work_items_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'work_items'
        },
        (payload) => {
          console.log('Realtime event received:', payload)
          callback(payload)
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status)
      })

    return subscription
  },

  unsubscribe(subscription) {
    if (subscription) {
      supabase.removeChannel(subscription)
      console.log('Realtime subscription removed')
    }
  }
}
