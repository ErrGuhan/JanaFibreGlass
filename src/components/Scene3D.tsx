import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Environment, Grid, Html } from '@react-three/drei'
import { useConfigStore } from '../store/useConfigStore'
import { ProductModel } from './ProductModel'
import { Loader2 } from 'lucide-react'

const CanvasLoader = () => (
  <Html center>
    <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-cyan-400">
      <Loader2 className="w-8 h-8 animate-spin" />
      <span className="text-xs font-mono tracking-wider">COMPUTING 3D GEOMETRY...</span>
    </div>
  </Html>
)

export const Scene3D: React.FC = () => {
  const { envPreset, showGrid } = useConfigStore()

  return (
    <div className="relative w-full h-full min-h-[500px] select-none">
      <Canvas
        shadows
        camera={{ position: [4.8, 3.2, 5.8], fov: 42 }}
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
        className="cursor-grab active:cursor-grabbing"
      >
        <color attach="background" args={['#070b14']} />
        
        {/* Soft Ambient & Directional Studio Lights */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[6, 8, 5]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={25}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-6, 4, -4]} intensity={0.4} color="#38bdf8" />
        <directionalLight position={[0, -4, 4]} intensity={0.2} color="#818cf8" />

        {/* Dynamic HDRI Environment */}
        <Suspense fallback={<CanvasLoader />}>
          <Environment preset={envPreset} background={false} environmentIntensity={0.8} />
          
          {/* Main 3D Model */}
          <ProductModel />
        </Suspense>

        {/* Realistic Contact Shadow on Floor */}
        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.65}
          scale={14}
          blur={2.4}
          far={4.5}
          resolution={1024}
          color="#000000"
        />

        {/* Technical Sub-surface Floor Grid */}
        {showGrid && (
          <Grid
            position={[0, -0.02, 0]}
            args={[20, 20]}
            cellSize={0.5}
            cellThickness={0.6}
            cellColor="#1e293b"
            sectionSize={2.0}
            sectionThickness={1.2}
            sectionColor="#0284c7"
            fadeDistance={15}
            fadeStrength={1.5}
          />
        )}

        {/* Camera Interaction Orbit Controls */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.06}
          minDistance={2.5}
          maxDistance={14}
          maxPolarAngle={Math.PI / 2 + 0.05} // Prevent camera going too far below floor
          target={[0, 1.2, 0]}
        />
      </Canvas>
    </div>
  )
}
