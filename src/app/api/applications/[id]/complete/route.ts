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

    // Only the employer who owns the job can mark completed
    if (application.job.employerId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Only the employer can mark applications as completed' },
        { status: 403 }
      );
    }

    if (application.status !== 'arrived') {
      return NextResponse.json(
        { success: false, error: 'Application must be in arrived status' },
        { status: 400 }
      );
    }

    const updatedApplication = await db.application.update({
      where: { id },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
    });

    // Increment worker's completedJobs count
    const workerProfile = await db.workerProfile.findUnique({
      where: { userId: application.workerId },
    });

    if (workerProfile) {
      await db.workerProfile.update({
        where: { userId: application.workerId },
        data: { completedJobs: workerProfile.completedJobs + 1 },
      });
    }

    // Notify worker
    await db.notification.create({
      data: {
        userId: application.workerId,
        type: 'job_completed',
        title: 'Работа завершена',
        body: `Работа "${application.job.title}" отмечена как завершённая`,
      },
    });

    return NextResponse.json({ success: true, data: updatedApplication });
  } catch (error) {
    console.error('Application complete error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
