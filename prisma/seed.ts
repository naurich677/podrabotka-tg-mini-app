import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  // Clear existing data
  await db.notification.deleteMany();
  await db.application.deleteMany();
  await db.review.deleteMany();
  await db.phoneVerification.deleteMany();
  await db.workerProfile.deleteMany();
  await db.employerProfile.deleteMany();
  await db.job.deleteMany();
  await db.user.deleteMany();

  // Demo Worker Users
  const worker1 = await db.user.create({
    data: {
      telegramId: 100001,
      telegramUsername: 'alisa_nurlan',
      firstName: 'Алиса',
      lastName: 'Нурланова',
      photoUrl: '',
      role: 'worker',
      phone: '+77011112233',
      phoneVerified: true,
      language: 'ru',
      city: 'astana',
    },
  });

  await db.workerProfile.create({
    data: {
      userId: worker1.id,
      birthDate: '1998-05-12',
      gender: 'female',
      about: 'Опыт работы курьером 2 года. Ответственная, пунктуальная.',
      categories: JSON.stringify(['courier', 'promouter']),
      skills: JSON.stringify(['навигация', 'коммуникация', 'доставка']),
      rating: 4.7,
      reviewsCount: 12,
      completedJobs: 34,
      preferredPaymentType: 'daily',
      verificationStatus: 'verified',
    },
  });

  const worker2 = await db.user.create({
    data: {
      telegramId: 100002,
      telegramUsername: 'dima_kim',
      firstName: 'Дмитрий',
      lastName: 'Ким',
      photoUrl: '',
      role: 'worker',
      phone: '+77021113344',
      phoneVerified: true,
      language: 'ru',
      city: 'astana',
    },
  });

  await db.workerProfile.create({
    data: {
      userId: worker2.id,
      birthDate: '1995-03-20',
      gender: 'male',
      about: 'Грузчик со своим транспортом. Физически крепкий.',
      categories: JSON.stringify(['loader', 'courier']),
      skills: JSON.stringify(['физическая сила', 'водительские права', 'пунктуальность']),
      rating: 4.5,
      reviewsCount: 8,
      completedJobs: 22,
      preferredPaymentType: 'daily',
      verificationStatus: 'verified',
    },
  });

  const worker3 = await db.user.create({
    data: {
      telegramId: 100003,
      telegramUsername: 'saule_zh',
      firstName: 'Сауле',
      lastName: 'Жумагулова',
      photoUrl: '',
      role: 'worker',
      phone: null,
      phoneVerified: false,
      language: 'kz',
      city: 'astana',
    },
  });

  await db.workerProfile.create({
    data: {
      userId: worker3.id,
      birthDate: '2000-11-08',
      gender: 'female',
      about: 'Студентка, ищу подработку на выходные.',
      categories: JSON.stringify(['promouter', 'waiter', 'cleaning']),
      skills: JSON.stringify(['общение', 'аккуратность']),
      rating: 0,
      reviewsCount: 0,
      completedJobs: 0,
      preferredPaymentType: 'daily',
      verificationStatus: 'none',
    },
  });

  // Demo Employer Users
  const employer1 = await db.user.create({
    data: {
      telegramId: 200001,
      telegramUsername: 'astana_delivery',
      firstName: 'Астана',
      lastName: 'Деливери',
      photoUrl: '',
      role: 'employer',
      phone: '+77711112233',
      phoneVerified: true,
      language: 'ru',
      city: 'astana',
    },
  });

  await db.employerProfile.create({
    data: {
      userId: employer1.id,
      companyName: 'ТОО "Астана Деливери"',
      businessType: 'delivery',
      binIin: '200140012345',
      description: 'Служба доставки по Астане. Ежедневно доставляем более 500 заказов.',
      address: 'г. Астана, ул. Кабанбай батыра, 15',
      city: 'astana',
      verifiedStatus: 'verified',
      rating: 4.8,
      reviewsCount: 45,
    },
  });

  const employer2 = await db.user.create({
    data: {
      telegramId: 200002,
      telegramUsername: 'bizservice_kz',
      firstName: 'Бизнес',
      lastName: 'Сервис',
      photoUrl: '',
      role: 'employer',
      phone: '+77721113344',
      phoneVerified: true,
      language: 'ru',
      city: 'astana',
    },
  });

  await db.employerProfile.create({
    data: {
      userId: employer2.id,
      companyName: 'ИП "Бизнес Сервис"',
      businessType: 'staffing',
      binIin: '190740034567',
      description: 'Предоставляем персонал для мероприятий и складов.',
      address: 'г. Астана, пр. Республики, 42',
      city: 'astana',
      verifiedStatus: 'pending',
      rating: 4.3,
      reviewsCount: 18,
    },
  });

  // Demo Jobs
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfter = new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0];

  const jobsData = [
    {
      employerId: employer1.id,
      title: 'Курьер-доставщик',
      category: 'courier',
      description: 'Доставка еды по Астане. Работа на своем авто или пешком. Маршрут определяется через приложение.',
      city: 'astana',
      district: 'esil',
      address: 'ул. Сыганак, 60',
      lat: 51.0907,
      lng: 71.4106,
      workDate: today,
      startTime: '09:00',
      endTime: '18:00',
      paymentAmount: 8000,
      paymentCurrency: 'KZT',
      paymentType: 'daily',
      paymentSchedule: 'same_day',
      workersNeeded: 5,
      workersConfirmed: 2,
      experienceRequired: false,
      documentsRequired: false,
      status: 'active',
    },
    {
      employerId: employer2.id,
      title: 'Грузчик на склад',
      category: 'loader',
      description: 'Погрузочно-разгрузочные работы на складе. Нужна физическая выносливость. Выдаётся спецодежда.',
      city: 'astana',
      district: 'saryarka',
      address: 'ул. Жубанова, 12',
      lat: 51.1662,
      lng: 71.4555,
      workDate: today,
      startTime: '08:00',
      endTime: '17:00',
      paymentAmount: 12000,
      paymentCurrency: 'KZT',
      paymentType: 'daily',
      paymentSchedule: 'same_day',
      workersNeeded: 3,
      workersConfirmed: 1,
      experienceRequired: true,
      documentsRequired: true,
      status: 'active',
    },
    {
      employerId: employer2.id,
      title: 'Промоутер в ТРЦ',
      category: 'promouter',
      description: 'Раздача листовок и продвижение бренда в ТРЦ Хан Шатыр. Приятная внешность, коммуникабельность.',
      city: 'astana',
      district: 'almaty',
      address: 'ТРЦ Хан Шатыр, пр. Туран, 37',
      lat: 51.1283,
      lng: 71.4315,
      workDate: tomorrow,
      startTime: '10:00',
      endTime: '19:00',
      paymentAmount: 6000,
      paymentCurrency: 'KZT',
      paymentType: 'daily',
      paymentSchedule: 'same_day',
      workersNeeded: 4,
      workersConfirmed: 0,
      experienceRequired: false,
      documentsRequired: false,
      status: 'active',
    },
    {
      employerId: employer1.id,
      title: 'Официант на банкет',
      category: 'waiter',
      description: 'Обслуживание гостей на корпоративном банкете на 200 персон. Опыт работы официантом от 6 месяцев.',
      city: 'astana',
      district: 'baykonur',
      address: 'Ресторан "Дастархан", ул. Мангилик Ел, 28',
      lat: 51.0894,
      lng: 71.4086,
      workDate: tomorrow,
      startTime: '17:00',
      endTime: '23:00',
      paymentAmount: 10000,
      paymentCurrency: 'KZT',
      paymentType: 'daily',
      paymentSchedule: 'next_day',
      workersNeeded: 8,
      workersConfirmed: 5,
      experienceRequired: true,
      documentsRequired: false,
      status: 'active',
    },
    {
      employerId: employer2.id,
      title: 'Уборка помещений',
      category: 'cleaning',
      description: 'Генеральная уборка офисного помещения 200 кв.м. Всё оборудование и средства предоставляются.',
      city: 'astana',
      district: 'esil',
      address: 'БЦ "Талан", ул. Достык, 13',
      lat: 51.1200,
      lng: 71.4200,
      workDate: today,
      startTime: '09:00',
      endTime: '15:00',
      paymentAmount: 7000,
      paymentCurrency: 'KZT',
      paymentType: 'daily',
      paymentSchedule: 'same_day',
      workersNeeded: 2,
      workersConfirmed: 1,
      experienceRequired: false,
      documentsRequired: false,
      status: 'active',
    },
    {
      employerId: employer1.id,
      title: 'Курьер-пешеход',
      category: 'courier',
      description: 'Доставка документов в пределах Есильского района. Пешие маршруты до 3 км.',
      city: 'astana',
      district: 'saryarka',
      address: 'ул. Кенесары, 55',
      lat: 51.1530,
      lng: 71.4500,
      workDate: dayAfter,
      startTime: '10:00',
      endTime: '16:00',
      paymentAmount: 7500,
      paymentCurrency: 'KZT',
      paymentType: 'daily',
      paymentSchedule: 'same_day',
      workersNeeded: 2,
      workersConfirmed: 0,
      experienceRequired: false,
      documentsRequired: true,
      status: 'active',
    },
    {
      employerId: employer2.id,
      title: 'Грузчик на стройку',
      category: 'loader',
      description: 'Разгрузка строительных материалов. Тяжелая физическая работа. Нужна спецобувь.',
      city: 'astana',
      district: 'almaty',
      address: 'Стройплощадка, ул. Ауэзова, 8',
      lat: 51.1350,
      lng: 71.4400,
      workDate: dayAfter,
      startTime: '07:00',
      endTime: '16:00',
      paymentAmount: 15000,
      paymentCurrency: 'KZT',
      paymentType: 'weekly',
      paymentSchedule: 'end_of_week',
      workersNeeded: 6,
      workersConfirmed: 3,
      experienceRequired: true,
      documentsRequired: true,
      status: 'active',
    },
    {
      employerId: employer1.id,
      title: 'Промоутер-консультант',
      category: 'promouter',
      description: 'Консультирование клиентов по услугам связи в точке продаж. Обучение предоставляется.',
      city: 'astana',
      district: 'esil',
      address: 'ТЦ "Керуен", ул. Коргалжын, 1',
      lat: 51.0950,
      lng: 71.4150,
      workDate: tomorrow,
      startTime: '10:00',
      endTime: '20:00',
      paymentAmount: 8000,
      paymentCurrency: 'KZT',
      paymentType: 'daily',
      paymentSchedule: 'next_day',
      workersNeeded: 3,
      workersConfirmed: 1,
      experienceRequired: false,
      documentsRequired: false,
      status: 'active',
    },
    // Drafts
    {
      employerId: employer2.id,
      title: 'Разнорабочий',
      category: 'loader',
      description: 'Черновик - разнорабочий на производство.',
      city: 'astana',
      district: 'saryarka',
      address: '',
      lat: null,
      lng: null,
      workDate: tomorrow,
      startTime: '08:00',
      endTime: '17:00',
      paymentAmount: 9000,
      paymentCurrency: 'KZT',
      paymentType: 'daily',
      paymentSchedule: 'same_day',
      workersNeeded: 4,
      workersConfirmed: 0,
      experienceRequired: false,
      documentsRequired: false,
      status: 'draft',
    },
    {
      employerId: employer1.id,
      title: 'Курьер на авто',
      category: 'courier',
      description: 'Черновик - курьер с личным автомобилем.',
      city: 'astana',
      district: 'almaty',
      address: '',
      lat: null,
      lng: null,
      workDate: dayAfter,
      startTime: '09:00',
      endTime: '18:00',
      paymentAmount: 15000,
      paymentCurrency: 'KZT',
      paymentType: 'daily',
      paymentSchedule: 'same_day',
      workersNeeded: 2,
      workersConfirmed: 0,
      experienceRequired: true,
      documentsRequired: true,
      status: 'draft',
    },
  ];

  const createdJobs: any[] = [];
  for (const jobData of jobsData) {
    const job = await db.job.create({ data: jobData });
    createdJobs.push(job);
  }

  // Demo Applications
  await db.application.create({
    data: {
      jobId: createdJobs[0].id,
      workerId: worker1.id,
      status: 'approved',
      appliedAt: new Date(Date.now() - 3600000),
      approvedAt: new Date(Date.now() - 1800000),
    },
  });

  await db.application.create({
    data: {
      jobId: createdJobs[0].id,
      workerId: worker2.id,
      status: 'applied',
      appliedAt: new Date(Date.now() - 7200000),
    },
  });

  await db.application.create({
    data: {
      jobId: createdJobs[1].id,
      workerId: worker2.id,
      status: 'approved',
      appliedAt: new Date(Date.now() - 86400000),
      approvedAt: new Date(Date.now() - 43200000),
    },
  });

  await db.application.create({
    data: {
      jobId: createdJobs[3].id,
      workerId: worker1.id,
      status: 'arrived',
      appliedAt: new Date(Date.now() - 172800000),
      approvedAt: new Date(Date.now() - 86400000),
      arrivedAt: new Date(),
    },
  });

  await db.application.create({
    data: {
      jobId: createdJobs[4].id,
      workerId: worker1.id,
      status: 'completed',
      appliedAt: new Date(Date.now() - 259200000),
      approvedAt: new Date(Date.now() - 172800000),
      arrivedAt: new Date(Date.now() - 86400000),
      completedAt: new Date(Date.now() - 43200000),
    },
  });

  await db.application.create({
    data: {
      jobId: createdJobs[6].id,
      workerId: worker2.id,
      status: 'paid',
      appliedAt: new Date(Date.now() - 604800000),
      approvedAt: new Date(Date.now() - 518400000),
      arrivedAt: new Date(Date.now() - 432000000),
      completedAt: new Date(Date.now() - 345600000),
      paidAt: new Date(Date.now() - 259200000),
    },
  });

  // Demo Notifications
  await db.notification.createMany({
    data: [
      { userId: worker1.id, type: 'application_approved', title: 'Вас одобрили!', body: 'Вы одобрены на вакансию "Курьер-доставщик"', isRead: false },
      { userId: worker1.id, type: 'shift_reminder', title: 'Смена завтра', body: 'Не забудьте: завтра смена "Официант на банкет" в 17:00', isRead: false },
      { userId: worker1.id, type: 'payment', title: 'Оплата отмечена', body: 'Работодатель отметил оплату за смену "Уборка помещений"', isRead: true },
      { userId: worker2.id, type: 'new_application', title: 'Новый отклик', body: 'Вы откликнулись на "Грузчик на склад"', isRead: false },
      { userId: employer1.id, type: 'new_application', title: 'Новый отклик', body: 'Дмитрий Ким откликнулся на "Курьер-доставщик"', isRead: false },
    ],
  });

  console.log('Seed data created successfully!');
  console.log(`  Users: 5 (3 workers, 2 employers)`);
  console.log(`  Jobs: ${createdJobs.length} (8 active, 2 drafts)`);
  console.log(`  Applications: 6`);
  console.log(`  Notifications: 5`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
