import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CocktailGrid } from '@/components/cocktails/CocktailGrid'
import { CategoryFilter } from '@/components/cocktails/CategoryFilter'
import { cocktailService } from '@/services/cocktailService'
import { favoriteService } from '@/services/favoriteService'
import { Button } from '@/components/ui/button'
import { FaPlus } from 'react-icons/fa'
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog'

export function MyCocktails() {
   const [cocktails, setCocktails] = useState([])
   const [loading, setLoading] = useState(true)
   const [selectedCategory, setSelectedCategory] = useState('all')
   const [favoritedIds, setFavoritedIds] = useState([])
   const [deleteId, setDeleteId] = useState(null)

   useEffect(() => {
      loadCocktails()
   }, [])

   const loadCocktails = async () => {
      setLoading(true)
      const [cocktailsRes, favoritesRes] = await Promise.all([
         cocktailService.getUserCocktails(),
         favoriteService.getUserFavoriteIds(),
      ])

      setCocktails(cocktailsRes.data || [])
      setFavoritedIds(favoritesRes.dbIds || [])
      setLoading(false)
   }

   const handleDelete = async () => {
      if (!deleteId) return

      const { error } = await cocktailService.deleteCocktail(deleteId)
      if (!error) {
         setCocktails((prev) => prev.filter((c) => c.id !== deleteId))
      }
      setDeleteId(null)
   }

   const handleFavoriteToggle = async (cocktail) => {
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
         <header className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 px-4">
            <div>
               <h1 className="text-4xl font-bold text-primary">
                  Mes Cocktails
               </h1>
               <p className="text-muted-foreground mt-2">
                  {cocktails.length} cocktail{cocktails.length > 1 ? 's' : ''} dans
                  votre collection
               </p>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90">
               <Link to="/add">
                  <FaPlus className="mr-2" />
                  Nouveau Cocktail
               </Link>
            </Button>
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
               onDelete={(id) => setDeleteId(id)}
               emptyMessage="Vous n'avez pas encore cree de cocktails"
            />
         )}

         <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
            <DialogContent className="bg-card border-border">
               <DialogHeader>
                  <DialogTitle>Confirmer la suppression</DialogTitle>
                  <DialogDescription>
                     Voulez-vous vraiment supprimer ce cocktail ? Cette action est
                     irreversible.
                  </DialogDescription>
               </DialogHeader>
               <DialogFooter>
                  <Button variant="outline" onClick={() => setDeleteId(null)}>
                     Annuler
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                     Supprimer
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   )
}
