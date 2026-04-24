import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const user = await getSessionUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const fullUser = await db.user.findUnique({
      where: { id: user.id },
      include: {
        workerProfile: true,
        employerProfile: true,
      },
    });

    return NextResponse.json({ success: true, data: fullUser });
  } catch (error) {
    console.error('Profile get error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getSessionUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const allowedFields = ['language', 'city', 'role', 'phone', 'firstName', 'lastName'];
    const updateData: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: updateData,
      include: {
        workerProfile: true,
        employerProfile: true,
      },
    });

    // If role changed to worker and no worker profile exists, create one
    if (body.role === 'worker' && !updatedUser.workerProfile) {
      await db.workerProfile.create({
        data: { userId: user.id },
      });
    }

    // If role changed to employer and no employer profile exists, create one
    if (body.role === 'employer' && !updatedUser.employerProfile) {
      await db.employerProfile.create({
        data: { userId: user.id },
      });
    }

    // Re-fetch with profiles
    const fullUser = await db.user.findUnique({
      where: { id: user.id },
      include: {
        workerProfile: true,
        employerProfile: true,
      },
    });

    return NextResponse.json({ success: true, data: fullUser });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
