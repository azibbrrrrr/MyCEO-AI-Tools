const EMAIL_PATTERN = /\b\S+@\S+\.\S+\b/g;
const PHONE_PATTERN = /\b\d{8,}\b/g;

const collapseWhitespace = (value: string) => value.replace(/\s+/g, ' ').trim();

const toTitleCase = (value: string) =>
  value
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const stripPii = (value: string) => value.replace(EMAIL_PATTERN, '').replace(PHONE_PATTERN, '');

export const sanitizeText = (value: string) => {
  const cleaned = collapseWhitespace(stripPii(value));
  if (!cleaned) return '';

  const hasLower = /[a-z]/.test(cleaned);
  const hasUpper = /[A-Z]/.test(cleaned);
  if (hasUpper && !hasLower) return toTitleCase(cleaned);

  return cleaned;
};

export const sanitizeWithFallback = (value: string, fallback: string) => {
  const cleaned = sanitizeText(value);
  return cleaned || fallback;
};
