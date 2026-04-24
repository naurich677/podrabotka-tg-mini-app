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

    // Only the employer who owns the job can reject
    if (application.job.employerId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Only the employer can reject applications' },
        { status: 403 }
      );
    }

    if (application.status !== 'applied') {
      return NextResponse.json(
        { success: false, error: 'Application is not in applied status' },
        { status: 400 }
      );
    }

    const updatedApplication = await db.application.update({
      where: { id },
      data: { status: 'rejected' },
    });

    // Notify worker
    await db.notification.create({
      data: {
        userId: application.workerId,
        type: 'application_rejected',
        title: 'Заявка отклонена',
        body: `Ваша заявка на "${application.job.title}" отклонена`,
      },
    });

    return NextResponse.json({ success: true, data: updatedApplication });
  } catch (error) {
    console.error('Application reject error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
