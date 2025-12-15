import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CATEGORY_OPTIONS } from '@/utils/constants'
import { FaPlus, FaTrash } from 'react-icons/fa'

export function CocktailForm({
   initialData = null,
   onSubmit,
   isLoading = false,
}) {
   const [formData, setFormData] = useState({
      name: initialData?.name || '',
      instructions: initialData?.instructions || '',
      category: initialData?.category || 'autres',
      image_url: initialData?.image_url || '',
      is_public: initialData?.is_public || false,
   })

   const [ingredients, setIngredients] = useState(
      initialData?.ingredients || [{ name: '', amount: '' }]
   )

   const handleChange = (e) => {
      const { name, value, type, checked } = e.target
      setFormData((prev) => ({
         ...prev,
         [name]: type === 'checkbox' ? checked : value,
      }))
   }

   const handleSelectChange = (value) => {
      setFormData((prev) => ({ ...prev, category: value }))
   }

   const handleIngredientChange = (index, field, value) => {
      const updated = [...ingredients]
      updated[index][field] = value
      setIngredients(updated)
   }

   const addIngredient = () => {
      setIngredients([...ingredients, { name: '', amount: '' }])
   }

   const removeIngredient = (index) => {
      if (ingredients.length > 1) {
         setIngredients(ingredients.filter((_, i) => i !== index))
      }
   }

   const handleSubmit = (e) => {
      e.preventDefault()
      const validIngredients = ingredients.filter(
         (ing) => ing.name.trim() !== ''
      )

      const normalizedName = formData.name.charAt(0).toUpperCase() + formData.name.slice(1).toLowerCase()
      onSubmit({ ...formData, name: normalizedName, ingredients: validIngredients })
   }

   return (
      <Card className="bg-card border-border">
         <CardHeader>
            <CardTitle className="text-primary">
               {initialData ? 'Modifier le cocktail' : 'Nouveau cocktail'}
            </CardTitle>
         </CardHeader>
         <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-2">
                  <Label htmlFor="name">Nom du cocktail *</Label>
                  <Input
                     id="name"
                     name="name"
                     value={formData.name}
                     onChange={handleChange}
                     placeholder="Ex: Mojito"
                     required
                     className="bg-input border-border"
                  />
               </div>

               <div className="space-y-2">
                  <Label htmlFor="category">Categorie</Label>
                  <Select
                     value={formData.category}
                     onValueChange={handleSelectChange}
                  >
                     <SelectTrigger className="bg-input border-border">
                        <SelectValue placeholder="Choisir une categorie" />
                     </SelectTrigger>
                     <SelectContent className="bg-card border-border">
                        {CATEGORY_OPTIONS.map((category) => (
                           <SelectItem key={category.value} value={category.value}>
                              {category.label}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>

               <div className="space-y-4">
                  <Label>Ingredients *</Label>
                  <div className="space-y-3">
                     {ingredients.map((ingredient, index) => (
                        <div key={index} className="flex gap-2">
                           <Input
                              placeholder="Quantite (ex: 4cl)"
                              value={ingredient.amount}
                              onChange={(e) =>
                                 handleIngredientChange(index, 'amount', e.target.value)
                              }
                              className="flex-1 bg-input border-border"
                           />
                           <Input
                              placeholder="Ingredient"
                              value={ingredient.name}
                              onChange={(e) =>
                                 handleIngredientChange(index, 'name', e.target.value)
                              }
                              required={index === 0}
                              className="flex-[2] bg-input border-border"
                           />
                           <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeIngredient(index)}
                              disabled={ingredients.length === 1}
                              className="text-muted-foreground hover:text-destructive"
                           >
                              <FaTrash className="h-4 w-4" />
                           </Button>
                        </div>
                     ))}
                  </div>
                  <Button
                     type="button"
                     variant="outline"
                     onClick={addIngredient}
                     className="w-full border-dashed border-border hover:border-primary hover:text-primary"
                  >
                     <FaPlus className="mr-2 h-4 w-4" />
                     Ajouter un ingredient
                  </Button>
               </div>

               <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions *</Label>
                  <Textarea
                     id="instructions"
                     name="instructions"
                     value={formData.instructions}
                     onChange={handleChange}
                     placeholder="Decrivez les etapes de preparation..."
                     rows={5}
                     required
                     className="bg-input border-border resize-none"
                  />
               </div>

               <div className="space-y-2">
                  <Label htmlFor="image_url">URL de l'image</Label>
                  <Input
                     id="image_url"
                     name="image_url"
                     type="url"
                     value={formData.image_url}
                     onChange={handleChange}
                     placeholder="https://..."
                     className="bg-input border-border"
                  />
               </div>

               <div className="flex items-center gap-2">
                  <input
                     id="is_public"
                     name="is_public"
                     type="checkbox"
                     checked={formData.is_public}
                     onChange={handleChange}
                     className="h-4 w-4 rounded border-border bg-input text-primary focus:ring-primary"
                  />
                  <Label htmlFor="is_public" className="text-sm cursor-pointer">
                     Rendre public (visible sur la page d'accueil)
                  </Label>
               </div>

               <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
               >
                  {isLoading
                     ? 'Enregistrement...'
                     : initialData
                       ? 'Modifier'
                       : 'Creer'}
               </Button>
            </form>
         </CardContent>
      </Card>
   )
}
