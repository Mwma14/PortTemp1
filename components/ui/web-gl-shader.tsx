"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function WebGLShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene | null
    camera: THREE.OrthographicCamera | null
    renderer: THREE.WebGLRenderer | null
    mesh: THREE.Mesh | null
    uniforms: any
    animationId: number | null
  }>({
    scene: null,
    camera: null,
    renderer: null,
    mesh: null,
    uniforms: null,
    animationId: null,
  })

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const { current: refs } = sceneRef

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      // --- Noise Functions for Texture ---

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(random(i), random(i + vec2(1.0, 0.0)), u.x),
                   mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      float fbm(vec2 st) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 3; i++) {
          v += a * noise(st);
          st *= 2.0;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        // Normalize coordinates
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
        
        // Slow down time
        float t = time * 0.2;

        // --- Main Beam ---
        // Calculate wavy path
        float waveY = sin(uv.x * 0.7 + t) * 0.2 + 
                      sin(uv.x * 1.5 + t * 0.5) * 0.1 + 
                      noise(vec2(uv.x + t, t)) * 0.05;
        
        // Shift beam slightly up to make room for reflection
        waveY += 0.1;

        float dist = abs(uv.y - waveY);
        
        // Add smoky texture to the beam
        float smoke = fbm(vec2(uv.x * 3.0 + t * 2.0, uv.y * 4.0));
        
        // Core brightness + Outer glow with texture
        float intensity = 0.006 / (dist + 0.001);
        intensity += (0.05 / (dist + 0.08)) * (0.6 + 0.4 * smoke);

        // --- Secondary Light Beam (for "more lights") ---
        float waveY2 = sin(uv.x * 1.2 - t * 0.8) * 0.15 + 
                       cos(uv.x * 2.2 + t) * 0.05 + 0.1; // Same vertical offset
        float dist2 = abs(uv.y - waveY2);
        // Fainter, thinner beam
        intensity += 0.015 / (dist2 + 0.04);

        // --- Mirror Reflection ---
        // Define a floor plane
        float floorY = -0.3;
        
        // Calculate where the reflection of the main wave would be
        // Reflection formula: 2 * floor - y
        float reflectedWaveY = 2.0 * floorY - waveY;
        
        // Distance to reflection path
        float reflectDist = abs(uv.y - reflectedWaveY);
        
        // Add ripples/distortion to the reflection using noise
        float ripple = noise(vec2(uv.x * 10.0, uv.y * 10.0 + t * 5.0)) * 0.03;
        reflectDist += ripple;

        // Reflection brightness
        float reflection = 0.025 / (reflectDist + 0.1);
        
        // Mask reflection: it should only appear below the "floor" and fade out
        float floorMask = 1.0 - smoothstep(floorY - 0.2, floorY + 0.1, uv.y);
        reflection *= floorMask;
        
        // Dim the reflection
        reflection *= 0.5;

        // --- Final Composition ---
        // Add some background ambient noise/grain
        float grain = (random(uv * time) - 0.5) * 0.03;
        
        float finalVal = intensity + reflection + grain;
        
        // Ensure pure white/grayscale output
        vec3 color = vec3(finalVal);
        
        // Slight tone mapping
        color = pow(color, vec3(0.9));

        gl_FragColor = vec4(color, 1.0);
      }
    `

    const initScene = () => {
      refs.scene = new THREE.Scene()
      try {
        refs.renderer = new THREE.WebGLRenderer({ canvas, alpha: false })
      } catch (error) {
        console.warn('WebGL not available, using fallback')
        return
      }
      refs.renderer.setPixelRatio(window.devicePixelRatio)
      refs.renderer.setClearColor(new THREE.Color(0x000000))

      refs.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1)

      refs.uniforms = {
        resolution: { value: [window.innerWidth, window.innerHeight] },
        time: { value: 0.0 },
      }

      const position = [
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0,  1.0, 0.0,
      ]

      const positions = new THREE.BufferAttribute(new Float32Array(position), 3)
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute("position", positions)

      const material = new THREE.RawShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: refs.uniforms,
        side: THREE.DoubleSide,
      })

      refs.mesh = new THREE.Mesh(geometry, material)
      refs.scene.add(refs.mesh)

      handleResize()
    }

    const animate = (time: number) => {
      // Use timestamp for consistent speed independent of refresh rate
      // Previous increment was 0.024 per frame @ ~60fps
      // 0.024 * 60 = 1.44 units per second
      if (refs.uniforms) refs.uniforms.time.value = (time * 0.001) * 1.44
      
      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera)
      }
      refs.animationId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      if (!refs.renderer || !refs.uniforms) return
      const width = window.innerWidth
      const height = window.innerHeight
      refs.renderer.setSize(width, height, false)
      refs.uniforms.resolution.value = [width, height]
    }

    initScene()
    refs.animationId = requestAnimationFrame(animate)
    window.addEventListener("resize", handleResize)

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId)
      window.removeEventListener("resize", handleResize)
      if (refs.mesh) {
        refs.scene?.remove(refs.mesh)
        refs.mesh.geometry.dispose()
        if (refs.mesh.material instanceof THREE.Material) {
          refs.mesh.material.dispose()
        }
      }
      refs.renderer?.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full block"
    />
  )
}
