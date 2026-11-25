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

const SECTION_CAMERA: Record<
  SectionId,
  { x: number; y: number; z: number; lx: number; ly: number }
> = {
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

function drawNameBandCanvas(canvas: HTMLCanvasElement): void {
  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = 'rgba(7, 10, 16, 0.72)';
  ctx.fillRect(0, 32, width, height - 64);

  ctx.strokeStyle = 'rgba(77, 255, 51, 0.5)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 34);
  ctx.lineTo(width, 34);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(0, 204, 255, 0.5)';
  ctx.beginPath();
  ctx.moveTo(0, height - 34);
  ctx.lineTo(width, height - 34);
  ctx.stroke();

  ctx.textBaseline = 'middle';
  ctx.font = '700 84px "Chakra Petch", sans-serif';

  const repeats = 2;
  const cellW = width / repeats;
  for (let i = 0; i < repeats; i++) {
    const centerX = cellW * i + cellW * 0.5;
    const codahText = 'CODAH';
    const abiudeText = 'ABIUDE';
    const gap = 36;
    const codahW = ctx.measureText(codahText).width;
    const abiudeW = ctx.measureText(abiudeText).width;
    const totalW = codahW + gap + abiudeW;
    const startX = centerX - totalW / 2;

    const gGrad = ctx.createLinearGradient(startX, 60, startX + codahW, 196);
    gGrad.addColorStop(0, '#b4ff4d');
    gGrad.addColorStop(0.5, '#22e500');
    gGrad.addColorStop(1, '#059669');
    ctx.fillStyle = gGrad;
    ctx.fillText(codahText, startX, height / 2 + 2);

    const bGrad = ctx.createLinearGradient(
      startX + codahW + gap,
      60,
      startX + totalW,
      196
    );
    bGrad.addColorStop(0, '#67e8f9');
    bGrad.addColorStop(0.5, '#00ccff');
    bGrad.addColorStop(1, '#0284c7');
    ctx.fillStyle = bGrad;
    ctx.fillText(abiudeText, startX + codahW + gap, height / 2 + 2);

    // Diamond divider
    const divX = cellW * i + 40;
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(divX, height / 2 - 14);
    ctx.lineTo(divX + 14, height / 2);
    ctx.lineTo(divX, height / 2 + 14);
    ctx.lineTo(divX - 14, height / 2);
    ctx.closePath();
    ctx.fill();
  }
}

function createNameBandTexture(maxAnisotropy: number): {
  canvas: HTMLCanvasElement;
  texture: THREE.CanvasTexture;
} {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 256;
  drawNameBandCanvas(canvas);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = maxAnisotropy;
  return { canvas, texture };
}

function drawNamePlaqueCanvas(canvas: HTMLCanvasElement): void {
  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = 'rgba(5, 7, 12, 0.78)';
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(40, 28, width - 80, height - 56, 26);
  } else {
    ctx.rect(40, 28, width - 80, height - 56);
  }
  ctx.fill();

  ctx.strokeStyle = 'rgba(226, 232, 240, 0.28)';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.font = '700 94px "Chakra Petch", sans-serif';
  ctx.textBaseline = 'middle';
  const codahText = 'CODAH';
  const abiudeText = 'ABIUDE';
  const gap = 36;
  const codahW = ctx.measureText(codahText).width;
  const abiudeW = ctx.measureText(abiudeText).width;
  const totalW = codahW + gap + abiudeW;
  const startX = (width - totalW) / 2;

  const gGrad = ctx.createLinearGradient(startX, 50, startX + codahW, 170);
  gGrad.addColorStop(0, '#b4ff4d');
  gGrad.addColorStop(0.55, '#22e500');
  gGrad.addColorStop(1, '#10b981');
  ctx.fillStyle = gGrad;
  ctx.fillText(codahText, startX, height / 2 + 3);

  const bGrad = ctx.createLinearGradient(
    startX + codahW + gap,
    50,
    startX + totalW,
    170
  );
  bGrad.addColorStop(0, '#7dd3fc');
  bGrad.addColorStop(0.55, '#00ccff');
  bGrad.addColorStop(1, '#0284c7');
  ctx.fillStyle = bGrad;
  ctx.fillText(abiudeText, startX + codahW + gap, height / 2 + 3);
}

function createNamePlaqueTexture(maxAnisotropy: number): {
  canvas: HTMLCanvasElement;
  texture: THREE.CanvasTexture;
} {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 220;
  drawNamePlaqueCanvas(canvas);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return { canvas, texture };
}

function createLogoGeometries() {
  // Stylized geometric "C" matching Codah's logo
  const cShape = new THREE.Shape();
  const cx = -0.18;
  const cy = 0.02;
  const rOut = 0.56;
  const rIn = 0.34;
  const openAngle = 0.88;
  cShape.absarc(cx, cy, rOut, openAngle, Math.PI * 2 - openAngle, false);
  cShape.lineTo(
    cx + rIn * Math.cos(Math.PI * 2 - openAngle),
    cy + rIn * Math.sin(Math.PI * 2 - openAngle)
  );
  cShape.absarc(cx, cy, rIn, Math.PI * 2 - openAngle, openAngle, true);
  cShape.closePath();

  const cGeo = new THREE.ExtrudeGeometry(cShape, {
    depth: 0.14,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.025,
    bevelSegments: 3,
    curveSegments: 32,
  });

  // Stylized geometric "A" with hollow upper triangle
  const aShape = new THREE.Shape();
  aShape.moveTo(-0.22, -0.5);
  aShape.lineTo(-0.02, -0.5);
  aShape.lineTo(0.11, -0.1);
  aShape.lineTo(0.35, -0.1);
  aShape.lineTo(0.48, -0.5);
  aShape.lineTo(0.68, -0.5);
  aShape.lineTo(0.3, 0.56);
  aShape.lineTo(0.16, 0.56);
  aShape.closePath();

  const aHole = new THREE.Path();
  aHole.moveTo(0.23, 0.36);
  aHole.lineTo(0.14, 0.06);
  aHole.lineTo(0.32, 0.06);
  aHole.closePath();
  aShape.holes.push(aHole);

  const aGeo = new THREE.ExtrudeGeometry(aShape, {
    depth: 0.15,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.025,
    bevelSegments: 3,
  });

  // Iconic horizontal spear/blade crossbar slicing across C and A
  const spearShape = new THREE.Shape();
  spearShape.moveTo(-0.34, 0.0);
  spearShape.lineTo(0.56, 0.1);
  spearShape.lineTo(0.96, 0.01);
  spearShape.lineTo(0.56, -0.11);
  spearShape.closePath();

  const spearGeo = new THREE.ExtrudeGeometry(spearShape, {
    depth: 0.18,
    bevelEnabled: true,
    bevelThickness: 0.028,
    bevelSize: 0.02,
    bevelSegments: 2,
  });

  // Tri-color outer emblem ring segments
  const arcGreenGeo = new THREE.TorusGeometry(0.95, 0.042, 16, 48, Math.PI * 0.66);
  const arcChromeGeo = new THREE.TorusGeometry(0.95, 0.034, 14, 36, Math.PI * 0.35);
  const arcBlueGeo = new THREE.TorusGeometry(0.95, 0.044, 16, 48, Math.PI * 0.56);

  return { cGeo, aGeo, spearGeo, arcGreenGeo, arcChromeGeo, arcBlueGeo };
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
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(
      container.clientWidth || window.innerWidth,
      container.clientHeight || window.innerHeight
    );
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
    const hemiLight = new THREE.HemisphereLight(0x88b8ff, 0x090b10, 0.72);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1dc, 2.4);
    keyLight.position.set(5, 7, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x00ff88, 12, 22, 1.8);
    rimLight.position.set(-4.5, 2.5, -2.5);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0x00ccff, 6.5, 20, 1.8);
    fillLight.position.set(4.5, -2.0, 2.5);
    scene.add(fillLight);

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const gridTexture = createGridTexture(maxAnisotropy);
    const dialTexture = createDialTexture(maxAnisotropy);
    const { canvas: nameBandCanvas, texture: nameBandTexture } =
      createNameBandTexture(maxAnisotropy);
    const { canvas: namePlaqueCanvas, texture: namePlaqueTexture } =
      createNamePlaqueTexture(maxAnisotropy);

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

    // Contact shadow grounding plane beneath the rotating logo sphere
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
    const contactGeo = new THREE.PlaneGeometry(6.5, 6.5);
    const contactMat = new THREE.MeshBasicMaterial({
      map: contactTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.7,
    });
    const contactPlane = new THREE.Mesh(contactGeo, contactMat);
    contactPlane.rotation.x = -Math.PI / 2;
    contactPlane.position.y = -3.33;
    scene.add(contactPlane);

    // === COMPOSITE ROTATING 3D LOGO SPHERE ("CA" + "CODAH ABIUDE") ===
    const sculptureGroup = new THREE.Group();
    sculptureGroup.position.set(1.25, 0.15, 0);
    scene.add(sculptureGroup);

    // Inner rotating logo ball group (rotates continuously around Y)
    const logoBallGroup = new THREE.Group();
    sculptureGroup.add(logoBallGroup);

    // 1. Primary Glossy Obsidian Core Sphere
    const coreGeo = new THREE.SphereGeometry(1.12, 48, 36);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x090d14,
      metalness: 0.88,
      roughness: 0.14,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    logoBallGroup.add(coreMesh);

    // 2. Subtle Geodesic Wireframe Shell around sphere
    const latticeGeo = new THREE.IcosahedronGeometry(1.17, 1);
    const latticeMat = new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      emissive: 0x00ff88,
      emissiveIntensity: 0.45,
      wireframe: true,
      roughness: 0.35,
      metalness: 0.5,
      transparent: true,
      opacity: 0.24,
    });
    const latticeMesh = new THREE.Mesh(latticeGeo, latticeMat);
    logoBallGroup.add(latticeMesh);

    // 3. Shared Logo Relief Geometries & PBR Materials
    const { cGeo, aGeo, spearGeo, arcGreenGeo, arcChromeGeo, arcBlueGeo } =
      createLogoGeometries();

    const greenLogoMat = new THREE.MeshStandardMaterial({
      color: 0x39ff14,
      emissive: 0x00aa33,
      emissiveIntensity: 0.42,
      metalness: 0.84,
      roughness: 0.16,
    });
    const chromeLogoMat = new THREE.MeshPhysicalMaterial({
      color: 0xe2e8f0,
      metalness: 0.96,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    });
    const spearMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      metalness: 0.98,
      roughness: 0.08,
      clearcoat: 1.0,
    });
    const blueArcMat = new THREE.MeshStandardMaterial({
      color: 0x00ccff,
      emissive: 0x0088ee,
      emissiveIntensity: 0.44,
      metalness: 0.86,
      roughness: 0.16,
    });

    const plaqueGeo = new THREE.PlaneGeometry(1.68, 0.36);
    const plaqueMat = new THREE.MeshBasicMaterial({
      map: namePlaqueTexture,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });

    // Mount two outward-facing 3D "CA" + "CODAH ABIUDE" emblem medallions (+Z & -Z)
    // so both sides of the rotating ball read clearly left-to-right
    const buildLogoFace = (zOffset: number, rotY: number) => {
      const face = new THREE.Group();
      face.position.set(0, 0.06, zOffset);
      face.rotation.y = rotY;
      face.scale.setScalar(0.92);

      const cMesh = new THREE.Mesh(cGeo, greenLogoMat);
      cMesh.position.z = 0;
      face.add(cMesh);

      const aMesh = new THREE.Mesh(aGeo, chromeLogoMat);
      aMesh.position.z = 0.02;
      face.add(aMesh);

      const spearMesh = new THREE.Mesh(spearGeo, spearMat);
      spearMesh.position.z = 0.06;
      face.add(spearMesh);

      const arcGreen = new THREE.Mesh(arcGreenGeo, greenLogoMat);
      arcGreen.rotation.z = Math.PI * 0.42;
      arcGreen.position.z = 0.04;
      face.add(arcGreen);

      const arcChromeTop = new THREE.Mesh(arcChromeGeo, chromeLogoMat);
      arcChromeTop.rotation.z = Math.PI * 0.08;
      arcChromeTop.position.z = 0.04;
      face.add(arcChromeTop);

      const arcChromeBot = new THREE.Mesh(arcChromeGeo, chromeLogoMat);
      arcChromeBot.rotation.z = Math.PI * 1.08;
      arcChromeBot.position.z = 0.04;
      face.add(arcChromeBot);

      const arcBlue = new THREE.Mesh(arcBlueGeo, blueArcMat);
      arcBlue.rotation.z = -Math.PI * 0.54;
      arcBlue.position.z = 0.04;
      face.add(arcBlue);

      const plaque = new THREE.Mesh(plaqueGeo, plaqueMat);
      plaque.position.set(0, -1.24, 0.14);
      face.add(plaque);

      logoBallGroup.add(face);
    };

    buildLogoFace(1.16, 0);
    buildLogoFace(-1.16, Math.PI);

    // 4. Equatorial "CODAH ABIUDE" Nameplate Ribbon orbiting the sphere
    const bandGeo = new THREE.CylinderGeometry(1.56, 1.56, 0.34, 72, 1, true);
    const bandMat = new THREE.MeshBasicMaterial({
      map: nameBandTexture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const nameBandMesh = new THREE.Mesh(bandGeo, bandMat);
    nameBandMesh.rotation.z = 0.09;
    nameBandMesh.position.y = -0.12;
    sculptureGroup.add(nameBandMesh);

    // 5. Outer Anodized Titanium Gimbal Ring
    const ring1Geo = new THREE.TorusGeometry(2.08, 0.042, 22, 96);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      metalness: 0.94,
      roughness: 0.18,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI * 0.36;
    sculptureGroup.add(ring1);

    // 6. Outer Matte Carbon Gimbal Ring
    const ring2Geo = new THREE.TorusGeometry(2.46, 0.038, 20, 96);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x262c38,
      metalness: 0.45,
      roughness: 0.62,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI * 0.28;
    ring2.rotation.x = -Math.PI * 0.24;
    sculptureGroup.add(ring2);

    // 7. Calibrated Outer Equatorial Dial Ring
    const ring3Geo = new THREE.TorusGeometry(2.86, 0.032, 16, 112);
    const ring3Mat = new THREE.MeshStandardMaterial({
      map: dialTexture,
      metalness: 0.85,
      roughness: 0.28,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.x = Math.PI * 0.48;
    sculptureGroup.add(ring3);

    // 8. 24 Instanced Orbital Beacon Nodes (alternating Neon Green & Electric Blue)
    const NODE_COUNT = 24;
    const nodeGeo = new THREE.OctahedronGeometry(0.06, 0);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00ff88,
      emissiveIntensity: 0.85,
      metalness: 0.6,
      roughness: 0.2,
    });
    const instancedNodes = new THREE.InstancedMesh(nodeGeo, nodeMat, NODE_COUNT);
    instancedNodes.frustumCulled = false;
    const nodeGreen = new THREE.Color(0x39ff14);
    const nodeBlue = new THREE.Color(0x00ccff);
    for (let i = 0; i < NODE_COUNT; i++) {
      const angle = (i / NODE_COUNT) * Math.PI * 2;
      const radius = i % 2 === 0 ? 2.86 : 2.08;
      _dummy.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      _dummy.scale.setScalar(i % 4 === 0 ? 1.3 : 0.85);
      _dummy.updateMatrix();
      instancedNodes.setMatrixAt(i, _dummy.matrix);
      instancedNodes.setColorAt(i, i % 2 === 0 ? nodeGreen : nodeBlue);
    }
    instancedNodes.instanceMatrix.needsUpdate = true;
    if (instancedNodes.instanceColor) {
      instancedNodes.instanceColor.needsUpdate = true;
    }
    instancedNodes.computeBoundingSphere();
    ring3.add(instancedNodes);

    // 9. Ambient Spatial Particle Field
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
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation loop with software WebGL pacing
    let frameId = 0;
    let disposed = false;
    let currentExplode = 0;
    let lastTime = performance.now();

    // Redraw 3D nameplate textures once Chakra Petch webfont finishes loading
    if (document.fonts?.ready) {
      void document.fonts.ready.then(() => {
        if (disposed) return;
        drawNameBandCanvas(nameBandCanvas);
        nameBandTexture.needsUpdate = true;
        drawNamePlaqueCanvas(namePlaqueCanvas);
        namePlaqueTexture.needsUpdate = true;
      });
    }

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

      // Resolve section accent color for rim lighting & outer wireframe
      let targetHex = SECTION_COLORS[sec] ?? SECTION_COLORS.home;
      if (ctrl.spectrumMode === 'emerald') targetHex = 0x00ff88;
      if (ctrl.spectrumMode === 'cobalt') targetHex = 0x00ccff;
      _targetColor.setHex(targetHex);
      _currentColor.lerp(_targetColor, 1 - Math.exp(-4.5 * delta));

      rimLight.color.copy(_currentColor);
      latticeMat.color.copy(_currentColor);
      latticeMat.emissive.copy(_currentColor);
      nodeMat.emissive.copy(_currentColor);

      currentExplode = THREE.MathUtils.damp(currentExplode, ctrl.explodeFactor, 6.5, delta);
      latticeMesh.scale.setScalar(1 + currentExplode * 0.35);
      latticeMat.wireframe = ctrl.wireframeOverlay;
      latticeMat.opacity = ctrl.wireframeOverlay ? 0.24 : 0.1;

      ring1.scale.setScalar(1 + currentExplode * 0.22);
      ring2.scale.setScalar(1 + currentExplode * 0.35);
      ring3.scale.setScalar(1 + currentExplode * 0.48);

      const speedMult = prefersReducedMotion
        ? 0
        : ctrl.speedMode === 'paused'
          ? 0
          : ctrl.speedMode === 'hyper'
            ? 2.2
            : 0.72;

      // Continuous rotation of the 3D CA logo ball + counter-rotating nameplate band
      logoBallGroup.rotation.y += delta * 0.42 * speedMult;
      latticeMesh.rotation.y -= delta * 0.16 * speedMult;
      nameBandMesh.rotation.y -= delta * 0.28 * speedMult;
      ring1.rotation.z += delta * 0.34 * speedMult;
      ring2.rotation.x += delta * 0.26 * speedMult;
      ring3.rotation.z -= delta * 0.2 * speedMult;
      starField.rotation.y += delta * 0.03 * speedMult;

      const isNarrow = window.innerWidth < 1024;
      const targetSculptX = isNarrow
        ? 0
        : sec === 'home'
          ? 1.55
          : sec === 'about'
            ? -1.45
            : 1.15;
      sculptureGroup.position.x = THREE.MathUtils.damp(
        sculptureGroup.position.x,
        targetSculptX,
        4.5,
        delta
      );

      const preset = SECTION_CAMERA[sec] ?? SECTION_CAMERA.home;
      const parallaxX = prefersReducedMotion ? 0 : pointer.x * 0.42;
      const parallaxY = prefersReducedMotion ? 0 : pointer.y * 0.26;
      const portraitZoomOut =
        camera.aspect < 1 ? (1 / Math.max(camera.aspect, 0.45) - 1) * 3.6 : 0;

      _camGoal.set(
        (isNarrow ? 0 : preset.x) + parallaxX,
        preset.y + parallaxY,
        (isNarrow ? preset.z + 1.6 : preset.z) + portraitZoomOut
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
      cGeo.dispose();
      aGeo.dispose();
      spearGeo.dispose();
      arcGreenGeo.dispose();
      arcChromeGeo.dispose();
      arcBlueGeo.dispose();
      greenLogoMat.dispose();
      chromeLogoMat.dispose();
      spearMat.dispose();
      blueArcMat.dispose();
      plaqueGeo.dispose();
      plaqueMat.dispose();
      bandGeo.dispose();
      bandMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      gridGeo.dispose();
      gridMat.dispose();
      gridTexture.dispose();
      dialTexture.dispose();
      nameBandTexture.dispose();
      namePlaqueTexture.dispose();
      contactGeo.dispose();
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
