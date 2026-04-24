import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const district = searchParams.get('district');
    const workDate = searchParams.get('date');
    const paymentType = searchParams.get('paymentType');
    const search = searchParams.get('search');
    const status = searchParams.get('status') || 'active';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const where: Record<string, unknown> = {
      status,
    };

    if (category) where.category = category;
    if (city) where.city = city;
    if (district) where.district = district;
    if (workDate) where.workDate = workDate;
    if (paymentType) where.paymentType = paymentType;

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      db.job.findMany({
        where,
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
          applications: {
            select: { id: true, status: true },
          },
          _count: {
            select: { applications: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.job.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        jobs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Jobs list error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (user.role !== 'employer') {
      return NextResponse.json(
        { success: false, error: 'Only employers can create jobs' },
        { status: 403 }
      );
    }

    if (!user.phoneVerified) {
      return NextResponse.json(
        { success: false, error: 'Phone verification required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      category,
      description,
      city,
      district,
      address,
      lat,
      lng,
      workDate,
      startTime,
      endTime,
      paymentAmount,
      paymentCurrency,
      paymentType,
      paymentSchedule,
      workersNeeded,
      experienceRequired,
      documentsRequired,
    } = body;

    if (!title || !category || !workDate || !startTime || !endTime || !paymentAmount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, category, workDate, startTime, endTime, paymentAmount' },
        { status: 400 }
      );
    }

    const job = await db.job.create({
      data: {
        employerId: user.id,
        title,
        category,
        description: description || '',
        city: city || user.city,
        district: district || null,
        address: address || null,
        lat: lat || null,
        lng: lng || null,
        workDate,
        startTime,
        endTime,
        paymentAmount: parseFloat(String(paymentAmount)),
        paymentCurrency: paymentCurrency || 'KZT',
        paymentType: paymentType || 'daily',
        paymentSchedule: paymentSchedule || null,
        workersNeeded: workersNeeded || 1,
        experienceRequired: experienceRequired || false,
        documentsRequired: documentsRequired || false,
        status: 'draft',
      },
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

    return NextResponse.json(
      { success: true, data: job },
      { status: 201 }
    );
  } catch (error) {
    console.error('Job create error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
