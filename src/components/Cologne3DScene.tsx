"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface Cologne3DSceneProps {
  phase: "idle" | "revealing" | "zooming" | "exiting";
}

export function Cologne3DScene({ phase }: Cologne3DSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0d10);

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const uniforms = {
      uTex: { value: null as THREE.Texture | null },
      uResolution: { value: new THREE.Vector2(width, height) },
      uTexAspect: { value: 1.0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0 },
      uZoom: { value: 1.0 },
      uLaunch: { value: 0.0 },
    };

    const loader = new THREE.TextureLoader();
    const photoTex = loader.load("/kolner-dom-4k.jpg", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      uniforms.uTex.value = tex;
      uniforms.uTexAspect.value = tex.image.width / tex.image.height;
    });

    const planeGeo = new THREE.PlaneGeometry(2, 2);
    const shaderMat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;

        uniform sampler2D uTex;
        uniform vec2 uResolution;
        uniform float uTexAspect;
        uniform vec2 uMouse;
        uniform float uTime;
        uniform float uZoom;
        uniform float uLaunch;

        varying vec2 vUv;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
            f.y
          );
        }

        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
          for (int i = 0; i < 5; i++) {
            v += a * noise(p);
            p = rot * p * 2.02;
            a *= 0.5;
          }
          return v;
        }

        float getBoundsMask(vec2 uv) {
          float mx = smoothstep(0.0, 0.035, uv.x) * (1.0 - smoothstep(0.965, 1.0, uv.x));
          float my = smoothstep(0.0, 0.015, uv.y) * (1.0 - smoothstep(0.985, 1.0, uv.y));
          return mx * my;
        }

        float getDepth(vec2 uv) {
          if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return 0.0;
          vec3 c = texture2D(uTex, uv).rgb;
          float lum = dot(c, vec3(0.299, 0.587, 0.114));
          float isSky = smoothstep(0.85, 0.96, lum);
          float verticalProximity = mix(1.0, 0.45, uv.y);
          float stoneRelief = (1.0 - lum) * 0.65 + 0.35;
          return (1.0 - isSky) * verticalProximity * stoneRelief;
        }

        void main() {
          float screenAspect = uResolution.x / uResolution.y;

          // Center focal point shifts slightly toward the Gothic rose window & portals during launch fly-in
          vec2 focalCenter = vec2(0.5, mix(0.5, 0.42, uLaunch));
          vec2 uv = vUv - focalCenter;

          if (screenAspect >= uTexAspect) {
            uv.x *= screenAspect / uTexAspect;
          } else {
            float portraitScale = mix(1.0, uTexAspect / screenAspect, 0.62);
            uv.x *= (screenAspect / uTexAspect) * portraitScale;
            uv.y *= portraitScale;
          }

          uv /= uZoom;
          uv += vec2(sin(uTime * 0.35) * 0.0025, cos(uTime * 0.28) * 0.0025);

          vec2 baseUv = uv + focalCenter;

          // 3D Depth-Map Parallax + Launch Dolly-Zoom Perspective Warp
          float d0 = getDepth(baseUv);
          vec2 radialDir = baseUv - focalCenter;
          // During launch, foreground cathedral towers rush outward/forward in 3D perspective
          vec2 perspectiveRush = radialDir * (d0 * uLaunch * 0.24);

          vec2 parallax = uMouse * 0.022 * d0;
          float d1 = getDepth(baseUv - parallax * 0.5 - perspectiveRush * 0.5);
          vec2 sampleUv = baseUv - uMouse * 0.022 * d1 - radialDir * (d1 * uLaunch * 0.26);

          // Volumetric Atmospheric Sky
          vec2 skyUv = vUv * vec2(screenAspect, 1.0) * 1.5;
          float c1 = fbm(skyUv + vec2(uTime * 0.025, uTime * 0.008));
          float c2 = fbm(skyUv * 2.2 - vec2(uTime * 0.015, 0.0));
          float cloudPattern = c1 * 0.65 + c2 * 0.35;

          vec3 skyTop = vec3(0.42, 0.48, 0.56);
          vec3 skyHorizon = vec3(0.68, 0.70, 0.73);
          vec3 baseSky = mix(skyHorizon, skyTop, pow(clamp(vUv.y, 0.0, 1.0), 0.65));

          vec3 cloudShadow = vec3(0.35, 0.39, 0.46);
          vec3 cloudHighlight = vec3(0.75, 0.77, 0.80);
          vec3 richSky = mix(baseSky, mix(cloudShadow, cloudHighlight, smoothstep(0.28, 0.78, cloudPattern)), 0.75);

          // 4K Unsharp Masking + Subtle Liquid Chromatic Refraction on Launch
          vec2 clampedUv = clamp(sampleUv, 0.002, 0.998);
          vec2 texel = 1.0 / vec2(2048.0, 2048.0);
          float chromaShift = uLaunch * 0.0045 * length(vUv - 0.5);

          float rCh = texture2D(uTex, clamp(clampedUv + radialDir * chromaShift, 0.002, 0.998)).r;
          float gCh = texture2D(uTex, clampedUv).g;
          float bCh = texture2D(uTex, clamp(clampedUv - radialDir * chromaShift, 0.002, 0.998)).b;
          vec3 centerCol = vec3(rCh, gCh, bCh);

          vec3 nCol = texture2D(uTex, clampedUv + vec2(0.0, texel.y)).rgb;
          vec3 sCol = texture2D(uTex, clampedUv - vec2(0.0, texel.y)).rgb;
          vec3 eCol = texture2D(uTex, clampedUv + vec2(texel.x, 0.0)).rgb;
          vec3 wCol = texture2D(uTex, clampedUv - vec2(texel.x, 0.0)).rgb;

          vec3 blurCol = (nCol + sCol + eCol + wCol) * 0.25;
          vec3 sharpCol = centerCol + (centerCol - blurCol) * 0.55;

          float lum = dot(centerCol, vec3(0.299, 0.587, 0.114));
          float inBounds = getBoundsMask(sampleUv);
          float photoSkyMask = smoothstep(0.84, 0.955, lum);
          float totalSkyMask = mix(1.0, photoSkyMask, inBounds);

          // 3D Normal Relief with dynamic light sweep during launch
          float hN = dot(nCol, vec3(0.333));
          float hS = dot(sCol, vec3(0.333));
          float hE = dot(eCol, vec3(0.333));
          float hW = dot(wCol, vec3(0.333));
          vec3 normal = normalize(vec3((hW - hE) * 3.4, (hS - hN) * 3.4, 1.0));

          float launchSweep = sin(uLaunch * 3.14159) * 1.1;
          vec3 lightDir = normalize(vec3(
            uMouse.x * 0.75 + sin(uTime * 0.4) * 0.2 + launchSweep,
            -uMouse.y * 0.75 + 0.3 + uLaunch * 0.4,
            0.8
          ));
          float diff = max(dot(normal, lightDir), 0.0);
          vec3 halfDir = normalize(lightDir + vec3(0.0, 0.0, 1.0));
          float spec = pow(max(dot(normal, halfDir), 0.0), 32.0);

          // Moody Gothic stone + golden architectural rim light during launch animation
          float launchGlow = sin(uLaunch * 3.14159) * 0.22;
          vec3 litStone = sharpCol * (0.68 + diff * (0.18 + launchGlow))
            + vec3(0.96, 0.91, 0.80) * spec * (0.05 + launchGlow * 0.35);

          vec3 finalColor = mix(litStone, richSky, totalSkyMask * 0.94);

          // Ground mist
          float bottomMist = smoothstep(0.0, 0.12, sampleUv.y);
          finalColor = mix(vec3(0.07, 0.08, 0.10), finalColor, bottomMist);

          // Cinematic vignette that deepens slightly at the edges during fly-through
          float vig = smoothstep(1.18 - uLaunch * 0.2, 0.25, length(vUv - 0.5));
          finalColor *= mix(0.62, 0.94, vig);

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });

    const quad = new THREE.Mesh(planeGeo, shaderMat);
    scene.add(quad);

    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        targetMouseX = (touch.clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = -(touch.clientY / window.innerHeight - 0.5) * 2;
      }
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        targetMouseX = THREE.MathUtils.clamp(e.gamma / 30, -1, 1);
        targetMouseY = THREE.MathUtils.clamp((e.beta - 45) / 30, -1, 1);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("deviceorientation", handleDeviceOrientation, {
      passive: true,
    });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };
    window.addEventListener("resize", handleResize);

    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      uniforms.uTime.value = t;

      const autoSwayX = Math.sin(t * 0.55) * 0.22;
      const autoSwayY = Math.cos(t * 0.4) * 0.15;

      uniforms.uMouse.value.x +=
        (targetMouseX + autoSwayX - uniforms.uMouse.value.x) * 0.05;
      uniforms.uMouse.value.y +=
        (targetMouseY + autoSwayY - uniforms.uMouse.value.y) * 0.05;

      const currentPhase = phaseRef.current;
      const targetZoom =
        currentPhase === "idle"
          ? 1.0
          : currentPhase === "revealing"
          ? 1.0
          : currentPhase === "zooming"
          ? 1.26
          : 1.68;

      const targetLaunch =
        currentPhase === "zooming"
          ? 0.55
          : currentPhase === "exiting"
          ? 1.0
          : 0.0;

      const speed =
        currentPhase === "zooming" || currentPhase === "exiting" ? 0.042 : 0.03;
      uniforms.uZoom.value += (targetZoom - uniforms.uZoom.value) * speed;
      uniforms.uLaunch.value += (targetLaunch - uniforms.uLaunch.value) * speed;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
      window.removeEventListener("resize", handleResize);
      photoTex.dispose();
      shaderMat.dispose();
      planeGeo.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full touch-none"
    />
  );
}
