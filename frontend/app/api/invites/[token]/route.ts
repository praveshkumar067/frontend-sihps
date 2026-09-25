import { NextResponse } from 'next/server';
import { InviteRecord } from '@/lib/types';
import { MOCK_INVITES } from '@/lib/mock-data';

// Access shared memory store (fallback array initialized with MOCK_INVITES)
declare global {
  var _memoryInvites: InviteRecord[] | undefined;
}

if (!global._memoryInvites) {
  global._memoryInvites = [...MOCK_INVITES];
}

export async function GET(request: Request, { params }: { params: { token: string } }) {
  const token = params.token;
  const invites = global._memoryInvites || MOCK_INVITES;
  const invite = invites.find(i => i.token === token);

  if (!invite) {
    return NextResponse.json({ valid: false, reason: 'Invitation link does not exist.' }, { status: 404 });
  }

  const isExpired = new Date(invite.expiresAt).getTime() < Date.now();
  if (isExpired || invite.status === 'expired') {
    invite.status = 'expired';
    return NextResponse.json({ valid: false, invite, reason: 'This invitation link has expired.' }, { status: 400 });
  }

  if (invite.status === 'completed') {
    return NextResponse.json({ valid: false, invite, reason: 'This invitation link has already been used to complete registration.' }, { status: 400 });
  }

  // Update status to 'opened' if currently 'sent'
  if (invite.status === 'sent') {
    invite.status = 'opened';
  }

  return NextResponse.json({ valid: true, invite });
}

export async function POST(request: Request, { params }: { params: { token: string } }) {
  try {
    const token = params.token;
    const body = await request.json();
    const invites = global._memoryInvites || MOCK_INVITES;
    const invite = invites.find(i => i.token === token);

    if (!invite) {
      return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
    }

    if (new Date(invite.expiresAt).getTime() < Date.now() || invite.status === 'expired') {
      invite.status = 'expired';
      return NextResponse.json({ error: 'Invite has expired' }, { status: 400 });
    }

    if (invite.status === 'completed') {
      return NextResponse.json({ error: 'Invite already completed' }, { status: 400 });
    }

    invite.status = 'completed';
    return NextResponse.json({ success: true, invite, regData: body.regData });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update invite' }, { status: 500 });
  }
}
