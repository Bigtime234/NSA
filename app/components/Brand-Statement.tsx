'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface PitchSlide {
  url: string;
  alt: string;
  caption: string;
}

interface PitchData {
  id: string;
  sport: string;
  tagline: string;
  headline: string;
  body: string;
  specs: {label: string;value: string;}[];
  slides: PitchSlide[];
}

const pitches: PitchData[] = [
{
  id: 'football',
  sport: 'Football',
  tagline: 'The Beautiful Game Deserves a Beautiful Stage',
  headline: 'FOOTBALL\nPITCH',
  body: 'From grassroots academies to elite stadiums, we engineer football pitches that perform under pressure. Precision-graded natural turf, FIFA-certified synthetic surfaces, and drainage systems built for 90 minutes of relentless play. Every line is painted with purpose. Every yard is built to be contested.',
  specs: [
  { label: 'Surface', value: 'Natural / Hybrid / Synthetic' },
  { label: 'Dimensions', value: '100–110m × 64–75m' },
  { label: 'Standard', value: 'FIFA Quality Pro' },
  { label: 'Drainage', value: 'Sub-surface + Perimeter' }],

  slides: [
  {
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_143e5bc94-1772134741494.png",
    alt: 'Aerial view of a professional football pitch under stadium floodlights, perfectly manicured green turf with crisp white lines',
    caption: 'Stadium-Grade Turf Installation'
  },
  {
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_184c74f7f-1769694182816.png",
    alt: 'Close-up of football pitch construction showing sub-surface drainage layer installation with workers in high-vis vests',
    caption: 'Sub-Surface Drainage Engineering'
  },
  {
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_143e5bc94-1772134741494.png",
    alt: 'Football pitch line marking machine creating crisp white boundary lines on lush green turf',
    caption: 'Precision Line Marking'
  },
  {
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_102bbde2c-1772959252161.png",
    alt: 'Empty professional football stadium at dusk with floodlights illuminating the pitch, dramatic sky in background',
    caption: 'Floodlit Match-Ready Finish'
  }]

},
{
  id: 'tennis',
  sport: 'Tennis',
  tagline: 'Every Surface. Every Serve. Engineered to Perfection.',
  headline: 'TENNIS\nCOURT',
  body: 'Hard court, clay, or grass — we construct tennis courts that meet ITF standards and exceed player expectations. Our acrylic hard courts deliver consistent ball bounce and superior traction. Our clay courts are hand-laid for authentic play. Built for club, academy, or international competition.',
  specs: [
  { label: 'Surface', value: 'Acrylic / Clay / Grass' },
  { label: 'Dimensions', value: '23.77m × 10.97m' },
  { label: 'Standard', value: 'ITF Certified' },
  { label: 'Fencing', value: 'Galvanised + PVC Coated' }],

  slides: [
  {
    url: "https://images.unsplash.com/photo-1647772154087-d7e438ad6987",
    alt: 'Professional tennis court with vibrant blue acrylic surface and crisp white lines, net perfectly tensioned in center',
    caption: 'Acrylic Hard Court Construction'
  },
  {
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_104470042-1782605407751.png",
    alt: 'Clay tennis court being prepared with workers raking the red clay surface to perfect smoothness',
    caption: 'Clay Court Surface Preparation'
  },
  {
    url: "https://images.unsplash.com/photo-1673794478062-1147dbb4d436",
    alt: 'Overhead aerial view of multiple tennis courts in a sports complex showing perfect symmetry and layout',
    caption: 'Multi-Court Complex Layout'
  },
  {
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_1e0da330e-1782605406744.png",
    alt: 'Tennis court net post installation with stainless steel hardware and tensioned net at regulation height',
    caption: 'Regulation Net & Post Installation'
  }]

},
{
  id: 'badminton',
  sport: 'Badminton',
  tagline: 'Speed Demands the Right Foundation.',
  headline: 'BADMINTON\nCOURT',
  body: 'Badminton is the fastest racket sport on earth. Our courts are built to match that speed — sprung wooden flooring for shock absorption, anti-glare lighting at BWF-specified lux levels, and line markings that hold under tournament pressure. Indoor or outdoor, we build courts where champions are made.',
  specs: [
  { label: 'Surface', value: 'Sprung Wood / PU Sports Floor' },
  { label: 'Dimensions', value: '13.4m × 6.1m' },
  { label: 'Standard', value: 'BWF Approved' },
  { label: 'Lighting', value: '≥500 lux (Tournament Grade)' }],

  slides: [
  {
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_1c55d211f-1764688168221.png",
    alt: 'Indoor badminton court with polished wooden sprung floor, bright overhead lighting and crisp blue and white court lines',
    caption: 'Sprung Hardwood Floor Installation'
  },
  {
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_1cf73503d-1782605407714.png",
    alt: 'Badminton court construction showing sub-floor sprung system being installed in an indoor sports hall',
    caption: 'Sub-Floor Shock Absorption System'
  },
  {
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_1c0c41ec9-1772226714692.png",
    alt: 'Professional badminton hall with multiple courts, high ceiling and tournament-grade LED lighting arrays',
    caption: 'Tournament-Grade LED Lighting'
  },
  {
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_1a53c7d0e-1782605406207.png",
    alt: 'Close-up of badminton court line marking on polished wood floor showing precise white boundary and service lines',
    caption: 'Precision Court Line Marking'
  }]

},
{
  id: 'handball',
  sport: 'Handball',
  tagline: 'Built for Contact. Built for Champions.',
  headline: 'HANDBALL\nCOURT',
  body: 'Handball demands a surface that absorbs impact, resists abrasion, and keeps players safe at full sprint. Our handball courts feature IHF-compliant dimensions, high-grip polyurethane surfaces, and goal systems engineered for the most physical sport in the world. From community halls to national arenas — we build it right.',
  specs: [
  { label: 'Surface', value: 'PU Sports Floor / Resin' },
  { label: 'Dimensions', value: '40m × 20m' },
  { label: 'Standard', value: 'IHF Certified' },
  { label: 'Goals', value: 'Aluminium, Freestanding / Fixed' }],

  slides: [
  {
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_1981ea6d2-1772229282867.png",
    alt: 'Professional handball court with bright orange and white polyurethane surface, goal posts and crisp court markings',
    caption: 'IHF-Compliant Court Surface'
  },
  {
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_13231cf7e-1782605407712.png",
    alt: 'Indoor sports hall under construction showing concrete sub-floor preparation before polyurethane sports surface application',
    caption: 'Sub-Floor Preparation & Levelling'
  },
  {
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_19610850f-1782605408255.png",
    alt: 'Handball goal post installation with aluminium frame being anchored to sports hall floor by construction workers',
    caption: 'Goal Post & Anchor Installation'
  },
  {
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_17983a2fa-1782605408018.png",
    alt: 'Completed indoor handball arena with stadium seating, professional lighting and match-ready court surface',
    caption: 'Arena-Ready Final Handover'
  }]

}];


export default function BuildYourPitch() {
  const [activePitch, setActivePitch] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const currentPitch = pitches[activePitch];

  const goToSlide = useCallback((index: number, direction: 'next' | 'prev' = 'next') => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setSlideDirection(direction);
    setTimeout(() => {
      setActiveSlide(index);
      setIsTransitioning(false);
    }, 400);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    const next = (activeSlide + 1) % currentPitch.slides.length;
    goToSlide(next, 'next');
  }, [activeSlide, currentPitch.slides.length, goToSlide]);

  const prevSlide = useCallback(() => {
    const prev = (activeSlide - 1 + currentPitch.slides.length) % currentPitch.slides.length;
    goToSlide(prev, 'prev');
  }, [activeSlide, currentPitch.slides.length, goToSlide]);

  // Auto-advance slideshow
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % currentPitch.slides.length);
    }, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activePitch, currentPitch.slides.length]);

  // Reset slide on pitch change
  const handlePitchChange = (index: number) => {
    if (index === activePitch) return;
    setActiveSlide(0);
    setActivePitch(index);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-black overflow-hidden"
      style={{ minHeight: '100vh' }}>
      
      {/* Top label bar */}
      <div className="border-b border-white/10">
        <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <span
            className="text-white/40 font-bold uppercase tracking-[0.4em]"
            style={{ fontSize: '0.65rem' }}>
            
            NSA Infrastructure
          </span>
          <span
            className="text-white/40 font-bold uppercase tracking-[0.4em]"
            style={{ fontSize: '0.65rem' }}>
            
            Build Your Pitch
          </span>
          <span
            className="text-white/40 font-bold uppercase tracking-[0.4em]"
            style={{ fontSize: '0.65rem' }}>
            
            Est. 2024
          </span>
        </div>
      </div>

      {/* Sport selector tabs */}
      <div className="border-b border-white/10">
        <div className="max-w-screen-xl mx-auto px-6 md:px-10">
          <div className="flex overflow-x-auto scrollbar-hide">
            {pitches.map((pitch, i) =>
            <button
              key={pitch.id}
              onClick={() => handlePitchChange(i)}
              className={`relative flex-shrink-0 px-8 py-5 font-black uppercase tracking-[0.2em] transition-all duration-300 border-b-2 ${
              activePitch === i ?
              'text-white border-white' : 'text-white/30 border-transparent hover:text-white/70 hover:border-white/30'}`
              }
              style={{ fontSize: '0.75rem' }}>
              
                {pitch.sport}
                {activePitch === i &&
              <span
                className="absolute bottom-0 left-0 w-full h-[2px] bg-white"
                style={{
                  animation: 'slideInLeft 0.4s cubic-bezier(0.22,1,0.36,1) forwards'
                }} />

              }
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[80vh]">

          {/* LEFT — Copy & Specs */}
          <div className="flex flex-col justify-center py-16 lg:py-20 lg:pr-16 border-b lg:border-b-0 lg:border-r border-white/10">

            {/* Sport number */}
            <div className="flex items-center gap-4 mb-8">
              <span
                className="text-white/10 font-black"
                style={{ fontSize: 'clamp(4rem, 8vw, 7rem)', lineHeight: 1, letterSpacing: '-0.05em' }}>
                
                0{activePitch + 1}
              </span>
              <div className="flex-1 h-[1px] bg-white/10" />
              <span
                className="text-white/40 font-bold uppercase tracking-[0.4em]"
                style={{ fontSize: '0.6rem' }}>
                
                {currentPitch.sport}
              </span>
            </div>

            {/* Tagline */}
            <p
              className="text-white/50 font-semibold uppercase tracking-[0.15em] mb-6"
              style={{ fontSize: '0.7rem' }}>
              
              {currentPitch.tagline}
            </p>

            {/* Headline */}
            <h2
              className="text-white font-black uppercase leading-none mb-8"
              style={{
                fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
                letterSpacing: '-0.04em',
                lineHeight: 0.9
              }}>
              
              {currentPitch.headline.split('\n').map((line, i) =>
              <span key={i} className={i === 1 ? 'block text-white/30' : 'block'}>
                  {line}
                </span>
              )}
            </h2>

            {/* Divider */}
            <div className="w-12 h-[1px] bg-white/30 mb-8" />

            {/* Body copy */}
            <p
              className="text-white/60 leading-relaxed mb-12"
              style={{ fontSize: 'clamp(0.85rem, 1.2vw, 1rem)', maxWidth: '42ch' }}>
              
              {currentPitch.body}
            </p>

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10">
              {currentPitch.specs.map((spec) =>
              <div key={spec.label} className="bg-black px-5 py-4">
                  <p
                  className="text-white/30 font-bold uppercase tracking-[0.3em] mb-1"
                  style={{ fontSize: '0.55rem' }}>
                  
                    {spec.label}
                  </p>
                  <p
                  className="text-white font-black uppercase"
                  style={{ fontSize: '0.8rem', letterSpacing: '0.02em' }}>
                  
                    {spec.value}
                  </p>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="mt-10 flex items-center gap-6">
              <button
                className="group flex items-center gap-3 bg-white text-black font-black uppercase tracking-[0.2em] px-8 py-4 transition-all duration-300 hover:bg-white/90"
                style={{ fontSize: '0.7rem' }}>
                
                Get a Quote
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
              <button
                className="text-white/40 font-bold uppercase tracking-[0.2em] hover:text-white transition-colors duration-300"
                style={{ fontSize: '0.65rem' }}>
                
                View Portfolio
              </button>
            </div>
          </div>

          {/* RIGHT — Slideshow */}
          <div className="relative flex flex-col py-16 lg:py-20 lg:pl-16">

            {/* Slide image */}
            <div className="relative flex-1 overflow-hidden bg-white/5" style={{ minHeight: '400px' }}>
              {currentPitch.slides.map((slide, i) =>
              <div
                key={`${activePitch}-${i}`}
                className="absolute inset-0 transition-all duration-500"
                style={{
                  opacity: i === activeSlide ? 1 : 0,
                  transform: i === activeSlide ?
                  'scale(1)' :
                  slideDirection === 'next' ? 'scale(1.04)' : 'scale(0.97)',
                  zIndex: i === activeSlide ? 1 : 0
                }}>
                
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                  src={slide.url}
                  alt={slide.alt}
                  className="w-full h-full object-cover filter grayscale contrast-110"
                  style={{ filter: 'grayscale(100%) contrast(1.1) brightness(0.85)' }} />
                
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                  {/* Slide caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-[1px] bg-white/60" />
                      <span
                      className="text-white/70 font-semibold uppercase tracking-[0.25em]"
                      style={{ fontSize: '0.6rem' }}>
                      
                        {slide.caption}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Slide counter overlay */}
              <div className="absolute top-5 right-5 z-10">
                <span
                  className="text-white/40 font-black"
                  style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>
                  
                  {String(activeSlide + 1).padStart(2, '0')} / {String(currentPitch.slides.length).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Slideshow controls */}
            <div className="flex items-center justify-between mt-6">
              {/* Dot indicators */}
              <div className="flex items-center gap-2">
                {currentPitch.slides.map((_, i) =>
                <button
                  key={i}
                  onClick={() => goToSlide(i, i > activeSlide ? 'next' : 'prev')}
                  className="transition-all duration-300"
                  aria-label={`Go to slide ${i + 1}`}>
                  
                    <span
                    className={`block transition-all duration-300 ${
                    i === activeSlide ? 'bg-white w-6 h-[2px]' : 'bg-white/25 w-2 h-[2px] hover:bg-white/50'}`
                    } />
                  
                  </button>
                )}
              </div>

              {/* Prev / Next arrows */}
              <div className="flex items-center gap-1">
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/60 transition-all duration-300"
                  aria-label="Previous slide">
                  
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/60 transition-all duration-300"
                  aria-label="Next slide">
                  
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-[1px] bg-white/10 overflow-hidden">
              <div
                className="h-full bg-white/60"
                style={{
                  width: `${(activeSlide + 1) / currentPitch.slides.length * 100}%`,
                  transition: 'width 0.4s cubic-bezier(0.22,1,0.36,1)'
                }} />
              
            </div>

            {/* Bottom sport switcher — thumbnail pills */}
            <div className="mt-8 flex items-center gap-3">
              <span
                className="text-white/25 font-bold uppercase tracking-[0.3em] mr-2"
                style={{ fontSize: '0.55rem' }}>
                
                Switch
              </span>
              {pitches.map((p, i) =>
              <button
                key={p.id}
                onClick={() => handlePitchChange(i)}
                className={`font-black uppercase tracking-[0.15em] px-4 py-2 border transition-all duration-300 ${
                activePitch === i ?
                'border-white text-white bg-white/10' : 'border-white/15 text-white/30 hover:border-white/40 hover:text-white/60'}`
                }
                style={{ fontSize: '0.6rem' }}>
                
                  {p.sport}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-white/10">
        <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <span
            className="text-white/20 font-bold uppercase tracking-[0.4em]"
            style={{ fontSize: '0.6rem' }}>
            
            Professional Construction · Certified Standards · Turnkey Delivery
          </span>
          <span
            className="text-white/20 font-bold uppercase tracking-[0.4em]"
            style={{ fontSize: '0.6rem' }}>
            
            4 Sports · 1 Builder
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInLeft {
          from { transform: scaleX(0); transform-origin: left; }
          to { transform: scaleX(1); transform-origin: left; }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>);

}