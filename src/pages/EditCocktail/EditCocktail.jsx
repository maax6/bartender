import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CocktailForm } from '@/components/cocktails/CocktailForm'
import { cocktailService } from '@/services/cocktailService'
import { toast } from 'sonner'

export function EditCocktail() {
   const { id } = useParams()
   const [cocktail, setCocktail] = useState(null)
   const [loading, setLoading] = useState(true)
   const [isSubmitting, setIsSubmitting] = useState(false)
   const navigate = useNavigate()

   useEffect(() => {
      loadCocktail()
   }, [id])

   const loadCocktail = async () => {
      const { data, error } = await cocktailService.getCocktailById(id)
      if (error || !data) {
         toast.error('Cocktail non trouve')
         navigate('/my-cocktails')
      } else {
         setCocktail(data)
      }
      setLoading(false)
   }

   const handleSubmit = async (formData) => {
      setIsSubmitting(true)
      const { error } = await cocktailService.updateCocktail(id, formData)

      if (error) {
         toast.error('Erreur lors de la modification')
      } else {
         toast.success('Cocktail modifie avec succes!')
         navigate('/my-cocktails')
      }
      setIsSubmitting(false)
   }

   if (loading) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            <div className="text-primary animate-pulse text-xl">Chargement...</div>
         </div>
      )
   }

   return (
      <div className="min-h-screen py-8 px-4">
         <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-accent text-glow-gold mb-8 text-center">
               Modifier le Cocktail
            </h1>
            <CocktailForm
               initialData={cocktail}
               onSubmit={handleSubmit}
               isLoading={isSubmitting}
            />
         </div>
      </div>
   )
}
