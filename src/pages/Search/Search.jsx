import { useState, useEffect } from 'react'
import { CocktailGrid } from '@/components/cocktails/CocktailGrid'
import { apiService } from '@/services/api'
import { favoriteService } from '@/services/favoriteService'
import { useAuth } from '@/context/AuthContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FaSearch } from 'react-icons/fa'

export function Search() {
   const [query, setQuery] = useState('')
   const [cocktails, setCocktails] = useState([])
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState('')
   const [hasSearched, setHasSearched] = useState(false)
   const [favoritedNames, setFavoritedNames] = useState([])
   const { isAuthenticated } = useAuth()

   useEffect(() => {
      if (isAuthenticated) {
         loadUserFavorites()
      }
   }, [isAuthenticated])

   const loadUserFavorites = async () => {
      const { apiNames } = await favoriteService.getUserFavoriteIds()
      setFavoritedNames(apiNames)
   }

   const handleSearch = async (e) => {
      e.preventDefault()
      if (!query.trim()) return

      setLoading(true)
      setError('')
      setHasSearched(true)

      const { data, error } = await apiService.searchCocktails(query)

      if (error) {
         setError('Erreur lors de la recherche')
         setCocktails([])
      } else if (!data || data.length === 0) {
         setError('Aucun cocktail trouve')
         setCocktails([])
      } else {
         setCocktails(data)
      }
      setLoading(false)
   }

   const handleFavoriteToggle = async (cocktail) => {
      if (!isAuthenticated) return

      const { isFavorited, favoriteId } = await favoriteService.isApiFavorited(
         cocktail.name
      )

      if (isFavorited) {
         await favoriteService.removeFavorite(favoriteId)
         setFavoritedNames((prev) => prev.filter((n) => n !== cocktail.name))
      } else {
         await favoriteService.addApiFavorite(cocktail.name, cocktail)
         setFavoritedNames((prev) => [...prev, cocktail.name])
      }
   }

   return (
      <div className="min-h-screen">
         <header className="text-center py-12 px-4">
            <h1 className="text-4xl font-bold text-accent text-glow-gold mb-4">
               Recherche de Cocktails
            </h1>
            <p className="text-muted-foreground mb-8">
               Explorez des milliers de recettes de cocktails
            </p>

            <form
               onSubmit={handleSearch}
               className="max-w-xl mx-auto flex gap-2"
            >
               <Input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher un cocktail... (ex: Mojito, Margarita)"
                  className="flex-1 bg-input border-border h-12 text-lg"
               />
               <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 px-6 bg-primary hover:bg-primary/90"
               >
                  {loading ? (
                     <span className="animate-pulse">...</span>
                  ) : (
                     <>
                        <FaSearch className="mr-2" />
                        Rechercher
                     </>
                  )}
               </Button>
            </form>
         </header>

         {error && hasSearched && (
            <p className="text-center text-destructive mb-8">{error}</p>
         )}

         {!hasSearched && (
            <div className="text-center text-muted-foreground py-12">
               <FaSearch className="mx-auto text-6xl mb-4 opacity-20" />
               <p>Entrez un nom de cocktail pour commencer la recherche</p>
            </div>
         )}

         {hasSearched && !loading && !error && (
            <CocktailGrid
               cocktails={cocktails}
               source="api"
               favoritedIds={favoritedNames}
               onFavoriteToggle={handleFavoriteToggle}
               showActions={isAuthenticated}
            />
         )}
      </div>
   )
}
