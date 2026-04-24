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

    const body = await request.json();
    const { phoneNumber, verificationId } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
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

    // Update or create verification record
    if (verificationId) {
      await db.phoneVerification.update({
        where: { id: verificationId },
        data: {
          telegramContactShared: true,
          phoneNumber,
          verifiedAt: new Date(),
          source: 'telegram_mini_app',
        },
      });
    } else {
      await db.phoneVerification.create({
        data: {
          userId: user.id,
          telegramContactShared: true,
          phoneNumber,
          verifiedAt: new Date(),
          source: 'telegram_mini_app',
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: { user: updatedUser },
    });
  } catch (error) {
    console.error('Phone confirm error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
