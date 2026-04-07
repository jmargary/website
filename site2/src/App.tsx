
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VideoScroll } from './components/VideoScroll';
import { InfoSection } from './components/InfoSection';
import { SiteHeader } from './components/SiteHeader';
import { LanguageProvider } from './contexts/LanguageContext';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

// Matches: frame_00.webp ... frame_76.webp (77 frames)
const frameUrl = (index: number) =>
  `frames/frame_${String(index).padStart(2, '0')}.webp`;

function App() {

  return (
    <LanguageProvider>
      <main>
        <SiteHeader />

        {/* The full-screen scroll-driven video animation — 77 frames */}
        <VideoScroll
          frameCount={77}
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
