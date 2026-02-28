import { NextRequest, NextResponse } from 'next/server'
import { kotakNeoClient } from '@/lib/kotakNeoClient'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientId, totp, mpin } = body

    if (!clientId || !totp || !mpin) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create Kotak session
    const session = await kotakNeoClient.createSession({
      clientId,
      totp,
      mpin,
    })

    return NextResponse.json({
      token: session.token,
      userId: session.userId,
      expiresAt: session.expiresAt,
    })
  } catch (error) {
    console.error('Session creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1]

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const sessionValid = await kotakNeoClient.validateSession(token)

    return NextResponse.json({
      valid: sessionValid,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Session validation error:', error)
    return NextResponse.json(
      { error: 'Failed to validate session' },
      { status: 500 }
    )
  }
}