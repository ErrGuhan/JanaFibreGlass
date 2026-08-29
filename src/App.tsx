import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei'
import { useConfigStore } from './store/useConfigStore'
import { ParametricDoor } from './components/ParametricDoor'
import { ConfigPanel } from './components/ConfigPanel'
import { Header } from './components/Header'
import { MousePointer, ZoomIn, RotateCw, Loader2 } from 'lucide-react'

// Mobile-Optimized HTML/CSS Fallback Component
const LoadingFallback = () => (
  <Html center>
    <div className="flex flex-col items-center gap-3.5 p-5 rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-amber-500/40 text-amber-400 shadow-2xl min-w-[220px]">
      <div className="relative flex items-center justify-center">
        <Loader2 className="w-9 h-9 animate-spin text-amber-400" />
        <div className="absolute inset-0 rounded-full border-2 border-amber-400/20 animate-ping" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs font-mono font-bold tracking-wider text-slate-100">
          Loading 3D Studio...
        </span>
        <span className="text-[10px] text-slate-400">
          Initializing Parametric Engine
        </span>
      </div>
    </div>
  </Html>
)

/**
 * App - Mobile-Optimized 3D Door Configurator Application
 * Features:
 * 1. Suspense loading ring fallback ("Loading 3D Studio...").
 * 2. dpr={[1, 1.5]} capping resolution on high-DPI mobile screens.
 * 3. gl={{ powerPreference: "high-performance", antialias: false }} for max FPS.
 * 4. Lightweight Environment lighting map (resolution={256}).
 */
export function App() {
  const { doorConfig, color, wireframe } = useConfigStore()

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#070b14] flex flex-col font-sans select-none">
      {/* 1. Glassmorphic Navigation Header Overlay */}
      <Header />

      {/* 2. Viewport Container */}
      <main className="relative flex-1 w-full h-full pt-16">
        
        {/* BASE LAYER: Mobile-Optimized @react-three/fiber 3D Canvas */}
        <div className="absolute inset-0 w-full h-full bg-radial from-[#111827] via-[#090d16] to-[#050810]">
          <Suspense fallback={<LoadingFallback />}>
            <Canvas
              shadows
              camera={{ position: [2.6, 1.6, 3.2], fov: 45 }}
              dpr={[1, 1.5]}
              gl={{
                powerPreference: 'high-performance',
                antialias: false,
                preserveDrawingBuffer: true,
              }}
              className="cursor-grab active:cursor-grabbing"
            >
              {/* Smooth Canvas Background */}
              <color attach="background" args={['#090d16']} />

              {/* Lighting setup */}
              <ambientLight intensity={0.6} />
              <directionalLight
                position={[5, 8, 4]}
                intensity={1.3}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-near={0.5}
                shadow-camera-far={15}
                shadow-camera-left={-3}
                shadow-camera-right={3}
                shadow-camera-top={4}
                shadow-camera-bottom={-1}
                shadow-bias={-0.0001}
              />
              <directionalLight position={[-4, 3, -3]} intensity={0.4} color="#38bdf8" />

              {/* Lightweight Environment HDRI Map (resolution={256}) */}
              <Environment preset="city" environmentIntensity={0.85} resolution={256} />

              {/* Procedural 3D Parametric Door */}
              <ParametricDoor
                topWidth={doorConfig.topWidth}
                bottomWidth={doorConfig.bottomWidth}
                leftHeight={doorConfig.leftHeight}
                rightHeight={doorConfig.rightHeight}
                thickness={doorConfig.thickness}
                doorColor={color}
                openAngle={doorConfig.openAngle}
                wireframe={wireframe}
              />

              {/* Grounding Contact Shadows */}
              <ContactShadows
                position={[0, 0, 0]}
                opacity={0.75}
                scale={7}
                blur={2.4}
                far={3.0}
                resolution={512}
                color="#000000"
              />

              {/* OrbitControls */}
              <OrbitControls
                makeDefault
                enableDamping
                dampingFactor={0.06}
                minDistance={1.2}
                maxDistance={8}
                maxPolarAngle={Math.PI / 2 + 0.05}
                target={[0, 1.0, 0]}
              />
            </Canvas>
          </Suspense>
        </div>

        {/* FLOATING HUD: Transparent Glassmorphic Navigation Pill (Bottom Left) */}
        <div className="absolute bottom-24 left-4 sm:bottom-6 sm:left-6 z-20 pointer-events-none hidden sm:block">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full flex items-center gap-4 text-[11px] text-slate-300 shadow-xl pointer-events-auto">
            <div className="flex items-center gap-1.5 text-slate-200">
              <MousePointer className="w-3.5 h-3.5 text-amber-400" />
              <span>Rotate</span>
            </div>
            <div className="h-3 w-px bg-white/15" />
            <div className="flex items-center gap-1.5 text-slate-200">
              <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
              <span>Zoom</span>
            </div>
            <div className="h-3 w-px bg-white/15" />
            <div className="flex items-center gap-1.5 text-slate-200">
              <RotateCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Pan</span>
            </div>
          </div>
        </div>

        {/* TOP LAYER: Hyper-Optimized Mobile Glassmorphic ConfigPanel */}
        <ConfigPanel />

      </main>
    </div>
  )
}

export default App
