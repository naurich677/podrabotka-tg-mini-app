export type Language = 'ru' | 'kz';

const translations = {
  ru: {
    splash: { title: 'Подработки', subtitle: 'Найдите работу на каждый день' },
    selectLanguage: { title: 'Выберите язык', ru: 'Русский', kz: 'Қазақша' },
    selectRole: { title: 'Чем можете помочь?', worker: 'Ищу подработку', employer: 'Ищу работников' },
    phoneVerification: { title: 'Подтвердите номер телефона', shareViaTelegram: 'Поделиться номером через Telegram', confirmViaBot: 'Подтвердить через бота', description: 'Для отклика на вакансии необходимо подтвердить номер телефона', skip: 'Пропустить', manualInput: 'Или введите номер вручную', phonePlaceholder: '+7 (___) ___-__-__' },

    nav: { feed: 'Лента', applications: 'Отклики', favorites: 'Избранное', profile: 'Профиль', shifts: 'Смены', create: 'Создать' },

    feed: { title: 'Подработки', search: 'Поиск подработок...', today: 'Сегодня', tomorrow: 'Завтра', dailyPay: 'Ежедневная оплата', nearby: 'Рядом', urgent: 'Срочно', noJobs: 'Подработки не найдены', filters: 'Фильтры', fresh: 'Новые', hot: 'Горячие' },
    filters: { title: 'Фильтры', category: 'Категория', district: 'Район', date: 'Дата', shiftTime: 'Время смены', paymentType: 'Тип оплаты', salaryRange: 'Диапазон суммы', apply: 'Применить', reset: 'Сбросить', daily: 'Ежедневная', weekly: 'Еженедельная', from: 'от', to: 'до' },
    jobCard: { apply: 'Откликнуться', applied: 'Вы откликнулись', perDay: 'в день', perShift: 'за смену', spotsLeft: 'мест осталось', experience: 'Опыт требуется', noExperience: 'Без опыта', documents: 'Документы нужны', noDocuments: 'Без документов', requirements: 'Требования', description: 'Описание', payment: 'Оплата', when: 'Когда выплата', schedule: 'График', company: 'Компания', address: 'Адрес', save: 'Сохранить', saved: 'Сохранено', share: 'Поделиться' },
    myApplications: { title: 'Мои отклики', applied: 'Отклик', approved: 'Одобрено', rejected: 'Отклонено', arrived: 'Пришел', completed: 'Завершено', paid: 'Оплачено', noShow: 'Не пришел', noApplications: 'У вас пока нет откликов' },
    favorites: { title: 'Избранное', noFavorites: 'Вы еще ничего не сохранили' },
    history: { title: 'История смен', noHistory: 'У вас пока нет завершенных смен', totalEarned: 'Всего заработано', completedShifts: 'Завершенных смен' },

    dashboard: { title: 'Управление', activeShifts: 'Активные смены', totalApplications: 'Всего откликов', confirmedWorkers: 'Подтверждено работников', upcomingShifts: 'Ближайшие смены', createNew: 'Создать смену' },
    createShift: { title: 'Создать смену', jobTitle: 'Название вакансии', category: 'Категория', description: 'Описание', city: 'Город', district: 'Район', address: 'Адрес', date: 'Дата', startTime: 'Время начала', endTime: 'Время окончания', payment: 'Ставка', currency: 'Валюта', paymentType: 'Тип оплаты', paymentSchedule: 'Когда выплата', workersNeeded: 'Количество мест', experienceRequired: 'Требуется опыт', documentsRequired: 'Нужны документы', publish: 'Опубликовать', saveDraft: 'Сохранить черновик', validation: { titleRequired: 'Укажите название', dateRequired: 'Укажите дату', paymentRequired: 'Укажите ставку', workersRequired: 'Укажите количество мест' } },
    shiftList: { title: 'Мои смены', drafts: 'Черновики', active: 'Активные', completed: 'Завершенные', cancelled: 'Отмененные', noShifts: 'Нет смен' },
    applications: { title: 'Отклики', approve: 'Подтвердить', reject: 'Отклонить', approved: 'Подтвержден', rejected: 'Отклонен', completedShifts: 'Завершенных смен', rating: 'Рейтинг', noApplications: 'Пока нет откликов', spotsFilled: 'мест занято' },
    attendance: { title: 'Учет выхода', arrived: 'Пришел', notArrived: 'Не пришел', markArrived: 'Отметить приход', markNotArrived: 'Отметить неявку', of: 'из' },
    paymentTracking: { title: 'Учет оплаты', markPaid: 'Отметить оплачено', paid: 'Оплачено', notPaid: 'Не оплачено', totalPaid: 'Всего выплачено' },

    profile: { title: 'Профиль', edit: 'Редактировать', name: 'Имя', phone: 'Телефон', age: 'Возраст', skills: 'Навыки', categories: 'Категории', rating: 'Рейтинг', documents: 'Документы', companyName: 'Название компании', businessType: 'Тип бизнеса', binIin: 'БИН/ИИН', about: 'О себе', switchRole: 'Переключить роль', language: 'Язык', city: 'Город', logout: 'Выйти', save: 'Сохранить', verifyPhone: 'Подтвердить телефон', phoneVerified: 'Телефон подтвержден', phoneNotVerified: 'Телефон не подтвержден', verified: 'Верифицирован', notVerified: 'Не верифицирован', worker: 'Работник', employer: 'Работодатель', completedJobs: 'Завершенных работ', memberSince: 'Участник с' },

    common: { loading: 'Загрузка...', error: 'Произошла ошибка', retry: 'Повторить', cancel: 'Отмена', confirm: 'Подтвердить', back: 'Назад', save: 'Сохранить', delete: 'Удалить', edit: 'Редактировать', close: 'Закрыть', noResults: 'Нет результатов', seeAll: 'Смотреть все', kzt: '₸', perDay: '/день', perWeek: '/неделя', yes: 'Да', no: 'Нет' },

    categories: { courier: 'Курьер', loader: 'Грузчик', promouter: 'Промоутер', waiter: 'Официант', cleaning: 'Уборка', other: 'Другое' },

    districts: { esil: 'Есильский', almaty: 'Алматинский', saryarka: 'Сарыаркинский', baykonur: 'Байконурский' },

    notifications: { title: 'Уведомления', loginSuccess: 'Вы успешно вошли', confirmPhone: 'Подтвердите номер телефона', applied: 'Вы откликнулись на смену', approved: 'Вас одобрили', shiftTomorrow: 'Смена завтра', workerConfirmed: 'Работник подтвержден', workerNoShow: 'Работник не вышел', paymentMarked: 'Оплата отмечена', leaveReview: 'Оставьте отзыв', noNotifications: 'Нет уведомлений' },

    paymentSchedules: { same_day: 'В день смены', next_day: 'На следующий день', end_of_week: 'В конце недели' }
  },
  kz: {
    splash: { title: 'Жұмыс', subtitle: 'Күнделікті жұмыс табыңыз' },
    selectLanguage: { title: 'Тілді таңдаңыз', ru: 'Русский', kz: 'Қазақша' },
    selectRole: { title: 'Көмектесе аласыз ба?', worker: 'Жұмыс іздеймін', employer: 'Қызметкер іздеймін' },
    phoneVerification: { title: 'Телефон нөміріңізді растаңыз', shareViaTelegram: 'Telegram арқылы нөмірді бөлісу', confirmViaBot: 'Бот арқылы растау', description: 'Вакансияға отклик беру үшін телефон нөмірін растау қажет', skip: 'Өткізіп жіберу', manualInput: 'Немесе нөмірді қолмен енгізіңіз', phonePlaceholder: '+7 (___) ___-__-__' },

    nav: { feed: 'Тізім', applications: 'Откликтер', favorites: 'Таңдаулылар', profile: 'Профиль', shifts: 'Ауысымдар', create: 'Құру' },

    feed: { title: 'Жұмыстар', search: 'Жұмыс іздеу...', today: 'Бүгін', tomorrow: 'Ертең', dailyPay: 'Күнделікті төлем', nearby: 'Жақын', urgent: 'Шұғыл', noJobs: 'Жұмыс табылмады', filters: 'Сүзгілер', fresh: 'Жаңа', hot: 'Ыстық' },
    filters: { title: 'Сүзгілер', category: 'Санат', district: 'Аудан', date: 'Күні', shiftTime: 'Ауысым уақыты', paymentType: 'Төлем түрі', salaryRange: 'Сома диапазоны', apply: 'Қолдану', reset: 'Жою', daily: 'Күнделікті', weekly: 'Апталық', from: 'бастап', to: 'дейін' },
    jobCard: { apply: 'Отклик беру', applied: 'Сіз отклик бердіңіз', perDay: 'күніне', perShift: 'ауысымға', spotsLeft: 'орын қалды', experience: 'Тәжірибе қажет', noExperience: 'Тәжірибесіз', documents: 'Құжаттар қажет', noDocuments: 'Құжаттарсыз', requirements: 'Талаптар', description: 'Сипаттама', payment: 'Төлем', when: 'Қашан төлем', schedule: 'Кесте', company: 'Компания', address: 'Мекенжай', save: 'Сақтау', saved: 'Сақталды', share: 'Бөлісу' },
    myApplications: { title: 'Менің откликтерім', applied: 'Отклик', approved: 'Бекітілді', rejected: 'Қабылданбады', arrived: 'Келді', completed: 'Аяқталды', paid: 'Төленді', noShow: 'Келмеді', noApplications: 'Сізде әлі откликтер жоқ' },
    favorites: { title: 'Таңдаулылар', noFavorites: 'Сіз әлі ештеңе сақтамағансыз' },
    history: { title: 'Ауысым тарихы', noHistory: 'Сізде әлі аяқталған ауысымдар жоқ', totalEarned: 'Барлығы табылған', completedShifts: 'Аяқталған ауысымдар' },

    dashboard: { title: 'Басқару панелі', activeShifts: 'Белсенді ауысымдар', totalApplications: 'Барлық откликтер', confirmedWorkers: 'Бекітілген қызметкерлер', upcomingShifts: 'Жақын ауысымдар', createNew: 'Ауысым құру' },
    createShift: { title: 'Ауысым құру', jobTitle: 'Вакансия атауы', category: 'Санат', description: 'Сипаттама', city: 'Қала', district: 'Аудан', address: 'Мекенжай', date: 'Күні', startTime: 'Басталу уақыты', endTime: 'Аяқталу уақыты', payment: 'Ставка', currency: 'Валюта', paymentType: 'Төлем түрі', paymentSchedule: 'Қашан төлем', workersNeeded: 'Орын саны', experienceRequired: 'Тәжірибе қажет', documentsRequired: 'Құжаттар қажет', publish: 'Жариялау', saveDraft: 'Черновикті сақтау', validation: { titleRequired: 'Атауын көрсетіңіз', dateRequired: 'Күнін көрсетіңіз', paymentRequired: 'Ставканы көрсетіңіз', workersRequired: 'Орын санын көрсетіңіз' } },
    shiftList: { title: 'Менің ауысымдарым', drafts: 'Черновиктер', active: 'Белсенді', completed: 'Аяқталған', cancelled: 'Жойылған', noShifts: 'Ауысымдар жоқ' },
    applications: { title: 'Откликтер', approve: 'Бекіту', reject: 'Қабылдамау', approved: 'Бекітілді', rejected: 'Қабылданбады', completedShifts: 'Аяқталған ауысымдар', rating: 'Рейтинг', noApplications: 'Әлі откликтер жоқ', spotsFilled: 'орын алынған' },
    attendance: { title: 'Келу есебі', arrived: 'Келді', notArrived: 'Келмеді', markArrived: 'Келді деп белгілеу', markNotArrived: 'Келмеді деп белгілеу', of: 'из' },
    paymentTracking: { title: 'Төлем есебі', markPaid: 'Төленді деп белгілеу', paid: 'Төленді', notPaid: 'Төленбеді', totalPaid: 'Барлығы төленген' },

    profile: { title: 'Профиль', edit: 'Өңдеу', name: 'Аты', phone: 'Телефон', age: 'Жасы', skills: 'Дағдылар', categories: 'Санаттар', rating: 'Рейтинг', documents: 'Құжаттар', companyName: 'Компания атауы', businessType: 'Бизнес түрі', binIin: 'БИН/ИИН', about: 'Өзім туралы', switchRole: 'Рөлді ауыстыру', language: 'Тіл', city: 'Қала', logout: 'Шығу', save: 'Сақтау', verifyPhone: 'Телефонды растау', phoneVerified: 'Телефон расталды', phoneNotVerified: 'Телефон расталмаған', verified: 'Верификацияланған', notVerified: 'Верификацияланбаған', worker: 'Жұмысшы', employer: 'Жұмыс беруші', completedJobs: 'Аяқталған жұмыстар', memberSince: 'Мүше басталған' },

    common: { loading: 'Жүктелуде...', error: 'Қате орын алды', retry: 'Қайта әрекет', cancel: 'Болдырмау', confirm: 'Растау', back: 'Артқа', save: 'Сақтау', delete: 'Жою', edit: 'Өңдеу', close: 'Жабу', noResults: 'Нәтиже жоқ', seeAll: 'Барлығын көру', kzt: '₸', perDay: '/күн', perWeek: '/апта', yes: 'Иә', no: 'Жоқ' },

    categories: { courier: 'Курьер', loader: 'Жүк тасушы', promouter: 'Промоутер', waiter: 'Даяшы', cleaning: 'Тазалық', other: 'Басқа' },

    districts: { esil: 'Есіль', almaty: 'Алматы', saryarka: 'Сарыарқа', baykonur: 'Байқоңыр' },

    notifications: { title: 'Хабарландырулар', loginSuccess: 'Сіз сәтті кірдіңіз', confirmPhone: 'Телефон нөміріңізді растаңыз', applied: 'Сіз ауысымға отклик бердіңіз', approved: 'Сізді бекітті', shiftTomorrow: 'Ертең ауысым', workerConfirmed: 'Қызметкер бекітілді', workerNoShow: 'Қызметкер келмеді', paymentMarked: 'Төлем белгіленді', leaveReview: 'Пікір қалдырыңыз', noNotifications: 'Хабарландырулар жоқ' },

    paymentSchedules: { same_day: 'Ауысым күні', next_day: 'Келесі күні', end_of_week: 'Апта соңында' }
  }
};

export type TranslationKey = typeof translations.ru;

function getNestedValue(obj: Record<string, unknown>, keys: string[]): unknown {
  let current = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  return current;
}

export function t(lang: Language, path: string): string {
  const keys = path.split('.');
  const value = getNestedValue(translations[lang], keys);
  if (typeof value === 'string') {
    return value;
  }
  // Fallback to Russian
  const fallback = getNestedValue(translations.ru, keys);
  if (typeof fallback === 'string') {
    return fallback;
  }
  return path;
}

export function getAllTranslations(lang: Language) {
  return translations[lang];
}

export const CATEGORY_KEYS = ['courier', 'loader', 'promouter', 'waiter', 'cleaning', 'other'] as const;
export const DISTRICT_KEYS = ['esil', 'almaty', 'saryarka', 'baykonur'] as const;
