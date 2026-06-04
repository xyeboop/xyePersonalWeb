/**
 * 3D Particle Nebula Background — Three.js
 * Cosmic starfield with slow rotation and mouse parallax.
 */
(function () {
  // ── Configuration ──────────────────────────────────────────────
  const PARTICLE_COUNT = 3000;
  const SPREAD = 800;
  const ROTATION_SPEED = 0.00015;
  const PARALLAX_STRENGTH = 2.5;

  // ── Scene setup ────────────────────────────────────────────────
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    3000
  );
  camera.position.z = 600;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // ── Inject canvas into the DOM ─────────────────────────────────
  const container = document.getElementById("particle-bg");
  if (container) {
    container.appendChild(renderer.domElement);
  } else {
    document.body.prepend(renderer.domElement);
    renderer.domElement.style.position = "fixed";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.zIndex = "-1";
    renderer.domElement.style.pointerEvents = "none";
  }

  // ── Glow sprite texture (canvas-generated soft circle) ─────────
  function createGlowTexture(size, color, falloff) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, color);
    gradient.addColorStop(falloff, color);
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    return new THREE.CanvasTexture(canvas);
  }

  // Create varied textures for size/color variation
  const texBright = createGlowTexture(64, "rgba(220,235,255,1)", 0.15);
  const texMedium = createGlowTexture(64, "rgba(180,200,230,0.85)", 0.25);
  const texDim = createGlowTexture(48, "rgba(140,170,210,0.6)", 0.35);

  // ── Particle system ────────────────────────────────────────────
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);
  const colors = new Float32Array(PARTICLE_COUNT * 3);

  const colorPalette = [
    new THREE.Color("#e8f0ff"), // ice white
    new THREE.Color("#c8ddf8"), // soft ice blue
    new THREE.Color("#a0c4e8"), // muted blue
    new THREE.Color("#d8e8f8"), // silver blue
    new THREE.Color("#f0f4fa"), // near white
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Spread particles in a sphere-like volume with some clustering
    const radius = SPREAD * (0.3 + Math.random() * 0.7);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    // Add some planar bias for "nebula" feel — flatten Y somewhat
    const flatFactor = 0.4 + Math.random() * 0.6;
    positions[i * 3] = Math.cos(theta) * Math.sin(phi) * radius;
    positions[i * 3 + 1] = Math.cos(phi) * radius * flatFactor * 0.5;
    positions[i * 3 + 2] = Math.sin(theta) * Math.sin(phi) * radius * flatFactor - SPREAD * 0.5;

    // Varied sizes — distant particles smaller
    const distFromCenter = Math.sqrt(
      positions[i * 3] ** 2 +
      positions[i * 3 + 1] ** 2 +
      positions[i * 3 + 2] ** 2
    );
    sizes[i] = (0.5 + Math.random() * 3.5) * (1 - distFromCenter / SPREAD * 0.5);

    // Assign colors from palette
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    const variation = 0.85 + Math.random() * 0.15;
    colors[i * 3] = color.r * variation;
    colors[i * 3 + 1] = color.g * variation;
    colors[i * 3 + 2] = color.b * variation;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  function createPointCloud(count, spriteTex, sizeRange, opacity) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = SPREAD * (0.2 + Math.random() * 0.8);
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const ff = 0.3 + Math.random() * 0.7;
      pos[i * 3] = Math.cos(th) * Math.sin(ph) * r;
      pos[i * 3 + 1] = Math.cos(ph) * r * ff * 0.4;
      pos[i * 3 + 2] = Math.sin(th) * Math.sin(ph) * r * ff - SPREAD * 0.5;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({
      map: spriteTex,
      size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      transparent: true,
      opacity: opacity,
      color: new THREE.Color("#e0ebff"),
    });

    return new THREE.Points(geo, mat);
  }

  // Three cloud layers at different scales for depth
  const cloud1 = createPointCloud(1200, texBright, [2.5, 5.5], 0.9);
  const cloud2 = createPointCloud(1000, texMedium, [1.5, 3.5], 0.7);
  const cloud3 = createPointCloud(800, texDim, [1.0, 2.5], 0.5);

  const particleGroup = new THREE.Group();
  particleGroup.add(cloud1);
  particleGroup.add(cloud2);
  particleGroup.add(cloud3);
  scene.add(particleGroup);

  // ── Background gradient overlay via a subtle plane ─────────────
  const bgGeo = new THREE.PlaneGeometry(2000, 2000);
  const bgMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec2 vUv;
      uniform float uTime;
      void main() {
        vec3 topColor = vec3(0.02, 0.03, 0.06);
        vec3 midColor = vec3(0.01, 0.02, 0.04);
        vec3 botColor = vec3(0.03, 0.04, 0.07);
        float mixVal = vUv.y;
        vec3 col = mix(botColor, midColor, smoothstep(0.3, 0.7, mixVal));
        col = mix(col, topColor, smoothstep(0.7, 1.0, mixVal));
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    depthWrite: false,
    depthTest: false,
  });
  const bgPlane = new THREE.Mesh(bgGeo, bgMat);
  bgPlane.position.z = -900;
  scene.add(bgPlane);

  // ── Mouse tracking ─────────────────────────────────────────────
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

  document.addEventListener("mousemove", (e) => {
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // ── Resize handler ─────────────────────────────────────────────
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    bgMat.uniforms.uResolution.value.set(
      window.innerWidth,
      window.innerHeight
    );
  });

  // ── Animation loop ─────────────────────────────────────────────
  function animate() {
    requestAnimationFrame(animate);

    // Smooth mouse interpolation (lerp) — faster response
    mouse.x += (mouse.targetX - mouse.x) * 0.04;
    mouse.y += (mouse.targetY - mouse.y) * 0.04;

    // Slow rotation of the particle cloud
    particleGroup.rotation.y += ROTATION_SPEED;
    particleGroup.rotation.x += ROTATION_SPEED * 0.3;

    // Parallax camera offset based on mouse position
    camera.position.x +=
      (mouse.x * PARALLAX_STRENGTH * 120 - camera.position.x) * 0.03;
    camera.position.y +=
      (mouse.y * PARALLAX_STRENGTH * 80 - camera.position.y) * 0.03;
    camera.lookAt(0, -50, -200);

    renderer.render(scene, camera);
  }

  animate();
})();
