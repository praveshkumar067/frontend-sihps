import { NextResponse } from 'next/server';
import { InviteRecord } from '@/lib/types';
import { MOCK_INVITES } from '@/lib/mock-data';

// Global in-memory storage for API routes (persistent while server runs)
let memoryInvites: InviteRecord[] = [...MOCK_INVITES];

export async function GET() {
  // Check for expired invites
  const now = Date.now();
  memoryInvites = memoryInvites.map(inv => {
    if (inv.status !== 'completed' && new Date(inv.expiresAt).getTime() < now) {
      return { ...inv, status: 'expired' };
    }
    return inv;
  });
  return NextResponse.json(memoryInvites);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { recipientName, recipientPhone, recipientEmail, customMessage } = body;

    if (!recipientName) {
      return NextResponse.json({ error: 'Recipient name is required' }, { status: 400 });
    }

    const randomHex = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6);
    const token = `inv-${randomHex}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const record: InviteRecord = {
      id: `inv-${Date.now()}`,
      token,
      recipientName,
      recipientPhone: recipientPhone || '',
      recipientEmail: recipientEmail || '',
      customMessage: customMessage || '',
      status: 'sent',
      createdAt: now.toISOString(),
      expiresAt
    };

    memoryInvites.unshift(record);
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create invite' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    memoryInvites = memoryInvites.map(inv => inv.id === id ? { ...inv, status: 'expired' as const } : inv);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to revoke invite' }, { status: 500 });
  }
}
