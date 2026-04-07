import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface VideoScrollProps {
  frameCount: number;
  frameUrlPattern: (index: number) => string;
  scrollHeight?: string;
}

export function VideoScroll({
  frameCount,
  frameUrlPattern,
  scrollHeight = '500vh',
}: VideoScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [firstFrameReady, setFirstFrameReady] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || frameCount === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false })!;

    // Load first frame immediately
    const firstImg = new Image();
    firstImg.src = frameUrlPattern(0);
    firstImg.onload = () => {
      imagesRef.current[0] = firstImg;
      canvas.width = firstImg.width || 1920;
      canvas.height = firstImg.height || 1080;
      ctx.drawImage(firstImg, 0, 0, canvas.width, canvas.height);
      setFirstFrameReady(true);

      // Preload remaining frames via native browser caching
      for (let i = 1; i < frameCount; i++) {
        const img = new Image();
        img.src = frameUrlPattern(i);
        imagesRef.current[i] = img;
      }

      // Setup GSAP scroll trigger timeline
      let renderedFrame = -1;
      const obj = { f: 0 };
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2, /* Doubled for extra smoothness on mobile/iPhone */
        }
      });

      tl.to(obj, {
        f: frameCount - 1,
        ease: 'none',
        duration: 0.85, /* 85% of scroll triggers the video */
        onUpdate() {
          const target = Math.round(obj.f);
          if (target !== renderedFrame) {
            const img = imagesRef.current[target];
            if (img && img.complete && img.naturalWidth > 0) {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              renderedFrame = target;
            }
          }
        },
      })
      .to({}, { duration: 0.15 }); /* Last 15% hold frame */
    };

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      imagesRef.current = [];
    };
  }, [frameCount, frameUrlPattern]);

  return (
    <div ref={containerRef} className="video-scroll-container" style={{ height: scrollHeight, position: 'relative' }}>
      <div className="video-scroll-sticky">
        <div className="video-scroll-canvas-wrapper">
          <canvas
            ref={canvasRef}
            className="video-scroll-canvas"
            style={{ opacity: firstFrameReady ? 1 : 0 }}
          />
        </div>
      </div>
    </div>
  );
}
