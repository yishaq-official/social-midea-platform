import { useState, useEffect, useRef } from 'react';
import './Landing.css';

/* ─── tiny hook: detect when element enters viewport ─── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

/* ─── Animated counter ─── */
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 20);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Data ─── */
const features = [
  {
    icon: '✦',
    title: 'Real-Time Feed',
    desc: 'See posts, stories, and updates the moment they happen — zero lag, always live.',
    color: 'var(--purple)',
  },
  {
    icon: '🔒',
    title: 'Privacy First',
    desc: 'Granular controls so you decide who sees what. Your data belongs to you.',
    color: 'var(--pink)',
  },
  {
    icon: '🌐',
    title: 'Global Communities',
    desc: 'Discover and join thousands of interest-based groups from across the world.',
    color: 'var(--cyan)',
  },
  {
    icon: '⚡',
    title: 'Instant Messaging',
    desc: 'End-to-end encrypted chats, voice notes, and media sharing in one tap.',
    color: 'var(--gold)',
  },
  {
    icon: '🎨',
    title: 'Creative Studio',
    desc: 'Built-in editor for photos, short videos, and stories with premium filters.',
    color: 'var(--green)',
  },
  {
    icon: '📈',
    title: 'Creator Analytics',
    desc: 'Deep insights into reach, engagement, and audience growth — all for free.',
    color: 'var(--orange)',
  },
];

const testimonials = [
  {
    avatar: '👩🏽‍💻',
    name: 'Amara Osei',
    role: 'UX Designer · Accra',
    quote:
      '"Social Midea completely changed how I share my design journey. The engagement is real and the community is incredibly supportive."',
  },
  {
    avatar: '🧑🏻‍🎤',
    name: 'Kenji Watanabe',
    role: 'Musician · Tokyo',
    quote:
      '"I grew my fanbase from 200 to 40 k in three months — without spending a single dollar on ads. This platform just works."',
  },
  {
    avatar: '👩🏾‍🏫',
    name: 'Priya Sharma',
    role: 'Educator · Mumbai',
    quote:
      '"The community groups feature is a game-changer for online education. My students are more engaged than ever."',
  },
];

const navLinks = ['Features', 'Community', 'Creators', 'Pricing'];

/* ─── Main Component ─── */
export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // auto-rotate testimonials
  useEffect(() => {
    const t = setInterval(() => {
      setActiveTestimonial(i => (i + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const [heroRef, heroInView] = useInView(0.1);
  const [featRef, featInView] = useInView(0.05);
  const [statsRef, statsInView] = useInView(0.2);
  const [testRef, testInView] = useInView(0.2);
  const [ctaRef, ctaInView] = useInView(0.2);

  return (
    <div className="lp-root">
      {/* ── Noise overlay ── */}
      <div className="lp-noise" aria-hidden="true" />

      {/* ── Ambient blobs ── */}
      <div className="lp-blob lp-blob--1" aria-hidden="true" />
      <div className="lp-blob lp-blob--2" aria-hidden="true" />
      <div className="lp-blob lp-blob--3" aria-hidden="true" />

      {/* ═══════════════════════ NAV ═══════════════════════ */}
      <header className={`lp-nav ${scrolled ? 'lp-nav--scrolled' : ''}`}>
        <a href="#" className="lp-logo" aria-label="Social Midea home">
          <span className="lp-logo__icon">◈</span>
          <span>Social<span className="lp-logo__accent">Midea</span></span>
        </a>

        <nav className={`lp-nav__links ${menuOpen ? 'lp-nav__links--open' : ''}`} aria-label="Main navigation">
          {navLinks.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="lp-nav__link" onClick={() => setMenuOpen(false)}>
              {l}
            </a>
          ))}
        </nav>

        <div className="lp-nav__cta">
          <a href="#login" className="lp-btn lp-btn--ghost">Sign in</a>
          <a href="#signup" className="lp-btn lp-btn--primary">Get Started</a>
        </div>

        <button
          className={`lp-hamburger ${menuOpen ? 'lp-hamburger--open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}
        >
          <span /><span /><span />
        </button>
      </header>

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section
        id="hero"
        className={`lp-hero ${heroInView ? 'lp-anim--in' : 'lp-anim--out'}`}
        ref={heroRef}
      >
        <div className="lp-hero__badge">
          <span className="lp-badge__dot" />
          Now in public beta — join free today
        </div>

        <h1 className="lp-hero__title">
          Your world,<br />
          <span className="lp-gradient-text">beautifully</span><br />
          connected.
        </h1>

        <p className="lp-hero__sub">
          Social Midea is the next-generation platform where authentic stories,
          vibrant communities, and powerful creators come together.
        </p>

        <div className="lp-hero__actions">
          <a href="#signup" className="lp-btn lp-btn--primary lp-btn--xl">
            Start for free
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#demo" className="lp-btn lp-btn--glass lp-btn--xl">
            Watch demo
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <circle cx="12" cy="12" r="10" opacity=".2" />
              <polygon points="10,8 16,12 10,16" />
            </svg>
          </a>
        </div>

        {/* Mock phone UI */}
        <div className="lp-hero__phone" aria-hidden="true">
          <div className="lp-phone">
            <div className="lp-phone__screen">
              <div className="lp-phone__bar" />
              {/* Feed items */}
              {[
                { avatar: '👩🏾', name: 'Maya', time: '2m ago', img: '🌆', likes: '1.2k' },
                { avatar: '🧑🏻', name: 'Luca', time: '8m ago', img: '🎵', likes: '847' },
                { avatar: '👩🏽', name: 'Nora', time: '15m ago', img: '🌿', likes: '2.4k' },
              ].map((p, i) => (
                <div className="lp-feed-card" key={i}>
                  <div className="lp-feed-card__top">
                    <span className="lp-feed-avatar">{p.avatar}</span>
                    <div>
                      <div className="lp-feed-name">{p.name}</div>
                      <div className="lp-feed-time">{p.time}</div>
                    </div>
                  </div>
                  <div className="lp-feed-img">{p.img}</div>
                  <div className="lp-feed-card__actions">
                    <span>❤️ {p.likes}</span>
                    <span>💬</span>
                    <span>↗</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="lp-phone__home-bar" />
          </div>
          {/* floating cards */}
          <div className="lp-float-card lp-float-card--a">
            <span>🔥</span> Trending now
          </div>
          <div className="lp-float-card lp-float-card--b">
            <span>✅</span> 12k online
          </div>
        </div>
      </section>

      {/* ═══════════════════════ STATS ═══════════════════════ */}
      <section className={`lp-stats ${statsInView ? 'lp-anim--in' : 'lp-anim--out'}`} ref={statsRef}>
        {[
          { value: 2400000, suffix: '+', label: 'Active users' },
          { value: 180, suffix: '+', label: 'Countries' },
          { value: 98, suffix: '%', label: 'Uptime SLA' },
          { value: 4700000, suffix: '+', label: 'Daily posts' },
        ].map(({ value, suffix, label }) => (
          <div className="lp-stat" key={label}>
            <div className="lp-stat__value">
              <Counter target={value} suffix={suffix} />
            </div>
            <div className="lp-stat__label">{label}</div>
          </div>
        ))}
      </section>

      {/* ═══════════════════════ FEATURES ═══════════════════════ */}
      <section
        id="features"
        className={`lp-features ${featInView ? 'lp-anim--in' : 'lp-anim--out'}`}
        ref={featRef}
      >
        <div className="lp-section-label">Features</div>
        <h2 className="lp-section-title">
          Everything you need to<br />
          <span className="lp-gradient-text">create & connect</span>
        </h2>
        <p className="lp-section-sub">
          Designed for creators, communities, and casual users alike — no trade-offs.
        </p>

        <div className="lp-features__grid">
          {features.map((f, i) => (
            <div
              className="lp-feat-card"
              key={f.title}
              style={{ '--delay': `${i * 0.08}s`, '--accent': f.color }}
            >
              <div className="lp-feat-card__icon">{f.icon}</div>
              <h3 className="lp-feat-card__title">{f.title}</h3>
              <p className="lp-feat-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ COMMUNITY HIGHLIGHT ═══════════════════════ */}
      <section id="community" className="lp-community">
        <div className="lp-community__content">
          <div className="lp-section-label">Community</div>
          <h2 className="lp-section-title lp-section-title--left">
            Real people.<br />
            <span className="lp-gradient-text">Real connections.</span>
          </h2>
          <p className="lp-section-sub lp-section-sub--left">
            From niche hobbies to global movements, Social Midea's community tools
            let you build meaningful spaces where everyone feels at home.
          </p>
          <ul className="lp-community__list">
            {[
              'Create public or private groups',
              'Host live events & streams',
              'Polls, AMAs, and collaborative posts',
              'Moderation tools that actually work',
            ].map(item => (
              <li key={item} className="lp-community__item">
                <span className="lp-community__check">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <a href="#signup" className="lp-btn lp-btn--primary">Build your community →</a>
        </div>

        <div className="lp-community__visual" aria-hidden="true">
          <div className="lp-group-card lp-group-card--main">
            <div className="lp-group-header">
              <span className="lp-group-icon">🎨</span>
              <div>
                <div className="lp-group-name">Design & Craft</div>
                <div className="lp-group-members">48,231 members</div>
              </div>
            </div>
            <div className="lp-group-avatars">
              {['👩🏾‍🎨', '🧑🏻‍💻', '👨🏿‍🎤', '👩🏽‍🏫', '🧑🏼‍🚀'].map((a, i) => (
                <span key={i} className="lp-group-avatar" style={{ '--i': i }}>{a}</span>
              ))}
              <span className="lp-group-more">+243</span>
            </div>
            <div className="lp-group-activity">
              <span className="lp-badge__dot" /> 1,402 active right now
            </div>
          </div>
          <div className="lp-group-card lp-group-card--b">
            <span className="lp-group-icon">🎵</span>
            <span className="lp-group-name">Music Makers</span>
            <span className="lp-group-members">31k</span>
          </div>
          <div className="lp-group-card lp-group-card--c">
            <span className="lp-group-icon">📸</span>
            <span className="lp-group-name">Photographers</span>
            <span className="lp-group-members">22k</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ TESTIMONIALS ═══════════════════════ */}
      <section
        id="creators"
        className={`lp-testimonials ${testInView ? 'lp-anim--in' : 'lp-anim--out'}`}
        ref={testRef}
      >
        <div className="lp-section-label">Testimonials</div>
        <h2 className="lp-section-title">
          Loved by <span className="lp-gradient-text">creators</span> worldwide
        </h2>

        <div className="lp-test-slider">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`lp-test-card ${i === activeTestimonial ? 'lp-test-card--active' : ''}`}
            >
              <p className="lp-test-quote">{t.quote}</p>
              <div className="lp-test-author">
                <span className="lp-test-avatar">{t.avatar}</span>
                <div>
                  <div className="lp-test-name">{t.name}</div>
                  <div className="lp-test-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lp-test-dots">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`lp-test-dot ${i === activeTestimonial ? 'lp-test-dot--active' : ''}`}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => setActiveTestimonial(i)}
            />
          ))}
        </div>
      </section>

      {/* ═══════════════════════ CTA ═══════════════════════ */}
      <section
        id="pricing"
        className={`lp-cta ${ctaInView ? 'lp-anim--in' : 'lp-anim--out'}`}
        ref={ctaRef}
      >
        <div className="lp-cta__inner">
          <div className="lp-cta__blob" aria-hidden="true" />
          <div className="lp-section-label lp-section-label--light">Get started</div>
          <h2 className="lp-cta__title">
            Join millions already<br />sharing their story.
          </h2>
          <p className="lp-cta__sub">
            Free forever for individuals. Upgrade anytime for advanced creator tools.
          </p>
          <div className="lp-cta__form" role="form" aria-label="Sign up form">
            <input
              id="cta-email"
              type="email"
              placeholder="Enter your email"
              className="lp-cta__input"
              aria-label="Email address"
            />
            <button type="button" id="cta-signup-btn" className="lp-btn lp-btn--primary lp-btn--xl">
              Create account
            </button>
          </div>
          <p className="lp-cta__legal">
            No credit card required · Cancel anytime · GDPR compliant
          </p>
        </div>
      </section>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer className="lp-footer">
        <div className="lp-footer__top">
          <a href="#" className="lp-logo lp-footer__logo">
            <span className="lp-logo__icon">◈</span>
            <span>Social<span className="lp-logo__accent">Midea</span></span>
          </a>
          <nav className="lp-footer__nav" aria-label="Footer navigation">
            {['About', 'Blog', 'Careers', 'Press', 'Privacy', 'Terms', 'Support'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="lp-footer__link">{l}</a>
            ))}
          </nav>
          <div className="lp-footer__socials">
            {['𝕏', '⬡', '▶', '📸'].map((s, i) => (
              <a key={i} href="#social" className="lp-footer__social" aria-label={`Social link ${i + 1}`}>{s}</a>
            ))}
          </div>
        </div>
        <div className="lp-footer__bottom">
          <p>© {new Date().getFullYear()} Social Midea, Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
