'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function SocialCallback() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user } = useAuth()

    useEffect(() => {
        const token = searchParams.get('token')
        const refreshToken = searchParams.get('refreshToken')

        if (token) {
            localStorage.setItem('accessToken', token)
            if (refreshToken) localStorage.setItem('refreshToken', refreshToken)

            // Just redirect to dashboard, the AuthProvider will pick up the token from localStorage
            window.location.href = '/dashboard'
        } else {
            router.push('/auth/login?error=no_token')
        }
    }, [searchParams, router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">Logging you in...</h2>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            </div>
        </div>
    )
}
