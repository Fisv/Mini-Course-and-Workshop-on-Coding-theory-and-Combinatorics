// CTC 2026 — shared scripts
(function () {
  // Portrait fallback: if a photo file is missing, show the monogram instead
  document.querySelectorAll("[data-photo] img").forEach((img) => {
    const fail = () => img.closest("[data-photo]").classList.add("no-photo");
    if (img.complete && img.naturalWidth === 0) fail();
    img.addEventListener("error", fail);
  });

  // ---------- Scroll progress: horizontal bar under the sticky header, label shows the current section ----------
  const navLinks = [...document.querySelectorAll(".pnav a[href^='#']")];
  const menu = navLinks.length ? navLinks : [...document.querySelectorAll(".nav__links a[href^='#']")];
  const stops = menu
    .map((a) => ({ a, el: document.getElementById(a.getAttribute("href").slice(1)) }))
    .filter((x) => x.el);
  if (stops.length) {
    const host = document.querySelector(".pnav") || document.querySelector(".nav");
    const h1 = document.querySelector(".phero__name");
    const startName = h1 ? h1.textContent.trim() : "Home";
    const bar = document.createElement("div");
    bar.className = "sprog";
    bar.setAttribute("aria-hidden", "true");
    bar.innerHTML = '<span class="sprog__fill"></span><span class="sprog__label"></span>';
    document.body.append(bar);
    const [fill, label] = bar.children;
    let last;
    const update = () => {
      const top = host ? Math.max(0, host.getBoundingClientRect().bottom) : 0;
      bar.style.top = `${top}px`;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      fill.style.transform = `scaleX(${p})`;
      let cur = null;
      stops.forEach((x) => { if (x.el.getBoundingClientRect().top <= top + window.innerHeight * 0.35) cur = x; });
      if (p > 0.995) cur = stops[stops.length - 1];
      if (cur !== last) {
        last = cur;
        label.textContent = cur ? cur.a.textContent.trim() : startName;
        menu.forEach((a) => a.classList.toggle("is-active", !!cur && a === cur.a));
      }
      const w = bar.clientWidth, lw = label.offsetWidth, pad = 8;
      const x = Math.min(w - lw - pad, Math.max(pad, p * w - lw / 2));
      label.style.transform = `translateX(${x}px)`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("load", update);
  }

})();
