import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const departmentId = searchParams.get("department_id")
    const semester = searchParams.get("semester")
    const year = searchParams.get("year")

    let query = supabase
      .from("courses")
      .select(`
        *,
        departments(name, code)
      `)
      .order("name")

    if (departmentId) {
      query = query.eq("department_id", departmentId)
    }
    if (semester) {
      query = query.eq("semester", Number.parseInt(semester))
    }
    if (year) {
      query = query.eq("year", Number.parseInt(year))
    }

    const { data: courses, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ courses })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (userData?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { name, code, department_id, semester, year, credits } = body

    const { data, error } = await supabase
      .from("courses")
      .insert({ name, code, department_id, semester, year, credits })
      .select(`
        *,
        departments(name, code)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ course: data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
