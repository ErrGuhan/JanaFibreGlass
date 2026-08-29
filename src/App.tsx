import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei'
import { useConfigStore } from './store/useConfigStore'
import { ParametricDoor } from './components/ParametricDoor'
import { ConfigPanel } from './components/ConfigPanel'
import { Header } from './components/Header'
import { MousePointer, ZoomIn, RotateCw, Loader2 } from 'lucide-react'

// Canvas Fallback Loading Spinner
const CanvasLoader = () => (
  <Html center>
    <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-amber-500/30 text-amber-400 shadow-2xl">
      <Loader2 className="w-7 h-7 animate-spin" />
      <span className="text-xs font-mono font-bold tracking-wider">
        COMPUTING 3D GEOMETRY...
      </span>
    </div>
  </Html>
)

/**
 * App - Main 3D Door Configurator Application
 * Layers the real-time @react-three/fiber Canvas with Environment lighting,
 * soft grounding ContactShadows, procedural <ParametricDoor /> geometry,
 * and the floating glassmorphic <ConfigPanel />.
 */
export function App() {
  const { doorConfig, color, wireframe } = useConfigStore()

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#070b14] flex flex-col font-sans select-none">
      {/* 1. Glassmorphic Navigation Header Overlay */}
      <Header />

      {/* 2. Main Viewport Area */}
      <main className="relative flex-1 w-full h-full pt-16">
        
        {/* BASE LAYER: @react-three/fiber 3D Canvas */}
        <div className="absolute inset-0 w-full h-full bg-radial from-[#111827] via-[#090d16] to-[#050810]">
          <Canvas
            shadows
            camera={{ position: [2.6, 1.6, 3.2], fov: 45 }}
            dpr={[1, 2]}
            gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
            className="cursor-grab active:cursor-grabbing"
          >
            {/* Smooth Solid Dark Gray / Radial Canvas Color */}
            <color attach="background" args={['#090d16']} />

            {/* Studio Lighting */}
            <ambientLight intensity={0.6} />
            <directionalLight
              position={[5, 8, 4]}
              intensity={1.3}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-near={0.5}
              shadow-camera-far={15}
              shadow-camera-left={-3}
              shadow-camera-right={3}
              shadow-camera-top={4}
              shadow-camera-bottom={-1}
              shadow-bias={-0.0001}
            />
            <directionalLight position={[-4, 3, -3]} intensity={0.4} color="#38bdf8" />

            {/* Environment HDRI Lighting (City Preset) */}
            <Suspense fallback={<CanvasLoader />}>
              <Environment preset="city" environmentIntensity={0.85} />

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
            </Suspense>

            {/* Soft, Realistic Grounding Contact Shadows (No Explicit Floor Grid Lines) */}
            <ContactShadows
              position={[0, 0, 0]}
              opacity={0.75}
              scale={7}
              blur={2.4}
              far={3.0}
              resolution={1024}
              color="#000000"
            />

            {/* OrbitControls for Touch & Mouse Gesture Interactions */}
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
        </div>

        {/* FLOATING HUD: Condensed Transparent Glassmorphic Navigation Pill (Bottom Left) */}
        <div className="absolute bottom-6 left-6 z-20 pointer-events-none hidden sm:block">
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

        {/* TOP LAYER: Floating Glassmorphic ConfigPanel UI */}
        <ConfigPanel />

      </main>
    </div>
  )
}

export default App
