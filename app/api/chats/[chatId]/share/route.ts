import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const runtime = 'edge'

export async function POST(req: Request, { params }: { params: { chatId: string } }) {

  const { chatId } = params
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  if (!chatId) {
    return new Response('chatId params is required', {
      status: 400
    })
  }

  console.log('chatId get ->', chatId)

  try {

    // see README function get_chat_data definition
    const { data: rows, error } = await supabase.rpc('get_chat_data', {
      p_user_id: userId,
      p_chat_id: chatId
    })

    if (!rows || !rows?.length) {
      return NextResponse.json({
        message: 'The chat has since been removed',
        code: 1
      })
    }

    console.log('get chat rows', rows)
  
    if (rows[0].user_id !== userId) {
      return NextResponse.json({
        message: 'You do not have permission to share this chat',
        code: 1
      })
    }

    const sharePath = `/share/${rows[0].chat_id}`

    const { data: updatedRows, error: sharedError } = await supabase.rpc('update_share_path', { a_chat_id: chatId, a_user_id: userId, a_share_path: sharePath })

    if (sharedError) {
      console.error('update_shared_path rpc sharedError:', sharedError)
      return NextResponse.json({
        data: [],
        code: 0,
      })
    }

    console.log('updatedRows', updatedRows)

    return NextResponse.json({
      data: updatedRows ? updatedRows[0] : [],
      code: 0
    })

  } catch (error) {
    console.log('update_shared_path rpc error', error)
    return NextResponse.json({
      data: [],
      code: 0
    })
  }
}

export async function GET(req: Request, { params }: { params: { chatId: string } }) {

  const { chatId } = params

  if (!chatId) {
    return new Response('chatId params is required', {
      status: 400
    })
  }

  console.log('chatId get ->', chatId)

  try {

    const { data: rows, error } = await supabase.rpc('get_shared_chat', { p_chat_id: chatId })

    if (error) {
      console.error('get_shared_chat rpc error:', error)
      return NextResponse.json({
        data: [],
        code: 0,
      })
    }

    return NextResponse.json({
      data: rows ? rows[0] : [],
      code: 0
    })

  } catch (error) {
    console.log('get_shared_chat rpc error', error)
    return NextResponse.json({
      data: [],
      code: 0
    })
  }
}