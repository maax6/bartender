import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/config/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
   const [user, setUser] = useState(null)
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
         setUser(session?.user ?? null)
         setLoading(false)
      })

      const {
         data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
         setUser(session?.user ?? null)
      })

      return () => subscription.unsubscribe()
   }, [])

   const signUp = async (email, password) => {
      const { data, error } = await supabase.auth.signUp({ email, password })
      return { data, error }
   }

   const signIn = async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({
         email,
         password,
      })
      return { data, error }
   }

   const signOut = async () => {
      const { error } = await supabase.auth.signOut()
      return { error }
   }

   const value = {
      user,
      loading,
      signUp,
      signIn,
      signOut,
      isAuthenticated: !!user,
   }

   return (
      <AuthContext.Provider value={value}>
         {!loading && children}
      </AuthContext.Provider>
   )
}
