/**
 * Ting Lab — Personal Homepage
 * Smooth scroll, nav highlighting, BorderGlow mouse tracking, video modal.
 */
document.addEventListener("DOMContentLoaded", () => {
  // ── Smooth scroll for anchor links ───────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ── Active nav link highlight on click ───────────────────────
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // ── BorderGlow: mouse tracking on CTA button ─────────────────
  const ctaBtn = document.querySelector(".cta-btn");
  if (!ctaBtn) return;

  function getCenter(el) {
    const { width, height } = el.getBoundingClientRect();
    return [width / 2, height / 2];
  }

  function getEdgeProximity(el, x, y) {
    const [cx, cy] = getCenter(el);
    const dx = x - cx;
    const dy = y - cy;
    let kx = Infinity, ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }

  function getCursorAngle(el, x, y) {
    const [cx, cy] = getCenter(el);
    const dx = x - cx;
    const dy = y - cy;
    if (dx === 0 && dy === 0) return 0;
    const radians = Math.atan2(dy, dx);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  }

  ctaBtn.addEventListener("pointermove", (e) => {
    const rect = ctaBtn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const edge = getEdgeProximity(ctaBtn, x, y);
    const angle = getCursorAngle(ctaBtn, x, y);
    ctaBtn.style.setProperty("--edge-proximity", (edge * 100).toFixed(3));
    ctaBtn.style.setProperty("--cursor-angle", angle.toFixed(3) + "deg");
  });
});
