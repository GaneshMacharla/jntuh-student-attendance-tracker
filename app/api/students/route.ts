import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const departmentId = searchParams.get("department_id")
    const year = searchParams.get("year")
    const semester = searchParams.get("semester")

    let query = supabase
      .from("students")
      .select(`
        *,
        users(full_name, email, phone),
        departments(name, code)
      `)
      .order("roll_number")

    if (departmentId) {
      query = query.eq("department_id", departmentId)
    }
    if (year) {
      query = query.eq("year", Number.parseInt(year))
    }
    if (semester) {
      query = query.eq("semester", Number.parseInt(semester))
    }

    const { data: students, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ students })
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
    const { user_id, roll_number, department_id, year, semester, batch } = body

    const { data, error } = await supabase
      .from("students")
      .insert({ id: user_id, roll_number, department_id, year, semester, batch })
      .select(`
        *,
        users(full_name, email, phone),
        departments(name, code)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ student: data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
