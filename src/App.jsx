import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { Navbar } from '@/components/Navbar'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Toaster } from '@/components/ui/sonner'

// Pages
import { Home } from '@/pages/Home/Home'
import { Search } from '@/pages/Search/Search'
import { MyCocktails } from '@/pages/MyCocktails/MyCocktails'
import { Favorites } from '@/pages/Favorites/Favorites'
import { AddCocktail } from '@/pages/AddCocktail/AddCocktail'
import { EditCocktail } from '@/pages/EditCocktail/EditCocktail'
import { Login } from '@/pages/Auth/Login'
import { Register } from '@/pages/Auth/Register'

export default function App() {
   return (
      <AuthProvider>
         <BrowserRouter>
            <div className="min-h-screen bg-background">
               <Navbar />
               <main className="pb-8">
                  <Routes>
                     {/* Public routes */}
                     <Route path="/" element={<Home />} />
                     <Route path="/search" element={<Search />} />
                     <Route path="/login" element={<Login />} />
                     <Route path="/register" element={<Register />} />

                     {/* Protected routes */}
                     <Route element={<ProtectedRoute />}>
                        <Route path="/my-cocktails" element={<MyCocktails />} />
                        <Route path="/favorites" element={<Favorites />} />
                        <Route path="/add" element={<AddCocktail />} />
                        <Route path="/edit/:id" element={<EditCocktail />} />
                     </Route>
                  </Routes>
               </main>
            </div>
            <Toaster position="top-right" richColors />
         </BrowserRouter>
      </AuthProvider>
   )
}
