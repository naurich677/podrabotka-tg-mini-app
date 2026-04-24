import { db } from '@/lib/db';
import { validateInitData } from './telegram';

export async function getSessionUser(request: Request) {
  // Try Authorization header first
  const authHeader = request.headers.get('Authorization');
  let initData = '';

  if (authHeader?.startsWith('tma ')) {
    initData = authHeader.slice(4);
  }

  // Try body
  if (!initData) {
    try {
      const clonedRequest = request.clone();
      const body = await clonedRequest.json();
      initData = body.initData || '';
    } catch {
      // ignore parse errors
    }
  }

  if (!initData) return null;

  const { valid, user: tgUser } = validateInitData(initData);
  if (!valid || !tgUser) return null;

  // Find or create user
  let user = await db.user.findUnique({ where: { telegramId: tgUser.id } });

  if (!user) {
    user = await db.user.create({
      data: {
        telegramId: tgUser.id,
        telegramUsername: tgUser.username || null,
        firstName: tgUser.first_name || null,
        lastName: tgUser.last_name || null,
        photoUrl: tgUser.photo_url || null,
      },
    });
  } else {
    // Update user info
    user = await db.user.update({
      where: { id: user.id },
      data: {
        telegramUsername: tgUser.username || user.telegramUsername,
        firstName: tgUser.first_name || user.firstName,
        lastName: tgUser.last_name || user.lastName,
        photoUrl: tgUser.photo_url || user.photoUrl,
      },
    });
  }

  return user;
}
