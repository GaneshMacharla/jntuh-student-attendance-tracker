import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCard {
  title: string
  value: number
  description: string
  icon: LucideIcon
  trend: string
  color: string
  bgColor: string
}

interface FacultyStatsCardsProps {
  stats: StatCard[]
}

export function FacultyStatsCards({ stats }: FacultyStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <p className="text-xs text-blue-600 mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
