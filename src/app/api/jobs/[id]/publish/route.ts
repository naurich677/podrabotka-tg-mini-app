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

    const { id } = await params;

    const job = await db.job.findUnique({ where: { id } });

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    if (job.employerId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Only the job owner can publish' },
        { status: 403 }
      );
    }

    if (job.status !== 'draft') {
      return NextResponse.json(
        { success: false, error: 'Only draft jobs can be published' },
        { status: 400 }
      );
    }

    const updatedJob = await db.job.update({
      where: { id },
      data: { status: 'active' },
    });

    return NextResponse.json({ success: true, data: updatedJob });
  } catch (error) {
    console.error('Job publish error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
