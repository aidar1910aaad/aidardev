import { fireEvent, render, screen } from '@testing-library/react';
import ConversionContact from '../ConversionContact';
import { LanguageProvider } from '../../../contexts/LanguageContext';
import { translations } from '../../../contexts/translations';

const ru = translations.ru;

const renderForm = () =>
  render(
    <LanguageProvider initialLanguage="ru">
      <ConversionContact />
    </LanguageProvider>,
  );

const submitButton = () => screen.getByRole('button', { name: ru['leadForm.submit'] });

function fillContacts(name: string, phone: string) {
  fireEvent.change(screen.getByLabelText(ru['leadForm.name.label']), { target: { value: name } });
  fireEvent.change(screen.getByLabelText(ru['leadForm.phone.label']), { target: { value: phone } });
}

describe('ConversionContact lead form', () => {
  const mockFetch = jest.fn();
  const gtag = jest.fn();
  const open = jest.fn();

  beforeEach(() => {
    mockFetch.mockReset();
    gtag.mockReset();
    open.mockReset();
    global.fetch = mockFetch as unknown as typeof fetch;
    window.gtag = gtag;
    window.open = open as unknown as typeof window.open;
    window.sessionStorage.clear();
  });

  afterEach(() => {
    delete window.gtag;
  });

  it('asks for a name and a valid phone before sending anything', () => {
    renderForm();

    fireEvent.click(submitButton());
    expect(screen.getByText(ru['leadForm.error.name'])).toBeTruthy();
    expect(screen.getByText(ru['leadForm.error.phoneRequired'])).toBeTruthy();

    fillContacts('Айгерим', '12345');
    fireEvent.click(submitButton());
    expect(screen.getByText(ru['leadForm.error.phone'])).toBeTruthy();
    expect(screen.getByLabelText(ru['leadForm.phone.label']).getAttribute('aria-invalid')).toBe('true');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('formats a valid phone on blur', () => {
    renderForm();
    const phone = screen.getByLabelText(ru['leadForm.phone.label']) as HTMLInputElement;

    fireEvent.change(phone, { target: { value: '8 (707) 123-45-67' } });
    fireEvent.blur(phone);

    expect(phone.value).toBe('+7 707 123 45 67');
  });

  it('sends the lead, shows the thank-you state and fires generate_lead on 201', async () => {
    mockFetch.mockResolvedValue({ status: 201 } as Response);
    renderForm();

    fireEvent.click(screen.getByRole('button', { name: ru['home.contact.topic.bot'] }));
    fillContacts('  Айгерим ', '8 707 123 45 67');
    fireEvent.click(submitButton());

    expect(await screen.findByText(ru['leadForm.success.title'])).toBeTruthy();
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('/api/leads');
    expect(JSON.parse(init.body)).toEqual({
      name: 'Айгерим',
      phone: '+77071234567',
      task: '',
      service: 'bots',
      source: 'contact_form',
      page: '/',
      lang: 'ru',
      utm: {},
      website: '',
    });
    expect(gtag).toHaveBeenCalledWith('event', 'generate_lead', expect.objectContaining({ service: 'bots' }));
    expect(open).not.toHaveBeenCalled();

    const whatsapp = screen.getByRole('link', { name: ru['leadForm.whatsapp'] });
    const brief = new URL(whatsapp.getAttribute('href')!).searchParams.get('text');
    expect(brief).toBe(
      `${ru['home.contact.baseMessage']}\n${ru['home.contact.topicLine']}: ${ru['home.contact.topic.bot']}\n\n(с сайта: /)`,
    );
  });

  it('falls back to WhatsApp and does not count a lead when the server fails', async () => {
    mockFetch.mockResolvedValue({ status: 502 } as Response);
    renderForm();

    fillContacts('Aidar', '+7 707 123 45 67');
    fireEvent.click(submitButton());

    expect((await screen.findByRole('alert')).textContent).toContain(ru['leadForm.error.title']);
    expect(open).toHaveBeenCalledWith(
      expect.stringMatching(/^https:\/\/wa\.me\/77066703696\?text=/),
      '_blank',
      'noopener,noreferrer',
    );
    expect(gtag).not.toHaveBeenCalledWith('event', 'generate_lead', expect.anything());
    expect((submitButton() as HTMLButtonElement).disabled).toBe(false);
  });

  it('falls back to WhatsApp when the network is down', async () => {
    mockFetch.mockRejectedValue(new TypeError('Failed to fetch'));
    renderForm();

    fillContacts('Aidar', '87071234567');
    fireEvent.click(submitButton());

    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(open).toHaveBeenCalledTimes(1);
  });

  it('sends the honeypot value as is, even when a bot sets it without input events', async () => {
    mockFetch.mockResolvedValue({ status: 201 } as Response);
    const { container } = renderForm();

    fillContacts('Bot', '87071234567');
    const honeypot = container.querySelector<HTMLInputElement>('input[name="website"]')!;
    expect(honeypot.tabIndex).toBe(-1);
    expect(honeypot.getAttribute('autocomplete')).toBe('off');
    honeypot.value = 'https://spam.example';
    fireEvent.click(submitButton());

    await screen.findByText(ru['leadForm.success.title']);
    expect(JSON.parse(mockFetch.mock.calls[0][1].body).website).toBe('https://spam.example');
  });
});
