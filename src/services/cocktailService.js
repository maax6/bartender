import { supabase } from '@/config/supabase'

export const cocktailService = {
   async getUserCocktails() {
      const { data, error } = await supabase
         .from('cocktails')
         .select('*')
         .order('created_at', { ascending: false })

      return { data, error }
   },

   async getFeaturedCocktails(limit = 12) {
      const { data, error } = await supabase
         .from('cocktails')
         .select('*')
         .eq('is_public', true)
         .order('created_at', { ascending: false })
         .limit(limit)

      return { data, error }
   },

   async getCocktailsByCategory(category) {
      const { data, error } = await supabase
         .from('cocktails')
         .select('*')
         .eq('category', category)
         .order('created_at', { ascending: false })

      return { data, error }
   },

   async getCocktailById(id) {
      const { data, error } = await supabase
         .from('cocktails')
         .select('*')
         .eq('id', id)
         .single()

      return { data, error }
   },

   async createCocktail(cocktailData) {
      const {
         data: { user },
      } = await supabase.auth.getUser()

      const { data, error } = await supabase
         .from('cocktails')
         .insert([{ ...cocktailData, user_id: user.id }])
         .select()
         .single()

      return { data, error }
   },

   async updateCocktail(id, cocktailData) {
      const { data, error } = await supabase
         .from('cocktails')
         .update({ ...cocktailData, updated_at: new Date().toISOString() })
         .eq('id', id)
         .select()
         .single()

      return { data, error }
   },

   async deleteCocktail(id) {
      const { error } = await supabase.from('cocktails').delete().eq('id', id)

      return { error }
   },
}
