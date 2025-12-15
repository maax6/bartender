import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
   FaHome,
   FaSearch,
   FaGlassMartiniAlt,
   FaHeart,
   FaPlus,
   FaSignOutAlt,
   FaUser,
   FaBars,
} from 'react-icons/fa'
import { useState } from 'react'

const navLinks = [
   { to: '/', icon: FaHome, label: 'Accueil' },
   { to: '/search', icon: FaSearch, label: 'Recherche' },
]

const authLinks = [
   { to: '/my-cocktails', icon: FaGlassMartiniAlt, label: 'Mes Cocktails' },
   { to: '/favorites', icon: FaHeart, label: 'Favoris' },
   { to: '/add', icon: FaPlus, label: 'Ajouter' },
]

export function Navbar() {
   const { user, signOut, isAuthenticated } = useAuth()
   const navigate = useNavigate()
   const [mobileOpen, setMobileOpen] = useState(false)

   const handleSignOut = async () => {
      await signOut()
      navigate('/')
   }

   const NavItem = ({ to, icon: Icon, label }) => (
      <NavLink
         to={to}
         onClick={() => setMobileOpen(false)}
         className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
               isActive
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`
         }
      >
         <Icon className="w-4 h-4" />
         <span>{label}</span>
      </NavLink>
   )

   return (
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
         <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
               {/* Logo */}
               <NavLink to="/" className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary">
                     Bartender
                  </span>
               </NavLink>

               {/* Desktop Navigation */}
               <div className="hidden md:flex items-center gap-2">
                  {navLinks.map((link) => (
                     <NavItem key={link.to} {...link} />
                  ))}
                  {isAuthenticated &&
                     authLinks.map((link) => <NavItem key={link.to} {...link} />)}
               </div>

               {/* Auth Section */}
               <div className="flex items-center gap-4">
                  {isAuthenticated ? (
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button
                              variant="ghost"
                              className="relative h-10 w-10 rounded-full"
                           >
                              <Avatar className="h-10 w-10 border-2 border-primary">
                                 <AvatarFallback className="bg-primary/20 text-primary">
                                    {user.email?.charAt(0).toUpperCase()}
                                 </AvatarFallback>
                              </Avatar>
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                           className="w-56 bg-card border-border"
                           align="end"
                        >
                           <div className="px-2 py-1.5">
                              <p className="text-sm font-medium">{user.email}</p>
                           </div>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem
                              onClick={handleSignOut}
                              className="text-destructive cursor-pointer"
                           >
                              <FaSignOutAlt className="mr-2 h-4 w-4" />
                              Deconnexion
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  ) : (
                     <Button
                        onClick={() => navigate('/login')}
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                     >
                        <FaUser className="mr-2 h-4 w-4" />
                        Connexion
                     </Button>
                  )}

                  {/* Mobile Menu Button */}
                  <Button
                     variant="ghost"
                     size="icon"
                     className="md:hidden"
                     onClick={() => setMobileOpen(!mobileOpen)}
                  >
                     <FaBars className="h-5 w-5" />
                  </Button>
               </div>
            </div>

            {/* Mobile Navigation */}
            {mobileOpen && (
               <div className="md:hidden py-4 border-t border-border">
                  <div className="flex flex-col gap-2">
                     {navLinks.map((link) => (
                        <NavItem key={link.to} {...link} />
                     ))}
                     {isAuthenticated &&
                        authLinks.map((link) => (
                           <NavItem key={link.to} {...link} />
                        ))}
                  </div>
               </div>
            )}
         </div>
      </nav>
   )
}
