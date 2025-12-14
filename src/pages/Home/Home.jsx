import { useState, useEffect } from 'react'
import { CocktailGrid } from '@/components/cocktails/CocktailGrid'
import { CategoryFilter } from '@/components/cocktails/CategoryFilter'
import { cocktailService } from '@/services/cocktailService'
import { favoriteService } from '@/services/favoriteService'
import { useAuth } from '@/context/AuthContext'

export function Home() {
   const [cocktails, setCocktails] = useState([])
   const [loading, setLoading] = useState(true)
   const [selectedCategory, setSelectedCategory] = useState('all')
   const [favoritedIds, setFavoritedIds] = useState([])
   const { isAuthenticated } = useAuth()

   useEffect(() => {
      loadData()
   }, [isAuthenticated])

   const loadData = async () => {
      setLoading(true)
      const { data } = await cocktailService.getFeaturedCocktails()
      setCocktails(data || [])

      if (isAuthenticated) {
         const { dbIds } = await favoriteService.getUserFavoriteIds()
         setFavoritedIds(dbIds)
      }
      setLoading(false)
   }

   const handleFavoriteToggle = async (cocktail) => {
      if (!isAuthenticated) return

      const { isFavorited, favoriteId } = await favoriteService.isDbFavorited(
         cocktail.id
      )

      if (isFavorited) {
         await favoriteService.removeFavorite(favoriteId)
         setFavoritedIds((prev) => prev.filter((id) => id !== cocktail.id))
      } else {
         await favoriteService.addDbFavorite(cocktail.id)
         setFavoritedIds((prev) => [...prev, cocktail.id])
      }
   }

   const filteredCocktails =
      selectedCategory === 'all'
         ? cocktails
         : cocktails.filter((c) => c.category === selectedCategory)

   return (
      <div className="min-h-screen">
         <header className="text-center py-12 px-4">
            <h1 className="text-5xl font-bold text-accent text-glow-gold mb-4">
               Bartender
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
               Decouvrez notre collection de cocktails signatures et trouvez
               l'inspiration pour vos creations
            </p>
         </header>

         <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
         />

         {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
               <div className="text-primary animate-pulse text-xl">
                  Chargement...
               </div>
            </div>
         ) : (
            <CocktailGrid
               cocktails={filteredCocktails}
               source="db"
               favoritedIds={favoritedIds}
               onFavoriteToggle={handleFavoriteToggle}
               emptyMessage="Aucun cocktail disponible pour le moment"
               showActions={isAuthenticated}
            />
         )}
      </div>
   )
}
