import { supabase } from '@/services/supabase'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return Response.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return Response.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return Response.json({
      success: true,
      product: data,
    })
  } catch (err) {
    console.error('API error:', err)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
