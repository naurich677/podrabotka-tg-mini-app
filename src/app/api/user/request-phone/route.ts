import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const user = await getSessionUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create a phone verification record
    const verification = await db.phoneVerification.create({
      data: {
        userId: user.id,
        telegramContactShared: false,
      },
    });

    return NextResponse.json({
      success: true,
      data: { verificationId: verification.id },
    });
  } catch (error) {
    console.error('Request phone error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
