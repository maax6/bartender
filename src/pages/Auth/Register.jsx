import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export function Register() {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')
   const [loading, setLoading] = useState(false)
   const { signUp } = useAuth()
   const navigate = useNavigate()

   const handleSubmit = async (e) => {
      e.preventDefault()

      if (password !== confirmPassword) {
         toast.error('Les mots de passe ne correspondent pas')
         return
      }

      if (password.length < 6) {
         toast.error('Le mot de passe doit faire au moins 6 caracteres')
         return
      }

      setLoading(true)

      const { error } = await signUp(email, password)

      if (error) {
         toast.error(error.message || "Erreur lors de l'inscription")
      } else {
         toast.success('Compte cree! Verifiez votre email pour confirmer.')
         navigate('/login')
      }
      setLoading(false)
   }

   return (
      <div className="min-h-screen flex items-center justify-center px-4">
         <Card className="w-full max-w-md bg-card border-border">
            <CardHeader className="text-center">
               <CardTitle className="text-3xl text-primary">
                  Creer un compte
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
                        minLength={6}
                        className="bg-input border-border"
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="confirmPassword">
                        Confirmer le mot de passe
                     </Label>
                     <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                     {loading ? 'Creation...' : 'Creer mon compte'}
                  </Button>

                  <p className="text-center text-muted-foreground text-sm">
                     Deja un compte?{' '}
                     <Link to="/login" className="text-primary hover:underline">
                        Se connecter
                     </Link>
                  </p>
               </form>
            </CardContent>
         </Card>
      </div>
   )
}
