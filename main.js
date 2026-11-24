/* SmallAUTO — minimal site script: mobile menu + enquiry form. No dependencies. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);

  /* Mobile menu */
  const btn = $(".menu-btn"), panel = $("#nav-panel");
  if (btn && panel) {
    const set = (open) => {
      panel.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.textContent = open ? "Close" : "Menu";
    };
    btn.addEventListener("click", () => set(!panel.classList.contains("open")));
    panel.addEventListener("click", (e) => { if (e.target.closest("a")) set(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && panel.classList.contains("open")) { set(false); btn.focus(); }
    });
  }

  /* Motion: progress bar, header state, word reveal, scroll reveal */
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = $(".site-header");
  const bar = document.createElement("div");
  bar.className = "progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.append(bar);
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      header.classList.toggle("scrolled", scrollY > 8);
      bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, scrollY / max) : 0) + ")";
    });
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (!reduce) {
    document.querySelectorAll("h1").forEach((h) => {
      const text = h.textContent.trim();
      h.setAttribute("aria-label", text);
      h.textContent = "";
      text.split(/\s+/).forEach((word, i, all) => {
        const outer = document.createElement("span"), inner = document.createElement("span");
        outer.className = "w"; outer.setAttribute("aria-hidden", "true");
        inner.style.setProperty("--i", i); inner.textContent = word;
        outer.append(inner); h.append(outer);
        if (i < all.length - 1) h.append(" ");
      });
    });

    const targets = [
      ".sec-head", ".sticky > *", ".trust > div", ".svc", ".bundle", ".steps li", ".rail li",
      ".dl-rows > div", ".price-table tbody tr", ".tbl-wrap", ".faq details", ".cta > *", ".outcomes li",
      ".chk li", ".rel li", ".about-rows > div", ".note", ".form-grid > div", ".legal > *", ".faq-group h2",
    ].join(",");
    const io = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        el.classList.add("in");
        io.unobserve(el);
        setTimeout(() => el.classList.remove("rv", "in"), 1600);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }) : null;
    if (io) {
      const seen = new Map();
      document.querySelectorAll(targets).forEach((el) => {
        if (el.closest(".hero, .page-head") || el.closest("#nav-panel")) return;
        const n = seen.get(el.parentNode) || 0;
        seen.set(el.parentNode, n + 1);
        el.style.setProperty("--d", Math.min(n, 6));
        el.classList.add("rv");
        io.observe(el);
      });
    }
  }

  /* Enquiry form */
  const form = $("#enquiry");
  if (!form) return;

  const email = form.dataset.email || "";
  const endpoint = form.dataset.endpoint || "";
  const status = $("#form-status");
  const submit = $("button[type=submit]", form);

  const date = form.elements.date;
  if (date) date.min = new Date().toISOString().slice(0, 10);

  const wanted = new URLSearchParams(location.search).get("service");
  if (wanted) {
    const box = form.querySelector(`input[name=services][value="${CSS.escape(wanted)}"]`);
    if (box) box.checked = true;
  }

  const say = (msg, state) => {
    status.textContent = msg;
    status.dataset.state = state || "info";
    status.focus();
  };

  const rules = {
    name: (v) => (v ? "" : "Please enter your name."),
    email: (v) => (!v ? "Please enter your email address." : /^\S+@\S+\.\S+$/.test(v) ? "" : "That email address doesn't look right."),
    goal: (v) => (v ? "" : "Please tell us what you want to achieve."),
  };

  const validate = () => {
    let first = null;
    for (const [name, check] of Object.entries(rules)) {
      const field = form.elements[name], msg = check(field.value.trim());
      const out = $("#err-" + name);
      out.textContent = msg;
      field.setAttribute("aria-invalid", msg ? "true" : "false");
      if (msg && !first) first = field;
    }
    if (first) first.focus();
    return !first;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const v = (n) => (form.elements[n] ? form.elements[n].value.trim() : "");
    const services = [...form.querySelectorAll("input[name=services]:checked")].map((c) => c.dataset.label);
    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone) || "";
    const fields = [
      ["Name", v("name")], ["Email", v("email")], ["Business", v("business")],
      ["Phone", v("phone")], ["Website", v("website")],
      ["Services of interest", services.join(", ")],
      ["What they want to achieve", v("goal")],
      ["Preferred date", v("date")], ["Preferred time", v("time")],
      ["Visitor timezone", v("date") || v("time") ? tz : ""],
      ["Notes", v("notes")],
    ].filter((f) => f[1]);
    const subject = "Consultation enquiry from " + v("name");

    if (endpoint) {
      submit.disabled = true;
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(Object.assign({ subject }, Object.fromEntries(fields))),
        });
        if (!res.ok) throw new Error("bad status");
        form.hidden = true;
        const done = $("#form-done");
        done.hidden = false;
        done.focus();
      } catch (err) {
        submit.disabled = false;
        say("Your enquiry could not be sent. Please try again, or email us directly at " + email + ".", "error");
      }
      return;
    }

    /* No form backend configured: hand off to the visitor's email app, honestly. */
    const body = fields.map((f) => f[0] + ": " + f[1]).join("\n");
    location.href = "mailto:" + email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    say("Your email app should now be open with your enquiry filled in. Press send there to complete it. We have not received anything until you do. If nothing opened, email us at " + email + ".");
  });
})();
