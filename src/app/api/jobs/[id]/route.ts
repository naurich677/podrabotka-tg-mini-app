import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const job = await db.job.findUnique({
      where: { id },
      include: {
        employer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photoUrl: true,
            telegramUsername: true,
            phone: true,
            employerProfile: true,
          },
        },
        applications: {
          include: {
            worker: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                photoUrl: true,
                telegramUsername: true,
                workerProfile: true,
              },
            },
          },
        },
        reviews: true,
      },
    });

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: job });
  } catch (error) {
    console.error('Job get error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existingJob = await db.job.findUnique({ where: { id } });

    if (!existingJob) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    if (existingJob.employerId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Only the job owner can update' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const allowedFields = [
      'title',
      'category',
      'description',
      'city',
      'district',
      'address',
      'lat',
      'lng',
      'workDate',
      'startTime',
      'endTime',
      'paymentAmount',
      'paymentCurrency',
      'paymentType',
      'paymentSchedule',
      'workersNeeded',
      'experienceRequired',
      'documentsRequired',
      'status',
    ];

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === 'paymentAmount') {
          updateData[field] = parseFloat(String(body[field]));
        } else {
          updateData[field] = body[field];
        }
      }
    }

    const job = await db.job.update({
      where: { id },
      data: updateData,
      include: {
        employer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photoUrl: true,
            telegramUsername: true,
            employerProfile: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: job });
  } catch (error) {
    console.error('Job update error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
