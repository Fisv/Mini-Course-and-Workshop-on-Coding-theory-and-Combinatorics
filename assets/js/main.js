// CTC 2026 — shared scripts
(function () {
  // Portrait fallback: if a photo file is missing, show the monogram instead
  document.querySelectorAll("[data-photo] img").forEach((img) => {
    const fail = () => img.closest("[data-photo]").classList.add("no-photo");
    if (img.complete && img.naturalWidth === 0) fail();
    img.addEventListener("error", fail);
  });

  // ---------- Scroll progress: vertical line on the right edge, label shows the current section ----------
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
    bar.innerHTML = '<span class="sprog__fill"></span><span class="sprog__dot"></span><span class="sprog__label"></span>';
    document.body.append(bar);
    const [fill, dot, label] = bar.children;
    let last;
    const update = () => {
      const top = host ? Math.max(0, host.getBoundingClientRect().bottom) : 0;
      bar.style.top = `${top + 24}px`;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      fill.style.transform = `scaleY(${p})`;
      let cur = null;
      stops.forEach((x) => { if (x.el.getBoundingClientRect().top <= top + window.innerHeight * 0.35) cur = x; });
      if (p > 0.995) cur = stops[stops.length - 1];
      if (cur !== last) {
        last = cur;
        label.textContent = cur ? cur.a.textContent.trim() : startName;
        menu.forEach((a) => a.classList.toggle("is-active", !!cur && a === cur.a));
      }
      // Dot rides the line; the label is centred on it but kept inside the track at both ends
      const h = bar.clientHeight, lh = label.offsetHeight;
      dot.style.transform = `translateY(${p * h}px)`;
      const y = Math.min(h - lh, Math.max(0, p * h - lh / 2));
      label.style.transform = `translateY(${y}px)`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("load", update);
  }

})();
