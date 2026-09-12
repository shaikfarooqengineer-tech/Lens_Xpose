"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Aperture,
  Play,
  Pause,
  Menu,
  Camera,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { photos, films, testimonials, studio } from "@/lib/content";

export function Navigation({ inner = false }: { inner?: boolean }) {
  const [scrolled, setScrolled] = useState(inner),
    [open, setOpen] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(inner || window.scrollY > 40);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [inner]);
  const links = [
    ["Selected work", inner ? "/work" : "#work"],
    ["The person", "/#about"],
    ["Films", "/#films"],
    ["Journal", "/journal"],
  ];
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <nav
        className={`navigation ${scrolled ? "scrolled" : ""}`}
        aria-label="Main navigation"
      >
        <a className="wordmark" href="/" aria-label="Lens Expose home">
          lens<span>expose</span>
          <i>®</i>
        </a>
        <div className="nav-links">
          {links.map(([name, url]) => (
            <a key={name} href={url}>
              {name}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <a className="nav-cta magnetic" href="/#contact">
            Let’s talk <ArrowUpRight size={17} />
          </a>
          <button
            className="menu-toggle"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="menu-dialog">
          <DialogTitle>Explore Lens Expose</DialogTitle>
          <DialogDescription>
            Photographs, films, and the person behind them.
          </DialogDescription>
          {links.map(([name, url]) => (
            <a key={name} href={url} onClick={() => setOpen(false)}>
              {name}
              <ArrowUpRight />
            </a>
          ))}
        </DialogContent>
      </Dialog>
    </>
  );
}
export function Motion() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    let stopTrail = () => {};
    const setup = () => {
      observer?.disconnect();
      stopTrail();
      document
        .querySelectorAll(".reveal")
        .forEach((el) => el.classList.remove("motion-ready", "is-visible"));
      if (media.matches) return;
      observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add("is-visible");
            else if (
              entry.boundingClientRect.top > innerHeight ||
              entry.boundingClientRect.bottom < 0
            )
              entry.target.classList.remove("is-visible");
          }),
        { threshold: 0, rootMargin: "0px" },
      );
      document.querySelectorAll(".reveal").forEach((el) => {
        el.classList.add("motion-ready");
        observer!.observe(el);
      });
      if (!matchMedia("(pointer:fine)").matches) return;
      const c = canvas.current!,
        ctx = c.getContext("2d");
      if (!ctx) return;
      let points: { x: number; y: number; t: number }[] = [],
        raf = 0;
      const resize = () => {
        c.width = innerWidth;
        c.height = innerHeight;
      };
      resize();
      const draw = (now: number) => {
        ctx.clearRect(0, 0, c.width, c.height);
        points = points.filter((p) => now - p.t < 360);
        points.forEach((p) => {
          const life = 1 - (now - p.t) / 360;
          const g = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            14 * life + 1,
          );
          g.addColorStop(0, `rgba(210,235,190,${life * 0.24})`);
          g.addColorStop(0.4, `rgba(170,145,225,${life * 0.1})`);
          g.addColorStop(1, "rgba(170,145,225,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 14 * life + 1, 0, Math.PI * 2);
          ctx.fill();
        });
        raf = points.length ? requestAnimationFrame(draw) : 0;
      };
      const move = (e: PointerEvent) => {
        if ((e.target as HTMLElement).closest("input,textarea,select")) return;
        points.push({ x: e.clientX, y: e.clientY, t: performance.now() });
        if (points.length > 28) points.shift();
        if (!raf) raf = requestAnimationFrame(draw);
      };
      const clear = () => {
        points = [];
        cancelAnimationFrame(raf);
        raf = 0;
        ctx.clearRect(0, 0, c.width, c.height);
      };
      const magnetic = (e: PointerEvent) => {
        const target = (e.target as HTMLElement).closest<HTMLElement>(
          ".magnetic",
        );
        if (!target) return;
        const r = target.getBoundingClientRect();
        target.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.09}px ${(e.clientY - r.top - r.height / 2) * 0.12}px`;
      };
      const reset = (e: PointerEvent) => {
        const target = (e.target as HTMLElement).closest<HTMLElement>(
          ".magnetic",
        );
        if (target) target.style.translate = "0px 0px";
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointermove", magnetic);
      window.addEventListener("pointerout", reset);
      window.addEventListener("resize", resize);
      document.addEventListener("visibilitychange", clear);
      document.addEventListener("pointerleave", clear);
      stopTrail = () => {
        clear();
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointermove", magnetic);
        window.removeEventListener("pointerout", reset);
        window.removeEventListener("resize", resize);
        document.removeEventListener("visibilitychange", clear);
        document.removeEventListener("pointerleave", clear);
      };
    };
    setup();
    media.addEventListener("change", setup);
    return () => {
      observer?.disconnect();
      stopTrail();
      media.removeEventListener("change", setup);
    };
  }, []);
  return <canvas ref={canvas} className="cursor-plume" aria-hidden="true" />;
}
function Hero() {
  return (
    <section className="hero">
      <div className="hero-backdrop" />
      <div className="hero-content">
        <p className="eyebrow entrance">
          <span className="live-dot" /> IN PURSUIT OF THE EXTRAORDINARY
        </p>
        <h1>
          <span className="hero-line">
            <b>Some</b> <b>moments.</b>
          </span>
          <span className="hero-line italic">
            <b>Stay</b> <b>with</b> <b>you.</b>
          </span>
        </h1>
        <div className="hero-bottom entrance">
          <p>
            I turn fleeting moments into photographs
            <br />
            and films you can feel. This is Lens Expose.
          </p>
          <a className="pill magnetic" href="#work">
            Step into my world <ArrowUpRight size={20} />
          </a>
        </div>
        <div className="hero-art-wrap">
          <img
            className="hero-art"
            src="/images/filmshero.webp"
            width="750"
            height="860"
            fetchPriority="high"
            alt="Cinema camera lit in blue and violet"
          />
        </div>
        <div className="hero-foot entrance">
          <span>PHOTOGRAPHY & FILMMAKING</span>
          <a href="#about">
            SCROLL TO FEEL <ArrowDown size={16} />
          </a>
          <span>LIGHT. FEELING. STORY.</span>
        </div>
      </div>
    </section>
  );
}
function About() {
  return (
    <section id="about" className="about section">
      <p className="eyebrow reveal">01 / THE PERSON BEHIND THE PICTURES</p>
      <div className="about-grid">
        <div>
          <h2 className="reveal">
            A little curiosity.
            <br />A different <em>perspective.</em>
          </h2>
          <p className="body-copy reveal">
            The quiet in a crowd. The light just before it disappears. The
            feeling you didn’t know could fit inside a frame.
          </p>
          <p className="body-copy reveal">
            That’s what I look for. Photography and films that bring you closer
            to the people, places, and stories that matter.
          </p>
          <a className="text-link reveal" href="#contact">
            Let’s make something meaningful <ArrowUpRight size={19} />
          </a>
        </div>
        <div className="portrait-wrap reveal">
          <img
            src="/images/imgabout22.webp"
            width="2480"
            height="2493"
            loading="lazy"
            alt="Hands holding a vintage medium-format camera"
          />
          <span className="portrait-note">Always looking a little closer.</span>
          <Aperture className="aperture" size={72} strokeWidth={1} />
        </div>
      </div>
    </section>
  );
}
export function PhotoDialog({
  index,
  onChange,
}: {
  index: number | null;
  onChange: (v: number | null) => void;
}) {
  const p = index === null ? null : photos[index];
  return (
    <Dialog
      open={index !== null}
      onOpenChange={(open) => {
        if (!open) onChange(null);
      }}
    >
      <DialogContent
        className="photo-dialog"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" && index !== null)
            onChange((index + 1) % photos.length);
          if (e.key === "ArrowLeft" && index !== null)
            onChange((index + photos.length - 1) % photos.length);
        }}
      >
        <DialogTitle>{p?.title}</DialogTitle>
        <DialogDescription>
          {p?.category} · Sample photography by {p?.credit}
        </DialogDescription>
        {p && (
          <img
            src={`/images/${p.id}-1600.webp`}
            srcSet={`/images/${p.id}-800.webp 800w, /images/${p.id}-1600.webp 1600w`}
            sizes="(max-width: 760px) 85vw, 50vw"
            alt={p.alt}
          />
        )}
        <div className="dialog-foot">
          <button
            className="round-button"
            onClick={() =>
              onChange(((index ?? 0) + photos.length - 1) % photos.length)
            }
            aria-label="Previous photograph"
          >
            <ArrowLeft />
          </button>
          <a href={p?.source} target="_blank" rel="noreferrer">
            Photo credit <ArrowUpRight size={14} />
          </a>
          <button
            className="round-button"
            onClick={() => onChange(((index ?? 0) + 1) % photos.length)}
            aria-label="Next photograph"
          >
            <ArrowRight />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
function Gallery() {
  const section = useRef<HTMLElement>(null),
    track = useRef<HTMLDivElement>(null),
    progress = useRef<HTMLDivElement>(null),
    counter = useRef<HTMLSpanElement>(null);
  const [selected, setSelected] = useState<number | null>(null);
  useEffect(() => {
    const s = section.current!,
      t = track.current!;
    const media = matchMedia(
      "(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    let distance = 0,
      raf = 0;
    const update = () => {
      raf = 0;
      if (!media.matches) return;
      const p = Math.max(
        0,
        Math.min(1, -s.getBoundingClientRect().top / distance),
      );
      t.style.transform = `translate3d(${-p * distance}px,0,0)`;
      if (progress.current) progress.current.style.transform = `scaleX(${p})`;
      if (counter.current)
        counter.current.textContent = String(
          Math.min(6, 1 + Math.floor(p * 6)),
        ).padStart(2, "0");
    };
    const resize = () => {
      distance = Math.max(1, t.scrollWidth - innerWidth);
      s.style.height = media.matches ? `${distance + innerHeight}px` : "auto";
      t.style.transform = "";
      update();
    };
    const scroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(t);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", resize);
    media.addEventListener("change", resize);
    resize();
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", resize);
      media.removeEventListener("change", resize);
    };
  }, []);
  return (
    <section ref={section} id="work" className="gallery">
      <div className="gallery-pin">
        <div className="gallery-heading">
          <div>
            <p className="eyebrow">02 / SELECTED PHOTOGRAPHY</p>
            <h2>
              Less posing.
              <br />
              <em>More feeling.</em>
            </h2>
          </div>
          <div className="gallery-aside">
            <p>
              A few frames.
              <br />A thousand little stories.
            </p>
            <a className="text-link" href="/work">
              View the collection <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
        <div ref={track} className="photo-track">
          {photos.map((p, i) => (
            <button
              className={`photo-card photo-${i}`}
              key={p.id}
              onClick={() => setSelected(i)}
              aria-label={`Open ${p.title}`}
            >
              <div className="photo-image">
                <img
                  src={`/images/${p.id}-1600.webp`}
                  srcSet={`/images/${p.id}-800.webp 800w, /images/${p.id}-1600.webp 1600w`}
                  sizes="(max-width: 760px) 85vw, 50vw"
                  alt={p.alt}
                  width="1000"
                  height="1200"
                  loading="lazy"
                />
                <span className="photo-open">
                  <ArrowUpRight size={24} />
                </span>
              </div>
              <div className="photo-caption">
                <span>
                  {p.title}
                  <small>{p.category}</small>
                </span>
                <span>{p.label}</span>
              </div>
            </button>
          ))}
        </div>
        <div className="gallery-status">
          <span className="desktop-hint">
            SCROLL TO EXPLORE <ArrowRight size={15} />
          </span>
          <span className="mobile-hint">
            SWIPE TO EXPLORE <ArrowRight size={15} />
          </span>
          <div className="gallery-progress">
            <div ref={progress} />
          </div>
          <span>
            <span ref={counter}>01</span> / 06
          </span>
        </div>
        <p className="sample-note">
          A visual moodboard · sample photographs, credited in each image.
        </p>
      </div>
      <PhotoDialog index={selected} onChange={setSelected} />
    </section>
  );
}
function Films() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <section id="films" className="films section">
      <div className="section-heading reveal">
        <div>
          <p className="eyebrow">03 / STORIES IN MOTION</p>
          <h2>
            Some stories
            <br />
            need to <em>move.</em>
          </h2>
        </div>
        <p>
          Light, sound, and everything in between.
          <br />A different way to feel the moment.
        </p>
      </div>
      <div className="film-grid">
        {films.map((f, i) => (
          <button
            className="film-card reveal"
            key={f.title}
            onClick={() => setActive(i)}
          >
            <img
              src={f.poster}
              alt={f.title}
              width="1200"
              height="800"
              loading="lazy"
            />
            <span className="play-button">
              <Play size={22} fill="currentColor" />
            </span>
            <div className="film-caption">
              <p className="eyebrow">{f.type}</p>
              <h3>{f.title}</h3>
              <span>
                FILM PREVIEW <ArrowUpRight size={16} />
              </span>
            </div>
          </button>
        ))}
      </div>
      <Dialog
        open={active !== null}
        onOpenChange={(o) => {
          if (!o) setActive(null);
        }}
      >
        <DialogContent className="film-dialog">
          <DialogTitle>
            {active !== null ? films[active].title : ""}
          </DialogTitle>
          <DialogDescription>
            {active !== null && films[active].src
              ? "A Lens Expose film."
              : "This is a preview of the film collection. The studio’s films will appear here when supplied."}
          </DialogDescription>
          {active !== null &&
            (films[active].src ? (
              <video
                src={films[active].src}
                poster={films[active].poster}
                controls
                autoPlay
                playsInline
              />
            ) : (
              <img src={films[active].poster} alt="Film collection preview" />
            ))}
        </DialogContent>
      </Dialog>
    </section>
  );
}
function Marquee() {
  const [paused, setPaused] = useState(false);
  const names = [
    "People & portraits",
    "Brands with a story",
    "Places worth feeling",
    "Moments that matter",
  ];
  return (
    <section className="collaborators">
      <div className="marquee-label">
        <p className="eyebrow">MADE FOR PEOPLE. BUILT ON CONNECTION.</p>
        <button
          className="round-button"
          aria-label={paused ? "Play marquee" : "Pause marquee"}
          onClick={() => setPaused(!paused)}
        >
          {paused ? <Play size={14} /> : <Pause size={14} />}
        </button>
      </div>
      <div className={`marquee ${paused ? "paused" : ""}`}>
        <div className="marquee-track">
          {[0, 1].map((n) => (
            <div className="marquee-group" key={n} aria-hidden={n === 1}>
              {names.map((name) => (
                <span key={name}>
                  {name}
                  <Aperture size={25} strokeWidth={1} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="sample-note">
        Client names will join this space with their permission.
      </p>
    </section>
  );
}
function Testimonials() {
  const [current, setCurrent] = useState(0),
    [paused, setPaused] = useState(false),
    [hover, setHover] = useState(false),
    [visible, setVisible] = useState(false),
    [reduced, setReduced] = useState(false);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const m = matchMedia("(prefers-reduced-motion: reduce)");
    const changed = () => setReduced(m.matches);
    changed();
    m.addEventListener("change", changed);
    const ob = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.25 },
    );
    ob.observe(ref.current!);
    return () => {
      ob.disconnect();
      m.removeEventListener("change", changed);
    };
  }, []);
  useEffect(() => {
    if (paused || hover || !visible || reduced) return;
    const timer = setInterval(
      () => setCurrent((c) => (c + 1) % testimonials.length),
      5500,
    );
    return () => clearInterval(timer);
  }, [paused, hover, visible, reduced]);
  const advance = (step: number) => {
    setCurrent((c) => (c + step + testimonials.length) % testimonials.length);
    setPaused(true);
  };
  return (
    <section
      ref={ref}
      className="testimonials section"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocusCapture={() => setHover(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHover(false);
      }}
    >
      <p className="eyebrow reveal">04 / ON THE OTHER SIDE OF THE LENS</p>
      <h2 className="reveal">
        Good stories.
        <br />
        <em>Even better connections.</em>
      </h2>
      <div className="testimonial-stage">
        {testimonials.map((q, i) => {
          const pos = (i - current + 3) % 3;
          return (
            <article
              key={q.name}
              className={`quote-card ${pos === 0 ? "center" : pos === 1 ? "right" : "left"}`}
              aria-hidden={pos !== 0}
            >
              <div className="quote-avatar">{q.initials}</div>
              <span className="quote-mark">“</span>
              <blockquote>{q.quote}</blockquote>
              <p>{q.name}</p>
              <small>{q.role}</small>
            </article>
          );
        })}
      </div>
      <div className="quote-controls">
        <button
          className="round-button"
          onClick={() => advance(-1)}
          aria-label="Previous testimonial"
        >
          <ArrowLeft size={18} />
        </button>
        {testimonials.map((_, i) => (
          <button
            className={`pagination-dot ${i === current ? "active" : ""}`}
            key={i}
            onClick={() => {
              setCurrent(i);
              setPaused(true);
            }}
            aria-label={`Show testimonial ${i + 1}`}
            aria-pressed={i === current}
          />
        ))}
        <button
          className="round-button"
          onClick={() => advance(1)}
          aria-label="Next testimonial"
        >
          <ArrowRight size={18} />
        </button>
        <button
          className="round-button"
          onClick={() => setPaused(!paused)}
          aria-label={paused ? "Play testimonials" : "Pause testimonials"}
        >
          {paused ? <Play size={15} /> : <Pause size={15} />}
        </button>
      </div>
      <p className="sample-note">
        Illustrative quotes · awaiting the studio’s client testimonials.
      </p>
    </section>
  );
}
export function Contact() {
  const [status, setStatus] = useState(""),
    [pending, setPending] = useState(false);
  return (
    <section id="contact" className="contact section">
      <div className="contact-intro reveal">
        <p className="eyebrow">05 / LET’S MAKE SOMETHING THAT MATTERS</p>
        <h2>
          Your story.
          <br />
          Our next
          <br />
          <em>great frame.</em>
        </h2>
        <p>
          Have an idea, a feeling, or just a question?
          <br />
          I’d love to hear it.
        </p>
        <div className="contact-star">
          <Aperture size={76} strokeWidth={0.8} />
        </div>
      </div>
      <form
        className="contact-form reveal"
        onSubmit={async (e) => {
          e.preventDefault();
          setPending(true);
          setStatus("");
          const form = e.currentTarget;
          const data = Object.fromEntries(new FormData(form));
          try {
            const r = await fetch("/api/contact", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            const result = (await r.json()) as { message: string };
            setStatus(result.message);
            if (r.ok) form.reset();
          } catch {
            setStatus(
              "We couldn’t send your message. Please try again. Your details are still here.",
            );
          } finally {
            setPending(false);
          }
        }}
      >
        <h3>Let’s start a conversation.</h3>
        <div className="form-row">
          <label>
            Your name
            <input
              required
              name="name"
              autoComplete="name"
              placeholder="How should I call you?"
              maxLength={100}
            />
          </label>
          <label>
            Email address
            <input
              required
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              maxLength={200}
            />
          </label>
        </div>
        <label>
          What are you dreaming of?
          <select name="project" defaultValue="">
            <option value="" disabled>
              Select a project type
            </option>
            <option>Photography</option>
            <option>Film / showreel</option>
            <option>Brand collaboration</option>
            <option>Something else</option>
          </select>
        </label>
        <label>
          A little about your idea
          <textarea
            required
            name="message"
            placeholder="The story, the place, the feeling…"
            rows={3}
            maxLength={5000}
          />
        </label>
        <label className="honeypot" aria-hidden="true">
          Leave empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
        <button className="pill magnetic" disabled={pending} type="submit">
          {pending ? "Sending…" : "Send your story"}
          <ArrowUpRight size={19} />
        </button>
        <p className="form-note">
          Your details are only used to respond to your inquiry.
        </p>
        <p className="form-status" role="status">
          {status}
        </p>
      </form>
    </section>
  );
}
export function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <a className="wordmark" href="/">
          lens<span>expose</span>
          <i>®</i>
        </a>
        <p>For the moments that deserve to stay.</p>
        <div className="footer-links">
          <a href="/work">Work</a>
          <a href="/journal">Journal & social</a>
          <a href="/#contact">Contact</a>
          {studio.instagram && <a href={studio.instagram}>Instagram</a>}
          {studio.twitter && <a href={studio.twitter}>X / Twitter</a>}
          {studio.vimeo && <a href={studio.vimeo}>Vimeo</a>}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Lens Expose</span>
        <span>MADE WITH INTENTION.</span>
        <a href="#main">Back to top ↑</a>
      </div>
    </footer>
  );
}
export function Portfolio() {
  return (
    <>
      <Navigation />
      <main id="main">
        <Hero />
        <About />
        <Gallery />
        <Films />
        <Marquee />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <Motion />
    </>
  );
}
export function WorkPage() {
  const [filter, setFilter] = useState("All"),
    [selected, setSelected] = useState<number | null>(null);
  return (
    <>
      <Navigation inner />
      <main id="main" className="archive section">
        <p className="eyebrow">THE COLLECTION / PHOTOGRAPHY</p>
        <h1>
          Look a little <em>closer.</em>
        </h1>
        <div className="archive-top">
          <p>People, places, and everything that happens between.</p>
          <span>06 FRAMES / A VISUAL MOODBOARD</span>
        </div>
        <div className="filters" role="group" aria-label="Filter photographs">
          {["All", ...photos.map((p) => p.category)].map((c) => (
            <button
              key={c}
              aria-pressed={filter === c}
              className={filter === c ? "active" : ""}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="archive-grid">
          {photos.map((p, i) =>
            filter === "All" || p.category === filter ? (
              <button
                className="photo-card"
                key={p.id}
                onClick={() => {
                  setSelected(i);
                  history.replaceState(null, "", `/work?photo=${p.id}`);
                }}
              >
                <div className="photo-image">
                  <img
                    src={`/images/${p.id}-1600.webp`}
                    srcSet={`/images/${p.id}-800.webp 800w, /images/${p.id}-1600.webp 1600w`}
                    sizes="(max-width: 760px) 85vw, 50vw"
                    alt={p.alt}
                    width="1000"
                    height="1200"
                    loading="lazy"
                  />
                  <span className="photo-open">
                    <ArrowUpRight />
                  </span>
                </div>
                <div className="photo-caption">
                  <span>
                    {p.title}
                    <small>
                      {p.category} · {p.credit}
                    </small>
                  </span>
                  <span>{p.label}</span>
                </div>
              </button>
            ) : null,
          )}
        </div>
        <p className="sample-note">
          Sample photographs by the credited Pexels contributors. The studio’s
          work will replace this moodboard.
        </p>
        <a className="text-link" href="/#films">
          Explore films <ArrowUpRight size={18} />
        </a>
        <WorkDeepLink onChange={setSelected} />
        <PhotoDialog
          index={selected}
          onChange={(i) => {
            setSelected(i);
            history.replaceState(
              null,
              "",
              i === null ? "/work" : `/work?photo=${photos[i].id}`,
            );
          }}
        />
      </main>
      <Footer />
      <Motion />
    </>
  );
}
function WorkDeepLink({ onChange }: { onChange: (n: number) => void }) {
  useEffect(() => {
    const id = new URLSearchParams(location.search).get("photo");
    const index = photos.findIndex((p) => p.id === id);
    if (index >= 0) onChange(index);
  }, [onChange]);
  return null;
}
export function JournalPage() {
  const [state, setState] = useState("loading"),
    [feed, setFeed] = useState<
      {
        id: string;
        media_url: string;
        permalink: string;
        caption?: string;
        media_type?: string;
        thumbnail_url?: string;
      }[]
    >([]);
  useEffect(() => {
    let active = true;
    fetch("/api/social")
      .then(
        (r) =>
          r.json() as Promise<{
            data?: {
              id: string;
              media_url: string;
              permalink: string;
              caption?: string;
              media_type?: string;
              thumbnail_url?: string;
            }[];
            status?: string;
          }>,
      )
      .then((r) => {
        if (!active) return;
        setFeed(r.data || []);
        setState(r.status || "ready");
      })
      .catch(() => {
        if (active) setState("error");
      });
    return () => {
      active = false;
    };
  }, []);
  return (
    <>
      <Navigation inner />
      <main id="main" className="journal section">
        <p className="eyebrow">OFF THE CONTACT SHEET</p>
        <h1>
          A glimpse
          <br />
          <em>in between.</em>
        </h1>
        <p className="journal-intro">
          Works in progress. Everyday discoveries.
          <br />
          Stories that don’t always make the final edit.
        </p>
        <div className="social-banner">
          <Camera size={28} />
          <div>
            <h3>The Instagram journal</h3>
            <p>
              {state === "loading"
                ? "Loading the latest moments…"
                : state === "unconfigured"
                  ? "The studio’s Instagram feed is not connected yet."
                  : state === "error"
                    ? "The feed is taking a moment. Please check back soon."
                    : feed.length
                      ? "Recent moments from the studio."
                      : "New moments will appear here soon."}
            </p>
          </div>
          {studio.instagram && (
            <a
              className="pill"
              href={studio.instagram}
              target="_blank"
              rel="noreferrer"
            >
              Follow along <ArrowUpRight size={18} />
            </a>
          )}
        </div>
        {feed.length > 0 ? (
          <div className="social-grid">
            {feed.map((post) => (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={
                    post.media_type === "VIDEO"
                      ? post.thumbnail_url
                      : post.media_url
                  }
                  alt={post.caption?.slice(0, 180) || "Instagram post"}
                  loading="lazy"
                />
                <p>{post.caption?.slice(0, 140)}</p>
              </a>
            ))}
          </div>
        ) : (
          <div className="journal-placeholder">
            <Aperture size={50} strokeWidth={1} />
            <p>Still looking. Always creating.</p>
            <a className="text-link" href="/work">
              Explore the visual moodboard <ArrowUpRight size={18} />
            </a>
          </div>
        )}
      </main>
      <Footer />
      <Motion />
    </>
  );
}
