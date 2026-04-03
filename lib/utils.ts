import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isTempEmail = (email: string): boolean => {
  const tempDomains = [
    'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'temp-mail.org', 
    '10minutemail.com', 'trashmail.com', 'maildrop.cc', 'dispostable.com',
    'getairmail.com', 'yopmail.com'
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
