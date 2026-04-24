import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

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

    const application = await db.application.findUnique({
      where: { id },
      include: { job: true },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    // Only the employer who owns the job can approve
    if (application.job.employerId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Only the employer can approve applications' },
        { status: 403 }
      );
    }

    if (application.status !== 'applied') {
      return NextResponse.json(
        { success: false, error: 'Application is not in applied status' },
        { status: 400 }
      );
    }

    // Check if job still has capacity
    if (application.job.workersConfirmed >= application.job.workersNeeded) {
      return NextResponse.json(
        { success: false, error: 'Job is already full' },
        { status: 400 }
      );
    }

    const updatedApplication = await db.application.update({
      where: { id },
      data: {
        status: 'approved',
        approvedAt: new Date(),
      },
    });

    // Increment workersConfirmed on job
    const newConfirmed = application.job.workersConfirmed + 1;
    const jobUpdateData: Record<string, unknown> = {
      workersConfirmed: newConfirmed,
    };

    // If job is now full, update status
    if (newConfirmed >= application.job.workersNeeded) {
      jobUpdateData.status = 'full';
    }

    await db.job.update({
      where: { id: application.jobId },
      data: jobUpdateData,
    });

    // Notify worker
    await db.notification.create({
      data: {
        userId: application.workerId,
        type: 'application_approved',
        title: 'Заявка одобрена',
        body: `Ваша заявка на "${application.job.title}" одобрена!`,
      },
    });

    return NextResponse.json({ success: true, data: updatedApplication });
  } catch (error) {
    console.error('Application approve error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
