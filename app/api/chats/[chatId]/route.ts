import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

export const runtime = 'edge'

export async function GET(req: Request,  { params }: { params: { chatId: string } }) {

  const { chatId } = params
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  console.log('chatId userId', chatId, userId)

  try {

    const startTime = Date.now()

    // see README function get_chat_data definition
    const { data: rows, error } = await supabase.rpc('get_chat_data', {
      p_user_id: userId,
      p_chat_id: chatId
    })

    const endTime = Date.now()
    const executionTime = endTime - startTime

    console.log(`Execution Time: ${executionTime} ms`)

    console.log(`chat ${chatId} data `, rows, error)

    if (rows.length === 0) {
      return NextResponse.json({
        data: null,
        code: 0
      })
    }

    return NextResponse.json({
      data: rows[0],
      code: 0
    })

  } catch (error) {
    console.log('error', error)
    return NextResponse.json({
      data: [],
      code: 0
    })
  }
}

export async function DELETE(req: Request, { params }: { params: { chatId: string } }) {

  const { chatId } = params
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  console.log('delet chatId: ', chatId)

  try {

    const { data, error } = await supabase.rpc('delete_chat', {
      p_user_id: userId,
      p_chat_id: chatId
    })

    // revalidatePath('/')
    revalidatePath(`/chat/${chatId}`)

    console.log('error', error)

    if (error) {
      return NextResponse.json({
        message: 'Chat not found or not authorized to delete this chat',
        code: 1
      })
    }

    return NextResponse.json({
      message: 'Chat deleted successfully',
      code: 0
    })

  } catch (error) {
    console.log('error', error)
    return NextResponse.json({
      message: 'Error deleting chat',
      code: 1
    })
  }
}