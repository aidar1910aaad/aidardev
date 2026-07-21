import { buildWhatsAppUrl, PRIMARY_WHATSAPP_NUMBER } from '../whatsapp';

describe('buildWhatsAppUrl', () => {
  it('builds an encoded URL for the primary number', () => {
    expect(buildWhatsAppUrl('Здравствуйте! Хочу обсудить сайт и SEO.')).toBe(
      `https://wa.me/${PRIMARY_WHATSAPP_NUMBER}?text=${encodeURIComponent('Здравствуйте! Хочу обсудить сайт и SEO.')}`,
    );
  });

  it('normalizes a formatted phone number', () => {
    expect(buildWhatsAppUrl('Hello', '+7 (706) 670-36-96')).toBe(
      'https://wa.me/77066703696?text=Hello',
    );
  });

  it('omits the text parameter for an empty message', () => {
    expect(buildWhatsAppUrl('   ')).toBe(
      `https://wa.me/${PRIMARY_WHATSAPP_NUMBER}`,
    );
  });
});
