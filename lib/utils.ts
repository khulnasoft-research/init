import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { platformConfig } from '@/lib/platform/config';

export const protocol = platformConfig.protocol;
export const rootDomain = platformConfig.rootDomain;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
