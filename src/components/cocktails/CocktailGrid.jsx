import { CocktailCard } from './CocktailCard'

export function CocktailGrid({
   cocktails,
   source = 'db',
   favoritedIds = [],
   onFavoriteToggle,
   onDelete,
   emptyMessage = 'Aucun cocktail trouve',
   showActions = true,
}) {
   if (!cocktails || cocktails.length === 0) {
      return (
         <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-8">
            <p className="text-xl text-muted-foreground">{emptyMessage}</p>
         </div>
      )
   }

   return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
         {cocktails.map((cocktail, index) => (
            <CocktailCard
               key={source === 'api' ? cocktail.name : cocktail.id}
               cocktail={cocktail}
               source={source}
               index={index}
               isFavorited={
                  source === 'api'
                     ? favoritedIds.includes(cocktail.name)
                     : favoritedIds.includes(cocktail.id)
               }
               onFavoriteToggle={onFavoriteToggle}
               onDelete={onDelete}
               showActions={showActions}
            />
         ))}
      </div>
   )
}
