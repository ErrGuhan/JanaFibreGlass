import React from 'react'
import * as THREE from 'three'

export interface ParametricWallProps {
  /** Top width of opening in meters */
  topWidth: number
  /** Bottom width of opening in meters */
  bottomWidth: number
  /** Left height of opening in meters */
  leftHeight: number
  /** Right height of opening in meters */
  rightHeight: number
  /** Frame face profile width in meters */
  frameWidth?: number
  /** Wall color hex string (default: '#FAFAFA' warm architectural white) */
  wallColor?: string
  /** Total wall width in meters (default: 6.0m) */
  totalWallWidth?: number
  /** Total wall height in meters (default: 3.6m) */
  totalWallHeight?: number
  /** Wall depth/thickness in meters (default: 0.15m = 15cm) */
  wallDepth?: number
  /** Show wireframe overlay */
  wireframe?: boolean
}

/**
 * ParametricWall - Architectural Room Wall Component
 * Features:
 * 1. Baseboard / Skirting Board geometry: Pure white (#FFFFFF), 10cm height x 1.5cm depth painted wood finish (roughness=0.4, metalness=0).
 * 2. Soft warm architectural white matte drywall paint (#FAFAFA, roughness=0.9, metalness=0).
 */
export const ParametricWall: React.FC<ParametricWallProps> = ({
  topWidth,
  bottomWidth,
  leftHeight,
  rightHeight,
  frameWidth = 0.055,
  wallColor = '#FAFAFA',
  totalWallWidth = 6.0,
  totalWallHeight = 3.6,
  wallDepth = 0.15,
  wireframe = false,
}) => {
  const outerWidth = Math.max(topWidth, bottomWidth) + frameWidth * 2
  const maxOpeningHeight = Math.max(leftHeight, rightHeight) + frameWidth

  const halfWallW = totalWallWidth / 2
  const halfDoorW = outerWidth / 2

  const leftWallWidth = halfWallW - halfDoorW
  const leftWallCenterX = -halfWallW + leftWallWidth / 2

  const rightWallWidth = halfWallW - halfDoorW
  const rightWallCenterX = halfDoorW + rightWallWidth / 2

  const topWallHeight = totalWallHeight - maxOpeningHeight
  const topWallCenterY = maxOpeningHeight + topWallHeight / 2

  // Baseboard dimensions: 10cm height (0.10m) x 1.5cm thickness (0.015m)
  const baseboardHeight = 0.10
  const baseboardThickness = 0.015
  const baseboardY = baseboardHeight / 2 // Sits flush on floor (0.05m)
  const baseboardZ = wallDepth / 2 + baseboardThickness / 2 // Flush against front wall surface

  // Drywall Paint Material (roughness=0.9, metalness=0)
  const wallMaterial = (
    <meshStandardMaterial
      color={new THREE.Color(wallColor)}
      roughness={0.9}
      metalness={0.0}
      wireframe={wireframe}
      side={THREE.DoubleSide}
    />
  )

  // Semi-Gloss Painted Wood Baseboard Material (Pure White #FFFFFF, roughness=0.4, metalness=0)
  const baseboardMaterial = (
    <meshStandardMaterial
      color="#FFFFFF"
      roughness={0.4}
      metalness={0.0}
      wireframe={wireframe}
    />
  )

  return (
    <group position={[0, 0, -wallDepth / 2 + 0.01]}>
      {/* 1. Left Wall Mesh */}
      {leftWallWidth > 0 && (
        <mesh
          position={[leftWallCenterX, totalWallHeight / 2, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[leftWallWidth, totalWallHeight, wallDepth]} />
          {wallMaterial}
        </mesh>
      )}

      {/* 2. Right Wall Mesh */}
      {rightWallWidth > 0 && (
        <mesh
          position={[rightWallCenterX, totalWallHeight / 2, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[rightWallWidth, totalWallHeight, wallDepth]} />
          {wallMaterial}
        </mesh>
      )}

      {/* 3. Top Wall Mesh */}
      {topWallHeight > 0 && (
        <mesh
          position={[0, topWallCenterY, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[outerWidth, topWallHeight, wallDepth]} />
          {wallMaterial}
        </mesh>
      )}

      {/* 4. Left Baseboard / Skirting Board Mesh (Stretches from far-left to door frame left edge) */}
      {leftWallWidth > 0 && (
        <mesh
          position={[leftWallCenterX, baseboardY, baseboardZ]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[leftWallWidth, baseboardHeight, baseboardThickness]} />
          {baseboardMaterial}
        </mesh>
      )}

      {/* 5. Right Baseboard / Skirting Board Mesh (Stretches from door frame right edge to far-right) */}
      {rightWallWidth > 0 && (
        <mesh
          position={[rightWallCenterX, baseboardY, baseboardZ]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[rightWallWidth, baseboardHeight, baseboardThickness]} />
          {baseboardMaterial}
        </mesh>
      )}

      {/* 6. Sub-floor Threshold Skirt */}
      <mesh
        position={[0, -0.05, 0]}
        receiveShadow
      >
        <boxGeometry args={[totalWallWidth, 0.1, wallDepth + 0.1]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.6} metalness={0.1} />
      </mesh>
    </group>
  )
}

export default ParametricWall
