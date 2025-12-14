import { supabase } from '@/config/supabase'

export const favoriteService = {
   async getUserFavorites() {
      const { data, error } = await supabase
         .from('favorites')
         .select(
            `
            *,
            cocktails (*)
         `
         )
         .order('created_at', { ascending: false })

      return { data, error }
   },

   async addDbFavorite(cocktailId) {
      const {
         data: { user },
      } = await supabase.auth.getUser()

      const { data, error } = await supabase
         .from('favorites')
         .insert([
            {
               user_id: user.id,
               cocktail_id: cocktailId,
               source: 'db',
            },
         ])
         .select()
         .single()

      return { data, error }
   },

   async addApiFavorite(cocktailName, cocktailData) {
      const {
         data: { user },
      } = await supabase.auth.getUser()

      const { data, error } = await supabase
         .from('favorites')
         .insert([
            {
               user_id: user.id,
               api_cocktail_name: cocktailName,
               api_cocktail_data: cocktailData,
               source: 'api',
            },
         ])
         .select()
         .single()

      return { data, error }
   },

   async removeFavorite(favoriteId) {
      const { error } = await supabase
         .from('favorites')
         .delete()
         .eq('id', favoriteId)

      return { error }
   },

   async isDbFavorited(cocktailId) {
      const {
         data: { user },
      } = await supabase.auth.getUser()

      if (!user) return { isFavorited: false, favoriteId: null }

      const { data, error } = await supabase
         .from('favorites')
         .select('id')
         .eq('cocktail_id', cocktailId)
         .eq('user_id', user.id)
         .maybeSingle()

      return { isFavorited: !!data && !error, favoriteId: data?.id }
   },

   async isApiFavorited(cocktailName) {
      const {
         data: { user },
      } = await supabase.auth.getUser()

      if (!user) return { isFavorited: false, favoriteId: null }

      const { data, error } = await supabase
         .from('favorites')
         .select('id')
         .eq('api_cocktail_name', cocktailName)
         .eq('user_id', user.id)
         .maybeSingle()

      return { isFavorited: !!data && !error, favoriteId: data?.id }
   },

   async getUserFavoriteIds() {
      const {
         data: { user },
      } = await supabase.auth.getUser()

      if (!user) return { dbIds: [], apiNames: [] }

      const { data } = await supabase
         .from('favorites')
         .select('cocktail_id, api_cocktail_name, source')
         .eq('user_id', user.id)

      const dbIds = data?.filter((f) => f.source === 'db').map((f) => f.cocktail_id) || []
      const apiNames = data?.filter((f) => f.source === 'api').map((f) => f.api_cocktail_name) || []

      return { dbIds, apiNames }
   },
}
