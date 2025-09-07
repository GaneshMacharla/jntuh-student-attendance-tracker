import type React from "react"
import { RoleGuard } from "@/components/auth/role-guard"
import { StudentSidebar } from "@/components/student/student-sidebar"
import { StudentHeader } from "@/components/student/student-header"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleGuard allowedRoles={["student"]}>
      <div className="min-h-screen bg-gray-50">
        <StudentHeader />
        <div className="flex">
          <StudentSidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </RoleGuard>
  )
}
