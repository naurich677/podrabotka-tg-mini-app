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

    // Only the employer who owns the job can mark as paid
    if (application.job.employerId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Only the employer can mark as paid' },
        { status: 403 }
      );
    }

    if (application.status !== 'completed') {
      return NextResponse.json(
        { success: false, error: 'Application must be in completed status' },
        { status: 400 }
      );
    }

    const updatedApplication = await db.application.update({
      where: { id },
      data: {
        status: 'paid',
        paidAt: new Date(),
      },
    });

    // Check if all applications are paid/completed, update job status
    const pendingApplications = await db.application.count({
      where: {
        jobId: application.jobId,
        status: { in: ['approved', 'arrived', 'completed'] },
      },
    });

    if (pendingApplications === 0) {
      await db.job.update({
        where: { id: application.jobId },
        data: { status: 'completed' },
      });
    }

    // Notify worker
    await db.notification.create({
      data: {
        userId: application.workerId,
        type: 'payment_received',
        title: 'Оплата получена',
        body: `Оплата за "${application.job.title}" отмечена как полученная`,
      },
    });

    return NextResponse.json({ success: true, data: updatedApplication });
  } catch (error) {
    console.error('Application paid error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
