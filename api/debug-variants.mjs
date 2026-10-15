/**
 * Debug API - Check variant data including weight
 * GET /api/debug-variants?product_id=xxx
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zzwssbtkfqzaghdyuqza.supabase.co'
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6d3NzYnRrZnF6YWdoZHl1cXphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA3NTU3NzUsImV4cCI6MjAyNjM1NTc3NX0.xDdDVOgkM6gVlpvKJz-5G3MEFQQ2HW1lB6Qx-_9bH2s'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { product_id } = req.query

    if (!product_id) {
      return res.status(400).json({ error: 'Missing product_id parameter' })
    }

    console.log(`📋 Fetching variants for product: ${product_id}`)

    // Get all variants for this product
    const { data: variants, error } = await supabase
      .from('product_variants')
      .select('id, sku, color, size, weight_kg, length_cm, width_cm, height_cm, stock, price')
      .eq('product_id', product_id)

    if (error) {
      return res.status(500).json({ 
        error: 'Failed to fetch variants', 
        details: error.message 
      })
    }

    if (!variants || variants.length === 0) {
      return res.status(404).json({ 
        error: 'No variants found for this product',
        product_id 
      })
    }

    console.log(`✅ Found ${variants.length} variants`)
    
    // Log each variant's weight info
    variants.forEach((v, idx) => {
      console.log(`   [${idx + 1}] SKU: ${v.sku} | Color: ${v.color} | Size: ${v.size} | Weight: ${v.weight_kg}kg | L:${v.length_cm}cm W:${v.width_cm}cm H:${v.height_cm}cm`)
    })

    return res.status(200).json({
      success: true,
      product_id,
      variant_count: variants.length,
      variants: variants.map(v => ({
        id: v.id,
        sku: v.sku,
        color: v.color,
        size: v.size,
        weight_kg: v.weight_kg,
        length_cm: v.length_cm,
        width_cm: v.width_cm,
        height_cm: v.height_cm,
        stock: v.stock,
        price: v.price,
      }))
    })
  } catch (err) {
    console.error('❌ Error:', err)
    return res.status(500).json({ 
      error: 'Server error',
      message: err instanceof Error ? err.message : 'Unknown error'
    })
  }
}

export default handler
