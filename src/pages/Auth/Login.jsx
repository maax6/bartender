import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export function Login() {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [loading, setLoading] = useState(false)
   const { signIn } = useAuth()
   const navigate = useNavigate()

   const handleSubmit = async (e) => {
      e.preventDefault()
      setLoading(true)

      const { error } = await signIn(email, password)

      if (error) {
         toast.error(error.message || 'Erreur de connexion')
      } else {
         toast.success('Connexion reussie!')
         navigate('/my-cocktails')
      }
      setLoading(false)
   }

   return (
      <div className="min-h-screen flex items-center justify-center px-4">
         <Card className="w-full max-w-md bg-card border-border">
            <CardHeader className="text-center">
               <CardTitle className="text-3xl text-primary">
                  Connexion
               </CardTitle>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                     <Label htmlFor="email">Email</Label>
                     <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        required
                        className="bg-input border-border"
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="password">Mot de passe</Label>
                     <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="bg-input border-border"
                     />
                  </div>

                  <Button
                     type="submit"
                     disabled={loading}
                     className="w-full bg-primary hover:bg-primary/90"
                  >
                     {loading ? 'Connexion...' : 'Se connecter'}
                  </Button>

                  <p className="text-center text-muted-foreground text-sm">
                     Pas de compte?{' '}
                     <Link
                        to="/register"
                        className="text-primary hover:underline"
                     >
                        Creer un compte
                     </Link>
                  </p>
               </form>
            </CardContent>
         </Card>
      </div>
   )
}
