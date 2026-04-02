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
  frameCount: initialFrameCount,
  frameUrlPattern,
  scrollHeight: initialScrollHeight = '500vh',
}: VideoScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bitmapsRef = useRef<ImageBitmap[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Determine if we should use mobile-light mode
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const frameCount = isMobile ? Math.ceil(initialFrameCount / 2) : initialFrameCount;
  const skipFactor = isMobile ? 2 : 1;
  const scrollHeight = isMobile ? '300vh' : initialScrollHeight;

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || initialFrameCount === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false })!;
    
    // Clear previous state
    bitmapsRef.current.forEach(b => b?.close());
    bitmapsRef.current = [];
    setFirstFrameReady(false);

    // Initial frame loading
    const loadFrame = async (idx: number) => {
      // If mobile, we load only frames like 0, 2, 4... (even indices)
      const actualIdx = idx * skipFactor;
      if (actualIdx >= initialFrameCount) return null;

      try {
        const response = await fetch(frameUrlPattern(actualIdx));
        const blob = await response.blob();
        const bitmap = await createImageBitmap(blob);
        bitmapsRef.current[idx] = bitmap;
        return bitmap;
      } catch (e) {
        console.error('Frame failed:', actualIdx);
        return null;
      }
    };

    // Load first frame immediately
    loadFrame(0).then((bitmap) => {
      if (bitmap) {
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        ctx.drawImage(bitmap, 0, 0);
        setFirstFrameReady(true);
      }

      // Load remaining frames in small batches to avoid blocking
      const loadOthers = async () => {
        for (let i = 1; i < frameCount; i++) {
          await loadFrame(i);
          // Yield to main thread every few frames
          if (i % 5 === 0) await new Promise(r => setTimeout(r, 0));
        }
      };
      
      loadOthers().then(() => {
        let renderedFrame = -1;
        const renderLoop = () => {
          const target = Math.floor(currentFrameRef.current);
          if (target !== renderedFrame) {
            const bmp = bitmapsRef.current[target];
            if (bmp) {
              ctx.drawImage(bmp, 0, 0);
              renderedFrame = target;
            }
          }
          rafRef.current = requestAnimationFrame(renderLoop);
        };
        rafRef.current = requestAnimationFrame(renderLoop);

        const obj = { f: 0 };
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: isMobile ? 0.3 : 0.6, // Tighter scrub on mobile for "snappiness"
            invalidateOnRefresh: true
          }
        });

        tl.to(obj, {
          f: frameCount - 1,
          ease: 'none',
          duration: 0.85, 
          onUpdate() {
            currentFrameRef.current = Math.min(frameCount - 1, Math.max(0, obj.f));
          },
        }).to({}, { duration: 0.15 });
      });
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [frameCount, frameUrlPattern, initialFrameCount, skipFactor, isMobile]);

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
