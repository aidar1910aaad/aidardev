import { formatPhone, isValidPhone, normalizePhone, sanitizePhoneInput } from '../whatsapp';

describe('normalizePhone (lead form + /api/leads)', () => {
  it.each([
    ['+7 707 123 45 67', '+77071234567'],
    ['+7 (707) 123-45-67', '+77071234567'],
    ['8 707 123 45 67', '+77071234567'],
    ['8 (707) 123-45-67', '+77071234567'],
    ['87071234567', '+77071234567'],
    ['77071234567', '+77071234567'],
    ['707 123 45 67', '+77071234567'],
    ['  +77071234567  ', '+77071234567'],
    ['8 (727) 250-00-00', '+77272500000'],
    ['+7 916 123-45-67', '+79161234567'],
    ['+998 90 123 45 67', '+998901234567'],
    ['00998 90 123 45 67', '+998901234567'],
    ['998901234567', '+998901234567'],
    ['+81 3 1234 5678', '+81312345678'],
  ])('accepts %s', (input, expected) => {
    expect(normalizePhone(input)).toBe(expected);
    expect(isValidPhone(input)).toBe(true);
  });

  it.each([
    [''],
    ['   '],
    ['phone'],
    ['12345'],
    ['+7 707 123 45'],
    ['+7 707 123 45 67 8'],
    ['8 707 123 45 678'],
    ['8707123456'],
    ['+7 000 000 00 00'],
    ['8 (123) 456-78-90'],
    ['+0 123 456 789'],
    ['+1234567890123456'],
  ])('rejects %p', (input) => {
    expect(normalizePhone(input)).toBeNull();
    expect(isValidPhone(input)).toBe(false);
  });
});

describe('formatPhone', () => {
  it('formats +7 numbers the way the site shows its own number', () => {
    expect(formatPhone('87071234567')).toBe('+7 707 123 45 67');
    expect(formatPhone('+7 (707) 123-45-67')).toBe('+7 707 123 45 67');
  });

  it('keeps other countries in E.164', () => {
    expect(formatPhone('00998 90 123 45 67')).toBe('+998901234567');
  });

  it('leaves incomplete input as typed', () => {
    expect(formatPhone(' 8 707 12 ')).toBe('8 707 12');
  });
});

describe('sanitizePhoneInput', () => {
  it('keeps digits, plus, spaces, brackets and dashes', () => {
    expect(sanitizePhoneInput('+7 (707) 123-45-67')).toBe('+7 (707) 123-45-67');
  });

  it('drops letters and collapses repeated spaces', () => {
    expect(sanitizePhoneInput('8 (707) abc 123')).toBe('8 (707) 123');
  });

  it('caps the length', () => {
    expect(sanitizePhoneInput('1'.repeat(40))).toHaveLength(24);
  });
});
