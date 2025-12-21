import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
    user: User | null
    session: Session | null
    loading: boolean
}

/**
 * Authentication hook for Supabase
 * Provides user state and auth methods
 */
export function useAuth() {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        session: null,
        loading: true,
    })

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setAuthState({
                user: session?.user ?? null,
                session,
                loading: false,
            })
        })

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setAuthState({
                user: session?.user ?? null,
                session,
                loading: false,
            })
        })

        return () => subscription.unsubscribe()
    }, [])

    const signIn = useCallback(async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        return { data, error }
    }, [])

    const signUp = useCallback(async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })
        return { data, error }
    }, [])

    const signOut = useCallback(async () => {
        const { error } = await supabase.auth.signOut()
        return { error }
    }, [])

    return {
        user: authState.user,
        session: authState.session,
        loading: authState.loading,
        signIn,
        signUp,
        signOut,
    }
}
