import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET method to fetch user's systemPrompt
export async function GET(req: Request) {
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const { data: rows, error } = await supabase.rpc('get_system_prompt_by_user_id', {
      _user_id: userId
    })
  
    if (error) {
      throw error
    }

    if (rows && rows?.length) {
      return NextResponse.json({ data: rows[0], code: 0 })
    }

    return NextResponse.json({ data: null, code: 0 })

  } catch (error) {
    console.log('error', error)
    return NextResponse.json({ data: null, code: 1, message: 'Error fetching system prompt' })
  }
}

// POST method to update user's systemPrompt
export async function POST(req: Request) {
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { prompt } = await req.json()

  if (!prompt) {
    return NextResponse.json({ code: 1, message: 'Prompt is required' })
  }

  try {
    const { data, error } = await supabase.rpc('upsert_system_prompt', {
      _user_id: userId,
      _prompt: prompt
    })

    if (error) {
      throw error
    }

    return NextResponse.json({ code: 0, message: 'System prompt updated successfully' })

  } catch (error) {
    console.log('error', error)
    return NextResponse.json({ code: 1, message: 'Error updating system prompt' })
  }
}
