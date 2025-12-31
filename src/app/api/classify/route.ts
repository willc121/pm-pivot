import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import OpenAI from 'openai'

const DAILY_LIMIT = 5

// Get rate limit key for today
function getRateLimitKey(ip: string): string {
  const today = new Date().toISOString().split('T')[0]
  return `hotdog:${ip}:${today}`
}

// Verify Cloudflare Turnstile token
async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    console.error('TURNSTILE_SECRET_KEY not configured')
    return false
  }

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret,
          response: token,
          remoteip: ip,
        }),
      }
    )

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error('Turnstile verification failed:', error)
    return false
  }
}

// Check and increment rate limit
async function checkRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  const key = getRateLimitKey(ip)
  
  try {
    const current = await kv.get<number>(key) || 0
    
    if (current >= DAILY_LIMIT) {
      return { allowed: false, remaining: 0 }
    }
    
    await kv.incr(key)
    await kv.expire(key, 86400)
    
    return { allowed: true, remaining: DAILY_LIMIT - current - 1 }
  } catch (error) {
    console.error('Rate limit check failed:', error)
    return { allowed: true, remaining: DAILY_LIMIT - 1 }
  }
}

// Classify image using GPT-4o-mini
async function classifyImage(base64Image: string): Promise<boolean> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const imageData = base64Image.replace(/^data:image\/\w+;base64,/, '')
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 50,
    messages: [
      {
        role: 'system',
        content: `You are a hot dog detector. Your ONLY job is to determine if an image contains a hot dog (frankfurter/wiener in a bun). 
        
Respond with ONLY "YES" if the image contains a hot dog, or "NO" if it does not.

A hot dog must be:
- A sausage/frankfurter in a bun
- Can have toppings like mustard, ketchup, relish, onions

NOT a hot dog:
- Just a sausage without a bun
- A hamburger or other sandwich
- Any other food
- Non-food items

Respond with exactly one word: YES or NO`
      },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${imageData}`,
              detail: 'low',
            },
          },
          {
            type: 'text',
            text: 'Is this a hot dog? Answer YES or NO only.',
          },
        ],
      },
    ],
  })

  const answer = response.choices[0]?.message?.content?.trim().toUpperCase()
  return answer === 'YES'
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'

    const body = await request.json()
    const { image, turnstileToken } = body

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    if (!turnstileToken) {
      return NextResponse.json(
        { error: 'CAPTCHA verification required' },
        { status: 400 }
      )
    }

    const isValidCaptcha = await verifyTurnstile(turnstileToken, ip)
    if (!isValidCaptcha) {
      return NextResponse.json(
        { error: 'CAPTCHA verification failed. Please try again.' },
        { status: 400 }
      )
    }

    const { allowed, remaining } = await checkRateLimit(ip)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Daily limit reached (5 checks per day). Come back tomorrow!' },
        { status: 429 }
      )
    }

    const isHotDog = await classifyImage(image)

    return NextResponse.json({
      isHotDog,
      remainingChecks: remaining,
    })
  } catch (error) {
    console.error('Classification error:', error)
    return NextResponse.json(
      { error: 'Failed to classify image. Please try again.' },
      { status: 500 }
    )
  }
}