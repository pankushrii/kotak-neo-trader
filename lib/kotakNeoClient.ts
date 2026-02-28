import axios, { AxiosInstance } from 'axios'
import { KotakSession, KotakQuote, KotakOrder, KotakPosition } from '@/types/kotak'

class KotakNeoClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_KOTAK_API_URL,
      timeout: 10000,
    })
  }

  async createSession(credentials: {
    clientId: string
    totp: string
    mpin: string
  }): Promise<KotakSession> {
    try {
      const response = await this.client.post('/session/login', {
        clientId: credentials.clientId,
        totpNumber: credentials.totp,
        mPin: credentials.mpin,
      })

      return {
        token: response.data.token,
        userId: response.data.userId,
        expiresAt: response.data.expiresAt,
      }
    } catch (error) {
      throw new Error('Failed to create session')
    }
  }

  async validateSession(token: string): Promise<boolean> {
    try {
      const response = await this.client.get('/session/validate', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      return response.status === 200
    } catch (error) {
      return false
    }
  }

  async getQuotes(token: string, symbols: string[]): Promise<KotakQuote[]> {
    try {
      const response = await this.client.post(
        '/quotes',
        { symbols },
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      return response.data.quotes || []
    } catch (error) {
      throw new Error('Failed to fetch quotes')
    }
  }

  async placeOrder(
    token: string,
    orderData: any
  ): Promise<KotakOrder> {
    try {
      const response = await this.client.post(
        '/orders/place',
        orderData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      return response.data
    } catch (error) {
      throw new Error('Failed to place order')
    }
  }

  async getOrders(token: string): Promise<KotakOrder[]> {
    try {
      const response = await this.client.get(
        '/orders',
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      return response.data.orders || []
    } catch (error) {
      throw new Error('Failed to fetch orders')
    }
  }

  async getPositions(token: string): Promise<KotakPosition[]> {
    try {
      const response = await this.client.get(
        '/positions',
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      return response.data.positions || []
    } catch (error) {
      throw new Error('Failed to fetch positions')
    }
  }
}

export const kotakNeoClient = new KotakNeoClient()