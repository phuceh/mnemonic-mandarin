import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const { email } = await req.json()
    const { data } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('email', email)
      .eq('status', 'active')
      .single()

    return NextResponse.json({ hasSubscription: !!data })
  } catch (error) {
    return NextResponse.json({ hasSubscription: false })
  }
}