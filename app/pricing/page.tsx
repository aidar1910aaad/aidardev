import { redirect } from 'next/navigation';

export default function PricingPage() {
  // Редирект на версию с языком
  redirect('/ru/pricing');
}

