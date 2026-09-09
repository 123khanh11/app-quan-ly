import { createClient } from '@supabase/supabase-js'

let supabaseClient = null

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient

  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(`Missing Supabase env vars`)
  }

  supabaseClient = createClient(url, key)
  return supabaseClient
}

async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const supabase = getSupabaseClient()

    const { 
      order_id,
      user_id,
      transfer_content,
      qr_code_url,
      bank_account,
      bank_name,
      amount,
      payment_method
    } = req.body

    // Validate required fields
    if (!order_id || !transfer_content || !bank_account || !bank_name || !amount) {
      return res.status(400).json({ 
        error: 'Missing required fields: order_id, transfer_content, bank_account, bank_name, amount' 
      })
    }

    // Only create payment_transfer if payment_method is bank_transfer
    if (payment_method !== 'bank_transfer') {
      console.log('ℹ️ Payment method is COD, skipping payment_transfer creation')
      return res.status(200).json({
        success: true,
        message: 'COD payment, no transfer needed'
      })
    }

    console.log('💳 Creating payment transfer for order:', order_id)

    // Create payment transfer
    const { data: transferData, error: transferError } = await supabase
      .from('payment_transfers')
      .insert([{
        order_id,
        user_id: user_id || null,
        transfer_content,
        qr_code_url: qr_code_url || null,
        bank_account,
        bank_name,
        amount: parseFloat(amount),
        status: 'pending'
      }])
      .select()

    if (transferError) {
      console.error('❌ Payment transfer creation error:', transferError)
      return res.status(500).json({
        error: `Payment transfer creation failed: ${transferError.message}`,
      })
    }

    if (!transferData || transferData.length === 0) {
      return res.status(500).json({
        error: 'Payment transfer created but no data returned',
      })
    }

    const paymentTransferId = transferData[0].id
    console.log('✅ Payment transfer created:', paymentTransferId)

    return res.status(201).json({
      success: true,
      payment_transfer_id: paymentTransferId,
      payment_transfer: transferData[0],
    })
  } catch (err) {
    console.error('❌ API error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return res.status(500).json({ 
      error: message,
    })
  }
}

export default handler
