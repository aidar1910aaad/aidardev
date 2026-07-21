import { redirect } from 'next/navigation';

export default function Home() {
  // Редирект на версию с языком (middleware обработает определение языка)
  redirect('/ru');
}
