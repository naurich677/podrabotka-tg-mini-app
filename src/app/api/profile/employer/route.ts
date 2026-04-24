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
      'companyName',
      'businessType',
      'binIin',
      'description',
      'address',
      'city',
      'verifiedStatus',
    ];

    const updateData: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Ensure employer profile exists
    let employerProfile = await db.employerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!employerProfile) {
      employerProfile = await db.employerProfile.create({
        data: { userId: user.id, ...updateData },
      });
    } else {
      employerProfile = await db.employerProfile.update({
        where: { userId: user.id },
        data: updateData,
      });
    }

    return NextResponse.json({ success: true, data: employerProfile });
  } catch (error) {
    console.error('Employer profile update error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
