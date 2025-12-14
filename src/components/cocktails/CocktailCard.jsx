import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { CATEGORY_COLORS } from '@/utils/constants'
import { FaHeart, FaRegHeart, FaEdit, FaTrash } from 'react-icons/fa'

export function CocktailCard({
   cocktail,
   source = 'db',
   isFavorited = false,
   onFavoriteToggle,
   onDelete,
   showActions = true,
   index = 0,
}) {
   const { isAuthenticated } = useAuth()
   const [isHovered, setIsHovered] = useState(false)

   const isOwnCocktail = source === 'db' && cocktail.user_id
   const displayName =
      cocktail.name.charAt(0).toUpperCase() +
      cocktail.name.slice(1).toLowerCase()

   // Handle ingredients display (API format is array of strings, DB format is array of objects)
   const ingredients =
      source === 'api'
         ? cocktail.ingredients
         : cocktail.ingredients?.map((ing) => `${ing.amount} ${ing.name}`) || []

   const categoryColor =
      CATEGORY_COLORS[cocktail.category] || CATEGORY_COLORS.autres

   return (
      <Card
         className={`group relative overflow-hidden bg-card border-border transition-all duration-300 animate-fade-in-up ${
            isHovered ? 'glow-purple scale-[1.02]' : ''
         }`}
         style={{ animationDelay: `${index * 50}ms` }}
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
      >
         {cocktail.image_url && (
            <div className="relative h-48 overflow-hidden">
               <img
                  src={cocktail.image_url}
                  alt={displayName}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
            </div>
         )}

         <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
               <h3 className="text-xl font-bold text-accent text-glow-gold truncate">
                  {displayName}
               </h3>
               {cocktail.category && (
                  <Badge
                     variant="outline"
                     className={`shrink-0 ${categoryColor}`}
                  >
                     {cocktail.category}
                  </Badge>
               )}
            </div>
         </CardHeader>

         <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-3">
               {cocktail.instructions}
            </p>

            <div className="space-y-1">
               <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Ingredients
               </p>
               <div className="flex flex-wrap gap-1">
                  {ingredients.slice(0, 5).map((ingredient, idx) => (
                     <Badge
                        key={idx}
                        variant="secondary"
                        className="text-xs bg-secondary/50"
                     >
                        {ingredient}
                     </Badge>
                  ))}
                  {ingredients.length > 5 && (
                     <Badge variant="secondary" className="text-xs bg-secondary/50">
                        +{ingredients.length - 5}
                     </Badge>
                  )}
               </div>
            </div>

            {showActions && isAuthenticated && (
               <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                  <Button
                     size="icon"
                     variant="ghost"
                     className={`h-9 w-9 ${
                        isFavorited
                           ? 'text-red-500 hover:text-red-400'
                           : 'text-muted-foreground hover:text-red-500'
                     }`}
                     onClick={() => onFavoriteToggle?.(cocktail, source)}
                  >
                     {isFavorited ? (
                        <FaHeart className="h-4 w-4" />
                     ) : (
                        <FaRegHeart className="h-4 w-4" />
                     )}
                  </Button>

                  {isOwnCocktail && (
                     <>
                        <Button
                           size="icon"
                           variant="ghost"
                           className="h-9 w-9 text-muted-foreground hover:text-primary"
                           asChild
                        >
                           <Link to={`/edit/${cocktail.id}`}>
                              <FaEdit className="h-4 w-4" />
                           </Link>
                        </Button>
                        <Button
                           size="icon"
                           variant="ghost"
                           className="h-9 w-9 text-muted-foreground hover:text-destructive"
                           onClick={() => onDelete?.(cocktail.id)}
                        >
                           <FaTrash className="h-4 w-4" />
                        </Button>
                     </>
                  )}
               </div>
            )}
         </CardContent>
      </Card>
   )
}
