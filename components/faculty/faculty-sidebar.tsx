"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, BookOpen, Calendar, Users, BarChart3, Settings, Clock, CheckSquare } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/faculty",
    icon: LayoutDashboard,
  },
  {
    title: "My Courses",
    href: "/faculty/courses",
    icon: BookOpen,
  },
  {
    title: "Schedule",
    href: "/faculty/schedule",
    icon: Calendar,
  },
  {
    title: "Mark Attendance",
    href: "/faculty/attendance",
    icon: CheckSquare,
  },
  {
    title: "My Students",
    href: "/faculty/students",
    icon: Users,
  },
  {
    title: "Sessions",
    href: "/faculty/sessions",
    icon: Clock,
  },
  {
    title: "Reports",
    href: "/faculty/reports",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/faculty/settings",
    icon: Settings,
  },
]

export function FacultySidebar() {
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
