import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(
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

    if (user.role !== 'worker') {
      return NextResponse.json(
        { success: false, error: 'Only workers can apply to jobs' },
        { status: 403 }
      );
    }

    if (!user.phoneVerified) {
      return NextResponse.json(
        { success: false, error: 'Phone verification required to apply' },
        { status: 403 }
      );
    }

    const { id } = await params;

    const job = await db.job.findUnique({
      where: { id },
      include: { applications: true },
    });

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    if (job.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Job is not active' },
        { status: 400 }
      );
    }

    if (job.workersConfirmed >= job.workersNeeded) {
      return NextResponse.json(
        { success: false, error: 'Job is already full' },
        { status: 400 }
      );
    }

    // Check if already applied
    const existingApplication = await db.application.findFirst({
      where: { jobId: id, workerId: user.id },
    });

    if (existingApplication) {
      return NextResponse.json(
        { success: false, error: 'You have already applied to this job' },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { note } = body;

    const application = await db.application.create({
      data: {
        jobId: id,
        workerId: user.id,
        note: note || null,
      },
      include: {
        job: true,
        worker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photoUrl: true,
          },
        },
      },
    });

    // Create notification for employer
    await db.notification.create({
      data: {
        userId: job.employerId,
        type: 'new_application',
        title: 'Новая заявка',
        body: `Получена новая заявка на "${job.title}"`,
      },
    });

    return NextResponse.json(
      { success: true, data: application },
      { status: 201 }
    );
  } catch (error) {
    console.error('Job apply error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
