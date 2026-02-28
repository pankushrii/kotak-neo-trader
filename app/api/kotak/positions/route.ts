import { NextRequest, NextResponse } from 'next/server'
import { kotakNeoClient } from '@/lib/kotakNeoClient'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1]

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const positions = await kotakNeoClient.getPositions(token)

    return NextResponse.json({
      positions,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Positions fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch positions' },
      { status: 500 }
    )
  }
}