import type { Metadata, Viewport } from 'next';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { SITE, homeSeo } from '@/content';

export const viewport: Viewport = {
  themeColor: '#f7f7f5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: homeSeo.title,
    template: `%s | ${SITE.name}`,
  },
  description: homeSeo.description,
  keywords: [
    'Techverse Infotech',
    'custom software development',
    'ERP software development',
    'website development company',
    'mobile app development',
    'AI automation services',
    'data annotation services',
    'data labelling services',
    'AI training data services',
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  metadataBase: new URL(SITE.url),
  alternates: { canonical: '/' },
  openGraph: {
    title: homeSeo.title,
    description: homeSeo.description,
    url: SITE.url,
    siteName: SITE.name,
    images: [{ url: '/images/techverse-logo.jpg', width: 1200, height: 630, alt: SITE.name }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: homeSeo.title,
    description: homeSeo.description,
    images: ['/images/techverse-logo.jpg'],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/images/techverse-logo.jpg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: `${SITE.url}/`,
    email: SITE.email,
    telephone: SITE.phone,
    description: SITE.tagline,
    sameAs: [SITE.url],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <SmoothScroll>
          <Navbar />
          <main id="top">{children}</main>
          <Footer />
          <WhatsAppButton />
        </SmoothScroll>
      </body>
    </html>
  );
}
