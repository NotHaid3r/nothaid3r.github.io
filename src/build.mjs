/* SmallAUTO static site generator.
   Run from the site folder:  SITE_URL=https://your-domain.com node src/build.mjs
   Optional:                  FORM_ENDPOINT=https://formspree.io/f/xxxx  (real form delivery)
   All content lives in the DATA section below. */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE_URL = (process.env.SITE_URL || "").replace(/\/$/, "");
const FORM_ENDPOINT = process.env.FORM_ENDPOINT || "";
const BASE = "/";

/* ===================== DATA ===================== */
const CO = {
  name: "SmallAUTO",
  tagline: "Small automation for larger businesses.",
  description: "SmallAUTO helps businesses simplify repetitive processes, streamline operations, and build practical automation systems that save time.",
  email: "moosahaider887@gmail.com",
  phone: "+92 304 5126435",
  address: "Forte College of Excellence, A-Block, Sargodha",
  year: 2026,
};

const SERVICES = [
  { slug: "seo-automation", id: "seo", name: "SEO Automation", setup: 299, monthly: 149,
    head: "Be found by more of the right customers.",
    desc: "Improve your online visibility and spend less time on repetitive SEO management.",
    best: "Businesses that want more organic visibility",
    out: ["Better visibility", "Less manual effort", "Clearer insights"],
    benefits: ["Keyword research support", "Content optimization support", "Website SEO analysis", "Performance monitoring", "Reporting and insights"],
    faq: [["How soon will I see results?", "SEO is gradual; we set expectations during onboarding and report progress regularly."], ["Do I need technical knowledge?", "No. You receive clear reports and recommendations."]] },
  { slug: "email-outreach-automation", id: "email", name: "Email Outreach Automation", setup: 299, monthly: 149,
    head: "Reach more potential customers, consistently.",
    desc: "Organized, personalized outreach with consistent follow-ups and clear performance insights.",
    best: "Teams that want steady, organized lead engagement",
    out: ["More conversations", "Consistent follow-ups", "Campaign clarity"],
    benefits: ["Organized outreach management", "Personalized communication", "Consistent follow-ups", "Lead engagement support", "Campaign performance insights"],
    faq: [["Can you guarantee replies?", "No one can. We focus on consistency and quality of outreach."], ["Do I keep control?", "Yes, you approve the approach and messaging."]] },
  { slug: "social-media-automation", id: "social", name: "Social Media Automation", setup: 299, monthly: 149,
    head: "A consistent presence, without the daily grind.",
    desc: "Keep your social media organized and consistent while reducing repetitive tasks.",
    best: "Brands that want a steady social presence",
    out: ["Consistent posting", "Time saved", "Performance clarity"],
    benefits: ["Social media management", "Content scheduling", "Publishing consistency", "Account activity management", "Performance tracking"],
    faq: [["Which platforms?", "Tell us your platforms in your enquiry and we will confirm."], ["Can I review posts?", "Yes, review options are part of onboarding."]] },
  { slug: "social-media-content-automation", id: "content", name: "Social Media Content Automation", setup: 299, monthly: 149,
    head: "More content ideas, less blank-page time.",
    desc: "Create, organize, and manage content more efficiently with less manual effort.",
    best: "Creators and brands that need fresh content",
    out: ["Fresh ideas", "Planned calendars", "Content reuse"],
    benefits: ["Content creation assistance", "Captions and content ideas", "Content calendars", "Creative planning", "Content repurposing"],
    faq: [["Is the content on-brand?", "We tailor content to your brand voice during onboarding."], ["Can I edit content?", "Absolutely."]] },
  { slug: "complete-bundle", id: "bundle", name: "SmallAUTO Complete Bundle", bundle: true, setup: 499, monthly: 349,
    head: "One solution for multiple areas of your business.",
    desc: "Bring multiple areas of your business together with one comprehensive automation solution.",
    best: "Growing businesses improving several areas at once",
    out: ["Four services in one", "Better value", "Priority support"],
    benefits: ["SEO Automation", "Email Outreach Automation", "Social Media Automation", "Social Media Content Automation", "Priority customer support"],
    faq: [["Why choose the bundle?", "It covers four areas for less than buying them separately."], ["Can I start smaller?", "Yes, add individual services anytime."]] },
];
const SINGLES = SERVICES.filter((s) => !s.bundle);
const BUNDLE = SERVICES.find((s) => s.bundle);

const HOW = [
  ["Identify repetitive tasks", "We learn about your business, your goals and the work that takes up your time."],
  ["Design the workflow", "We plan an automation that fits the way your business already operates."],
  ["Implement and test", "We set everything up, connect it and check that it works before it goes live."],
  ["Monitor and improve", "Regular reporting shows how things are running so adjustments can be made."],
];
const PROCESS = [
  ["Send an enquiry", "Tell us about your business and the services you are interested in, or book a consultation."],
  ["We get in touch", "Our team contacts you to understand your goals and answer your questions."],
  ["Scope and pricing confirmed", "Final pricing, scope and start date are confirmed with you before any work begins."],
  ["Kickoff and setup", "A guided kickoff with the SmallAUTO team, then we get everything ready for you."],
];
const TRUST = [
  ["Practical solutions", "Automation built around real, everyday business tasks."],
  ["Business-focused implementation", "We care about outcomes for your business, not technology for its own sake."],
  ["Transparent communication", "Clear pricing is published on this site, and no payment is taken online."],
  ["Tailored workflows", "Your goals, audience and preferences shape the setup."],
];
const WHY = [
  ["Less repetitive manual work", "Routine tasks are handled by automation so your time goes to work that needs you."],
  ["More consistent workflows", "The same steps run the same way each time, without relying on someone to remember."],
  ["Time back for your team", "Fewer hours spent on recurring admin means more for customers and growth."],
  ["Connected business tools", "We get your tools connected and ready so work moves between them smoothly."],
  ["Easier everyday operations", "Simple, dependable processes that are straightforward to follow and review."],
];
const GENERAL_FAQ = [
  ["What does SmallAUTO do?", "We provide affordable business automation services focused on saving you time and improving results."],
  ["How do I get started?", "Send an enquiry or book a consultation, and our team will contact you to discuss your goals and next steps."],
  ["Is payment taken on this site?", "No. Online payment is not enabled; our team will contact you about next steps."],
  ["Can I start with one service and add more later?", "Yes. You can begin with an individual service and add others anytime."],
  ["Can you guarantee specific results?", "We work to deliver the outcomes described, but we cannot guarantee specific business results."],
];

const money = (n) => "$" + Number(n).toLocaleString("en-US");

/* ===================== HELPERS ===================== */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const u = (p = "") => BASE + p;
const abs = (p = "") => SITE_URL + u(p);
const svcPath = (s) => `services/${s.slug}/`;
const ARROW = '<span aria-hidden="true">→</span>';
const link = (href, text) => `<a class="link" href="${href}">${text} ${ARROW}</a>`;
const btn = (href, text, ghost) => `<a class="btn${ghost ? " btn--ghost" : ""}" href="${href}">${text}</a>`;
const pad = (i) => String(i + 1).padStart(2, "0");
const tel = CO.phone.replace(/[^+\d]/g, "");
const faqHtml = (list) => `<div class="faq">${list.map((f) => `<details><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join("")}</div>`;
const faqLd = (list) => ({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: list.map((f) => ({ "@type": "Question", name: f[0], acceptedAnswer: { "@type": "Answer", text: f[1] } })) });
const orgRef = SITE_URL ? { "@id": abs() + "#organization" } : { "@type": "Organization", name: CO.name };
const crumbLd = (items) => SITE_URL ? { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it[0], item: abs(it[1]) })) } : null;

/* ===================== COMPONENTS ===================== */
const crumbs = (items) => `<nav aria-label="Breadcrumb"><ol class="crumbs">${items.map((it, i) => i === items.length - 1 ? `<li aria-current="page">${esc(it[0])}</li>` : `<li><a href="${u(it[1])}">${esc(it[0])}</a></li>`).join("")}</ol></nav>`;

const timeline = (steps) => `<ol class="steps">${steps.map((s, i) => `<li><span class="n">${pad(i)}</span><h3>${esc(s[0])}</h3><p>${esc(s[1])}</p></li>`).join("")}</ol>`;
const rail = (steps) => `<ol class="rail">${steps.map((s, i) => `<li><span class="n">${pad(i)}</span><h3>${esc(s[0])}</h3><p>${esc(s[1])}</p></li>`).join("")}</ol>`;

const serviceList = () => `<div class="svc-list">${SINGLES.map((s, i) => `<article class="svc">
  <span class="svc-num" aria-hidden="true">${pad(i)}</span>
  <div class="svc-main"><h3><a class="svc-link" href="${u(svcPath(s))}">${esc(s.name)}</a></h3><p>${esc(s.desc)}</p></div>
  <ul class="svc-out">${s.out.map((o) => `<li>${esc(o)}</li>`).join("")}</ul>
  <p class="svc-price"><strong>From ${money(s.monthly)}/mo</strong><span>+ ${money(s.setup)} setup</span></p>
  <span class="svc-go" aria-hidden="true">→</span>
</article>`).join("")}</div>`;

const bundleBand = () => `<div class="bundle">
  <div><span class="eyebrow">Includes all four services</span><h3>${esc(BUNDLE.name)}</h3><p>${esc(BUNDLE.head)} ${esc(BUNDLE.desc)}</p>
  <p class="price">${money(BUNDLE.monthly)}<span>/mo + ${money(BUNDLE.setup)} setup</span></p>
  <div class="actions">${btn(u(svcPath(BUNDLE)), "View the bundle")}${btn(u("contact/?service=bundle"), "Enquire", true)}</div></div>
  <div><h4>What's included</h4><ul class="chk">${BUNDLE.benefits.map((b) => {
    const s = SINGLES.find((x) => x.name === b);
    return `<li>${s ? `<a href="${u(svcPath(s))}">${esc(b)}</a>` : esc(b)}</li>`;
  }).join("")}</ul></div></div>`;

const pricingTable = (full) => `<div class="tbl-wrap"><table class="price-table"><thead><tr><th scope="col">Package</th><th scope="col">Setup (one-time)</th><th scope="col">Monthly</th>${full ? '<th scope="col">Included</th>' : ""}<th scope="col"><span class="vh">Action</span></th></tr></thead><tbody>
${SERVICES.map((s) => `<tr${s.bundle ? ' class="is-bundle"' : ""}>
<th scope="row"><a href="${u(svcPath(s))}">${esc(s.name)}</a><small>${esc(s.best)}</small></th>
<td class="num" data-label="Setup"><span>${money(s.setup)}</span></td><td class="num" data-label="Monthly"><span>${money(s.monthly)}<span class="per"> /mo</span></span></td>
${full ? `<td class="inc" data-label="Included"><ul>${s.benefits.map((b) => `<li>${esc(b)}</li>`).join("")}</ul></td>` : ""}
<td>${link(u("contact/?service=" + s.id), "Enquire")}</td></tr>`).join("")}
</tbody></table></div>`;

const ticker = () => {
  const items = [...SERVICES.map((x) => x.name), "Save time", "Simplify operations"];
  const list = (hidden) => `<ul${hidden ? ' aria-hidden="true"' : ""}>${[...items, ...items].map((n) => `<li>${esc(n)}</li>`).join("")}</ul>`;
  return `<div class="ticker" aria-label="SmallAUTO services"><div class="ticker-track">${list(false)}${list(true)}</div></div>`;
};

const noteBox = (t) => `<p class="note">${t}</p>`;

const ctaBand = () => `<section class="band section" aria-labelledby="cta-h"><div class="wrap cta">
<div><h2 id="cta-h">Ready to simplify the way your business works?</h2><p>Let's identify the processes that are slowing your business down and explore how automation can help.</p></div>
<div class="actions">${btn(u("contact/"), "Book a consultation")}${btn(u("services/"), "Explore our services", true)}</div>
</div></section>`;

const NAV = [["Services", "services/"], ["How it works", "#how-it-works"], ["Pricing", "pricing/"], ["About", "about/"]];

const header = (current) => `<a class="skip" href="#main">Skip to content</a>
<header class="site-header"><div class="wrap nav">
<a class="logo" href="${u()}" aria-label="SmallAUTO home">Small<span>AUTO</span></a>
<div class="nav-panel" id="nav-panel"><nav aria-label="Primary"><ul class="nav-links">${NAV.map((n) => {
  const href = n[1].startsWith("#") ? u() + n[1] : u(n[1]);
  const on = current && n[1] === current ? ' aria-current="page"' : "";
  return `<li><a href="${href}"${on}>${n[0]}</a></li>`;
}).join("")}</ul></nav>${btn(u("contact/"), "Book a consultation")}</div>
<button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav-panel">Menu</button>
</div></header>`;

const footer = () => `<footer class="site-footer"><div class="wrap"><div class="foot-grid">
<div><a class="logo" href="${u()}">Small<span>AUTO</span></a><p style="margin-top:16px">${esc(CO.tagline)} Practical automation for SEO, email outreach, social media and content.</p></div>
<div><h2>Explore</h2><ul><li><a href="${u("services/")}">Services</a></li><li><a href="${u()}#how-it-works">How it works</a></li><li><a href="${u("pricing/")}">Pricing</a></li><li><a href="${u("about/")}">About</a></li><li><a href="${u("faq/")}">FAQ</a></li><li><a href="${u("contact/")}">Contact</a></li></ul></div>
<div><h2>Services</h2><ul>${SERVICES.map((s) => `<li><a href="${u(svcPath(s))}">${esc(s.name)}</a></li>`).join("")}</ul></div>
<div><h2>Contact</h2><address><a href="mailto:${CO.email}">${esc(CO.email)}</a><br><a href="tel:${tel}">${esc(CO.phone)}</a><br>${esc(CO.address)}</address></div>
</div><div class="foot-bar"><span>© ${CO.year} ${CO.name}. All rights reserved.</span><ul><li><a href="${u("privacy-policy/")}">Privacy Policy</a></li><li><a href="${u("terms-and-conditions/")}">Terms &amp; Conditions</a></li></ul></div></div></footer>`;

/* ===================== PAGE SHELL ===================== */
function shell(p) {
  const url = SITE_URL ? abs(p.path) : "";
  const image = SITE_URL ? abs("og-image.png") : "";
  const ld = (p.ld || []).filter(Boolean).map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`).join("\n");
  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.desc)}">
<meta name="theme-color" content="#171717"><meta name="color-scheme" content="dark">
${p.noindex ? '<meta name="robots" content="noindex">' : ""}${url && !p.noindex ? `<link rel="canonical" href="${url}">` : ""}
<meta property="og:type" content="website"><meta property="og:site_name" content="${CO.name}">
<meta property="og:title" content="${esc(p.title)}"><meta property="og:description" content="${esc(p.desc)}">
${url ? `<meta property="og:url" content="${url}">` : ""}${image ? `<meta property="og:image" content="${image}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">` : ""}
<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}">
<link rel="icon" href="${u("favicon.svg")}" type="image/svg+xml">
<link rel="preload" href="${u("fonts/manrope-latin-wght-normal.woff2")}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${u("fonts/inter-latin-wght-normal.woff2")}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${u("styles.css")}">
<script>document.documentElement.classList.add("js")</script>
${ld}
</head><body>
${header(p.nav)}
<main id="main">
${p.body}
</main>
${footer()}
<script src="${u("main.js")}" defer></script>
</body></html>
`;
}

const pageHead = (crumbItems, h1, lead, extra = "") => `<section class="page-head"><div class="wrap">${crumbs(crumbItems)}<h1>${h1}</h1>${lead ? `<p class="lead">${lead}</p>` : ""}${extra}</div></section>`;

/* ===================== PAGES ===================== */
const pages = [];

/* Home */
pages.push({
  path: "", nav: "",
  title: "SmallAUTO — Business Automation Services",
  desc: "SmallAUTO helps businesses simplify repetitive processes with practical automation for SEO, email outreach, social media and content.",
  ld: [{ "@context": "https://schema.org", "@type": "ProfessionalService", ...(SITE_URL ? { "@id": abs() + "#organization", url: abs() } : {}), name: CO.name, description: CO.description, email: CO.email, telephone: CO.phone, address: { "@type": "PostalAddress", streetAddress: "Forte College of Excellence, A-Block", addressLocality: "Sargodha", addressCountry: "PK" } },
    faqLd(GENERAL_FAQ)],
  body: `
<section class="hero"><div class="wrap hero-grid">
  <div><span class="eyebrow">Business automation</span><h1>Make your business work smarter.</h1>
  <p class="lead">SmallAUTO helps businesses simplify repetitive processes, streamline operations, and build practical automation systems that save time.</p>
  <div class="actions">${btn(u("services/"), "Explore our services")}${btn(u("contact/"), "Book a consultation", true)}</div></div>
  <aside class="hero-index" aria-label="What we automate"><p>What we automate</p><ul>${SINGLES.map((s, i) => `<li><a href="${u(svcPath(s))}"><span class="n">${pad(i)}</span><span><strong>${esc(s.name)}</strong><small>${esc(s.out.join(" · "))}</small></span><span class="go" aria-hidden="true">→</span></a></li>`).join("")}</ul></aside>
</div></section>
${ticker()}

<section class="trust-strip" aria-label="How we work"><div class="wrap"><div class="trust">${TRUST.map((t) => `<div><h3>${esc(t[0])}</h3><p>${esc(t[1])}</p></div>`).join("")}</div></div></section>

<section class="section" id="services" aria-labelledby="svc-h"><div class="wrap">
  <div class="sec-head sec-head--row"><div><span class="eyebrow">Services</span><h2 id="svc-h">Automation for the work that repeats.</h2><p>Four focused services, each with a clear monthly fee and one-time setup. Or bring them together in a single bundle.</p></div>${link(u("services/"), "All services")}</div>
  ${serviceList()}${bundleBand()}
</div></section>

<section class="band section" id="how-it-works" aria-labelledby="how-h"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">How it works</span><h2 id="how-h">From repetitive task to running automation.</h2><p>A straightforward approach, from understanding the work to keeping it running well.</p></div>
  ${timeline(HOW)}
</div></section>

<section class="section" aria-labelledby="why-h"><div class="wrap split">
  <div class="sticky"><span class="eyebrow">Why SmallAUTO</span><h2 id="why-h">Practical value, without the hype.</h2><p class="lead">We focus on the everyday work that slows a business down, and on making it simpler to run.</p></div>
  <dl class="dl-rows">${WHY.map((w) => `<div><dt>${esc(w[0])}</dt><dd>${esc(w[1])}</dd></div>`).join("")}</dl>
</div></section>

<section class="band section" id="pricing" aria-labelledby="price-h"><div class="wrap">
  <div class="sec-head sec-head--row"><div><span class="eyebrow">Pricing</span><h2 id="price-h">Clear pricing, published up front.</h2><p>Each package has a one-time setup fee and a monthly fee. Final scope and pricing are confirmed with you before work begins.</p></div>${link(u("pricing/"), "Full pricing details")}</div>
  ${pricingTable(false)}
  ${noteBox("No payment is taken on this website. Commitment terms and support response times are confirmed with you directly. Results cannot be guaranteed.")}
</div></section>

<section class="section" aria-labelledby="proc-h"><div class="wrap split">
  <div class="sticky"><span class="eyebrow">Our process</span><h2 id="proc-h">From first enquiry to kickoff.</h2><p class="lead">What happens after you get in touch, so there are no surprises.</p></div>
  <div>${rail(PROCESS)}</div>
</div></section>

<section class="band section" aria-labelledby="faq-h"><div class="wrap split">
  <div class="sticky"><span class="eyebrow">FAQ</span><h2 id="faq-h">Common questions.</h2><p class="lead">${link(u("faq/"), "See all questions")}</p></div>
  ${faqHtml(GENERAL_FAQ)}
</div></section>

${ctaBand()}`,
});

/* Services index */
pages.push({
  path: "services/", nav: "services/",
  title: "Business Automation Services | SmallAUTO",
  desc: "SEO, email outreach, social media and content automation, plus a complete bundle. Clear monthly pricing from SmallAUTO.",
  ld: [crumbLd([["Home", ""], ["Services", "services/"]])],
  body: `${pageHead([["Home", ""], ["Services", "services/"]], "Services", "Four focused automation services and one complete bundle. Each has a clear monthly fee and a one-time setup.")}
<section class="section"><div class="wrap">${serviceList()}${bundleBand()}</div></section>
${ctaBand()}`,
});

/* Service pages */
SERVICES.forEach((s) => {
  const others = SERVICES.filter((x) => x !== s).slice(0, 3);
  const rows = [["Best for", s.best], ["Deliverables", s.benefits.join(" · ")], ["Onboarding", "Guided kickoff with the SmallAUTO team"], ["Reporting", "Regular summaries (cadence confirmed at onboarding)"], ["Support", "Email support — response times to be confirmed"], ["Billing", `${money(s.monthly)}/month + ${money(s.setup)} one-time setup`], ["Commitment", "Terms to be confirmed"]];
  pages.push({
    path: svcPath(s), nav: "services/",
    title: `${s.name} | SmallAUTO`,
    desc: `${s.desc} From ${money(s.monthly)}/month plus ${money(s.setup)} setup.`,
    ld: [{ "@context": "https://schema.org", "@type": "Service", name: s.name, description: s.desc, ...(SITE_URL ? { url: abs(svcPath(s)) } : {}), provider: orgRef }, crumbLd([["Home", ""], ["Services", "services/"], [s.name, svcPath(s)]]), faqLd(s.faq)],
    body: `<section class="page-head"><div class="wrap">${crumbs([["Home", ""], ["Services", "services/"], [s.name, svcPath(s)]])}
<div class="hero-grid"><div><h1 style="max-width:16ch">${esc(s.name)}</h1><p class="lead" style="margin-bottom:12px"><strong style="color:var(--text);font-weight:600">${esc(s.head)}</strong></p><p class="lead" style="margin-bottom:32px">${esc(s.desc)}</p>
<div class="actions">${btn(u("contact/?service=" + s.id), "Enquire about this service")}${btn(u("contact/"), "Book a consultation", true)}</div></div>
<aside class="at-a-glance" aria-label="Pricing at a glance"><dl><div><dt>Monthly</dt><dd class="big">${money(s.monthly)} <span>/ month</span></dd></div><div><dt>One-time setup</dt><dd class="big">${money(s.setup)}</dd></div><div><dt>Best for</dt><dd>${esc(s.best)}</dd></div></dl></aside></div></div></section>

<section class="section" aria-labelledby="out-h"><div class="wrap"><div class="sec-head"><span class="eyebrow">Key outcomes</span><h2 id="out-h">What you can expect.</h2></div>
<ol class="outcomes">${s.out.map((o, i) => `<li><span class="n">${pad(i)}</span><p>${esc(o)}</p></li>`).join("")}</ol></div></section>

<section class="band section" aria-labelledby="inc-h"><div class="wrap split"><div class="sticky"><span class="eyebrow">What's included</span><h2 id="inc-h">Included in ${esc(s.name)}.</h2></div>
<ul class="chk">${s.benefits.map((b) => {
      const sv = s.bundle && SINGLES.find((x) => x.name === b);
      return `<li>${sv ? `<a href="${u(svcPath(sv))}">${esc(b)}</a>` : esc(b)}</li>`;
    }).join("")}</ul></div></section>

<section class="section" aria-labelledby="spec-h"><div class="wrap"><div class="sec-head"><span class="eyebrow">Details</span><h2 id="spec-h">Specifications.</h2></div>
<div class="tbl-wrap"><table class="spec"><tbody>${rows.map((r) => `<tr><th scope="row">${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join("")}</tbody></table></div>
${noteBox("No payment is taken on this website. Final pricing, scope and start date are confirmed with you before work begins.")}</div></section>

<section class="band section" aria-labelledby="how-h"><div class="wrap"><div class="sec-head"><span class="eyebrow">How it works</span><h2 id="how-h">How the work runs.</h2></div>${timeline(HOW)}</div></section>

<section class="section" aria-labelledby="faq-h"><div class="wrap split"><div class="sticky"><span class="eyebrow">FAQ</span><h2 id="faq-h">Questions about ${esc(s.name)}.</h2></div>${faqHtml(s.faq)}</div></section>

<section class="band section" aria-labelledby="more-h"><div class="wrap"><div class="sec-head"><span class="eyebrow">Explore more</span><h2 id="more-h">Other services.</h2></div>
<ul class="rel">${others.map((o) => `<li><a href="${u(svcPath(o))}"><strong>${esc(o.name)}</strong><span>${esc(o.desc)}</span><span class="go" aria-hidden="true">→</span></a></li>`).join("")}</ul></div></section>
${ctaBand()}`,
  });
});

/* Pricing */
{
  const sepSetup = SINGLES.reduce((a, s) => a + s.setup, 0), sepMonthly = SINGLES.reduce((a, s) => a + s.monthly, 0);
  pages.push({
    path: "pricing/", nav: "pricing/",
    title: "Pricing | SmallAUTO",
    desc: "Transparent SmallAUTO pricing: one-time setup plus a monthly fee. Individual services from $149/month, or the Complete Bundle.",
    ld: [crumbLd([["Home", ""], ["Pricing", "pricing/"]])],
    body: `${pageHead([["Home", ""], ["Pricing", "pricing/"]], "Pricing", "Each package has a one-time setup fee and a monthly fee. Final pricing, scope and start date are confirmed with you before work begins.")}
<section class="section" aria-labelledby="cmp-h"><div class="wrap"><h2 class="vh" id="cmp-h">Package comparison</h2>${pricingTable(true)}</div></section>
<section class="band section" aria-labelledby="bun-h"><div class="wrap split"><div class="sticky"><span class="eyebrow">Bundle</span><h2 id="bun-h">The bundle compared with four separate services.</h2><p class="lead">Based on the listed prices of the four individual services.</p></div>
<div class="tbl-wrap"><table><thead><tr><th scope="col">Option</th><th scope="col">Setup</th><th scope="col">Monthly</th></tr></thead><tbody>
<tr><th scope="row">All four services separately</th><td class="num">${money(sepSetup)}</td><td class="num">${money(sepMonthly)}</td></tr>
<tr><th scope="row">${esc(BUNDLE.name)}</th><td class="num">${money(BUNDLE.setup)}</td><td class="num">${money(BUNDLE.monthly)}</td></tr>
<tr><th scope="row">Difference</th><td class="num">${money(sepSetup - BUNDLE.setup)}</td><td class="num">${money(sepMonthly - BUNDLE.monthly)}</td></tr></tbody></table></div></div></section>
<section class="section" aria-labelledby="know-h"><div class="wrap split"><div class="sticky"><span class="eyebrow">Good to know</span><h2 id="know-h">Before you enquire.</h2></div>
<ul class="chk"><li>Prices are a monthly fee plus a one-time setup fee.</li><li>No payment is taken on this website.</li><li>Final pricing, scope and start date are confirmed with you before work begins.</li><li>Commitment terms and support response times are confirmed with you directly.</li><li>Reporting cadence is confirmed at onboarding.</li><li>We cannot guarantee specific business results.</li></ul></div></section>
${ctaBand()}`,
  });
}

/* About */
pages.push({
  path: "about/", nav: "about/",
  title: "About SmallAUTO | Business Automation",
  desc: "SmallAUTO makes professional automation accessible and affordable, with clear communication, honest pricing and a focus on outcomes.",
  ld: [crumbLd([["Home", ""], ["About", "about/"]])],
  body: `${pageHead([["Home", ""], ["About", "about/"]], "About SmallAUTO", "SmallAUTO is a business automation agency. We help businesses save time on repetitive work with practical, affordable automation.")}
<section class="section"><div class="wrap about-rows">
<div><h2>Mission</h2><p>Make professional automation accessible and affordable.</p></div>
<div><h2>Vision</h2><p>Help businesses of every size work smarter.</p></div>
<div><h2>Customer first</h2><p>Clear communication, honest pricing, focused outcomes.</p></div></div></section>
${ctaBand()}`,
});

/* FAQ */
pages.push({
  path: "faq/", nav: "",
  title: "FAQ | SmallAUTO",
  desc: "Answers about SmallAUTO's automation services: getting started, pricing, payment, results and each individual service.",
  ld: [crumbLd([["Home", ""], ["FAQ", "faq/"]]), faqLd([...GENERAL_FAQ, ...SERVICES.flatMap((s) => s.faq)])],
  body: `${pageHead([["Home", ""], ["FAQ", "faq/"]], "Frequently asked questions", "Quick answers about working with SmallAUTO. Can't find yours? Get in touch.")}
<section class="section"><div class="wrap" style="max-width:820px">
<div class="faq-group"><h2>General</h2>${faqHtml(GENERAL_FAQ)}</div>
${SERVICES.map((s) => `<div class="faq-group"><h2>${esc(s.name)}</h2>${faqHtml(s.faq)}</div>`).join("")}
</div></section>
${ctaBand()}`,
});

/* Contact */
pages.push({
  path: "contact/", nav: "",
  title: "Book a Consultation | SmallAUTO",
  desc: "Book a consultation or send an enquiry to SmallAUTO. Tell us about your business and the processes you want to automate.",
  ld: [crumbLd([["Home", ""], ["Contact", "contact/"]])],
  body: `${pageHead([["Home", ""], ["Contact", "contact/"]], "Book a consultation", "Tell us about your business and what you'd like to automate. Our team will get in touch to discuss next steps.")}
<section class="section"><div class="wrap form-grid">
<div>
<form id="enquiry" novalidate data-email="${esc(CO.email)}" data-endpoint="${esc(FORM_ENDPOINT)}">
<div class="row"><div class="field"><label for="f-name">Full name <span class="req" aria-hidden="true">*</span></label><input id="f-name" name="name" autocomplete="name" required aria-describedby="err-name"><p class="err" id="err-name"></p></div>
<div class="field"><label for="f-email">Email <span class="req" aria-hidden="true">*</span></label><input id="f-email" name="email" type="email" autocomplete="email" required aria-describedby="err-email"><p class="err" id="err-email"></p></div></div>
<div class="row"><div class="field"><label for="f-biz">Business name <span class="opt">(optional)</span></label><input id="f-biz" name="business" autocomplete="organization"></div>
<div class="field"><label for="f-phone">Phone <span class="opt">(optional)</span></label><input id="f-phone" name="phone" type="tel" autocomplete="tel"></div></div>
<div class="field"><label for="f-web">Website <span class="opt">(optional)</span></label><input id="f-web" name="website" type="url" autocomplete="url" placeholder="https://"></div>
<fieldset><legend>Services you're interested in <span class="opt">(optional)</span></legend><div class="checks">${SERVICES.map((s) => `<label class="check"><input type="checkbox" name="services" value="${s.id}" data-label="${esc(s.name)}"> ${esc(s.name)}</label>`).join("")}</div></fieldset>
<div class="field"><label for="f-goal">What do you want to achieve? <span class="req" aria-hidden="true">*</span></label><textarea id="f-goal" name="goal" required aria-describedby="err-goal"></textarea><p class="err" id="err-goal"></p></div>
<div class="row"><div class="field"><label for="f-date">Preferred consultation date <span class="opt">(optional)</span></label><input id="f-date" name="date" type="date"></div>
<div class="field"><label for="f-time">Preferred time <span class="opt">(optional)</span></label><input id="f-time" name="time" type="time"></div></div>
<div class="field"><label for="f-notes">Anything else? <span class="opt">(optional)</span></label><textarea id="f-notes" name="notes" style="min-height:90px"></textarea></div>
<button class="btn" type="submit">Send enquiry</button>
<p class="form-note">* Required. ${FORM_ENDPOINT ? "Your details are used only to respond to your enquiry. Preferred times are requests until confirmed by our team." : "Sending opens your email app with your enquiry filled in. It is only sent once you press send there. Preferred times are requests until confirmed by our team."}</p>
<div class="status" id="form-status" role="status" tabindex="-1"></div>
</form>
<div id="form-done" class="status" role="status" tabindex="-1" hidden><strong>Thank you. Your enquiry has been sent.</strong><br>Our team will contact you to discuss next steps. No payment has been taken.</div>
</div>
<div class="side">
<section><h2>Contact details</h2><ul class="contact-list"><li><small>Email</small><a class="inline-link" href="mailto:${CO.email}">${esc(CO.email)}</a></li><li><small>Phone</small><a class="inline-link" href="tel:${tel}">${esc(CO.phone)}</a></li><li><small>Address</small>${esc(CO.address)}</li></ul></section>
<section><h2>What happens next</h2>${rail(PROCESS.slice(1, 4))}</section>
</div></div></section>`,
});

/* Legal */
const legal = (path, title, h1, desc, blocks) => pages.push({
  path, nav: "", title, desc,
  ld: [crumbLd([["Home", ""], [h1, path]])],
  body: `${pageHead([["Home", ""], [h1, path]], h1, "")}<section class="section"><div class="wrap legal"><p>Last updated: November 2026</p>${blocks.map((b) => `<h2>${esc(b[0])}</h2><p>${esc(b[1])}</p>`).join("")}</div></section>`,
});
legal("privacy-policy/", "Privacy Policy | SmallAUTO", "Privacy Policy", "How SmallAUTO collects and uses the information you submit through its website forms.", [
  ["What we collect", "Information you submit through our forms: your name, business name, email, phone number, website, business needs and meeting preferences."],
  ["How we use it", "To respond to your request, provide and improve our services, and communicate with you about your enquiry. We do not sell your personal information."],
  ["How your enquiry reaches us", "Your enquiry is sent to us by email, either through your own email app or through a form service if one is enabled on this site."],
  ["Fonts and third parties", "This website serves its own fonts and does not load third-party scripts or trackers."],
  ["Questions", "Contact us through the Contact page about your data."],
]);
legal("terms-and-conditions/", "Terms & Conditions | SmallAUTO", "Terms & Conditions", "The terms that apply to using the SmallAUTO website and enquiring about its automation services.", [
  ["Services", "SmallAUTO provides business automation services as described on each service page. Requests submitted through this website are enquiries, not binding contracts, until confirmed by our team."],
  ["Pricing", "Prices shown are a monthly fee plus a one-time setup fee. Final pricing, scope and start date are confirmed with you before work begins."],
  ["Results", "We work to deliver the outcomes described, but we cannot guarantee specific business results."],
  ["Payment", "Online payment is not taken on this website. Payment terms are agreed directly with you."],
  ["Changes", "We may update these terms from time to time. Continued use of the website means you accept the updated terms."],
]);

/* ===================== WRITE ===================== */
function write(rel, content) {
  const file = join(ROOT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}
pages.forEach((p) => write(join(p.path, "index.html"), shell(p)));

write("404.html", shell({ path: "404.html", noindex: true, nav: "", title: "Page not found | SmallAUTO", desc: "This page could not be found.",
  body: `<section class="center-page"><div class="wrap"><span class="eyebrow">Error 404</span><h1>Page not found.</h1><p class="lead" style="margin-bottom:28px">The page you're looking for doesn't exist or has moved.</p><div class="actions">${btn(u(), "Back to home")}${btn(u("services/"), "View services", true)}</div></div></section>` }));

write("favicon.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#171717"/><text x="32" y="43" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="30" fill="#F2EEE7">SA</text></svg>\n`);

if (SITE_URL) {
  write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url><loc>${abs(p.path)}</loc></url>`).join("\n")}\n</urlset>\n`);
  write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${abs("sitemap.xml")}\n`);
} else {
  write("robots.txt", `User-agent: *\nAllow: /\n`);
  console.warn("\n⚠  SITE_URL not set: canonical tags, og:url, og:image and sitemap.xml were skipped.\n   Rebuild with:  SITE_URL=https://your-domain.com node src/build.mjs\n");
}
console.log(`Built ${pages.length} pages + 404.`);
