import { Button } from '@/components/ui/button'
import { CATEGORY_OPTIONS } from '@/utils/constants'

export function CategoryFilter({ selectedCategory, onCategoryChange }) {
   return (
      <div className="flex flex-wrap gap-2 p-4 justify-center">
         <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange('all')}
            className={
               selectedCategory === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'border-border hover:border-primary hover:text-primary'
            }
         >
            Tous
         </Button>
         {CATEGORY_OPTIONS.map((category) => (
            <Button
               key={category.value}
               variant={selectedCategory === category.value ? 'default' : 'outline'}
               size="sm"
               onClick={() => onCategoryChange(category.value)}
               className={
                  selectedCategory === category.value
                     ? 'bg-primary text-primary-foreground'
                     : 'border-border hover:border-primary hover:text-primary'
               }
            >
               {category.label}
            </Button>
         ))}
      </div>
   )
}
