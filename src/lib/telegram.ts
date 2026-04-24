import crypto from 'crypto';

interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

export function validateInitData(initData: string): { valid: boolean; user?: TelegramUser } {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  // Dev mode: allow without token
  if (!botToken) {
    console.warn('TELEGRAM_BOT_TOKEN not set, skipping validation (dev mode)');
    try {
      const params = new URLSearchParams(initData);
      const userJson = params.get('user');
      if (userJson) {
        return { valid: true, user: JSON.parse(userJson) };
      }
    } catch {
      // ignore parse errors
    }
    return { valid: false };
  }

  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    if (!hash) return { valid: false };

    // Remove hash from params
    params.delete('hash');

    // Sort params alphabetically by key
    const dataCheckItems: string[] = [];
    params.forEach((value, key) => {
      dataCheckItems.push(`${key}=${value}`);
    });
    dataCheckItems.sort();
    const dataCheckString = dataCheckItems.join('\n');

    // Compute secret key
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();

    // Compute hash
    const computedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (computedHash === hash) {
      const userJson = params.get('user');
      const user = userJson ? JSON.parse(userJson) : undefined;
      return { valid: true, user };
    }

    return { valid: false };
  } catch (e) {
    console.error('initData validation error:', e);
    return { valid: false };
  }
}
