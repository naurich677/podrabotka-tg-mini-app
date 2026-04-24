import { db } from '@/lib/db';
import { validateInitData } from '@/lib/telegram';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { initData } = body;

    if (!initData) {
      return NextResponse.json(
        { success: false, error: 'initData is required' },
        { status: 400 }
      );
    }

    const { valid, user: tgUser } = validateInitData(initData);

    if (!valid || !tgUser) {
      return NextResponse.json(
        { success: false, error: 'Invalid initData' },
        { status: 401 }
      );
    }

    // Find or create user
    let user = await db.user.findUnique({
      where: { telegramId: tgUser.id },
      include: { workerProfile: true, employerProfile: true },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          telegramId: tgUser.id,
          telegramUsername: tgUser.username || null,
          firstName: tgUser.first_name || null,
          lastName: tgUser.last_name || null,
          photoUrl: tgUser.photo_url || null,
        },
        include: { workerProfile: true, employerProfile: true },
      });
    } else {
      user = await db.user.update({
        where: { id: user.id },
        data: {
          telegramUsername: tgUser.username || user.telegramUsername,
          firstName: tgUser.first_name || user.firstName,
          lastName: tgUser.last_name || user.lastName,
          photoUrl: tgUser.photo_url || user.photoUrl,
        },
        include: { workerProfile: true, employerProfile: true },
      });
    }

    return NextResponse.json({
      success: true,
      data: { user, sessionToken: user.id },
    });
  } catch (error) {
    console.error('Auth init error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
