import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

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
    const allowedFields = [
      'birthDate',
      'gender',
      'avatar',
      'about',
      'categories',
      'skills',
      'preferredPaymentType',
      'verificationStatus',
    ];

    const updateData: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        // For categories and skills, stringify if they're arrays
        if ((field === 'categories' || field === 'skills') && Array.isArray(body[field])) {
          updateData[field] = JSON.stringify(body[field]);
        } else {
          updateData[field] = body[field];
        }
      }
    }

    // Ensure worker profile exists
    let workerProfile = await db.workerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!workerProfile) {
      workerProfile = await db.workerProfile.create({
        data: { userId: user.id, ...updateData },
      });
    } else {
      workerProfile = await db.workerProfile.update({
        where: { userId: user.id },
        data: updateData,
      });
    }

    return NextResponse.json({ success: true, data: workerProfile });
  } catch (error) {
    console.error('Worker profile update error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
