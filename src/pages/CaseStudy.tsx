import { useEffect, useState } from "react";

type Theme = "dark" | "light";

type CaseStudy = {
  slug: string;
  index: string;
  title: string;
  category: string;
  image: string;
  imageAlt: string;
  intro: string;
  challenge: string;
  role: string[];
  actions: string[];
  result: string;
};

const CASE_STUDIES: Record<string, CaseStudy> = {
  "culinary-development": {
    slug: "culinary-development",
    index: "01",
    title: "Culinary Development",
    category: "Menu Development · Plating · Concept",
    image: "/images/work/project-01.png",
    imageAlt: "Culinary development project",
    intro:
      "A selected culinary development project focused on bringing menu direction, plating, and concept into one coherent culinary language.",
    challenge:
      "Create a clearer relationship between the food itself, the way it is presented, and the broader concept—while keeping the direction practical enough to translate into day-to-day kitchen execution.",
    role: ["Menu Development", "Plating Direction", "Concept Development"],
    actions: [
      "Developed a clearer culinary direction around the concept and intended guest experience.",
      "Refined plating language to create stronger visual consistency across the food presentation.",
      "Considered repeatability and kitchen practicality alongside the creative direction.",
    ],
    result:
      "A more cohesive culinary direction that connects menu thinking, visual presentation, and practical execution. Project-specific commercial metrics can be added here when available.",
  },
  "restaurant-concept": {
    slug: "restaurant-concept",
    index: "02",
    title: "Restaurant Concept",
    category: "F&B Consulting · Menu Strategy",
    image: "/images/work/project-02.png",
    imageAlt: "Restaurant concept project",
    intro:
      "A selected F&B consulting project centered on connecting restaurant concept, menu strategy, and operational practicality.",
    challenge:
      "Translate a restaurant idea into a menu direction that feels coherent to the guest while remaining grounded in how a real kitchen has to operate, produce, cost, and serve the food.",
    role: ["F&B Consulting", "Menu Strategy", "Operational Thinking"],
    actions: [
      "Structured the menu direction around the concept rather than treating dishes as isolated items.",
      "Considered product mix, kitchen practicality, consistency, and guest experience as connected decisions.",
      "Used culinary and operational thinking together to create a clearer framework for execution.",
    ],
    result:
      "A stronger framework connecting concept, menu direction, and practical restaurant execution. Specific client outcomes or performance data can be added here when available.",
  },
  "kitchen-standards": {
    slug: "kitchen-standards",
    index: "03",
    title: "Kitchen Standards",
    category: "Operations · Systems · Food Safety",
    image: "/images/work/project-03.png",
    imageAlt: "Kitchen operations project",
    intro:
      "A selected kitchen-operations project focused on clearer systems, consistency, and food-safety standards that can be followed in daily service.",
    challenge:
      "Turn kitchen standards into practical routines that support consistency, accountability, food safety, and smoother day-to-day operations without creating unnecessary complexity for the team.",
    role: ["Kitchen Operations", "Systems", "Food Safety"],
    actions: [
      "Organized operational thinking around repeatable standards rather than informal habits.",
      "Focused on workflow, consistency, hygiene, temperature control, and practical food-safety discipline.",
      "Prioritized systems that are clear enough for teams to follow during real kitchen service.",
    ],
    result:
      "A more structured operational direction centered on repeatability, clarity, and food safety. Measurable before-and-after results can be added here when project data is available.",
  },
};

const ORDER = [
  "culinary-development",
  "restaurant-concept",
  "kitchen-standards",
];

function getAdjacentProject(slug: string, direction: -1 | 1) {
  const currentIndex = ORDER.indexOf(slug);
  const nextIndex = (currentIndex + direction + ORDER.length) % ORDER.length;
  return CASE_STUDIES[ORDER[nextIndex]];
}

type CaseStudyPageProps = {
  slug: string;
};

function CaseStudyPage({ slug }: CaseStudyPageProps) {
  const [theme, setTheme] = useState<Theme>("dark");
  const project = CASE_STUDIES[slug] ?? CASE_STUDIES[ORDER[0]];
  const previousProject = getAdjacentProject(project.slug, -1);
  const nextProject = getAdjacentProject(project.slug, 1);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${project.title} — PANBRAMSYAH`;
    window.scrollTo(0, 0);

    return () => {
      document.title = previousTitle;
    };
  }, [project.title]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  return (
    <div className="site case-study-page">
      <header className="navbar case-study-navbar">
        <a href="/" className="brand" aria-label="PANBRAMSYAH home">
          PANBRAMSYAH
        </a>

        <div className="case-study-navbar-actions">
          <a href="/#work" className="career-back-link">
            <span>←</span>
            <span>Selected Work</span>
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
        <section className="case-study-hero">
          <div className="case-study-hero-copy">
            <div className="section-label case-study-index-label">
              <span>{project.index}</span>
              <span>Selected Work</span>
            </div>

            <p className="case-study-kicker">{project.category}</p>

            <h1>{project.title}</h1>

            <p className="case-study-intro">{project.intro}</p>
          </div>

          <figure className="case-study-hero-visual">
            <div className="case-study-hero-image">
              <img src={project.image} alt={project.imageAlt} />
            </div>

            <figcaption>
              <span>{project.title}</span>
              <span>Case Study {project.index}</span>
            </figcaption>
          </figure>
        </section>

        <section className="case-study-story">
          <div className="case-study-section-heading">
            <div className="section-label">
              <span>01</span>
              <span>Challenge</span>
            </div>

            <h2>Define the problem before designing the solution.</h2>
          </div>

          <div className="case-study-narrative">
            <p>{project.challenge}</p>
          </div>
        </section>

        <section className="case-study-role-section">
          <div className="case-study-section-heading">
            <div className="section-label">
              <span>02</span>
              <span>My Role</span>
            </div>

            <h2>Where culinary thinking meets practical execution.</h2>
          </div>

          <div className="case-study-role-grid">
            {project.role.map((item, index) => (
              <div className="case-study-role-card" key={item}>
                <span>0{index + 1}</span>
                <h3>{item}</h3>
              </div>
            ))}
          </div>
        </section>

        <section className="case-study-story">
          <div className="case-study-section-heading">
            <div className="section-label">
              <span>03</span>
              <span>What I Did</span>
            </div>

            <h2>Translate direction into decisions the kitchen can use.</h2>
          </div>

          <div className="case-study-action-list">
            {project.actions.map((action, index) => (
              <div className="case-study-action" key={action}>
                <span>0{index + 1}</span>
                <p>{action}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="case-study-result-section">
          <div className="case-study-section-heading">
            <div className="section-label">
              <span>04</span>
              <span>Result</span>
            </div>

            <h2>A clearer framework for stronger execution.</h2>
          </div>

          <div className="case-study-result-copy">
            <p>{project.result}</p>
          </div>
        </section>

        <section className="case-study-gallery-section">
          <div className="case-study-section-heading">
            <div className="section-label">
              <span>05</span>
              <span>Gallery</span>
            </div>

            <h2>Selected visual from the project.</h2>
          </div>

          <figure className="case-study-gallery-feature">
            <div className="case-study-gallery-image">
              <img src={project.image} alt={project.imageAlt} loading="lazy" />
            </div>

            <figcaption>
              <span>{project.title}</span>
              <span>01 / 01</span>
            </figcaption>
          </figure>
        </section>

        <nav className="case-study-project-nav" aria-label="Project navigation">
          <a href={`/work/${previousProject.slug}`}>
            <span>← Previous Project</span>
            <strong>{previousProject.title}</strong>
          </a>

          <a href={`/work/${nextProject.slug}`}>
            <span>Next Project →</span>
            <strong>{nextProject.title}</strong>
          </a>
        </nav>

        <section className="case-study-cta-section">
          <div>
            <p className="case-study-kicker">Work With Me</p>
            <h2>
              Have a culinary project
              <br />
              that needs direction?
            </h2>
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
          <a href="/#work">Selected Work ↑</a>
        </div>

        <p className="copyright">© {currentYear} PANBRAMSYAH</p>
      </footer>
    </div>
  );
}

export default CaseStudyPage;
