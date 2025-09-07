"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, BookOpen, Calendar, BarChart3, Settings, Clock, User, Award } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/student",
    icon: LayoutDashboard,
  },
  {
    title: "My Courses",
    href: "/student/courses",
    icon: BookOpen,
  },
  {
    title: "Attendance",
    href: "/student/attendance",
    icon: Calendar,
  },
  {
    title: "Schedule",
    href: "/student/schedule",
    icon: Clock,
  },
  {
    title: "Performance",
    href: "/student/performance",
    icon: Award,
  },
  {
    title: "Reports",
    href: "/student/reports",
    icon: BarChart3,
  },
  {
    title: "Profile",
    href: "/student/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/student/settings",
    icon: Settings,
  },
]

export function StudentSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Button
              key={item.href}
              asChild
              variant={isActive ? "default" : "ghost"}
              className={cn("w-full justify-start", isActive && "bg-blue-600 text-white hover:bg-blue-700")}
            >
              <Link href={item.href}>
                <Icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          )
        })}
      </nav>
    </div>
  )
}
