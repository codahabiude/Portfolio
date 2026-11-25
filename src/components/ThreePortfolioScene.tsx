import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { SceneControlState, SectionId } from '../types/portfolio.ts';

interface ThreePortfolioSceneProps {
  activeSection: SectionId;
  controls: SceneControlState;
}

const SECTION_COLORS: Record<SectionId, number> = {
  home: 0x00ff88,
  work: 0x00ccff,
  services: 0xa855f7,
  about: 0xf59e0b,
  hire: 0xec4899,
};

const SECTION_CAMERA: Record<SectionId, { x: number; y: number; z: number; lx: number; ly: number }> = {
  home: { x: -1.35, y: 0.65, z: 7.4, lx: -0.9, ly: 0.1 },
  work: { x: 0.0, y: 1.45, z: 8.4, lx: 0.0, ly: -0.15 },
  services: { x: 1.5, y: 0.9, z: 7.6, lx: 0.6, ly: 0.1 },
  about: { x: -1.1, y: 1.15, z: 7.2, lx: -0.4, ly: 0.2 },
  hire: { x: 0.9, y: 0.75, z: 7.5, lx: 0.35, ly: 0.0 },
};

// Module-scope reusable math helpers (zero per-frame GC allocations)
const _targetColor = new THREE.Color();
const _currentColor = new THREE.Color(0x00ff88);
const _dummy = new THREE.Object3D();
const _camGoal = new THREE.Vector3();
const _lookCurrent = new THREE.Vector3();
const _lookGoal = new THREE.Vector3();

function detectSoftwareWebGL(): boolean {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function createGridTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, size, size);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.11)';
    ctx.lineWidth = 1.5;
    const step = 64;
    for (let i = 0; i <= size; i += step) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, size);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(size, i);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(0, 255, 136, 0.38)';
    for (let x = 0; x <= size; x += step * 2) {
      for (let y = 0; y <= size; y += step * 2) {
        ctx.fillRect(x - 2, y - 2, 4, 4);
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(14, 14);
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createDialTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const width = 1024;
  const height = 128;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#181c24';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#94a3b8';
    for (let i = 0; i < 64; i++) {
      const x = (i / 64) * width;
      const tall = i % 4 === 0;
      ctx.fillRect(x, tall ? 18 : 34, 2, tall ? 40 : 20);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function ThreePortfolioScene({ activeSection, controls }: ThreePortfolioSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef({ activeSection, controls });
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  stateRef.current = { activeSection, controls };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSoftwareGl = detectSoftwareWebGL();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);
    renderer.shadowMap.enabled = false;

    const canvasEl = renderer.domElement;
    canvasEl.style.display = 'block';
    canvasEl.style.width = '100%';
    canvasEl.style.height = '100%';
    container.appendChild(canvasEl);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglUnavailable(true);
    };
    const handleContextRestored = () => {
      setWebglUnavailable(false);
    };
    canvasEl.addEventListener('webglcontextlost', handleContextLost);
    canvasEl.addEventListener('webglcontextrestored', handleContextRestored);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050507);
    scene.fog = new THREE.FogExp2(0x050507, 0.042);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(
      SECTION_CAMERA[activeSection].x,
      SECTION_CAMERA[activeSection].y,
      SECTION_CAMERA[activeSection].z
    );

    // 3-point balanced studio lighting rig (warm key + cool hemisphere + accent rim)
    const hemiLight = new THREE.HemisphereLight(0x88b8ff, 0x090b10, 0.65);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1dc, 2.2);
    keyLight.position.set(5, 7, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x00ff88, 12, 22, 1.8);
    rimLight.position.set(-4.5, 2.5, -2.5);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0x00ccff, 5.5, 20, 1.8);
    fillLight.position.set(4.5, -2.0, 2.5);
    scene.add(fillLight);

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const gridTexture = createGridTexture(maxAnisotropy);
    const dialTexture = createDialTexture(maxAnisotropy);

    // Architectural ground spatial grid
    const gridGeo = new THREE.PlaneGeometry(46, 46);
    const gridMat = new THREE.MeshBasicMaterial({
      map: gridTexture,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const groundGrid = new THREE.Mesh(gridGeo, gridMat);
    groundGrid.rotation.x = -Math.PI / 2;
    groundGrid.position.y = -3.35;
    scene.add(groundGrid);

    // Contact shadow grounding plane beneath the gyroscopic core
    const contactCanvas = document.createElement('canvas');
    contactCanvas.width = 256;
    contactCanvas.height = 256;
    const cCtx = contactCanvas.getContext('2d');
    if (cCtx) {
      const grad = cCtx.createRadialGradient(128, 128, 10, 128, 128, 128);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.72)');
      grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.28)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
      cCtx.fillStyle = grad;
      cCtx.fillRect(0, 0, 256, 256);
    }
    const contactTex = new THREE.CanvasTexture(contactCanvas);
    const contactMat = new THREE.MeshBasicMaterial({
      map: contactTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.7,
    });
    const contactPlane = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 6.5), contactMat);
    contactPlane.rotation.x = -Math.PI / 2;
    contactPlane.position.y = -3.33;
    scene.add(contactPlane);

    // Composite 8-part Procedural Gyroscopic Core (THREE.Group)
    const sculptureGroup = new THREE.Group();
    sculptureGroup.position.set(1.25, 0.15, 0);
    scene.add(sculptureGroup);

    // 1. Primary Faceted Obsidian Core
    const coreGeo = new THREE.IcosahedronGeometry(1.05, 0);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x11151d,
      metalness: 0.92,
      roughness: 0.14,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    sculptureGroup.add(coreMesh);

    // 2. Inner Glowing Lattice Shell (explodes outward)
    const latticeGeo = new THREE.IcosahedronGeometry(1.18, 1);
    const latticeMat = new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      emissive: 0x00ff88,
      emissiveIntensity: 0.55,
      wireframe: true,
      roughness: 0.35,
      metalness: 0.5,
      transparent: true,
      opacity: 0.75,
    });
    const latticeMesh = new THREE.Mesh(latticeGeo, latticeMat);
    sculptureGroup.add(latticeMesh);

    // 3. Primary Anodized Titanium Gimbal Ring
    const ring1Geo = new THREE.TorusGeometry(1.88, 0.045, 24, 96);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      metalness: 0.94,
      roughness: 0.18,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI * 0.34;
    sculptureGroup.add(ring1);

    // 4. Secondary Matte Carbon Gimbal Ring (roughness contrast >= 0.35)
    const ring2Geo = new THREE.TorusGeometry(2.35, 0.04, 20, 96);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x262c38,
      metalness: 0.45,
      roughness: 0.62,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI * 0.28;
    ring2.rotation.x = -Math.PI * 0.22;
    sculptureGroup.add(ring2);

    // 5. Calibrated Equatorial Dial Ring with procedural dial texture
    const ring3Geo = new THREE.TorusGeometry(2.82, 0.032, 16, 112);
    const ring3Mat = new THREE.MeshStandardMaterial({
      map: dialTexture,
      metalness: 0.85,
      roughness: 0.28,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.x = Math.PI * 0.48;
    sculptureGroup.add(ring3);

    // 6. Architectural Axis Struts (4 opposing calibration pins)
    const strutGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.52, 12);
    const strutMat = new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      emissive: 0x00ff88,
      emissiveIntensity: 0.35,
      metalness: 0.8,
      roughness: 0.25,
    });
    const struts: THREE.Mesh[] = [];
    const strutDirs: [number, number, number][] = [
      [1, 0, 0],
      [-1, 0, 0],
      [0, 1, 0],
      [0, -1, 0],
    ];
    strutDirs.forEach(([dx, dy, dz]) => {
      const strut = new THREE.Mesh(strutGeo, strutMat);
      strut.position.set(dx * 1.45, dy * 1.45, dz * 1.45);
      if (dx !== 0) strut.rotation.z = Math.PI / 2;
      strut.userData.baseDir = new THREE.Vector3(dx, dy, dz);
      struts.push(strut);
      sculptureGroup.add(strut);
    });

    // 7. 24 Instanced Orbital Beacon Nodes around outer rings
    const NODE_COUNT = 24;
    const nodeGeo = new THREE.OctahedronGeometry(0.06, 0);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00ff88,
      emissiveIntensity: 0.9,
      metalness: 0.6,
      roughness: 0.2,
    });
    const instancedNodes = new THREE.InstancedMesh(nodeGeo, nodeMat, NODE_COUNT);
    instancedNodes.frustumCulled = false;
    for (let i = 0; i < NODE_COUNT; i++) {
      const angle = (i / NODE_COUNT) * Math.PI * 2;
      const radius = i % 2 === 0 ? 2.82 : 1.88;
      _dummy.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      _dummy.scale.setScalar(i % 4 === 0 ? 1.3 : 0.85);
      _dummy.updateMatrix();
      instancedNodes.setMatrixAt(i, _dummy.matrix);
    }
    instancedNodes.instanceMatrix.needsUpdate = true;
    instancedNodes.computeBoundingSphere();
    ring3.add(instancedNodes);

    // 8. Ambient Spatial Particle Field
    const STAR_COUNT = 260;
    const starPositions = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 26;
      starPositions[i * 3 + 1] = (Math.random() - 0.25) * 14;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 3;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.045,
      transparent: true,
      opacity: 0.65,
      sizeAttenuation: true,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Pointer parallax tracking
    const pointer = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation loop with software WebGL pacing
    let frameId = 0;
    let disposed = false;
    let currentExplode = 0;
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl.fenceSync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const status = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
        if (status === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const { activeSection: sec, controls: ctrl } = stateRef.current;

      // Resolve target accent color
      let targetHex = SECTION_COLORS[sec] ?? SECTION_COLORS.home;
      if (ctrl.spectrumMode === 'emerald') targetHex = 0x00ff88;
      if (ctrl.spectrumMode === 'cobalt') targetHex = 0x00ccff;
      _targetColor.setHex(targetHex);
      _currentColor.lerp(_targetColor, 1 - Math.exp(-4.5 * delta));

      rimLight.color.copy(_currentColor);
      latticeMat.color.copy(_currentColor);
      latticeMat.emissive.copy(_currentColor);
      strutMat.color.copy(_currentColor);
      strutMat.emissive.copy(_currentColor);
      nodeMat.emissive.copy(_currentColor);

      // Exploded assembly smooth damping
      currentExplode = THREE.MathUtils.damp(currentExplode, ctrl.explodeFactor, 6.5, delta);
      const latticeScale = 1 + currentExplode * 0.42;
      latticeMesh.scale.setScalar(latticeScale);
      latticeMat.wireframe = ctrl.wireframeOverlay;
      latticeMat.opacity = ctrl.wireframeOverlay ? 0.78 : 0.25;

      ring1.scale.setScalar(1 + currentExplode * 0.22);
      ring2.scale.setScalar(1 + currentExplode * 0.35);
      ring3.scale.setScalar(1 + currentExplode * 0.48);

      for (let i = 0; i < struts.length; i++) {
        const s = struts[i];
        const dir = s.userData.baseDir as THREE.Vector3;
        const dist = 1.45 + currentExplode * 0.95;
        s.position.set(dir.x * dist, dir.y * dist, dir.z * dist);
      }

      // Spin speeds
      const speedMult = prefersReducedMotion
        ? 0
        : ctrl.speedMode === 'paused'
          ? 0
          : ctrl.speedMode === 'hyper'
            ? 2.4
            : 0.75;

      coreMesh.rotation.y += delta * 0.28 * speedMult;
      coreMesh.rotation.x += delta * 0.14 * speedMult;
      latticeMesh.rotation.y -= delta * 0.22 * speedMult;
      ring1.rotation.z += delta * 0.42 * speedMult;
      ring2.rotation.x += delta * 0.32 * speedMult;
      ring3.rotation.z -= delta * 0.24 * speedMult;
      starField.rotation.y += delta * 0.03 * speedMult;

      // Responsive sculpture horizontal offset on wide screens
      const isNarrow = window.innerWidth < 1024;
      const targetSculptX = isNarrow ? 0 : sec === 'home' ? 1.55 : sec === 'about' ? -1.45 : 1.15;
      sculptureGroup.position.x = THREE.MathUtils.damp(sculptureGroup.position.x, targetSculptX, 4.5, delta);

      // Smooth camera preset + pointer parallax
      const preset = SECTION_CAMERA[sec] ?? SECTION_CAMERA.home;
      const parallaxX = prefersReducedMotion ? 0 : pointer.x * 0.42;
      const parallaxY = prefersReducedMotion ? 0 : pointer.y * 0.26;

      _camGoal.set(
        (isNarrow ? 0 : preset.x) + parallaxX,
        preset.y + parallaxY,
        isNarrow ? preset.z + 1.8 : preset.z
      );
      camera.position.x = THREE.MathUtils.damp(camera.position.x, _camGoal.x, 4.2, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, _camGoal.y, 4.2, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, _camGoal.z, 4.2, delta);

      _lookGoal.set(isNarrow ? 0 : preset.lx, preset.ly, 0);
      _lookCurrent.x = THREE.MathUtils.damp(_lookCurrent.x, _lookGoal.x, 4.2, delta);
      _lookCurrent.y = THREE.MathUtils.damp(_lookCurrent.y, _lookGoal.y, 4.2, delta);
      camera.lookAt(_lookCurrent);

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      canvasEl.removeEventListener('webglcontextlost', handleContextLost);
      canvasEl.removeEventListener('webglcontextrestored', handleContextRestored);

      coreGeo.dispose();
      coreMat.dispose();
      latticeGeo.dispose();
      latticeMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      strutGeo.dispose();
      strutMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      gridGeo.dispose();
      gridMat.dispose();
      gridTexture.dispose();
      dialTexture.dispose();
      contactPlane.geometry.dispose();
      contactMat.dispose();
      contactTex.dispose();
      envTex.dispose();
      renderer.dispose();
      if (canvasEl.parentNode === container) {
        container.removeChild(canvasEl);
      }
    };
  }, []);

  if (webglUnavailable) {
    return (
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_72%_32%,rgba(0,255,136,0.12),transparent_48%),radial-gradient(circle_at_24%_78%,rgba(0,204,255,0.09),transparent_42%),#050507]"
      />
    );
  }

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
