import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isTempEmail = (email: string): boolean => {
  const tempDomains = [
    // Common providers
    'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'temp-mail.org', 
    '10minutemail.com', 'trashmail.com', 'maildrop.cc', 'dispostable.com',
    'getairmail.com', 'yopmail.com', 'getnada.com', 'mohmal.com',
    'dropmail.me', 'clipmail.org', 'bounced.io', 'sharklasers.com',
    'guerrillamail.biz', 'spam4.me', 'grr.la', 'guerrillamail.info', 
    'guerrillamail.net', 'guerrillamail.org', 'pokemail.net',
    'harakirimail.com', '30minutemail.com', 'fakeinbox.com',
    'mailnesia.com', 'mailcatch.com', 'temp-mail.ru', 'tempmail.re',
    'temporary-mail.net', 'jetable.org', 'mintemail.com', 'spambox.us',
    'mytemp.email', 'notsharingmy.info', 'mailnull.com', 'disposable.com',
    'tempemail.co', 'owlymail.com', 'disposablemail.com', 'emlbox.com',
    'emlpro.com', 'emlhub.com'
  ];
  const domain = email.split('@')[1]?.toLowerCase();
  return tempDomains.includes(domain);
};

export const isValidFutureDate = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  const now = new Date();
  // Set time to midnight for comparison if needed, but here simple comparison is fine
  return date.getTime() >= (now.getTime() - 60000); // Allow 1 min grace
};

export const parsePrice = (price: string | number | null | undefined): number => {
  if (typeof price === 'number') return isNaN(price) ? 0 : price;
  if (!price) return 0;
  const cleaned = price.toString().replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

export const formatPrice = (price: string | number | null | undefined): string => {
  const num = parsePrice(price);
  return num.toLocaleString('en-IN');
};
