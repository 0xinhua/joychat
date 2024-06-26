import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: Request) {
  const userId = (await auth())?.user.id

  console.log('userId -> ', userId)

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  console.log('userId get ->', userId)

  try {

    const { data: rows, error } = await supabase.rpc('get_user_chats', { p_user_id: userId })

    if (error) {
      console.error('get_user_chats rpc error:', error)
      return NextResponse.json({
        data: [],
        code: 0,
      })
    }

    return NextResponse.json({
      data: rows ? rows : [],
      code: 0
    })

  } catch (error) {
    console.log('get_user_chats rpc error', error)
    return NextResponse.json({
      data: [],
      code: 0
    })
  }
}

export async function DELETE(req: Request) {

  const userId = (await auth())?.user.id

  console.log('userId -> ', userId)

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  try {

    const { data, error } = await supabase.rpc('delete_user_chats', { p_user_id: userId })

    console.log('delete rows data', error)

    return NextResponse.json({
      data: [],
      code: 0,
      message: 'success',
    })

  } catch (error) {
    console.log('error', error)
    return NextResponse.json({
      data: [],
      code: 0
    })
  }
}