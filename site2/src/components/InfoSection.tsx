import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { INFO_CONTENT, SIDEBAR_BUTTONS } from '../data';
import type { SlideData } from '../data';

export function InfoSection() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { lang } = useLanguage();
  const expansionRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const [settled, setSettled] = useState(false);

  // Simple pointer-events lock: disable mouse interaction on section until it reaches viewport top.
  // Optimized: removes listener immediately upon condition met to eliminate constant layout thrashing.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onScroll = () => {
      if (section.getBoundingClientRect().top <= 0) {
        setSettled(true);
        window.removeEventListener('scroll', onScroll);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Check immediately in case page is loaded already scrolled down
    onScroll();
    
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Eagerly preload ALL category images on mount — eliminates first-click latency.
  // Uses requestIdleCallback so it doesn't block the main thread.
  useEffect(() => {
    const preload = () => {
      const allUrls = new Set<string>();
      Object.values(INFO_CONTENT).forEach(section => {
        Object.values(section.content).forEach(langData => {
          langData.slides?.forEach(s => allUrls.add(s.imageUrl));
          langData.alternatingList?.forEach(s => allUrls.add(s.imageUrl));
          langData.featureGrid?.forEach(s => allUrls.add(s.imageUrl));
          langData.plansData?.forEach(s => { if (s.imageUrl) allUrls.add(s.imageUrl); });
        });
      });
      allUrls.forEach(url => { new Image().src = url; });
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(preload);
    } else {
      setTimeout(preload, 200);
    }
  }, []);

  const currentSection = INFO_CONTENT[activeId ?? 'default'] ?? INFO_CONTENT['default'];
  const languageData = currentSection.content[lang];

  // New: If in default (or initial) state, we'll also append the business info below it
  const showBusinessAddon = activeId === 'default' || activeId === null;
  const businessLangData = INFO_CONTENT['business'].content[lang];

  const [expandedPlanIndex, setExpandedPlanIndex] = useState<number | null>(null);

  // Auto-scroll when a plan is expanded
  useEffect(() => {
    if (expandedPlanIndex !== null) {
      // Small timeout to allow the element to render and the DOM to update its position
      setTimeout(() => {
        expansionRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 300);
    }
  }, [expandedPlanIndex]);

  return (
    <section
      ref={sectionRef}
      className="info-section"
      id="info-section"
      style={{ pointerEvents: settled ? 'auto' : 'none' }}
    >
      <nav className="info-sidebar">
        {SIDEBAR_BUTTONS.map((id) => {
          const section = INFO_CONTENT[id];
          return (
            <button
              key={id}
              className={`info-btn ${activeId === id ? 'info-btn--active' : ''}`}
              onClick={() => {
                setActiveId(activeId === id ? null : id);
                setExpandedPlanIndex(null); // Reset expansion on category change
              }}
            >
              {section.btnLabel[lang]}
            </button>
          );
        })}
      </nav>

      <div
        className="info-panel info-panel--open"
        style={{
          display: 'grid',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('images/business/background.jpg')`,
          backgroundColor: '#0f1115', // deep slate black background
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      >
        {/* Perfectly sticky responsive background layer */}
        <div 
           className="info-panel-bg"
           style={{
             gridArea: '1 / 1',
             position: 'sticky',
             top: 0,
             height: '100vh',
             width: '100%',
             backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${languageData.panelBackground || 'images/business/background.jpg'}')`,
             backgroundSize: 'contain',
             backgroundRepeat: 'no-repeat',
             backgroundPosition: 'center',
             transform: 'translate3d(0, 0, 0)',
             WebkitTransform: 'translate3d(0, 0, 0)',
             zIndex: 0
           }}
        />

        {/* Content layer that scrolls over the background */}
        <div
          key={activeId ?? 'default'}
          className="info-panel-content animate-slide"
          style={{ gridArea: '1 / 1', zIndex: 1 }}
        >
          {/* Main Category Title & Subtitle */}
          {(languageData.layoutType !== 'plansGrid' && languageData.layoutType !== 'alternatingList' && languageData.layoutType !== 'featureGrid') && (
            <>
              <h2
                className="info-panel-title"
                style={{
                  fontSize: '3.5rem',
                  marginBottom: '0.5rem',
                  fontWeight: 800,
                  color: '#fff',
                  textShadow: '0 4px 12px rgba(0,0,0,0.4)'
                }}
              >
                {languageData.title}
              </h2>

              {languageData.subtitle && (
                <p
                  className="info-panel-subtitle"
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#fff',
                    marginBottom: '2.5rem',
                    lineHeight: 1.4,
                    maxWidth: '900px',
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }}
                >
                  {languageData.subtitle}
                </p>
              )}
            </>
          )}

          {/* Contact Form Layout */}
          {languageData.layoutType === 'contactForm' && (
            <div style={{ display: 'flex', gap: '4rem', alignItems: 'flex-start', flexWrap: 'wrap', marginTop: '2rem' }}>
              {/* Form */}
              <form
                style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}
                onSubmit={e => { e.preventDefault(); }}
              >
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Անուն *"
                  style={{
                    padding: '1rem 1.4rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.25)',
                    background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '1rem', outline: 'none',
                    backdropFilter: 'blur(8px)'
                  }}
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Էլ․ հասցե *"
                  style={{
                    padding: '1rem 1.4rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.25)',
                    background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '1rem', outline: 'none',
                    backdropFilter: 'blur(8px)'
                  }}
                />
                <textarea
                  name="message"
                  required
                  placeholder="Հաղորդագրություն *"
                  rows={5}
                  style={{
                    padding: '1rem 1.4rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.25)',
                    background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '1rem', outline: 'none',
                    resize: 'vertical', backdropFilter: 'blur(8px)', fontFamily: 'inherit'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '1rem 2.5rem', borderRadius: '12px', border: 'none',
                    background: '#fff', color: '#000', fontSize: '1rem', fontWeight: 700,
                    cursor: 'pointer', alignSelf: 'flex-start', letterSpacing: '0.5px',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  Դիմել
                </button>
              </form>

              {/* Contact Info */}
              <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {[
                  { label: 'Հեռախոսահամար', value: '(+374) 44 33 99 99' },
                  { label: 'Էլ․ հասցե', value: 'info@upandup.am' },
                  { label: 'Հասցե', value: 'ՀՀ, ք․ Երևան, Գևորգ Չաուշ 11/5' },
                ].map(item => (
                  <div key={item.label}>
                    <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem', fontWeight: 700 }}>
                      {item.label}
                    </p>
                    <p style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 800 }}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Feature Grid for Privileges */}
          {languageData.layoutType === 'featureGrid' && languageData.featureGrid && (
            <div 
              className="feature-grid" 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                gap: '2rem',
                marginTop: '1rem',
                marginBottom: '4rem'
              }}
            >
              {languageData.featureGrid.map((item, idx) => (
                <div 
                  key={idx} 
                  className="feature-card animate-slide"
                  style={{ 
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('images/business/background.jpg')`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.4s ease',
                    cursor: 'default'
                  }}
                >
                  <div style={{
                    height: '350px',
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.8s ease'
                      }}
                      className="feature-img-hover"
                    />
                  </div>
                  <div style={{ padding: '1.5rem', background: 'rgba(0, 0, 0, 0.85)', height: '100%' }}>
                    <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                      {item.title}
                    </h3>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1rem', lineHeight: 1.6 }}>
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Main Category Slides */}
          {languageData.slides && languageData.slides.length > 0 && (
            <div style={{ marginBottom: '2.5rem' }}>
              <ImageCarousel
                slides={languageData.slides}
                isDefault={activeId === 'default' || activeId === null}
                layoutType={languageData.layoutType}
                autoSlide={activeId !== 'business'}
              />
            </div>
          )}

          {/* Main Category Plans GRID (New) */}
          {languageData.layoutType === 'plansGrid' && languageData.plansData && (
            <div className="plans-grid-container" style={{ marginBottom: '3rem' }}>
              <div className="plans-grid">
                {languageData.plansData.map((plan, idx) => (
                  <div
                    key={idx}
                    className="plan-card"
                    style={{
                      aspectRatio: '1/1',
                      backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0) 70%), url(${plan.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      position: 'relative',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    <h3 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', marginBottom: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{plan.title}</h3>
                    <p style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1.5rem', lineHeight: 1.3, fontWeight: 800 }}>{plan.shortText}</p>
                    <button
                      onClick={() => setExpandedPlanIndex(expandedPlanIndex === idx ? null : idx)}
                      style={{
                        alignSelf: 'flex-start',
                        padding: '0.7rem 1.4rem',
                        borderRadius: '25px',
                        background: expandedPlanIndex === idx ? '#fff' : 'rgba(255,255,255,0.1)',
                        color: expandedPlanIndex === idx ? '#000' : '#fff',
                        backdropFilter: 'blur(12px)',
                        border: `1px solid ${expandedPlanIndex === idx ? '#fff' : 'rgba(255,255,255,0.4)'}`,
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        cursor: 'pointer',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: expandedPlanIndex === idx ? '0 10px 20px rgba(0,0,0,0.3)' : 'none'
                      }}
                    >
                      {lang === 'am' ? 'Ավելին' : lang === 'ru' ? 'Подробнее' : 'More'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Monotone Expansion Area */}
              {expandedPlanIndex !== null && languageData.plansData[expandedPlanIndex] && (
                <div
                  ref={expansionRef}
                  className="plan-expansion animate-slide"
                  style={{
                     marginTop: '1.5rem',
                    padding: '2.5rem',
                    scrollMarginTop: '120px',
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url('images/business/background.jpg')`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    maxWidth: '900px'
                  }}
                >
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                    {languageData.plansData[expandedPlanIndex].fullText}
                  </p>
                  
                  {languageData.plansData[expandedPlanIndex].bulletPoints && (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '0.8rem' }}>
                      {languageData.plansData[expandedPlanIndex].bulletPoints.map((item, bIdx) => (
                        <li key={bIdx} style={{ display: 'flex', alignItems: 'flex-start', color: '#fff', fontSize: '1rem', lineHeight: 1.5 }}>
                          <span style={{ 
                            display: 'inline-block', 
                            width: '6px', 
                            height: '6px', 
                            background: '#fff', 
                            borderRadius: '50%', 
                            marginTop: '0.65rem',
                            marginRight: '1rem',
                            opacity: 0.6
                          }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Main Category Description */}
          {(languageData.layoutType !== 'plansGrid' && languageData.layoutType !== 'alternatingList' && languageData.layoutType !== 'featureGrid') && (
            <div className="info-panel-desc">
              {languageData.description.map((p, idx) => (
                <p key={idx} style={{ marginBottom: '1.25rem', fontSize: '1.15rem', lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.85)', fontWeight: 500, maxWidth: '800px' }}>
                  {p}
                </p>
              ))}
            </div>
          )}

          {/* Main Category Alternating List (New for Services) */}
          {languageData.layoutType === 'alternatingList' && languageData.alternatingList && (
            <div className="alternating-list" style={{ marginTop: '2rem' }}>
              {languageData.alternatingList.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`alternating-row animate-slide ${idx % 2 !== 0 ? 'alternating-row--reverse' : ''}`}
                  style={{ 
                    gap: '4rem',
                    marginBottom: '5rem',
                  }}
                >
                  {/* Text Side */}
                   <div className="alternating-row-text" style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('images/business/background.jpg')`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    padding: '2.5rem', 
                    borderRadius: '24px', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <h3 style={{ 
                      fontSize: '1.6rem', 
                      color: '#fff', 
                      marginBottom: '0.85rem', 
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {item.title}
                    </h3>
                    <p style={{ 
                      fontSize: '1.2rem', 
                      lineHeight: 1.8, 
                      color: 'rgba(255,255,255,0.8)',
                      fontWeight: 500
                    }}>
                      {item.text}
                    </p>
                  </div>
                  
                  {/* Image Side - Responsive Area */}
                  <div className="alternating-row-image" style={{ 
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <div style={{
                      width: '100%',
                      height: '100%',
                      backgroundImage: `url(${item.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      transition: 'transform 0.6s ease'
                    }} className="service-img-hover" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Main Category Secondary Grid (if any) */}
          {languageData.secondaryGrid && (
            <div className="secondary-grid">
              {languageData.secondaryGrid.map((img, idx) => (
                <div
                  key={idx}
                  className="grid-item"
                  onClick={() => setSelectedImage(img)}
                  style={{ cursor: 'zoom-in' }}
                >
                  <img src={img} alt={`Floor ${idx + 1}`} loading="lazy" decoding="async" />
                </div>
              ))}
            </div>
          )}

          {/* BUSINESS ADDON: If we are in default, we append business content here */}
          {showBusinessAddon && (
            <div className="business-addon" style={{ marginTop: '3.5rem' }}>
              <h2
                className="info-panel-title"
                style={{ fontSize: '2.25rem', marginBottom: '1.5rem', color: '#fff', textShadow: '0 4px 12px rgba(0,0,0,0.4)' }}
              >
                {businessLangData.title}
              </h2>

              <ImageCarousel
                slides={businessLangData.slides ?? []}
                isDefault={false}
                layoutType="multiSlide"
                autoSlide={false}
              />

              {businessLangData.secondaryGrid && (
                <div className="secondary-grid" style={{ marginTop: '3rem' }}>
                  {businessLangData.secondaryGrid.map((img, idx) => (
                    <div
                      key={idx}
                      className="grid-item"
                      onClick={() => setSelectedImage(img)}
                      style={{ cursor: 'zoom-in' }}
                    >
                      <img src={img} alt={`Floor ${idx + 1}`} loading="lazy" decoding="async" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* Global Footer Copyright */}
          <footer style={{ 
            marginTop: '4rem', 
            paddingTop: '2rem', 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.4)',
            fontSize: '0.9rem',
            width: '100%',
            paddingBottom: '2rem'
          }}>
            © 2026 UpAndUp All Rights Reserved.
          </footer>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="lightbox-modal" onClick={() => setSelectedImage(null)}>
          <button className="lightbox-close">&times;</button>
          <img src={selectedImage} alt="Full View" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}

function ImageCarousel({ slides, isDefault, layoutType, autoSlide = true }: { slides: SlideData[], isDefault?: boolean, layoutType?: 'standard' | 'smallCarousel' | 'multiSlide' | 'plansGrid' | 'alternatingList' | 'featureGrid' | 'contactForm', autoSlide?: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const isSmall = layoutType === 'smallCarousel';
  const isMulti = layoutType === 'multiSlide';
  const slidesToShow = isMulti ? 2.5 : 1; // 2.5 makes images bigger and shows more are coming
  const maxIndex = Math.max(0, slides.length - Math.floor(slidesToShow));

  const goNext = () => setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  const goPrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  useEffect(() => {
    if (!autoSlide || slides.length <= slidesToShow) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length, maxIndex, slidesToShow, autoSlide, currentIndex]);

  return (
    <div className={`carousel-wrapper ${isSmall ? 'carousel-wrapper--small' : ''} ${isMulti ? 'carousel-wrapper--multi' : ''}`}>
      <div
        className="carousel-container"
        style={
          isSmall ? { height: 'auto', aspectRatio: '9 / 6', maxWidth: '600px' } :
            isMulti ? { height: 'auto', aspectRatio: '15 / 9', overflow: 'hidden' } :
              {}
        }
      >
        {/* The sliding images track */}
        <div
          className="carousel-track"
          style={{
            transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
            width: isMulti ? '100%' : '100%',
            transition: autoSlide ? undefined : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        >
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className="carousel-slide"
              style={{
                backgroundImage: `url(${slide.imageUrl})`,
                flex: `0 0 ${100 / slidesToShow}%`,
                aspectRatio: isMulti ? '6 / 9' : 'unset',
                height: isMulti ? 'auto' : '100%',
                borderRadius: isMulti ? '12px' : '0',
                marginRight: isMulti ? '1rem' : '0'
              }}
            >
              {/* Text overlapping THIS specific image box inside the slide component */}
              {(slide.title || slide.topText || slide.subtitle) && (
                <div className={`carousel-overlay ${isDefault ? 'carousel-overlay--centered' : ''}`}>
                  <div className="carousel-text-box" style={{ 
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('images/business/background.jpg')`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  padding: '1.5rem', 
                  width: isMulti ? '90%' : 'auto' 
                }}>
                    {slide.topText && (
                      <p style={{ margin: 0, fontSize: isMulti ? '0.7rem' : '0.9rem', color: '#ccc', letterSpacing: '1px', marginBottom: '0.5rem', fontWeight: 600 }}>
                        {slide.topText}
                      </p>
                    )}
                    <h2 className="info-panel-title" style={{ fontSize: isMulti ? '1.2rem' : '2.2rem', marginBottom: '0.4rem', color: '#fff', fontWeight: 'bold', lineHeight: 1.2 }}>
                      {slide.title}
                    </h2>
                    {slide.subtitle && (
                      <p className="info-panel-subtitle" style={{ margin: 0, fontSize: isMulti ? '0.8rem' : '1rem', color: '#ddd' }}>
                        {slide.subtitle}
                      </p>
                    )}
                    {slide.stats && (
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.8rem', width: '100%', justifyContent: isDefault ? 'center' : 'flex-start' }}>
                        {slide.stats.map((stat, sIdx) => (
                          <div key={sIdx} style={{ display: 'flex', flexDirection: 'column', alignItems: isDefault ? 'center' : 'flex-start' }}>
                            <span style={{ fontSize: isMulti ? '1rem' : '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '0.1rem' }}>{stat.value}</span>
                            <span style={{ fontSize: isMulti ? '0.6rem' : '0.8rem', color: '#bbb', lineHeight: 1.2, maxWidth: '120px' }}>{stat.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Loading progress dots below the image (only if autoSlide is on) */}
      {slides.length > 1 && autoSlide && (
        <div className="carousel-dots-container">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`carousel-dot ${currentIndex === idx ? 'carousel-dot--active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
            >
              {currentIndex === idx && (
                <div key={currentIndex} className="carousel-dot-fill" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Navigation Buttons for Manual Mode */}
      {!autoSlide && slides.length > slidesToShow && (
        <div className="carousel-controls">
          <button className="carousel-ctrl-btn" onClick={goPrev}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <button className="carousel-ctrl-btn" onClick={goNext}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      )}
    </div>
  );
}
