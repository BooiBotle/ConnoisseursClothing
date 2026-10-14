import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedCollections } from '../components/home/FeaturedCollections';
import { FeaturedDrops } from '../components/home/FeaturedDrops';
import { BrandStorySection } from '../components/home/BrandStorySection';
import { PromoBanner } from '../components/home/PromoBanner';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturedCollections />
      <FeaturedDrops />
      <BrandStorySection />
      <PromoBanner />
    </div>
  );
};
