"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: string[]
  fallbackPath?: string
}

export function RoleGuard({ children, allowedRoles, fallbackPath = "/auth/login" }: RoleGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
          router.push(fallbackPath)
          return
        }

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single()

        if (userError || !userData) {
          router.push(fallbackPath)
          return
        }

        if (allowedRoles.includes(userData.role)) {
          setIsAuthorized(true)
        } else {
          // Redirect based on user's actual role
          if (userData.role === "admin") {
            router.push("/admin")
          } else if (userData.role === "faculty") {
            router.push("/faculty")
          } else if (userData.role === "student") {
            router.push("/student")
          } else {
            router.push(fallbackPath)
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push(fallbackPath)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [allowedRoles, fallbackPath, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
