import { BUSINESS_TYPES } from '@/constants';

export const BUSINESS_TYPE_OPTIONS = BUSINESS_TYPES;
export type BusinessTypeKey = (typeof BUSINESS_TYPES)[number]['key'];
