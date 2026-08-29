import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei'
import { useConfigStore } from './store/useConfigStore'
import { ParametricDoor } from './components/ParametricDoor'
import { ConfigPanel } from './components/ConfigPanel'
import { DashboardLayout } from './components/DashboardLayout'
import { SavedConfigurations } from './components/SavedConfigurations'
import { ProductCategories } from './components/ProductCategories'
import { PastWorkGallery } from './components/PastWorkGallery'
import { MousePointer, ZoomIn, RotateCw, Loader2, Sparkles } from 'lucide-react'

// Light-Theme HTML/CSS Fallback Component
const LightCanvasLoader = () => (
  <Html center>
    <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-gray-200 text-slate-800 shadow-lg min-w-[200px]">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      <span className="text-xs font-mono font-bold tracking-wider text-slate-700">
        Rendering 3D Studio...
      </span>
    </div>
  </Html>
)

/**
 * App - Light-Theme Enterprise 3D Door Studio
 * Integrates:
 * 1. DashboardLayout shell (light theme).
 * 2. 3D Canvas placed in a white card container (bg-white rounded-2xl shadow-sm border border-gray-100).
 * 3. Light background <color attach="background" args={['#f8fafc']} /> matching slate-50.
 * 4. Daytime studio environment lighting & soft grounding ContactShadows.
 * 5. White card ConfigPanel side by side with the 3D Canvas.
 */
export function App() {
  const [activeTab, setActiveTab] = useState('configurator')
  const { doorConfig, color, wireframe } = useConfigStore()

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'configurator' && (
        <div className="space-y-6">
          
          {/* Main 2-Column Responsive Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* COLUMN 1: Light-Theme 3D Canvas Container Card (lg:col-span-7 xl:col-span-8) */}
            <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-3 relative h-[520px] sm:h-[620px] lg:h-[680px] overflow-hidden flex flex-col">
              
              {/* Card Header Status Bar */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-slate-50/50 rounded-xl mb-2 z-10">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Realtime Parametric Engine</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                  <span>W: {doorConfig.bottomWidth}cm</span>
                  <span>H: {doorConfig.leftHeight}cm</span>
                </div>
              </div>

              {/* 3D WebGL Canvas Layer */}
              <div className="relative flex-1 w-full h-full rounded-xl overflow-hidden">
                <Suspense fallback={<LightCanvasLoader />}>
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
                    {/* Background matching Tailwind #f8fafc slate-50 seamlessly */}
                    <color attach="background" args={['#f8fafc']} />

                    {/* Daytime Studio Lighting */}
                    <ambientLight intensity={0.95} />
                    <directionalLight
                      position={[5, 8, 4]}
                      intensity={1.5}
                      castShadow
                      shadow-mapSize-width={1024}
                      shadow-mapSize-height={1024}
                      shadow-bias={-0.0001}
                    />
                    <directionalLight position={[-4, 4, -3]} intensity={0.5} color="#e0f2fe" />

                    {/* Environment City Preset (Daytime Studio Light) */}
                    <Environment preset="city" environmentIntensity={1.0} resolution={256} />

                    {/* Procedural Parametric 3D Door */}
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

                    {/* Grounding ContactShadows casting soft shadow on floor */}
                    <ContactShadows
                      position={[0, 0, 0]}
                      opacity={0.6}
                      scale={7}
                      blur={2.0}
                      far={3.0}
                      resolution={512}
                      color="#000000"
                    />

                    {/* Orbit Controls */}
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

                {/* Minimalist Controls Pill HUD (Bottom Left inside canvas card) */}
                <div className="absolute bottom-4 left-4 z-10 hidden sm:block pointer-events-none">
                  <div className="bg-white/80 backdrop-blur-md border border-gray-200 px-3.5 py-1.5 rounded-full flex items-center gap-3 text-[11px] text-slate-600 shadow-xs pointer-events-auto">
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

            {/* COLUMN 2: Light White-Card Configurator Panel (lg:col-span-5 xl:col-span-4) */}
            <div className="lg:col-span-5 xl:col-span-4">
              <ConfigPanel />
            </div>

          </div>
        </div>
      )}

      {/* Other Tabs */}
      {activeTab === 'saved' && <SavedConfigurations />}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <ProductCategories />
        </div>
      )}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <PastWorkGallery />
        </div>
      )}
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

export default App
