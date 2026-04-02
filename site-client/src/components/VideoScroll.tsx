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
  const bitmapsRef = useRef<ImageBitmap[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const [firstFrameReady, setFirstFrameReady] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || frameCount === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false })!;

    // Load first frame immediately
    fetch(frameUrlPattern(0))
      .then((r) => r.blob())
      .then((blob) => createImageBitmap(blob))
      .then((bitmap) => {
        bitmapsRef.current[0] = bitmap;
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        ctx.drawImage(bitmap, 0, 0);
        setFirstFrameReady(true);

        // START SCROLL TRIGGER IMMEDIATELY (Don't wait for all frames)
        const renderLoop = () => {
          const target = Math.floor(currentFrameRef.current);
          const bmp = bitmapsRef.current[target];
          if (bmp) {
            ctx.drawImage(bmp, 0, 0);
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
            scrub: 1.2, /* Smoother scrub for mobile */
          }
        });

        // 1. Initial 15% Scroll: Hold Frame 0
        tl.to({}, { duration: 0.15 })
          // 2. Main 70% Scroll: Animate Frames
          .to(obj, {
            f: frameCount - 1,
            ease: 'none',
            duration: 0.70,
            onUpdate() {
              currentFrameRef.current = Math.min(frameCount - 1, Math.max(0, obj.f));
            },
          })
          // 3. Last 15% Scroll: Hold Final Frame
          .to({}, { duration: 0.15 });

        // Load remaining frames in sequence (prioritized)
        const loadSequentially = async () => {
          for (let i = 1; i < frameCount; i++) {
            try {
              const res = await fetch(frameUrlPattern(i));
              const blob = await res.blob();
              const bmp = await createImageBitmap(blob);
              bitmapsRef.current[i] = bmp;
            } catch (e) {
              console.error('Frame error:', i, e);
            }
          }
        };
        loadSequentially();
      });

    return () => {
      cancelAnimationFrame(rafRef.current);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      bitmapsRef.current.forEach((b) => b.close());
      bitmapsRef.current = [];
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
