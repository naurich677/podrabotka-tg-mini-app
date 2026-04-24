// Types for the Telegram WebApp SDK
// Reference: https://core.telegram.org/bots/webapps

export interface TelegramWebApp {
  ready: () => void;
  close: () => void;
  expand: () => void;
  MainButton: TelegramMainButton;
  BackButton: TelegramBackButton;
  initData: string;
  initDataUnsafe: TelegramInitData;
  colorScheme: 'light' | 'dark';
  themeParams: TelegramThemeParams;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  SettingsButton: TelegramSettingsButton;
  HapticFeedback: TelegramHapticFeedback;
  CloudStorage: TelegramCloudStorage;
  BiometricManager: Record<string, unknown>;
  requestContact: (callback: (success: boolean, contact?: TelegramContact) => void) => void;
  showPopup: (params: Record<string, unknown>, callback?: (id: string) => void) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (ok: boolean) => void) => void;
  openTelegramLink: (url: string) => void;
  openInvoice: (url: string, callback?: (status: string) => void) => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  onEvent: (eventType: string, handler: (...args: unknown[]) => void) => void;
  offEvent: (eventType: string, handler: (...args: unknown[]) => void) => void;
  sendData: (data: string) => void;
  version: string;
  platform: string;
}

export interface TelegramMainButton {
  text: string;
  color: string;
  textColor: string;
  isVisible: boolean;
  isActive: boolean;
  isProgressVisible: boolean;
  setText: (text: string) => TelegramMainButton;
  onClick: (handler: () => void) => TelegramMainButton;
  offClick: (handler: () => void) => TelegramMainButton;
  show: () => TelegramMainButton;
  hide: () => TelegramMainButton;
  enable: () => TelegramMainButton;
  disable: () => TelegramMainButton;
  showProgress: (leaveActive?: boolean) => TelegramMainButton;
  hideProgress: () => TelegramMainButton;
  setParams: (params: Record<string, unknown>) => TelegramMainButton;
}

export interface TelegramBackButton {
  isVisible: boolean;
  onClick: (handler: () => void) => TelegramBackButton;
  offClick: (handler: () => void) => TelegramBackButton;
  show: () => TelegramBackButton;
  hide: () => TelegramBackButton;
}

export interface TelegramSettingsButton {
  isVisible: boolean;
  onClick: (handler: () => void) => TelegramSettingsButton;
  offClick: (handler: () => void) => TelegramSettingsButton;
  show: () => TelegramSettingsButton;
  hide: () => TelegramSettingsButton;
}

export interface TelegramHapticFeedback {
  impactOccurred: (style: string) => void;
  notificationOccurred: (type: string) => void;
  selectionChanged: () => void;
}

export interface TelegramCloudStorage {
  setItem: (key: string, value: string, callback?: (error?: Error) => void) => void;
  getItem: (key: string, callback: (error?: Error, value?: string) => void) => void;
  getItems: (keys: string[], callback: (error?: Error, values?: Record<string, string>) => void) => void;
  removeItem: (key: string, callback?: (error?: Error) => void) => void;
  removeItems: (keys: string[], callback?: (error?: Error) => void) => void;
  getKeys: (callback: (error?: Error, keys?: string[]) => void) => void;
}

export interface TelegramInitData {
  query_id?: string;
  user?: TelegramUser;
  receiver?: TelegramUser;
  chat?: TelegramChat;
  start_param?: string;
  auth_date: number;
  hash: string;
}

export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface TelegramChat {
  id: number;
  type: string;
  title?: string;
  username?: string;
  photo_url?: string;
}

export interface TelegramContact {
  contact_id: number;
  phone_number: string;
  first_name: string;
  last_name?: string;
  user_id?: number;
}

export interface TelegramThemeParams {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
  header_bg_color?: string;
  accent_text_color?: string;
  section_bg_color?: string;
  section_header_text_color?: string;
  subtitle_text_color?: string;
  destructive_text_color?: string;
}
