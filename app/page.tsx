import type { Metadata } from 'next';
import { buildMetadata, homeSeo } from '@/content';
import HomeHero from '@/components/home/HomeHero';
import WhatWeDo from '@/components/home/WhatWeDo';
import Services from '@/components/Services';
import WhyChoose from '@/components/home/WhyChoose';
import IndustriesHome from '@/components/home/IndustriesHome';
import ProcessHome from '@/components/home/ProcessHome';
import AboutTeaser from '@/components/home/AboutTeaser';
import FaqHome from '@/components/home/FaqHome';
import ContactTeaser from '@/components/home/ContactTeaser';

export const metadata: Metadata = buildMetadata(homeSeo);

export default function Home() {
  return (
    <>
      <HomeHero />
      <WhatWeDo />
      <Services />
      <WhyChoose />
      <IndustriesHome />
      <ProcessHome />
      <AboutTeaser />
      <FaqHome />
      <ContactTeaser />
    </>
  );
}
