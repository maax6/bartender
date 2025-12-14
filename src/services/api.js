const API_KEY = import.meta.env.VITE_NINJA_KEY
const BASE_URL = 'https://api.api-ninjas.com/v1/cocktail'

export const apiService = {
   async searchCocktails(query) {
      try {
         const response = await fetch(
            `${BASE_URL}?name=${encodeURIComponent(query)}`,
            {
               headers: {
                  'X-Api-Key': API_KEY,
               },
            }
         )

         if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`)
         }

         const data = await response.json()
         return { data, error: null }
      } catch (error) {
         return { data: null, error: error.message }
      }
   },

   async searchByIngredient(ingredient) {
      try {
         const response = await fetch(
            `${BASE_URL}?ingredients=${encodeURIComponent(ingredient)}`,
            {
               headers: {
                  'X-Api-Key': API_KEY,
               },
            }
         )

         if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`)
         }

         const data = await response.json()
         return { data, error: null }
      } catch (error) {
         return { data: null, error: error.message }
      }
   },
}
