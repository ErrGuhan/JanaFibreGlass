import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { useConfigStore } from '../store/useConfigStore'
import { ParametricDoor } from '../components/ParametricDoor'
import { DimensionLines } from '../components/3d/DimensionLines'
import { ConfigPanel } from '../components/ConfigPanel'
import { DashboardLayout } from '../components/DashboardLayout'
import { SavedConfigurations } from '../components/SavedConfigurations'
import { ProductCategories } from '../components/ProductCategories'
import { PastWorkGallery } from '../components/PastWorkGallery'
import { MousePointer, ZoomIn, RotateCw, Loader2, Sparkles } from 'lucide-react'

const DOMCanvasLoader = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm z-20">
    <div className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-gray-200 text-slate-800 shadow-md min-w-[200px]">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      <span className="text-xs font-mono font-bold tracking-wider text-slate-700">
        Rendering 3D Studio...
      </span>
    </div>
  </div>
)

export const StudioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('configurator')
  const { doorConfig, color, wireframe } = useConfigStore()

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'configurator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* COLUMN 1: 3D Canvas (Constrained on mobile to h-[50vh] max-h-[420px] to prevent touch trap) */}
            <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-2 relative h-[50vh] min-h-[320px] max-h-[420px] sm:h-[540px] lg:h-[720px] lg:max-h-none overflow-hidden flex flex-col">
              <div className="relative flex-1 w-full h-full rounded-2xl overflow-hidden">
                <Suspense fallback={<DOMCanvasLoader />}>
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
                    <color attach="background" args={['#f8fafc']} />
                    <ambientLight intensity={0.7} />
                    <directionalLight
                      position={[5, 10, 5]}
                      intensity={1.5}
                      castShadow
                      shadow-mapSize-width={1024}
                      shadow-mapSize-height={1024}
                      shadow-bias={-0.0001}
                    />
                    <directionalLight position={[-5, 5, 5]} intensity={0.6} color="#ffffff" />
                    <directionalLight position={[0, -2, 4]} intensity={0.3} color="#f8fafc" />

                    <Environment preset="city" environmentIntensity={1.0} resolution={256} />

                    <ParametricDoor
                      topWidth={doorConfig.topWidth}
                      bottomWidth={doorConfig.bottomWidth}
                      leftHeight={doorConfig.leftHeight}
                      rightHeight={doorConfig.rightHeight}
                      thickness={doorConfig.thickness}
                      doorColor={color}
                      wireframe={wireframe}
                    />

                    <DimensionLines />

                    <ContactShadows
                      position={[0, 0, 0]}
                      opacity={0.7}
                      scale={10}
                      blur={2.5}
                      far={4}
                      resolution={512}
                      color="#000000"
                    />

                    <OrbitControls
                      makeDefault
                      enableDamping
                      enablePan={false}
                      enableZoom={true}
                      enableRotate={true}
                      dampingFactor={0.06}
                      minDistance={1.2}
                      maxDistance={8}
                      maxPolarAngle={Math.PI / 2 + 0.05}
                      target={[0, 1.0, 0]}
                    />
                  </Canvas>
                </Suspense>

                <div className="absolute bottom-4 left-4 z-10 hidden sm:block pointer-events-none">
                  <div className="bg-white/85 backdrop-blur-md border border-gray-200 px-3.5 py-1.5 rounded-full flex items-center gap-3 text-[11px] text-slate-600 shadow-xs pointer-events-auto">
                    <div className="flex items-center gap-1 text-slate-800">
                      <MousePointer className="w-3.5 h-3.5 text-blue-600" />
                      <span>Rotate</span>
                    </div>
                    <div className="h-3 w-px bg-gray-200" />
                    <div className="flex items-center gap-1 text-slate-800">
                      <ZoomIn className="w-3.5 h-3.5 text-blue-600" />
                      <span>Zoom</span>
                    </div>
                    <div className="h-3 w-px bg-gray-200" />
                    <div className="flex items-center gap-1 text-slate-800">
                      <RotateCw className="w-3.5 h-3.5 text-blue-600" />
                      <span>Pan</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: Configurator Panel */}
            <div className="lg:col-span-5 xl:col-span-4">
              <ConfigPanel />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'saved' && <SavedConfigurations />}
      {activeTab === 'catalog' && <ProductCategories />}
      {activeTab === 'gallery' && <PastWorkGallery />}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Studio Settings</h3>
              <p className="text-xs text-slate-500">Configure global defaults & rendering parameters</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-gray-200 text-xs text-slate-600 space-y-2">
            <p>• Rendering Engine: React Three Fiber v9</p>
            <p>• Unit Scale: Metric (Centimeters to World Meters)</p>
            <p>• Environment Lighting: City Preset HDRI (Daytime Studio)</p>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default StudioPage
