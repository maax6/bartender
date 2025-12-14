import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CocktailForm } from '@/components/cocktails/CocktailForm'
import { cocktailService } from '@/services/cocktailService'
import { toast } from 'sonner'

export function AddCocktail() {
   const [isLoading, setIsLoading] = useState(false)
   const navigate = useNavigate()

   const handleSubmit = async (formData) => {
      setIsLoading(true)
      const { data, error } = await cocktailService.createCocktail(formData)

      if (error) {
         toast.error('Erreur lors de la creation du cocktail')
      } else {
         toast.success('Cocktail cree avec succes!')
         navigate('/my-cocktails')
      }
      setIsLoading(false)
   }

   return (
      <div className="min-h-screen py-8 px-4">
         <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-accent text-glow-gold mb-8 text-center">
               Creer un Cocktail
            </h1>
            <CocktailForm onSubmit={handleSubmit} isLoading={isLoading} />
         </div>
      </div>
   )
}
