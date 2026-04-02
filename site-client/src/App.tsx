import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VideoScroll } from './components/VideoScroll';
import { InfoSection } from './components/InfoSection';
import { SiteHeader } from './components/SiteHeader';
import { LanguageProvider } from './contexts/LanguageContext';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

// Matches: frame_000.webp ... frame_191.webp (192 frames)
const frameUrl = (index: number) =>
  `/frames/ezgif-split/frame_${String(index).padStart(3, '0')}.webp`;

function App() {
  useEffect(() => {
    const els = gsap.utils.toArray<HTMLElement>('.reveal');
    els.forEach((el) => {
      gsap.fromTo(
        el,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        }
      );
    });
  }, []);

  return (
    <LanguageProvider>
      <main>
        <SiteHeader />

        {/* The full-screen scroll-driven video animation — 192 frames */}
        <VideoScroll
          frameCount={192}
          frameUrlPattern={frameUrl}
          scrollHeight="500vh"
        />

        {/* White wide spacer section after animation */}
        <section className="white-buffer" />

        {/* The new info section that appears after scrolling */}
        <InfoSection />
      </main>
    </LanguageProvider>
  );
}

export default App;
