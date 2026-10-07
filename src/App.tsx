import { useEffect, useState, type FormEvent } from "react";
import "./App.css";

type Theme = "dark" | "light";

type Toast = {
  type: "success" | "error";
  message: string;
} | null;

type ContactResponse = {
  success?: boolean;
  message?: string;
  code?: string;
  enquiryId?: string;
};

const EXPERIENCE_LOGOS = [
  { src: "/images/experience-logos/fugo.png", alt: "FUGO Hotel Banjarmasin", size: "wide" },
  { src: "/images/experience-logos/cocana.png", alt: "Cocana Resort", size: "tall" },
  { src: "/images/experience-logos/australian-venue-co.png", alt: "Australian Venue Co.", size: "wide" },
  { src: "/images/experience-logos/ennismore.png", alt: "Ennismore", size: "wide" },
  { src: "/images/experience-logos/accor.png", alt: "Accor", size: "tall" },
  { src: "/images/experience-logos/pullman.png", alt: "Pullman Hotels & Resorts", size: "wide" },
  { src: "/images/experience-logos/novotel.png", alt: "Novotel Hotels & Resorts", size: "wide" },
  { src: "/images/experience-logos/mercure.png", alt: "Mercure Hotels", size: "wide" },
  { src: "/images/experience-logos/marriott-international.png", alt: "Marriott International", size: "wide" },
  { src: "/images/experience-logos/w-hotels.png", alt: "W Hotels", size: "tall" },
  { src: "/images/experience-logos/ihg.png", alt: "InterContinental Hotels Group", size: "wide" },
  { src: "/images/experience-logos/crowne-plaza.png", alt: "Crowne Plaza Hotels & Resorts", size: "wide" },
  { src: "/images/experience-logos/best-western.png", alt: "Best Western Hotels & Resorts", size: "wide" },
  { src: "/images/experience-logos/worldskills.png", alt: "WorldSkills", size: "wide" },
  { src: "/images/experience-logos/kemnaker.png", alt: "Kementerian Ketenagakerjaan Republik Indonesia", size: "wide" },
] as const;

function App() {
  /* =========================================================
     THEME
  ========================================================= */

  const [theme, setTheme] = useState<Theme>("dark");

  /* =========================================================
     MOBILE MENU
  ========================================================= */

  const [menuOpen, setMenuOpen] = useState(false);

  /* =========================================================
     CONTACT FORM
  ========================================================= */

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  const currentYear = new Date().getFullYear();

  /* =========================================================
     APPLY THEME
  ========================================================= */

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  /* =========================================================
     SCROLL TO CONTACT WHEN OPENING /#contact
  ========================================================= */

  useEffect(() => {
    if (window.location.hash !== "#contact") {
      return;
    }

    const timer = window.setTimeout(() => {
      const contactSection = document.getElementById("contact");

      if (contactSection) {
        contactSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  /* =========================================================
     MOBILE MENU SCROLL LOCK
  ========================================================= */

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /* =========================================================
     ESCAPE CLOSES MOBILE MENU
  ========================================================= */

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /* =========================================================
     CLOSE MOBILE MENU ON DESKTOP
  ========================================================= */

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* =========================================================
     AUTO-CLOSE NOTIFICATION
  ========================================================= */

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 5000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toast]);

  /* =========================================================
     THEME TOGGLE
  ========================================================= */

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  /* =========================================================
     MOBILE MENU
  ========================================================= */

  const toggleMenu = () => {
    setMenuOpen((currentState) => !currentState);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  /* =========================================================
     CONTACT FORM SUBMISSION
  ========================================================= */

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const form = event.currentTarget;

    /*
      Use the browser's built-in validation before contacting
      the Worker.
    */
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      company: String(formData.get("company") ?? "").trim(),
      service: String(formData.get("service") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),

      /*
        Hidden anti-spam honeypot.
        A normal visitor should never interact with this field.
      */
      hp_field: String(formData.get("hp_field") ?? "").trim(),
    };

    setIsSubmitting(true);
    setToast(null);

    /*
      Prevent the UI from staying on "Sending..." forever if
      the network becomes unavailable.
    */
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      controller.abort();
    }, 15000);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      let result: ContactResponse;

      try {
        result = (await response.json()) as ContactResponse;
      } catch {
        throw new Error(
          "The server returned an invalid response. Please try again.",
        );
      }

      /*
        A green success notification is shown ONLY when the
        Worker confirms success.

        For example, if Supabase saves the enquiry but Resend
        fails, the Worker returns success: false and the form
        stays filled so the visitor can retry later.
      */
      if (!response.ok || result.success !== true) {
        if (result.code === "RESEND_SENDER_UNAUTHORIZED") {
          throw new Error(
            result.message ||
              "Your enquiry was saved, but the email service is not authorized for the sender domain.",
          );
        }

        if (result.code === "EMAIL_SEND_FAILED") {
          throw new Error(
            result.message ||
              "Your enquiry was saved, but the email notification could not be sent.",
          );
        }

        throw new Error(
          result.message || "Your message could not be sent. Please try again.",
        );
      }

      /*
        Only clear the form after the Worker confirms that the
        complete contact flow succeeded.
      */
      form.reset();

      setToast({
        type: "success",
        message: result.message || "Your message has been sent successfully.",
      });
    } catch (error) {
      let message = "Your message could not be sent. Please try again.";

      if (error instanceof DOMException && error.name === "AbortError") {
        message =
          "The request took too long. Please check your connection and try again.";
      } else if (error instanceof Error) {
        message = error.message;
      }

      setToast({
        type: "error",
        message,
      });
    } finally {
      window.clearTimeout(timeout);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="site">
      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <header className="navbar">
        <a href="#top" className="brand" onClick={closeMenu}>
          PANBRAMSYAH
        </a>

        <div className="nav-right">
          <nav className="nav-links" aria-label="Main navigation">
            <a href="#about">About</a>
            <a href="#services">Expertise</a>
            <a href="#work">Work</a>
            <a href="#experience">Experience</a>
            <a href="#contact">Contact</a>
          </nav>

          {/* THEME */}

          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            <span className="theme-dot" />

            <span className="theme-text">
              {theme === "dark" ? "Light" : "Dark"}
            </span>
          </button>

          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
            onClick={toggleMenu}
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* =====================================================
          MOBILE NAVIGATION
      ====================================================== */}

      <div
        id="mobile-navigation"
        className={`mobile-menu ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="mobile-menu-inner">
          <nav className="mobile-nav-links" aria-label="Mobile navigation">
            <a href="#about" onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>
              <span>01</span>
              <strong>About</strong>
              <span>↗</span>
            </a>

            <a
              href="#services"
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
            >
              <span>02</span>
              <strong>Expertise</strong>
              <span>↗</span>
            </a>

            <a href="#work" onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>
              <span>03</span>
              <strong>Selected Work</strong>
              <span>↗</span>
            </a>

            <a
              href="#experience"
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
            >
              <span>04</span>
              <strong>Experience</strong>
              <span>↗</span>
            </a>

            <a href="#contact" onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>
              <span>05</span>
              <strong>Contact</strong>
              <span>↗</span>
            </a>
          </nav>

          <div className="mobile-menu-footer">
            <div>
              <span>Professional Chef | </span>
              <span>Private Chef | </span>
              <span>Culinary Consultant</span>
            </div>

            <p>PANBRAMSYAH</p>
          </div>
        </div>
      </div>

      <main>
        {/* =====================================================
            HERO
        ====================================================== */}

        <section id="top" className="hero">
          <div className="hero-copy">
            <p className="eyebrow">
              Professional Chef | Private Chef | Culinary Consultant
            </p>

            <h1>
              Crafted in the kitchen.
              <br />
              Shaped by experience.
            </h1>

            <p className="hero-description">
              Helping restaurants and F&amp;B businesses transform culinary
              ideas into thoughtful menus, stronger kitchen systems, and
              concepts that work in the real world.
            </p>

            <div className="hero-actions">
              <a href="#work" className="button button-primary">
                <span>Selected Work</span>
                <span>↘</span>
              </a>

              <a href="#contact" className="text-link">
                <span>Work With Me</span>
                <span>↗</span>
              </a>
            </div>

            <div className="hero-note">
              <span>Menu Development</span>
              <span>Culinary Consulting</span>
              <span>Culinary Mentoring</span>
            </div>
          </div>

          <figure className="hero-visual">
            <div className="hero-image">
              <img
                src="/images/work/hero-chef.JPG"
                alt="Culinary Professional"
              />
            </div>

            <figcaption>
              <span>Culinary Professional</span>
              {/* <span>01 / 03</span> */}
            </figcaption>
          </figure>
        </section>

        {/* =====================================================
            ABOUT
        ====================================================== */}

        <section id="about" className="about-section">
          <div className="section-label">
            <span>01</span>
            <span>About</span>
          </div>

          <div className="about-content">
            <div>
              <h2 className="about-intro">
                More than a decade of experience across professional kitchens
                and international hospitality.
              </h2>
            </div>

            <div className="about-copy">
              <p>
                I am a professional chef with more than 10 years of experience
                in the food and beverage industry, including international
                experience within a global hotel environment.
              </p>

              <p>
                Today, I combine culinary experience with practical business
                thinking to help restaurants and F&amp;B businesses develop
                stronger concepts, better menus, and more effective kitchen
                operations.
              </p>
            </div>
          </div>

          <div className="about-stats">
            <div className="stat">
              <strong>10+</strong>
              <span>Years of experience</span>
            </div>

            <div className="stat">
              <strong>International</strong>
              <span>Hospitality experience</span>
            </div>

            <div className="stat">
              <strong>End-to-End</strong>
              <span>Culinary development</span>
            </div>
          </div>
        </section>

        {/* =====================================================
            EXPERTISE
        ====================================================== */}

        <section id="services" className="services-section">
          <div className="section-label">
            <span>02</span>
            <span>Expertise</span>
          </div>

          <div className="services-heading">
            <p className="services-kicker">What I Do</p>

            <h2>
              Culinary knowledge
              <br />
              built for the real world.
            </h2>
          </div>

          <div className="services-list">
            <div className="service-item">
              <span className="service-number">01</span>

              <div className="service-content">
                <h3>Menu Development</h3>

                <p>
                  Thoughtful menu creation built around concept, identity,
                  operational practicality, profitability, and guest experience.
                </p>
              </div>

              <span className="service-arrow">↗</span>
            </div>

            <div className="service-item">
              <span className="service-number">02</span>

              <div className="service-content">
                <h3>F&amp;B Consulting</h3>

                <p>
                  Practical culinary guidance for restaurants, cafés, hotels,
                  and new food and beverage concepts.
                </p>
              </div>

              <span className="service-arrow">↗</span>
            </div>

            <div className="service-item">
              <span className="service-number">03</span>

              <div className="service-content">
                <h3>Culinary Mentoring</h3>

                <p>
                  Professional guidance for chefs and culinary teams looking to
                  strengthen skills, standards, and kitchen leadership.
                </p>
              </div>

              <span className="service-arrow">↗</span>
            </div>

            <div className="service-item">
              <span className="service-number">04</span>

              <div className="service-content">
                <h3>Kitchen Operations</h3>

                <p>
                  Improving kitchen systems, workflow, consistency, food safety,
                  organization, and operational standards.
                </p>
              </div>

              <span className="service-arrow">↗</span>
            </div>
          </div>
        </section>

        {/* =====================================================
            SELECTED WORK
        ====================================================== */}

        <section id="work" className="work-section">
          <div className="section-heading-row">
            <div className="section-label">
              <span>03</span>
              <span>Selected Work</span>
            </div>

            <p>
              A selection of culinary development, concepts, and operational
              work.
            </p>
          </div>

          <div className="work-grid">
            {/* PROJECT 01 */}

            <a
              href="/work/culinary-development"
              className="work-card work-card-large work-card-link"
              aria-label="View Culinary Development case study"
            >
              <div className="work-image">
                <img
                  src="/images/work/project-01.png"
                  alt="Culinary development project"
                />
              </div>

              <div className="work-meta">
                <div>
                  <span className="work-index">01</span>

                  <h3>Culinary Development</h3>

                  <p>Menu Development · Plating · Concept</p>
                </div>

                <span className="work-link">View Project ↗</span>
              </div>
            </a>

            {/* PROJECT 02 */}

            <a
              href="/work/restaurant-concept"
              className="work-card work-card-link"
              aria-label="View Restaurant Concept case study"
            >
              <div className="work-image">
                <img
                  src="/images/work/project-02.png"
                  alt="Restaurant concept project"
                />
              </div>

              <div className="work-meta">
                <div>
                  <span className="work-index">02</span>

                  <h3>Restaurant Concept</h3>

                  <p>F&amp;B Consulting · Menu Strategy</p>
                </div>

                <span className="work-link">View Project ↗</span>
              </div>
            </a>

            {/* PROJECT 03 */}

            <a
              href="/work/kitchen-standards"
              className="work-card work-card-link"
              aria-label="View Kitchen Standards case study"
            >
              <div className="work-image">
                <img
                  src="/images/work/project-03.png"
                  alt="Kitchen operations project"
                />
              </div>

              <div className="work-meta">
                <div>
                  <span className="work-index">03</span>

                  <h3>Kitchen Standards</h3>

                  <p>Operations · Systems · Food Safety</p>
                </div>

                <span className="work-link">View Project ↗</span>
              </div>
            </a>
          </div>
        </section>

        {/* =====================================================
            EXPERIENCE
        ====================================================== */}

        <section id="experience" className="experience-section">
          <div className="section-label">
            <span>04</span>
            <span>Experience</span>
          </div>

          <div className="experience-heading">
            <h2>
              Experience shaped
              <br />
              across professional kitchens.
            </h2>
          </div>

          <div className="experience-list">
            <a
              href="/experience/professional-chef"
              className="experience-item experience-item-link"
              aria-label="View full professional chef career"
            >
              <div className="experience-number">01</div>

              <div className="experience-role">
                <h3>Professional Chef</h3>
                <p>International Hospitality</p>
              </div>

              <div className="experience-details">
                <p>
                  More than 10 years of experience across professional kitchens,
                  hotel operations, menu development, culinary leadership, and
                  day-to-day kitchen management.
                </p>

                <span className="experience-view">View Full Career ↗</span>
              </div>
            </a>

            <div className="experience-item">
              <div className="experience-number">02</div>

              <div className="experience-role">
                <h3>International Experience</h3>

                <p>Global Hotel Environment</p>
              </div>

              <div className="experience-details">
                <p>
                  Experience working overseas within an international hotel
                  environment, adapting to different teams, standards, cultures,
                  and operational expectations.
                </p>
              </div>
            </div>

            <div className="experience-item">
              <div className="experience-number">03</div>

              <div className="experience-role">
                <h3>F&amp;B Development</h3>

                <p>Consulting &amp; Culinary Support</p>
              </div>

              <div className="experience-details">
                <p>
                  Supporting food and beverage concepts through practical menu
                  development, kitchen systems, food safety standards,
                  mentoring, and operational improvement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CONTACT
        ====================================================== */}

        <section id="contact" className="contact-section">
          <div className="section-label">
            <span>05</span>
            <span>Contact</span>
          </div>

          <div className="contact-layout">
            <div className="contact-intro">
              <p className="contact-kicker">Work With Me</p>

              <h2>
                Let's create
                <br />
                something considered.
              </h2>

              <p className="contact-description">
                Whether you are developing a new F&amp;B concept, improving an
                existing operation, or looking for culinary guidance, tell me
                about your project.
              </p>

              <div className="contact-services">
                <span>Menu Development</span>
                <span>F&amp;B Consulting</span>
                <span>Culinary Mentoring</span>
                <span>Kitchen Operations</span>
              </div>
            </div>

            {/* =================================================
                REAL CONTACT FORM
            ================================================= */}

            <form
              className="contact-form"
              onSubmit={handleContactSubmit}
              aria-busy={isSubmitting}
            >
              {/* HONEYPOT / ANTI-SPAM */}

              <div className="honeypot-field" aria-hidden="true">
                <label htmlFor="hp_field">Leave this field empty</label>

                <input
                  id="hp_field"
                  name="hp_field"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  data-lpignore="true"
                  data-1p-ignore="true"
                />
              </div>

              {/* NAME */}

              <div className="form-group">
                <label htmlFor="name">Name</label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  autoComplete="name"
                  minLength={2}
                  maxLength={100}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* EMAIL */}

              <div className="form-group">
                <label htmlFor="email">Email</label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  maxLength={254}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* COMPANY */}

              <div className="form-group">
                <label htmlFor="company">Company / Restaurant</label>

                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Optional"
                  autoComplete="organization"
                  maxLength={150}
                  disabled={isSubmitting}
                />
              </div>

              {/* SERVICE */}

              <div className="form-group">
                <label htmlFor="service">I'm interested in</label>

                <select
                  id="service"
                  name="service"
                  defaultValue=""
                  required
                  disabled={isSubmitting}
                >
                  <option value="" disabled>
                    Select a service
                  </option>

                  <option value="menu-development">Menu Development</option>

                  <option value="consulting">F&amp;B Consulting</option>

                  <option value="mentoring">Culinary Mentoring</option>

                  <option value="operations">Kitchen Operations</option>

                  <option value="private-dining">Private Dining</option>

                  <option value="other">Other</option>
                </select>
              </div>

              {/* MESSAGE */}

              <div className="form-group">
                <label htmlFor="message">Tell me about your project</label>

                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell me a little about what you are working on..."
                  minLength={10}
                  maxLength={5000}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? "Sending..." : "Send Enquiry"}</span>

                <span>{isSubmitting ? "···" : "↗"}</span>
              </button>

              <p className="form-note">
                Your information will only be used to respond to your enquiry.
              </p>
            </form>
          </div>
        </section>
      </main>


      {/* =====================================================
          PROFESSIONAL EXPERIENCE LOGO MARQUEE
      ====================================================== */}

      <section
        className="brand-marquee-section"
        aria-labelledby="brand-marquee-title"
      >
        <div className="brand-marquee-heading">
          <div>
            <p className="brand-marquee-kicker">Professional Experience</p>
            <h2 id="brand-marquee-title">
              Hospitality brands &amp; professional environments
            </h2>
          </div>

          <p>
            Selected organizations and hospitality brands that have shaped my
            culinary career.
          </p>
        </div>

        <div className="brand-marquee" aria-label="Professional experience logos">
          <div className="brand-marquee-track">
            {[0, 1, 2].map((groupIndex) => (
              <div
                className="brand-marquee-group"
                key={`brand-group-${groupIndex}`}
                aria-hidden={groupIndex === 0 ? undefined : true}
              >
                {EXPERIENCE_LOGOS.map((logo) => (
                  <div
                    className="brand-logo-item"
                    key={`${groupIndex}-${logo.src}`}
                  >
                    <img
                      src={logo.src}
                      alt={groupIndex === 0 ? logo.alt : ""}
                      className={`brand-logo brand-logo--${logo.size}`}
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="footer">
        <div className="footer-brand">
          <span>PANBRAMSYAH</span>

          <p>Professional Chef | Private Chef | Culinary Consultant</p>
        </div>

        <div className="footer-links">
          <a href="#top">Back to top ↑</a>
        </div>

        <p className="copyright">© {currentYear} PANBRAMSYAH</p>
      </footer>

      {/* =====================================================
          POP-UP NOTIFICATION
      ====================================================== */}

      {toast && (
        <div
          className={`toast-notification ${
            toast.type === "success" ? "toast-success" : "toast-error"
          }`}
          role={toast.type === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          <div className="toast-icon">
            {toast.type === "success" ? "✓" : "!"}
          </div>

          <div className="toast-content">
            <strong>
              {toast.type === "success" ? "Message sent" : "Unable to send"}
            </strong>

            <p>{toast.message}</p>
          </div>

          <button
            type="button"
            className="toast-close"
            onClick={() => setToast(null)}
            aria-label="Close notification"
          ></button>
        </div>
      )}
    </div>
  );
}

export default App;
