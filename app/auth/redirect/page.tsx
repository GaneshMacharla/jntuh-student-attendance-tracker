"use client"

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AuthRedirect() {
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Redirect based on user role from metadata
        const userRole = user.user_metadata.role;
        if (userRole === "admin") {
          router.push("/admin/dashboard");
        } else if (userRole === "faculty") {
          router.push("/faculty/attendance");
        } else if (userRole === "student") {
          router.push("/student/dashboard");
        } else {
          // Default redirect if role is not found
          router.push("/");
        }       
      } else {
        router.push("/auth/login");
      }
    };
    checkUser();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting you to the correct page...</p>
    </div>
  );
}