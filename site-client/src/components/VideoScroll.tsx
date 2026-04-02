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
    const isMobile = window.innerWidth < 768;
    const effectiveFrames = isMobile ? Math.ceil(frameCount / 2) : frameCount;

    // Load first frame immediately so the page appears ready
    fetch(frameUrlPattern(0))
      .then((r) => r.blob())
      .then((blob) => createImageBitmap(blob))
      .then((bitmap) => {
        bitmapsRef.current[0] = bitmap;
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        ctx.drawImage(bitmap, 0, 0);
        setFirstFrameReady(true);

        // Load remaining frames with skips on mobile for performance
        const remaining = Array.from({ length: effectiveFrames - 1 }, (_, i) => {
          const frameIdx = isMobile ? (i + 1) * 2 : i + 1;
          const targetStoreIdx = i + 1;
          if (frameIdx >= frameCount) return Promise.resolve(null);

          return fetch(frameUrlPattern(frameIdx))
            .then((r) => r.blob())
            .then((blob) => createImageBitmap(blob))
            .then((bmp) => {
              bitmapsRef.current[targetStoreIdx] = bmp;
              return bmp;
            });
        });

        Promise.all(remaining).then(() => {
          // All frames loaded — start render loop + scroll trigger
          let renderedTargetIdx = -1;
          const renderLoop = () => {
            const target = Math.round(currentFrameRef.current);
            if (target !== renderedTargetIdx) {
              const bmp = bitmapsRef.current[target];
              if (bmp) {
                ctx.drawImage(bmp, 0, 0);
                renderedTargetIdx = target;
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
              scrub: 2.0, // Higher scrub for smoother interpolation on touch/iOS
            }
          });

          tl.to(obj, {
            f: effectiveFrames - 1,
            ease: 'none',
            duration: 0.85, /* 85% of scroll triggers the video */
            onUpdate() {
              currentFrameRef.current = Math.min(
                effectiveFrames - 1,
                Math.max(0, obj.f)
              );
            },
          })
          .to({}, { duration: 0.15 }); 
        });
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
