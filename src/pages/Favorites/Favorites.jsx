import { useState, useEffect } from 'react'
import { CocktailCard } from '@/components/cocktails/CocktailCard'
import { favoriteService } from '@/services/favoriteService'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FaHeart } from 'react-icons/fa'

export function Favorites() {
   const [favorites, setFavorites] = useState([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      loadFavorites()
   }, [])

   const loadFavorites = async () => {
      setLoading(true)
      const { data } = await favoriteService.getUserFavorites()
      setFavorites(data || [])
      setLoading(false)
   }

   const handleRemoveFavorite = async (favoriteId) => {
      const { error } = await favoriteService.removeFavorite(favoriteId)
      if (!error) {
         setFavorites((prev) => prev.filter((f) => f.id !== favoriteId))
      }
   }

   const dbFavorites = favorites.filter((f) => f.source === 'db')
   const apiFavorites = favorites.filter((f) => f.source === 'api')

   if (loading) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            <div className="text-primary animate-pulse text-xl">Chargement...</div>
         </div>
      )
   }

   return (
      <div className="min-h-screen">
         <header className="text-center py-12 px-4">
            <h1 className="text-4xl font-bold text-primary mb-4">
               Mes Favoris
            </h1>
            <p className="text-muted-foreground">
               {favorites.length} cocktail{favorites.length > 1 ? 's' : ''} dans
               vos favoris
            </p>
         </header>

         {favorites.length === 0 ? (
            <div className="text-center py-12">
               <FaHeart className="mx-auto text-6xl text-muted-foreground/20 mb-4" />
               <p className="text-muted-foreground">
                  Vous n'avez pas encore de favoris
               </p>
            </div>
         ) : (
            <Tabs defaultValue="all" className="px-4">
               <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 bg-card">
                  <TabsTrigger value="all">Tous ({favorites.length})</TabsTrigger>
                  <TabsTrigger value="personal">
                     Personnels ({dbFavorites.length})
                  </TabsTrigger>
                  <TabsTrigger value="api">API ({apiFavorites.length})</TabsTrigger>
               </TabsList>

               <TabsContent value="all" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     {favorites.map((favorite, index) => (
                        <CocktailCard
                           key={favorite.id}
                           cocktail={
                              favorite.source === 'db'
                                 ? favorite.cocktails
                                 : favorite.api_cocktail_data
                           }
                           source={favorite.source}
                           index={index}
                           isFavorited={true}
                           onFavoriteToggle={() =>
                              handleRemoveFavorite(favorite.id)
                           }
                           showActions={true}
                        />
                     ))}
                  </div>
               </TabsContent>

               <TabsContent value="personal" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     {dbFavorites.map((favorite, index) => (
                        <CocktailCard
                           key={favorite.id}
                           cocktail={favorite.cocktails}
                           source="db"
                           index={index}
                           isFavorited={true}
                           onFavoriteToggle={() =>
                              handleRemoveFavorite(favorite.id)
                           }
                           showActions={true}
                        />
                     ))}
                  </div>
                  {dbFavorites.length === 0 && (
                     <p className="text-center text-muted-foreground py-8">
                        Aucun cocktail personnel en favoris
                     </p>
                  )}
               </TabsContent>

               <TabsContent value="api" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     {apiFavorites.map((favorite, index) => (
                        <CocktailCard
                           key={favorite.id}
                           cocktail={favorite.api_cocktail_data}
                           source="api"
                           index={index}
                           isFavorited={true}
                           onFavoriteToggle={() =>
                              handleRemoveFavorite(favorite.id)
                           }
                           showActions={true}
                        />
                     ))}
                  </div>
                  {apiFavorites.length === 0 && (
                     <p className="text-center text-muted-foreground py-8">
                        Aucun cocktail API en favoris
                     </p>
                  )}
               </TabsContent>
            </Tabs>
         )}
      </div>
   )
}
