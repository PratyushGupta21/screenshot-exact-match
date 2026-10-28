import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface ParticleCloudBackgroundProps {
  className?: string;
}

/**
 * Checks if WebGL rendering is available in the current browser.
 */
function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") ||
          canvas.getContext("webgl") ||
          canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
}

/**
 * Checks user's motion preference.
 */
function checkReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Linear interpolation utility.
 */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Generates geometry for a refined, sculpted, hollow twisted torus particle ring.
 * Features thousands of distinct tiny particles with a prominent central opening.
 */
function createRingGeometry(count: number): THREE.BufferGeometry {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const tangents = new Float32Array(count * 3);
  const normals = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);
  const uValues = new Float32Array(count);

  // Proportions calibrated for a clearly visible central hole and elegant negative space
  const R0 = 1.85; // Major radius
  const r0 = 0.42; // Minor tube radius (hole diameter is ~2.86 units, outer diameter ~4.54 units)

  for (let i = 0; i < count; i++) {
    // Parameter u along the main loop [0, 2π)
    const u = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * ((Math.PI * 2) / count);
    const v = Math.random() * Math.PI * 2;

    // Organic harmonic modulation of major radius
    const Ru = R0 * (1.0 + 0.07 * Math.cos(3 * u) + 0.03 * Math.sin(2 * u));

    // 3D centerline spine with saddle curvature
    const Cx = Ru * Math.cos(u);
    const Cy = Ru * Math.sin(u);
    const Cz = 0.38 * Math.sin(2 * u) + 0.12 * Math.cos(3 * u);

    // Analytic derivative along u to find local tangent vector
    const dRu = R0 * (-0.21 * Math.sin(3 * u) + 0.06 * Math.cos(2 * u));
    const dTx = dRu * Math.cos(u) - Ru * Math.sin(u);
    const dTy = dRu * Math.sin(u) + Ru * Math.cos(u);
    const dTz = 0.76 * Math.cos(2 * u) - 0.36 * Math.sin(3 * u);
    const tLen = Math.sqrt(dTx * dTx + dTy * dTy + dTz * dTz) || 1;
    const tx = dTx / tLen;
    const ty = dTy / tLen;
    const tz = dTz / tLen;

    // Local orthonormal frame: Normal and Binormal vectors
    const upX = 0, upY = 0, upZ = 1;
    let nx = upY * tz - upZ * ty;
    let ny = upZ * tx - upX * tz;
    let nz = upX * ty - upY * tx;
    let nLen = Math.sqrt(nx * nx + ny * ny + nz * nz);
    if (nLen < 0.001) {
      nx = 1; ny = 0; nz = 0;
    } else {
      nx /= nLen; ny /= nLen; nz /= nLen;
    }
    const bx = ty * nz - tz * ny;
    const by = tz * nx - tx * nz;
    const bz = tx * ny - ty * nx;

    // Elliptical twisted cross-section: 2 full organic twists around the loop
    const theta = v + 2.0 * u;
    const w = r0 * (1.0 + 0.22 * Math.cos(2 * u));
    const h = r0 * 0.58;

    // Particles distributed along the ribbon surface with subtle shell thickness
    const rho = 0.82 + 0.18 * (Math.random() - 0.5);
    const thickness = (Math.random() - 0.5) * 0.15;

    const ox = ((rho * w + thickness) * Math.cos(theta)) * nx + ((rho * h + thickness) * Math.sin(theta)) * bx;
    const oy = ((rho * w + thickness) * Math.cos(theta)) * ny + ((rho * h + thickness) * Math.sin(theta)) * by;
    const oz = ((rho * w + thickness) * Math.cos(theta)) * nz + ((rho * h + thickness) * Math.sin(theta)) * bz;

    // Gentle micro-dispersion for a fine particulate cloud structure
    const dx = 0.035 * Math.sin(5 * u + 4 * v);
    const dy = 0.035 * Math.cos(4 * u + 5 * v);
    const dz = 0.045 * Math.sin(3 * u + 6 * v);

    positions[i * 3] = Cx + ox + dx;
    positions[i * 3 + 1] = Cy + oy + dy;
    positions[i * 3 + 2] = Cz + oz + dz;

    tangents[i * 3] = tx;
    tangents[i * 3 + 1] = ty;
    tangents[i * 3 + 2] = tz;

    // Outward surface normal
    normals[i * 3] = Math.cos(theta) * nx + Math.sin(theta) * bx;
    normals[i * 3 + 1] = Math.cos(theta) * ny + Math.sin(theta) * by;
    normals[i * 3 + 2] = Math.cos(theta) * nz + Math.sin(theta) * bz;

    // Refined color distribution:
    // ~10% Sparse lavender particles
    // ~60% Pure & soft white
    // ~30% Slate & soft grey
    const rand = Math.random();
    if (rand < 0.10) {
      // Sparse lavender particles
      const lavType = Math.random();
      if (lavType < 0.4) {
        // Soft glowing lavender
        colors[i * 3] = 0.78; colors[i * 3 + 1] = 0.70; colors[i * 3 + 2] = 0.95;
      } else if (lavType < 0.75) {
        // Pale ethereal lavender
        colors[i * 3] = 0.86; colors[i * 3 + 1] = 0.82; colors[i * 3 + 2] = 0.98;
      } else {
        // Deeper lavender accent
        colors[i * 3] = 0.68; colors[i * 3 + 1] = 0.58; colors[i * 3 + 2] = 0.90;
      }
      sizes[i] = 1.1 + Math.random() * 0.7;
    } else if (rand < 0.70) {
      // Crisp white & soft white
      const b = 0.90 + Math.random() * 0.10;
      colors[i * 3] = b; colors[i * 3 + 1] = b; colors[i * 3 + 2] = b;
      sizes[i] = 0.85 + Math.random() * 0.65;
    } else {
      // Slate & soft grey tones for depth
      const g = 0.45 + Math.random() * 0.25;
      colors[i * 3] = g * 0.92; colors[i * 3 + 1] = g * 0.95; colors[i * 3 + 2] = g;
      sizes[i] = 0.75 + Math.random() * 0.55;
    }

    phases[i] = Math.random() * Math.PI * 2;
    uValues[i] = u;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aTangent", new THREE.BufferAttribute(tangents, 3));
  geometry.setAttribute("aNormal", new THREE.BufferAttribute(normals, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
  geometry.setAttribute("aU", new THREE.BufferAttribute(uValues, 1));

  return geometry;
}

const vertexShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseInfluence;
uniform float uPixelRatio;
uniform float uReducedMotion;

attribute vec3 aTangent;
attribute vec3 aNormal;
attribute float aSize;
attribute float aPhase;
attribute float aU;

varying vec3 vColor;
varying float vAlpha;

void main() {
  vec3 pos = position;

  // Gentle, smooth surface drift along the ring contour
  if (uReducedMotion < 0.5) {
    float surfaceDrift = sin(aU * 2.0 + uTime * 0.3) * 0.035;
    pos += aTangent * surfaceDrift;

    float breathing = sin(uTime * 0.6 + aPhase) * 0.018;
    pos += aNormal * breathing;
  }

  // Refined pointer turbulence: localized, elegant stir with smooth spring settle
  if (uReducedMotion < 0.5 && uMouseInfluence > 0.001) {
    vec2 diff = pos.xy - uMouse;
    float dist = length(diff);
    float radius = 1.45;

    if (dist < radius) {
      float normDist = dist / radius;
      float factor = (1.0 - normDist);
      factor = factor * factor * uMouseInfluence;

      // Swirl around pointer
      vec3 pointerSwirl = vec3(-diff.y, diff.x, sin(diff.x * 2.5) * 0.25) / (dist + 0.25);
      vec3 stirDir = (aTangent * 0.6 + pointerSwirl * 0.4);
      pos += stirDir * (factor * 0.24);
    }
  }

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Dimensional lighting and directional shading
  vec3 lightDir = normalize(vec3(0.4, 0.75, 1.1));
  vec3 worldNormal = normalize(mat3(modelMatrix) * aNormal);
  float NdotL = dot(worldNormal, lightDir);
  float diffuse = clamp(NdotL * 0.30 + 0.70, 0.40, 1.0);

  // Depth-based tone: particles on the front arc are brighter, rear arc seen through the hole is softer
  float depthFade = smoothstep(-1.2, 1.0, pos.z);
  vColor = color * diffuse;

  // Tiny, sharp screen point sizes: between 1.2px and 3.0px
  float size = aSize * uPixelRatio * (22.0 / -mvPosition.z);
  gl_PointSize = clamp(size, 1.0, 3.2);

  // Controlled, non-overexposed alpha
  vAlpha = mix(0.40, 0.85, depthFade);
}
`;

const fragmentShader = `
uniform float uOpacity;
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  if (dist > 0.5) {
    discard;
  }

  // Crisp circular particle with fine edge falloff (no large blurry halo)
  float intensity = smoothstep(0.5, 0.2, dist);
  gl_FragColor = vec4(vColor, intensity * vAlpha * uOpacity);
}
`;

/**
 * ParticleCloudBackground — Real-time WebGL particle cloud forming a sculpted,
 * hollow, twisted ring with distinct white, soft-grey, and sparse lavender particles.
 */
export function ParticleCloudBackground({ className = "" }: ParticleCloudBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!checkWebGLSupport()) {
      setIsSupported(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const isMobile = width < 768;
    // Calibrated particle count for distinct starlight clarity
    const particleCount = isMobile ? 10000 : 24000;

    // Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: false,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      setIsSupported(false);
      return;
    }

    // Pure black background #000000
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const canvas = renderer.domElement;
    canvas.className = "w-full h-full pointer-events-none block";
    container.appendChild(canvas);

    // Particle Group & Geometry
    const particleGroup = new THREE.Group();
    const geometry = createRingGeometry(particleCount);

    // Position ring slightly to the right of center with generous negative space
    const updateLayout = (w: number) => {
      if (w < 768) {
        // Mobile: centered, large enough to be a recognizable background ring
        particleGroup.position.set(0.0, -0.1, 0);
        particleGroup.scale.setScalar(0.88);
      } else if (w < 1024) {
        // Tablet: shifted right, prominently sized
        particleGroup.position.set(0.4, 0.0, 0);
        particleGroup.scale.setScalar(1.10);
      } else {
        // Desktop: right-of-center, substantially larger — spans ~55–65% vh
        particleGroup.position.set(1.0, 0.05, 0);
        particleGroup.scale.setScalar(1.45);
      }
    };
    updateLayout(width);

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(999, 999) },
      uMouseInfluence: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
      uReducedMotion: { value: checkReducedMotion() ? 1.0 : 0.0 },
      uOpacity: { value: 0.90 },
    };

    // Use NormalBlending to prevent additive blowout/merging into a solid white blob
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      vertexColors: true,
    });

    const particleSystem = new THREE.Points(geometry, material);
    particleGroup.add(particleSystem);
    scene.add(particleGroup);

    // Set initial elegant oblique tilt revealing the deep hollow center
    particleGroup.rotation.x = -0.24;
    particleGroup.rotation.y = 0.22;

    // Interaction State
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseInfluence = 0;
    let lastPointerTime = performance.now();

    const handlePointerMove = (e: PointerEvent) => {
      if (checkReducedMotion()) return;
      const now = performance.now();
      const dt = Math.max(1, now - lastPointerTime);
      lastPointerTime = now;

      const rect = container.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const py = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      const dx = px - targetMouseX;
      const dy = py - targetMouseY;
      const speed = Math.sqrt(dx * dx + dy * dy) / (dt * 0.001);

      targetMouseX = Math.max(-1.5, Math.min(1.5, px));
      targetMouseY = Math.max(-1.5, Math.min(1.5, py));

      // Controlled velocity response without harsh spikes
      const speedSpike = Math.min(0.8, speed * 0.25);
      mouseInfluence = Math.min(1.0, mouseInfluence + speedSpike + 0.10);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (checkReducedMotion() || !e.touches[0]) return;
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      const px = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      const py = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);

      targetMouseX = Math.max(-1.5, Math.min(1.5, px));
      targetMouseY = Math.max(-1.5, Math.min(1.5, py));
      mouseInfluence = Math.min(0.8, mouseInfluence + 0.25);
    };

    const handlePointerLeave = () => {
      targetMouseX = 0;
      targetMouseY = 0;
    };

    // Attach passive listeners
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    // Handle Reduced Motion changes dynamically
    const motionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (e: MediaQueryListEvent) => {
      uniforms.uReducedMotion.value = e.matches ? 1.0 : 0.0;
    };
    motionMediaQuery.addEventListener("change", handleMotionChange);

    // Resize Observer
    const handleResize = () => {
      if (!container || !renderer) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      const pr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(pr);
      uniforms.uPixelRatio.value = pr;

      updateLayout(width);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      const reduced = uniforms.uReducedMotion.value > 0.5;

      // Mouse lerp and smooth settle
      mouseX = lerp(mouseX, targetMouseX, 0.06);
      mouseY = lerp(mouseY, targetMouseY, 0.06);

      mouseInfluence = lerp(mouseInfluence, 0, 0.035);
      if (mouseInfluence < 0.001) mouseInfluence = 0;

      // Subtle, controlled camera response
      if (!reduced) {
        const targetCamX = mouseX * 0.22;
        const targetCamY = mouseY * 0.15;
        camera.position.x = lerp(camera.position.x, targetCamX, 0.035);
        camera.position.y = lerp(camera.position.y, targetCamY, 0.035);
        camera.lookAt(particleGroup.position.x * 0.25, 0, 0);
      } else {
        camera.position.set(0, 0, 7.5);
        camera.lookAt(particleGroup.position.x * 0.25, 0, 0);
      }

      // Convert screen pointer to particleGroup local space
      const fovY = (camera.fov * Math.PI) / 180;
      const viewH = 2 * Math.tan(fovY / 2) * camera.position.z;
      const viewW = viewH * camera.aspect;

      const worldMouseX = (mouseX * viewW) / 2 + camera.position.x;
      const worldMouseY = (mouseY * viewH) / 2 + camera.position.y;

      const localMouseX = (worldMouseX - particleGroup.position.x) / particleGroup.scale.x;
      const localMouseY = (worldMouseY - particleGroup.position.y) / particleGroup.scale.y;

      uniforms.uMouse.value.set(localMouseX, localMouseY);
      uniforms.uMouseInfluence.value = mouseInfluence;
      uniforms.uTime.value = elapsedTime;

      // Slow majestic rotation of the sculpted ring
      if (!reduced) {
        particleGroup.rotation.z += 0.0005;
        particleGroup.rotation.y = Math.sin(elapsedTime * 0.08) * 0.09 + 0.22;
        particleGroup.rotation.x = Math.cos(elapsedTime * 0.06) * 0.06 - 0.24;
      }

      renderer?.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      motionMediaQuery.removeEventListener("change", handleMotionChange);

      geometry.dispose();
      material.dispose();
      renderer?.dispose();
      if (renderer?.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (!isSupported) {
    return <StaticRingFallback className={className} />;
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
      style={{ backgroundColor: "#000000" }}
    />
  );
}

/**
 * Static fallback rendering when WebGL is unavailable.
 */
function StaticRingFallback({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden flex items-center justify-end pr-10 lg:pr-32 ${className}`}
      style={{ backgroundColor: "#000000" }}
    >
      <div className="relative size-[360px] sm:size-[440px] rounded-full opacity-60">
        {/* Outer subtle ring contour */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, transparent 48%, rgba(200, 190, 240, 0.22) 58%, rgba(220, 220, 230, 0.35) 66%, transparent 70%)",
            filter: "blur(2px)",
          }}
        />
        {/* Large hollow opening in the center */}
        <div
          className="absolute inset-[32%] rounded-full"
          style={{
            backgroundColor: "#000000",
            boxShadow: "inset 0 0 25px rgba(0,0,0,0.95)",
          }}
        />
      </div>
    </div>
  );
}
