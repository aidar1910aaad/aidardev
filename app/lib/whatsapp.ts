export const PRIMARY_WHATSAPP_NUMBER = '77066703696';

export function buildWhatsAppUrl(
  message: string,
  phone: string = PRIMARY_WHATSAPP_NUMBER,
): string {
  const normalizedPhone = phone.replace(/\D/g, '');
  const normalizedMessage = message.trim();
  const baseUrl = `https://wa.me/${normalizedPhone}`;

  return normalizedMessage
    ? `${baseUrl}?text=${encodeURIComponent(normalizedMessage)}`
    : baseUrl;
}
