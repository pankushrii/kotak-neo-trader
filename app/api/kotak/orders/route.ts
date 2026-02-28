import { NextResponse } from 'next/server';

// Dummy in-memory orders storage
let orders = [];

// POST endpoint to place orders
export async function POST(req) {
    const order = await req.json();
    orders.push(order); // Store the order
    return NextResponse.json({ message: 'Order placed successfully!', order }, { status: 201 });
}

// GET endpoint to fetch orders
export async function GET() {
    return NextResponse.json(orders);
}