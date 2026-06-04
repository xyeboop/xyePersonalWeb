/**
 * Custom video controls — play/pause, progress bar seek, time display.
 */
(function () {
  const video = document.getElementById("ai-video");
  const playBtn = document.getElementById("vc-play");
  const playIcon = playBtn?.querySelector(".vc-play-icon");
  const track = document.getElementById("vc-track");
  const fill = document.getElementById("vc-fill");
  const thumb = document.getElementById("vc-thumb");
  const timeDisplay = document.getElementById("vc-time");

  if (!video) return;

  function fmt(t) {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, "0");
    return m + ":" + s;
  }

  // ── Play / Pause ────────────────────────────────────────────
  function updatePlayIcon() {
    playIcon.textContent = video.paused ? "▶" : "⏸"; // ▶ or ⏸
  }

  playBtn.addEventListener("click", () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
    updatePlayIcon();
  });

  video.addEventListener("play", updatePlayIcon);
  video.addEventListener("pause", updatePlayIcon);
  video.addEventListener("ended", () => {
    updatePlayIcon();
    fill.style.width = "100%";
    thumb.style.left = "100%";
    timeDisplay.textContent = fmt(video.duration) + " / " + fmt(video.duration);
  });

  // ── Progress bar ────────────────────────────────────────────
  function setProgress(e) {
    if (!video.duration || !isFinite(video.duration)) return;
    const rect = track.getBoundingClientRect();
    const pct = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    video.currentTime = pct * video.duration;
  }

  let dragging = false;
  track.addEventListener("mousedown", (e) => { dragging = true; setProgress(e); });
  document.addEventListener("mousemove", (e) => { if (dragging) setProgress(e); });
  document.addEventListener("mouseup", () => { dragging = false; });

  // ── Update UI on timeupdate ─────────────────────────────────
  video.addEventListener("timeupdate", () => {
    if (!video.duration || !isFinite(video.duration)) return;
    const pct = (video.currentTime / video.duration) * 100 || 0;
    fill.style.width = pct + "%";
    thumb.style.left = pct + "%";
    timeDisplay.textContent = fmt(video.currentTime) + " / " + fmt(video.duration);
  });

  // ── Click video to toggle play/pause ────────────────────────
  video.addEventListener("click", () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
    updatePlayIcon();
  });

  // Initialize — autoplay after metadata loads
  video.addEventListener("loadedmetadata", () => {
    timeDisplay.textContent = "0:00 / " + fmt(video.duration);
    updatePlayIcon();
    video.play().catch(() => {}); // autoplay; ignore if blocked
  });
})();
