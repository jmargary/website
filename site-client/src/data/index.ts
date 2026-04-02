import type { SectionTranslations } from './types';

// Import all specific category data modules
import { defaultData } from './categories/defaultData';
import { businessData } from './categories/businessData';
import { plansData } from './categories/plansData';
import { servicesData } from './categories/servicesData';
import { privilegesData } from './categories/privilegesData';
import { contactData } from './categories/contactData';

// Map them into the main data structure used by the app layout
export const INFO_CONTENT: Record<string, SectionTranslations> = {
  default: defaultData,
  business: businessData,
  plans: plansData,
  services: servicesData,
  privileges: privilegesData,
  contact: contactData
};

export const SIDEBAR_BUTTONS = ['plans', 'services', 'privileges', 'contact'];

export * from './types';
