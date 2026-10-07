import { useEffect, useState } from "react";

type Theme = "dark" | "light";

type CareerEntry = {
  period: string;
  role: string;
  company: string;
  location: string;
  summary: string;
  progression?: string;
  milestone?: string;
};

const careerEntries: CareerEntry[] = [
  {
    period: "Jun 2026 — Present",
    role: "Sous Chef",
    company: "FUGO Hotels & Resorts",
    location: "Banjarmasin, Indonesia",
    summary:
      "Directing daily kitchen operations across multiple outlets, standardizing workflows and station allocation, coaching teams, developing and engineering menus, and overseeing inventory, yield, waste control, and HACCP compliance.",
  },
  {
    period: "May 2026 — Jun 2026",
    role: "Junior Sous Chef",
    company: "Cocana Resorts",
    location: "Lombok, Indonesia",
    summary:
      "Supported executive kitchen leadership through line supervision, station planning, quality control, inventory and food-cost support, menu testing, and rigorous food-safety standards during high-volume service.",
  },
  {
    period: "Oct 2025 — Mar 2026",
    role: "Co-Founder",
    company: "Nasi Campur Mama Eter",
    location: "Banjarmasin, Indonesia",
    summary:
      "Co-founded and operated a home-based culinary business covering menu creation, daily production, quality and food safety, packaging, inventory, delivery coordination, and social-media-led customer growth.",
  },
  {
    period: "Aug 2023 — Jul 2025",
    role: "Chef de Partie",
    company: "Australian Venue Co.",
    location: "Queensland, Australia",
    summary:
      "Delivered consistent food quality and timely service while working to legislative and company standards across food safety, hygiene, stock handling, temperature controls, cleaning systems, and venue operations.",
  },
  {
    period: "Oct 2021 — Jul 2023",
    role: "Chef de Partie",
    company: "25hours Hotel One Central",
    location: "Dubai, United Arab Emirates",
    progression: "Commis I → Demi Chef de Partie → Chef de Partie",
    summary:
      "Progressed through three kitchen roles within the same property, taking on increasing responsibility for mise en place, production, section leadership, buffet and special-function supervision, training, quality consistency, cleanliness, waste, and cost control.",
  },
  {
    period: "Jan 2021 — Oct 2021",
    role: "Co-Owner",
    company: "Brother AST — Coffee & Roastery",
    location: "Banjarmasin, Indonesia",
    summary:
      "Worked across market analysis, menu development, recipe cards, food costing, selling-price decisions, SOP development, staff training, team building, service standards, quality, cost, losses, breakages, and cleanliness.",
  },
  {
    period: "Dec 2019 — Nov 2020",
    role: "Commis I",
    company: "Crowne Plaza Riyadh RDC Hotel & Convention Center",
    location: "Riyadh, Saudi Arabia",
    summary:
      "Handled day-to-day mise en place across cold and dessert sections while maintaining hygienic work areas, participating in kitchen briefings, and supporting training and effective team collaboration.",
  },
  {
    period: "Mar 2019 — Jun 2019",
    role: "Commis I",
    company: "W Hotels",
    location: "Muscat, Oman",
    summary:
      "Supported the Sous Chef and Chef de Partie with production to recipe and property standards, daily function planning, portion and quality control, spoilage reduction, sanitation, market lists, and store requisitions.",
  },
  {
    period: "Apr 2018 — Jan 2019",
    role: "Commis II",
    company: "Best Western Hotels & Resorts",
    location: "Banjarmasin, Indonesia",
    summary:
      "Supported daily kitchen operations across breakfast, lunch, dinner, à la carte, in-room dining, and banquets while monitoring food quality, food and equipment temperatures, and hygienic working conditions.",
  },
  {
    period: "Nov 2016 — May 2017",
    role: "Line Cook · Internship",
    company: "Pullman Hotels & Resorts",
    location: "Kuala Lumpur, Malaysia",
    summary:
      "Prepared ingredients, supported food production, checked preparation and temperature, assisted buffet setup and presentation, and applied HACCP procedures throughout daily kitchen operations.",
  },
  {
    period: "Oct 2013 — Oct 2014",
    role: "Training Center",
    company: "WorldSkills International",
    location: "Jakarta, Indonesia · Hanoi, Vietnam",
    milestone: "Indonesian Representative — ASEAN Skills Competition X",
    summary:
      "Trained across hygiene and sanitation, food commodities, receiving and handling ingredients, core cooking methods, market lists, recipe development, and practical competition modules before representing Indonesia in Hanoi.",
  },
  {
    period: "May 2013 — Oct 2013",
    role: "Commis III",
    company: "Novotel Hotels",
    location: "Banjarbaru, Indonesia",
    summary:
      "Built early professional-kitchen foundations through ingredient preparation, portioning, chopping, storage, and disciplined cleaning and sanitation of kitchen areas, tools, knives, and equipment.",
  },
  {
    period: "Jan 2012 — May 2012",
    role: "Trainee · Internship",
    company: "Mercure Hotels",
    location: "Banjarmasin, Indonesia",
    summary:
      "Worked under Chef de Partie guidance on kitchen cleanliness, breakfast and à la carte preparation, banquet production, buffet setup, and service support.",
  },
];

function ProfessionalChef() {
  const [theme, setTheme] = useState<Theme>("dark");
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Professional Chef Experience — PANBRAMSYAH";

    window.scrollTo(0, 0);

    return () => {
      document.title = previousTitle;
    };
  }, []);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  return (
    <div className="site career-page">
      <header className="navbar career-navbar">
        <a href="/" className="brand" aria-label="PANBRAMSYAH home">
          PANBRAMSYAH
        </a>

        <div className="career-navbar-actions">
          <a href="/#experience" className="career-back-link">
            <span>←</span>
            <span>Portfolio</span>
          </a>

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
        </div>
      </header>

      <main>
        <section className="career-hero">
          <div className="career-hero-grid">
            <div className="career-hero-copy">
              <p className="career-kicker">
                Professional Chef · Culinary Operations Leader
              </p>

              <h1>
                Built through service.
                <br />
                Refined across borders.
              </h1>

              <p className="career-hero-description">
                A culinary career shaped through professional kitchens,
                international hospitality, entrepreneurship, operational
                leadership, and a continued focus on standards that work in the
                real world.
              </p>

              <div className="career-hero-actions">
                <a href="#journey" className="button button-primary">
                  <span>View Career Journey</span>
                  <span>↓</span>
                </a>

                <a href="/#contact" className="text-link">
                  <span>Work With Me</span>
                  <span>↗</span>
                </a>
              </div>
            </div>

            <figure className="career-portrait">
              <div className="career-portrait-image">
                <img
                  src="/images/work/hero-chef.JPG"
                  alt="PANBRAMSYAH, professional chef and culinary consultant"
                />
              </div>

              <figcaption>
                <span>Professional Chef</span>
                <span>Indonesia · International</span>
              </figcaption>
            </figure>
          </div>

          <div className="career-stats" aria-label="Career summary">
            <div className="career-stat">
              <strong>10+</strong>
              <span>Years of experience</span>
            </div>

            <div className="career-stat">
              <strong>6</strong>
              <span>Countries of professional experience</span>
            </div>

            <div className="career-stat">
              <strong>2012</strong>
              <span>Professional journey began</span>
            </div>

            <div className="career-stat">
              <strong>Sous Chef</strong>
              <span>Current role</span>
            </div>
          </div>
        </section>

        <section id="journey" className="career-section career-journey-section">
          <div className="career-section-heading">
            <div className="section-label">
              <span>01</span>
              <span>Career Journey</span>
            </div>

            <div>
              <p className="career-section-kicker">From foundation to leadership</p>

              <h2>
                A career built one
                <br />
                kitchen at a time.
              </h2>
            </div>
          </div>

          <div className="career-timeline">
            {careerEntries.map((entry, index) => (
              <article
                className={`career-entry ${entry.milestone ? "career-entry-milestone" : ""}`}
                key={`${entry.company}-${entry.period}`}
              >
                <div className="career-entry-period">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{entry.period}</p>
                </div>

                <div className="career-entry-main">
                  {entry.milestone && (
                    <span className="career-milestone-label">Career Milestone</span>
                  )}

                  <h3>{entry.role}</h3>
                  <p className="career-company">{entry.company}</p>
                  <p className="career-location">{entry.location}</p>

                  {entry.progression && (
                    <p className="career-progression">{entry.progression}</p>
                  )}

                  {entry.milestone && (
                    <p className="career-milestone-title">{entry.milestone}</p>
                  )}
                </div>

                <div className="career-entry-copy">
                  <p>{entry.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="career-section">
          <div className="career-section-heading">
            <div className="section-label">
              <span>02</span>
              <span>International Experience</span>
            </div>

            <div>
              <p className="career-section-kicker">Across markets and cultures</p>

              <h2>
                Standards travel.
                <br />
                Context changes.
              </h2>
            </div>
          </div>

          <div className="career-international-grid">
            <div className="career-international-copy">
              <p>
                Professional experience across Indonesia, Malaysia, Oman, Saudi
                Arabia, the United Arab Emirates, and Australia has shaped an
                approach grounded in adaptability, consistency, communication,
                and respect for different operational environments.
              </p>

              <p>
                The work has ranged from hotel kitchens and convention
                operations to high-volume venues, resort environments, and
                independently operated F&amp;B businesses.
              </p>
            </div>

            <div className="career-country-list" aria-label="Countries worked in">
              <span>Indonesia</span>
              <span>Malaysia</span>
              <span>Oman</span>
              <span>Saudi Arabia</span>
              <span>United Arab Emirates</span>
              <span>Australia</span>
            </div>
          </div>
        </section>

        <section className="career-section career-capabilities-section">
          <div className="career-section-heading">
            <div className="section-label">
              <span>03</span>
              <span>Professional Practice</span>
            </div>

            <div>
              <p className="career-section-kicker">Beyond cooking</p>

              <h2>
                Culinary judgment backed
                <br />
                by operational discipline.
              </h2>
            </div>
          </div>

          <div className="career-capability-grid">
            <article className="career-capability-card">
              <span>01</span>
              <h3>Kitchen Leadership</h3>
              <p>
                Multi-outlet operations, station planning, service execution,
                pass and section leadership, team supervision, coaching, and
                day-to-day training.
              </p>
            </article>

            <article className="career-capability-card">
              <span>02</span>
              <h3>Menu &amp; Commercial Thinking</h3>
              <p>
                Menu development, menu engineering, standardized recipes,
                costing, selling-price decisions, seasonal promotions, and
                balancing product quality with commercial performance.
              </p>
            </article>

            <article className="career-capability-card">
              <span>03</span>
              <h3>Operational Control</h3>
              <p>
                Inventory, yield testing, ordering, prep tracking, waste
                control, stock handling, workflow standardization, and SOP
                development.
              </p>
            </article>

            <article className="career-capability-card">
              <span>04</span>
              <h3>Food Safety &amp; Standards</h3>
              <p>
                HACCP procedures, temperature controls, food handling and
                storage, sanitation, cleaning schedules, kitchen hygiene, and
                consistent quality standards.
              </p>
            </article>
          </div>
        </section>

        <section className="career-section">
          <div className="career-section-heading">
            <div className="section-label">
              <span>04</span>
              <span>Career Highlights</span>
            </div>

            <div>
              <p className="career-section-kicker">Selected milestones</p>

              <h2>
                Progress measured
                <br />
                through responsibility.
              </h2>
            </div>
          </div>

          <div className="career-highlight-grid">
            <article className="career-highlight-card">
              <span>WorldSkills</span>
              <h3>Represented Indonesia</h3>
              <p>
                Selected as an Indonesian representative for ASEAN Skills
                Competition X in Hanoi, Vietnam following dedicated professional
                training.
              </p>
            </article>

            <article className="career-highlight-card">
              <span>25hours Hotel One Central</span>
              <h3>Internal progression</h3>
              <p>
                Progressed from Commis I to Demi Chef de Partie and then Chef de
                Partie within the same international hotel property in Dubai.
              </p>
            </article>

            <article className="career-highlight-card">
              <span>Entrepreneurship</span>
              <h3>Built beyond hotel kitchens</h3>
              <p>
                Co-owned Brother AST — Coffee &amp; Roastery and later co-founded
                Nasi Campur Mama Eter, building hands-on experience in menu,
                pricing, operations, service, and customer delivery.
              </p>
            </article>

            <article className="career-highlight-card">
              <span>Current Practice</span>
              <h3>Sous Chef leadership</h3>
              <p>
                Current responsibilities span multi-outlet kitchen operations,
                menu engineering, staff coaching, food-cost control, inventory,
                waste optimization, and HACCP compliance.
              </p>
            </article>
          </div>
        </section>

        <section className="career-cta-section">
          <div className="career-cta-copy">
            <p className="career-section-kicker">Work With Me</p>

            <h2>
              Experience is useful
              <br />
              when it becomes practical.
            </h2>

            <p>
              I bring professional kitchen experience into menu development,
              culinary consulting, mentoring, and stronger day-to-day kitchen
              operations.
            </p>
          </div>

          <a href="/#contact" className="career-cta-link">
            <span>Start a Conversation</span>
            <span>↗</span>
          </a>
        </section>
      </main>

      <footer className="footer career-footer">
        <div className="footer-brand">
          <span>PANBRAMSYAH</span>
          <p>Professional Chef | Private Chef | Culinary Consultant</p>
        </div>

        <div className="footer-links">
          <a href="/#experience">Back to Portfolio ←</a>
        </div>

        <p className="copyright">© {currentYear} PANBRAMSYAH</p>
      </footer>
    </div>
  );
}

export default ProfessionalChef;
