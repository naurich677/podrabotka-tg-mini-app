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

    // Only the employer who owns the job can mark arrived
    if (application.job.employerId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Only the employer can mark workers as arrived' },
        { status: 403 }
      );
    }

    if (application.status !== 'approved') {
      return NextResponse.json(
        { success: false, error: 'Application must be in approved status' },
        { status: 400 }
      );
    }

    // Update application and job status
    const updatedApplication = await db.application.update({
      where: { id },
      data: {
        status: 'arrived',
        arrivedAt: new Date(),
      },
    });

    // Update job status to in_progress if not already
    if (application.job.status !== 'in_progress') {
      await db.job.update({
        where: { id: application.jobId },
        data: { status: 'in_progress' },
      });
    }

    return NextResponse.json({ success: true, data: updatedApplication });
  } catch (error) {
    console.error('Application arrived error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
