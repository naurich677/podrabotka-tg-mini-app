import { Bot, InlineKeyboard, Keyboard } from 'grammy';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const MINI_APP_URL = process.env.MINI_APP_URL || 'https://t.me/yourbot/app';
const MAIN_APP_URL = process.env.MAIN_APP_URL || 'http://localhost:3000';
const PORT = 3030;

// ============================================================
// Bot instance (may not start if no token)
// ============================================================

let bot: Bot | null = null;

if (BOT_TOKEN) {
  bot = new Bot(BOT_TOKEN);

  // ── /start command ──────────────────────────────────────────
  bot.command('start', async (ctx) => {
    const keyboard = new InlineKeyboard()
      .webApp('🔍 Открыть подработки', `${MINI_APP_URL}`)
      .row()
      .webApp('💼 Ищу работников', `${MINI_APP_URL}?role=employer`)
      .row()
      .text('📱 Подтвердить номер', 'verify_phone')
      .row()
      .text('❓ Помощь', 'help');

    await ctx.reply(
      `👋 Добро пожаловать в Подработки!\n\n` +
        `Найдите подработку с ежедневной оплатой или предложите работу исполнителям.\n\n` +
        `Выберите действие:`,
      { reply_markup: keyboard }
    );
  });

  // ── /app command ────────────────────────────────────────────
  bot.command('app', async (ctx) => {
    const keyboard = new InlineKeyboard().webApp(
      '📱 Открыть приложение',
      MINI_APP_URL
    );

    await ctx.reply('Откройте приложение:', { reply_markup: keyboard });
  });

  // ── /profile command ────────────────────────────────────────
  bot.command('profile', async (ctx) => {
    const tgUser = ctx.from;
    if (!tgUser) {
      await ctx.reply('Не удалось определить пользователя.');
      return;
    }

    try {
      // Build a minimal initData-like payload so the main app can identify the user
      // In dev mode (no token), auth validation is skipped.
      // In production, this will only work if the main app supports bot-level auth.
      const fakeInitData = new URLSearchParams({
        user: JSON.stringify({
          id: tgUser.id,
          first_name: tgUser.first_name,
          last_name: tgUser.last_name || '',
          username: tgUser.username || '',
        }),
        auth_date: Math.floor(Date.now() / 1000).toString(),
        hash: 'bot_request',
      }).toString();

      const res = await fetch(
        `${MAIN_APP_URL}/api/profile?XTransformPort=3000`,
        {
          headers: {
            Authorization: `tma ${fakeInitData}`,
          },
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      if (data.success && data.data) {
        const u = data.data;
        const roleLabel =
          u.role === 'worker'
            ? '👷 Работник'
            : u.role === 'employer'
              ? '💼 Работодатель'
              : '❓ Не выбрана';

        const phoneStatus = u.phoneVerified
          ? `✅ ${u.phone || 'Подтверждён'}`
          : '❌ Не подтверждён';

        let profileText =
          `👤 **Профиль**\n\n` +
          `📌 Имя: ${u.firstName || tgUser.first_name}${u.lastName ? ` ${u.lastName}` : ''}\n` +
          `🔗 Username: ${u.telegramUsername ? `@${u.telegramUsername}` : '—'}\n` +
          `🎭 Роль: ${roleLabel}\n` +
          `📱 Телефон: ${phoneStatus}\n` +
          `🏙️ Город: ${u.city || '—'}`;

        // Worker-specific info
        if (u.workerProfile) {
          const wp = u.workerProfile;
          profileText +=
            `\n\n👷 **Профиль работника:**\n` +
            `   Возраст: ${wp.age || '—'}\n` +
            `   О себе: ${wp.about || '—'}`;
          if (wp.categories) {
            try {
              const cats = JSON.parse(wp.categories);
              if (Array.isArray(cats) && cats.length > 0) {
                profileText += `\n   Категории: ${cats.join(', ')}`;
              }
            } catch {
              // ignore
            }
          }
        }

        // Employer-specific info
        if (u.employerProfile) {
          const ep = u.employerProfile;
          profileText +=
            `\n\n💼 **Профиль работодателя:**\n` +
            `   Компания: ${ep.companyName || '—'}\n` +
            `   Тип: ${ep.businessType || '—'}`;
        }

        const keyboard = new InlineKeyboard()
          .webApp('✏️ Редактировать', `${MINI_APP_URL}?screen=profileEdit`)
          .row()
          .text('🔄 Обновить', 'refresh_profile');

        await ctx.reply(profileText, {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        });
      } else {
        await ctx.reply(
          'Профиль не найден. Откройте приложение, чтобы создать профиль.',
          {
            reply_markup: new InlineKeyboard().webApp(
              '📱 Открыть приложение',
              MINI_APP_URL
            ),
          }
        );
      }
    } catch (e) {
      console.error('Profile fetch error:', e);
      await ctx.reply(
        'Не удалось загрузить профиль. Попробуйте позже или откройте приложение.',
        {
          reply_markup: new InlineKeyboard().webApp(
            '📱 Открыть приложение',
            MINI_APP_URL
          ),
        }
      );
    }
  });

  // ── /help command ───────────────────────────────────────────
  bot.command('help', async (ctx) => {
    await ctx.reply(
      `📋 *Помощь*\n\n` +
        `/start — Главное меню\n` +
        `/app — Открыть приложение\n` +
        `/profile — Ваш профиль\n` +
        `/help — Эта справка\n\n` +
        `💡 Для отклика на вакансии необходимо подтвердить номер телефона.`,
      { parse_mode: 'Markdown' }
    );
  });

  // ── Callback query: verify_phone ────────────────────────────
  bot.callbackQuery('verify_phone', async (ctx) => {
    const keyboard = new Keyboard()
      .requestContact('📱 Поделиться номером')
      .oneTime()
      .resized();

    await ctx.reply('Подтвердите номер телефона, нажав кнопку ниже:', {
      reply_markup: keyboard,
    });
    await ctx.answerCallbackQuery();
  });

  // ── Callback query: help ────────────────────────────────────
  bot.callbackQuery('help', async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply(
      `📋 *Помощь*\n\n` +
        `/start — Главное меню\n` +
        `/app — Открыть приложение\n` +
        `/profile — Ваш профиль\n` +
        `/help — Эта справка`,
      { parse_mode: 'Markdown' }
    );
  });

  // ── Callback query: refresh_profile ─────────────────────────
  bot.callbackQuery('refresh_profile', async (ctx) => {
    await ctx.answerCallbackQuery('Обновляю...');
    // Re-trigger profile by simulating /profile
    const fakeCtx = {
      from: ctx.from,
      reply: ctx.reply.bind(ctx),
    };
    // Just call profile logic directly
    const tgUser = ctx.from;
    if (!tgUser) return;

    try {
      const fakeInitData = new URLSearchParams({
        user: JSON.stringify({
          id: tgUser.id,
          first_name: tgUser.first_name || '',
          username: ctx.from?.username || '',
        }),
        auth_date: Math.floor(Date.now() / 1000).toString(),
        hash: 'bot_request',
      }).toString();

      const res = await fetch(
        `${MAIN_APP_URL}/api/profile?XTransformPort=3000`,
        {
          headers: {
            Authorization: `tma ${fakeInitData}`,
          },
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (data.success && data.data) {
        const u = data.data;
        const phoneStatus = u.phoneVerified
          ? `✅ ${u.phone || 'Подтверждён'}`
          : '❌ Не подтверждён';
        await ctx.reply(
          `👤 Профиль обновлён\n\n📱 Телефон: ${phoneStatus}\n🎭 Роль: ${u.role || '—'}`,
          { parse_mode: 'Markdown' }
        );
      } else {
        await ctx.reply('Профиль не найден.');
      }
    } catch {
      await ctx.reply('Не удалось обновить профиль.');
    }
  });

  // ── Contact sharing handler ─────────────────────────────────
  bot.on('message:contact', async (ctx) => {
    const contact = ctx.message.contact;
    const phone = contact.phone_number;
    const userId = ctx.from?.id;

    if (!userId) {
      await ctx.reply('❌ Не удалось определить пользователя.');
      return;
    }

    try {
      const res = await fetch(
        `${MAIN_APP_URL}/api/user/phone/bot-contact?XTransformPort=3000`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telegramId: userId, phoneNumber: phone }),
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        console.error('Phone verification failed:', errData);
        throw new Error(errData?.error || `HTTP ${res.status}`);
      }

      await ctx.reply(`✅ Номер ${phone} успешно подтверждён!`, {
        reply_markup: { remove_keyboard: true },
      });
    } catch (e) {
      console.error('Phone verification error:', e);
      await ctx.reply(
        '❌ Ошибка подтверждения номера. Попробуйте позже или подтвердите номер в приложении.',
        {
          reply_markup: new InlineKeyboard().webApp(
            '📱 Открыть приложение',
            MINI_APP_URL
          ),
        }
      );
    }
  });

  // ── Start the bot ───────────────────────────────────────────
  bot.start({
    onStart: (info) => {
      console.log(`✅ Bot @${info.username} started`);
    },
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    bot?.stop();
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    bot?.stop();
    process.exit(0);
  });
} else {
  console.warn(
    '⚠️  TELEGRAM_BOT_TOKEN is not set. Bot polling is disabled.'
  );
  console.warn(
    '   The HTTP notification server will still run on port ' + PORT + '.'
  );
}

// ============================================================
// HTTP server for notifications & health checks
// ============================================================

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    // ── POST /notify — send a message via the bot ─────────────
    if (req.method === 'POST' && path === '/notify') {
      try {
        const body = await req.json();
        const { chatId, message, type } = body;

        if (!chatId || !message) {
          return Response.json(
            { success: false, error: 'chatId and message are required' },
            { status: 400 }
          );
        }

        if (!bot) {
          return Response.json(
            {
              success: false,
              error: 'Bot is not running (no TELEGRAM_BOT_TOKEN)',
            },
            { status: 503 }
          );
        }

        // Add emoji prefix based on notification type
        let formattedMessage = message;
        if (type === 'application') {
          formattedMessage = `📩 ${message}`;
        } else if (type === 'approval') {
          formattedMessage = `✅ ${message}`;
        } else if (type === 'rejection') {
          formattedMessage = `❌ ${message}`;
        } else if (type === 'payment') {
          formattedMessage = `💰 ${message}`;
        } else if (type === 'reminder') {
          formattedMessage = `⏰ ${message}`;
        }

        await bot.api.sendMessage(chatId, formattedMessage);

        return Response.json({ success: true });
      } catch (e: any) {
        console.error('Notify error:', e);
        return Response.json(
          { success: false, error: e.message || 'Unknown error' },
          { status: 500 }
        );
      }
    }

    // ── POST /notify/batch — send to multiple users ───────────
    if (req.method === 'POST' && path === '/notify/batch') {
      try {
        const body = await req.json();
        const { chatIds, message, type } = body;

        if (!Array.isArray(chatIds) || !message) {
          return Response.json(
            {
              success: false,
              error: 'chatIds (array) and message are required',
            },
            { status: 400 }
          );
        }

        if (!bot) {
          return Response.json(
            {
              success: false,
              error: 'Bot is not running (no TELEGRAM_BOT_TOKEN)',
            },
            { status: 503 }
          );
        }

        let formattedMessage = message;
        if (type === 'application') formattedMessage = `📩 ${message}`;
        else if (type === 'approval') formattedMessage = `✅ ${message}`;
        else if (type === 'rejection') formattedMessage = `❌ ${message}`;
        else if (type === 'payment') formattedMessage = `💰 ${message}`;
        else if (type === 'reminder') formattedMessage = `⏰ ${message}`;

        const results = await Promise.allSettled(
          chatIds.map((chatId: number) =>
            bot.api.sendMessage(chatId, formattedMessage)
          )
        );

        const succeeded = results.filter((r) => r.status === 'fulfilled').length;
        const failed = results.filter((r) => r.status === 'rejected').length;

        return Response.json({
          success: true,
          data: { total: chatIds.length, succeeded, failed },
        });
      } catch (e: any) {
        console.error('Batch notify error:', e);
        return Response.json(
          { success: false, error: e.message || 'Unknown error' },
          { status: 500 }
        );
      }
    }

    // ── GET /health ───────────────────────────────────────────
    if (req.method === 'GET' && path === '/health') {
      return Response.json({
        status: 'ok',
        bot: bot ? 'running' : 'disabled',
        port: PORT,
      });
    }

    // ── 404 ───────────────────────────────────────────────────
    return Response.json({ error: 'Not found' }, { status: 404 });
  },
});

console.log(`🚀 Telegram bot service running on port ${PORT}`);
console.log(`   Health:  http://localhost:${PORT}/health`);
console.log(`   Notify:  POST http://localhost:${PORT}/notify`);
