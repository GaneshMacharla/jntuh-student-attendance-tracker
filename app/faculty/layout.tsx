import type React from "react"
import { RoleGuard } from "@/components/auth/role-guard"
import { FacultySidebar } from "@/components/faculty/faculty-sidebar"
import { FacultyHeader } from "@/components/faculty/faculty-header"

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleGuard allowedRoles={["faculty"]}>
      <div className="min-h-screen bg-gray-50">
        <FacultyHeader />
        <div className="flex">
          <FacultySidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </RoleGuard>
  )
}
