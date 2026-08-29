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
  /** Wall color hex string */
  wallColor?: string
  /** Total wall width in meters (default: 6.0m) */
  totalWallWidth?: number
  /** Total wall height in meters (default: 3.5m) */
  totalWallHeight?: number
  /** Wall depth/thickness in meters (default: 0.15m = 15cm) */
  wallDepth?: number
  /** Show wireframe overlay */
  wireframe?: boolean
}

/**
 * ParametricWall - Environmental Context Wall Component
 * Assembles four separate <mesh> elements (Top Wall, Left Wall, Right Wall, Floor Base)
 * with boxGeometry to dynamically frame the door opening and simulate a large room wall.
 */
export const ParametricWall: React.FC<ParametricWallProps> = ({
  topWidth,
  bottomWidth,
  leftHeight,
  rightHeight,
  frameWidth = 0.055,
  wallColor = '#334155',
  totalWallWidth = 6.0,
  totalWallHeight = 3.6,
  wallDepth = 0.15,
  wireframe = false,
}) => {
  // Opening dimensions including frame outer dimensions
  const outerWidth = Math.max(topWidth, bottomWidth) + frameWidth * 2
  const maxOpeningHeight = Math.max(leftHeight, rightHeight) + frameWidth

  // Half dimensions
  const halfWallW = totalWallWidth / 2
  const halfDoorW = outerWidth / 2

  // 1. Left Wall Segment: Extends from -halfWallW to -halfDoorW
  const leftWallWidth = halfWallW - halfDoorW
  const leftWallCenterX = -halfWallW + leftWallWidth / 2

  // 2. Right Wall Segment: Extends from +halfDoorW to +halfWallW
  const rightWallWidth = halfWallW - halfDoorW
  const rightWallCenterX = halfDoorW + rightWallWidth / 2

  // 3. Top Wall Segment: Sits above maxOpeningHeight up to totalWallHeight
  const topWallHeight = totalWallHeight - maxOpeningHeight
  const topWallCenterY = maxOpeningHeight + topWallHeight / 2

  const sharedMaterial = (
    <meshStandardMaterial
      color={new THREE.Color(wallColor)}
      roughness={0.7}
      metalness={0.1}
      wireframe={wireframe}
      side={THREE.DoubleSide}
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
          {sharedMaterial}
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
          {sharedMaterial}
        </mesh>
      )}

      {/* 3. Top Wall Mesh (Framing the opening top header) */}
      {topWallHeight > 0 && (
        <mesh
          position={[0, topWallCenterY, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[outerWidth, topWallHeight, wallDepth]} />
          {sharedMaterial}
        </mesh>
      )}

      {/* 4. Skirt / Sub-floor Base (Underneath Floor Threshold) */}
      <mesh
        position={[0, -0.05, 0]}
        receiveShadow
      >
        <boxGeometry args={[totalWallWidth, 0.1, wallDepth + 0.1]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.2} />
      </mesh>
    </group>
  )
}

export default ParametricWall
