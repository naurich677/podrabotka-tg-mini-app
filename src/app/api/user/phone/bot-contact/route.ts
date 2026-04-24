import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { telegramId, phoneNumber } = body;

    if (!telegramId || !phoneNumber) {
      return NextResponse.json(
        { success: false, error: 'telegramId and phoneNumber are required' },
        { status: 400 }
      );
    }

    // Find user by telegram ID
    const user = await db.user.findUnique({
      where: { telegramId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user phone
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        phone: phoneNumber,
        phoneVerified: true,
      },
    });

    // Create verification record
    await db.phoneVerification.create({
      data: {
        userId: user.id,
        telegramContactShared: true,
        phoneNumber,
        verifiedAt: new Date(),
        source: 'telegram_bot',
      },
    });

    return NextResponse.json({
      success: true,
      data: { user: updatedUser },
    });
  } catch (error) {
    console.error('Bot contact error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
