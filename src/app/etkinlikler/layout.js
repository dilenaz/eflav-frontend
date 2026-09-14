import { permanentRedirect } from 'next/navigation';

export default function EventsLayout({ children }) {
  void children;
  permanentRedirect('/faaliyetler');
}
