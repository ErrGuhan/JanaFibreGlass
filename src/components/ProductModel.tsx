import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useConfigStore } from '../store/useConfigStore'
import { Line, Html } from '@react-three/drei'
import { ParametricDoor } from './ParametricDoor'

export const ProductModel: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null)
  
  const {
    productType,
    color,
    roughness,
    metalness,
    clearcoat,
    transmission,
    opacity,
    wireframe,
    autoRotate,
    rotationSpeed,
    showDimensions,
    reinforcementRibs,
    flangeAccessory,
    dimensions,
    doorConfig,
  } = useConfigStore()

  // Frame animation for smooth rotation
  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * (rotationSpeed * 0.4)
    }
  })

  const radius = dimensions.diameter / 2
  const height = dimensions.height

  // Shared fiberglass material
  const materialProps = {
    color: new THREE.Color(color),
    roughness,
    metalness,
    clearcoat: transmission > 0 ? 1 : clearcoat,
    clearcoatRoughness: 0.1,
    transmission: transmission,
    ior: 1.52,
    thickness: 1.2,
    transparent: transmission > 0 || opacity < 1,
    opacity: opacity,
    wireframe,
    side: THREE.DoubleSide,
  }

  const accentMaterial = (
    <meshStandardMaterial
      color="#475569"
      metalness={0.8}
      roughness={0.2}
      wireframe={wireframe}
    />
  )

  const renderProduct = () => {
    switch (productType) {
      case 'door':
        return (
          <group position={[0, 0, 0]}>
            <ParametricDoor
              topWidth={doorConfig.topWidth}
              bottomWidth={doorConfig.bottomWidth}
              leftHeight={doorConfig.leftHeight}
              rightHeight={doorConfig.rightHeight}
              thickness={doorConfig.thickness}
              doorColor={color || doorConfig.doorColor}
              openAngle={doorConfig.openAngle}
              wireframe={wireframe}
            />
          </group>
        )

      case 'tank':
        return (
          <group position={[0, height / 2, 0]}>
            {/* Main Tank Cylinder Body */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[radius, radius, height, 48, 16, true]} />
              <meshPhysicalMaterial {...materialProps} />
            </mesh>

            {/* Top Dished Head / Dome */}
            <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
              <sphereGeometry args={[radius, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshPhysicalMaterial {...materialProps} />
            </mesh>

            {/* Bottom Dished Head */}
            <mesh position={[0, -height / 2, 0]} rotation={[Math.PI, 0, 0]} castShadow receiveShadow>
              <sphereGeometry args={[radius, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshPhysicalMaterial {...materialProps} />
            </mesh>

            {/* Reinforcement Hoop Rings */}
            {reinforcementRibs && (
              <>
                <mesh position={[0, -height * 0.25, 0]}>
                  <torusGeometry args={[radius + 0.04, 0.04, 16, 48]} />
                  {accentMaterial}
                </mesh>
                <mesh position={[0, 0, 0]}>
                  <torusGeometry args={[radius + 0.04, 0.04, 16, 48]} />
                  {accentMaterial}
                </mesh>
                <mesh position={[0, height * 0.25, 0]}>
                  <torusGeometry args={[radius + 0.04, 0.04, 16, 48]} />
                  {accentMaterial}
                </mesh>
              </>
            )}

            {/* Top Manhole Flange & Nozzle */}
            {flangeAccessory && (
              <group position={[0, height / 2 + radius * 0.9, 0]}>
                <mesh castShadow>
                  <cylinderGeometry args={[radius * 0.35, radius * 0.35, 0.25, 32]} />
                  {accentMaterial}
                </mesh>
                <mesh position={[0, 0.15, 0]}>
                  <cylinderGeometry args={[radius * 0.45, radius * 0.45, 0.06, 32]} />
                  {accentMaterial}
                </mesh>
              </group>
            )}

            {/* Side Inlet / Outlet Flange */}
            {flangeAccessory && (
              <group position={[radius + 0.15, -height * 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.18, 0.18, 0.35, 24]} />
                  {accentMaterial}
                </mesh>
                <mesh position={[0, 0.18, 0]}>
                  <cylinderGeometry args={[0.26, 0.26, 0.05, 24]} />
                  {accentMaterial}
                </mesh>
              </group>
            )}

            {/* Support Legs */}
            <group position={[0, -height / 2, 0]}>
              {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => (
                <mesh
                  key={i}
                  position={[
                    Math.cos(angle) * (radius * 0.85),
                    -0.35,
                    Math.sin(angle) * (radius * 0.85),
                  ]}
                  castShadow
                >
                  <boxGeometry args={[0.14, 0.7, 0.14]} />
                  {accentMaterial}
                </mesh>
              ))}
            </group>
          </group>
        )

      case 'dome':
        return (
          <group position={[0, 0, 0]}>
            {/* Geodesic Segmented Fiberglass Architectural Dome */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
              <sphereGeometry args={[radius, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshPhysicalMaterial {...materialProps} />
            </mesh>

            {/* Base Support Ring */}
            <mesh position={[0, 0.04, 0]}>
              <cylinderGeometry args={[radius + 0.08, radius + 0.12, 0.1, 48]} />
              {accentMaterial}
            </mesh>

            {/* Geodesic Structural Lattice Ribs */}
            {reinforcementRibs && (
              <group>
                <mesh position={[0, radius * 0.45, 0]}>
                  <torusGeometry args={[radius * 0.88, 0.03, 16, 48]} />
                  {accentMaterial}
                </mesh>
                <mesh position={[0, radius * 0.8, 0]}>
                  <torusGeometry args={[radius * 0.58, 0.03, 16, 48]} />
                  {accentMaterial}
                </mesh>
              </group>
            )}

            {/* Skylight Top Apex Ring */}
            {flangeAccessory && (
              <group position={[0, radius * 0.98, 0]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.4, 0.4, 0.12, 32]} />
                  <meshPhysicalMaterial
                    color="#e0f2fe"
                    transmission={0.9}
                    opacity={0.8}
                    transparent
                    roughness={0.1}
                    ior={1.5}
                  />
                </mesh>
                <mesh position={[0, 0.07, 0]}>
                  <torusGeometry args={[0.42, 0.03, 16, 32]} />
                  {accentMaterial}
                </mesh>
              </group>
            )}
          </group>
        )

      case 'pipe':
        return (
          <group position={[0, height / 2, 0]}>
            {/* High-Pressure Fiberglass Composite Pipe Section */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[radius, radius, height, 48, 16, true]} />
              <meshPhysicalMaterial {...materialProps} />
            </mesh>

            {/* End Flanges */}
            <mesh position={[0, height / 2, 0]}>
              <cylinderGeometry args={[radius * 1.35, radius * 1.35, 0.14, 36]} />
              {accentMaterial}
            </mesh>
            <mesh position={[0, -height / 2, 0]}>
              <cylinderGeometry args={[radius * 1.35, radius * 1.35, 0.14, 36]} />
              {accentMaterial}
            </mesh>

            {/* Pipe Joint / Reinforcement Couplers */}
            {reinforcementRibs && (
              <>
                <mesh position={[0, -height * 0.2, 0]}>
                  <cylinderGeometry args={[radius * 1.08, radius * 1.08, 0.22, 36]} />
                  {accentMaterial}
                </mesh>
                <mesh position={[0, height * 0.2, 0]}>
                  <cylinderGeometry args={[radius * 1.08, radius * 1.08, 0.22, 36]} />
                  {accentMaterial}
                </mesh>
              </>
            )}

            {/* Branch Tap / Access Port */}
            {flangeAccessory && (
              <group position={[0, 0, radius + 0.15]} rotation={[Math.PI / 2, 0, 0]}>
                <mesh castShadow>
                  <cylinderGeometry args={[radius * 0.4, radius * 0.4, 0.35, 24]} />
                  {accentMaterial}
                </mesh>
                <mesh position={[0, 0.18, 0]}>
                  <cylinderGeometry args={[radius * 0.55, radius * 0.55, 0.06, 24]} />
                  {accentMaterial}
                </mesh>
              </group>
            )}
          </group>
        )

      case 'enclosure':
        return (
          <group position={[0, height / 2, 0]}>
            {/* Weatherproof Modular Enclosure Body */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[dimensions.diameter, height, dimensions.diameter * 0.8]} />
              <meshPhysicalMaterial {...materialProps} />
            </mesh>

            {/* Top Sloped Weatherhood */}
            <mesh position={[0, height / 2 + 0.12, 0]} castShadow>
              <boxGeometry args={[dimensions.diameter * 1.08, 0.1, dimensions.diameter * 0.88]} />
              <meshPhysicalMaterial {...materialProps} />
            </mesh>

            {/* Inspection Window / Panel */}
            {flangeAccessory && (
              <group position={[0, 0.15, dimensions.diameter * 0.4 + 0.02]}>
                <mesh>
                  <planeGeometry args={[dimensions.diameter * 0.45, height * 0.35]} />
                  <meshPhysicalMaterial
                    color="#93c5fd"
                    transmission={0.85}
                    opacity={0.8}
                    transparent
                    roughness={0.08}
                    ior={1.5}
                  />
                </mesh>
                {/* Frame border */}
                <mesh position={[0, 0, -0.01]}>
                  <boxGeometry args={[dimensions.diameter * 0.48, height * 0.38, 0.02]} />
                  {accentMaterial}
                </mesh>
              </group>
            )}

            {/* Industrial Hinges & Latches */}
            {reinforcementRibs && (
              <>
                <mesh position={[-dimensions.diameter * 0.48, height * 0.25, dimensions.diameter * 0.38]}>
                  <boxGeometry args={[0.06, 0.2, 0.06]} />
                  {accentMaterial}
                </mesh>
                <mesh position={[-dimensions.diameter * 0.48, -height * 0.25, dimensions.diameter * 0.38]}>
                  <boxGeometry args={[0.06, 0.2, 0.06]} />
                  {accentMaterial}
                </mesh>
                {/* Ventilation Louvers on Side */}
                <mesh position={[dimensions.diameter * 0.51, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                  <planeGeometry args={[dimensions.diameter * 0.4, height * 0.25]} />
                  {accentMaterial}
                </mesh>
              </>
            )}

            {/* Mounting Plinth Base */}
            <mesh position={[0, -height / 2 - 0.08, 0]}>
              <boxGeometry args={[dimensions.diameter * 1.06, 0.16, dimensions.diameter * 0.86]} />
              {accentMaterial}
            </mesh>
          </group>
        )

      default:
        return null
    }
  }

  return (
    <group ref={groupRef}>
      {renderProduct()}

      {/* Real-time Technical Dimension Overlays for Standard Cylindrical/Rectangular shapes */}
      {showDimensions && productType !== 'door' && (
        <group>
          {/* Vertical Height Line */}
          <Line
            points={[
              [-radius - 0.4, 0, 0],
              [-radius - 0.4, height, 0],
            ]}
            color="#38bdf8"
            lineWidth={1.5}
            dashed
            dashScale={50}
            dashSize={0.1}
            gapSize={0.05}
          />
          {/* Horizontal Width Line */}
          <Line
            points={[
              [-radius, -0.05, radius + 0.4],
              [radius, -0.05, radius + 0.4],
            ]}
            color="#38bdf8"
            lineWidth={1.5}
            dashed
            dashScale={50}
            dashSize={0.1}
            gapSize={0.05}
          />

          {/* Dimension Label Badges */}
          <Html position={[-radius - 0.5, height / 2, 0]} center>
            <div className="bg-slate-900/90 text-cyan-400 text-[10px] font-mono font-semibold px-2 py-0.5 rounded border border-cyan-500/40 shadow-lg backdrop-blur-sm pointer-events-none whitespace-nowrap">
              H: {height.toFixed(1)}m
            </div>
          </Html>
          <Html position={[0, -0.1, radius + 0.5]} center>
            <div className="bg-slate-900/90 text-cyan-400 text-[10px] font-mono font-semibold px-2 py-0.5 rounded border border-cyan-500/40 shadow-lg backdrop-blur-sm pointer-events-none whitespace-nowrap">
              Ø: {dimensions.diameter.toFixed(1)}m
            </div>
          </Html>
        </group>
      )}

      {/* Door Specific Dimension Overlays */}
      {showDimensions && productType === 'door' && (
        <group>
          <Html position={[-doorConfig.bottomWidth * 0.01 / 2 - 0.15, doorConfig.leftHeight * 0.01 / 2, 0]} center>
            <div className="bg-slate-900/90 text-cyan-400 text-[10px] font-mono font-semibold px-2 py-0.5 rounded border border-cyan-500/40 shadow-lg backdrop-blur-sm pointer-events-none whitespace-nowrap">
              LH: {doorConfig.leftHeight}cm
            </div>
          </Html>
          <Html position={[doorConfig.bottomWidth * 0.01 / 2 + 0.15, doorConfig.rightHeight * 0.01 / 2, 0]} center>
            <div className="bg-slate-900/90 text-cyan-400 text-[10px] font-mono font-semibold px-2 py-0.5 rounded border border-cyan-500/40 shadow-lg backdrop-blur-sm pointer-events-none whitespace-nowrap">
              RH: {doorConfig.rightHeight}cm
            </div>
          </Html>
          <Html position={[0, Math.max(doorConfig.leftHeight, doorConfig.rightHeight) * 0.01 + 0.15, 0]} center>
            <div className="bg-slate-900/90 text-cyan-400 text-[10px] font-mono font-semibold px-2 py-0.5 rounded border border-cyan-500/40 shadow-lg backdrop-blur-sm pointer-events-none whitespace-nowrap">
              TW: {doorConfig.topWidth}cm
            </div>
          </Html>
          <Html position={[0, -0.1, 0.15]} center>
            <div className="bg-slate-900/90 text-cyan-400 text-[10px] font-mono font-semibold px-2 py-0.5 rounded border border-cyan-500/40 shadow-lg backdrop-blur-sm pointer-events-none whitespace-nowrap">
              BW: {doorConfig.bottomWidth}cm
            </div>
          </Html>
        </group>
      )}
    </group>
  )
}
