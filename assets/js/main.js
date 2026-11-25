// CTC 2026 — shared scripts
(function () {
  // Nav background after scrolling
  const nav = document.querySelector(".nav");
  const onScroll = () => nav && nav.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Portrait fallback: if a photo file is missing, show the monogram instead
  document.querySelectorAll("[data-photo] img").forEach((img) => {
    const fail = () => img.closest("[data-photo]").classList.add("no-photo");
    if (img.complete && img.naturalWidth === 0) fail();
    img.addEventListener("error", fail);
  });

  // Fade content in as it scrolls into view
  document.querySelectorAll([
    ".section-head", ".about__photo", ".about__statement", ".about__cols > div", ".honoree__photo", ".honoree__text",
    ".prog__part > h3", ".prog__part > p", ".day", ".speakers > li",
    ".block > h2", ".prose > *", ".facts", ".sub", ".timeline li", ".interests",
    ".pubs li", ".joint-intro", ".links", ".book", ".next", ".footer > .wrap",
  ].join(",")).forEach((el) => el.classList.add("reveal"));
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const fadeIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        fadeIO.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -24px 0px" });
    reveals.forEach((el) => fadeIO.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  // ---------- Scroll progress: vertical line, marker shows the current section ----------
  const named = [...document.querySelectorAll("[data-name]")];
  if (named.length) {
    const bar = document.createElement("div");
    bar.className = "progress";
    bar.setAttribute("aria-hidden", "true");
    bar.innerHTML = '<span class="progress__fill"></span><span class="progress__dot"><span class="progress__name"></span></span>';
    document.body.append(bar);
    const [fill, dot] = bar.children, name = dot.firstChild;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      let cur = named[0];
      named.forEach((s) => { if (s.getBoundingClientRect().top <= window.innerHeight * .45) cur = s; });
      name.textContent = cur.dataset.name;
      fill.style.transform = `scaleY(${p})`;
      // Keep the whole label inside the track at both ends
      const h = bar.clientHeight, half = name.offsetHeight / 2;
      dot.style.top = `${half + p * (h - 2 * half)}px`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("load", update);
  }

  // ---------- Profile sub-navigation: highlight the section in view ----------
  const links = document.querySelectorAll(".pnav a[href^='#']");
  if (links.length && "IntersectionObserver" in window) {
    const map = new Map([...links].map((a) => [a.getAttribute("href").slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          links.forEach((a) => a.classList.remove("is-active"));
          const a = map.get(en.target.id); if (a) a.classList.add("is-active");
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }
})();
