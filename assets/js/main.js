// CTC 2026 — shared scripts
(function () {
  // Portrait fallback: if a photo file is missing, show the monogram instead
  document.querySelectorAll("[data-photo] img").forEach((img) => {
    const fail = () => img.closest("[data-photo]").classList.add("no-photo");
    if (img.complete && img.naturalWidth === 0) fail();
    img.addEventListener("error", fail);
  });

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
