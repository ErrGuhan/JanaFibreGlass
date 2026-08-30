import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ParametricWall } from './ParametricWall'
import { useConfigStore } from '../store/useConfigStore'

export interface ParametricDoorProps {
  /** Top width of the door opening in cm (default: 84) */
  topWidth?: number
  /** Bottom width of the door opening in cm (default: 84) */
  bottomWidth?: number
  /** Left side frame height in cm (default: 210) */
  leftHeight?: number
  /** Right side frame height in cm (default: 210) */
  rightHeight?: number
  /** Door panel thickness in cm (default: 4.5) */
  thickness?: number
  /** Door opening side ('left' | 'right') */
  openSide?: 'left' | 'right'
  /** Color of the main door panel (default: '#d4a373') */
  doorColor?: string
  /** Color of the frame and sill (default: '#1e293b') */
  frameColor?: string
  /** Width / profile face of frame components in cm (default: 5.5) */
  frameWidth?: number
  /** Total depth / jamb depth of frame in cm (default: 10) */
  frameDepth?: number
  /** Height of the floor sill in cm (default: 4) */
  sillHeight?: number
  /** Optional door opening angle in degrees */
  openAngle?: number
  /** Show geometry wireframe (default: false) */
  wireframe?: boolean
  /** Unit scale factor to convert cm into Three.js world units (default: 0.01 for meters) */
  unitScale?: number
  /** Render surrounding room wall */
  showWall?: boolean
}

/**
 * ParametricDoor - 3D Door & Frame Component with 60FPS Spring Hinge Physics
 * Constructs a custom polygon using vertices: (0,0), (widthBottom, 0), (widthTop, heightRight), (0, heightLeft)
 * Supports 'left' and 'right' opening side hinge pivots.
 */
export const ParametricDoor: React.FC<ParametricDoorProps> = ({
  topWidth: propTopWidth,
  bottomWidth: propBottomWidth,
  leftHeight: propLeftHeight,
  rightHeight: propRightHeight,
  thickness: propThickness,
  openSide: propOpenSide,
  doorColor: propDoorColor,
  frameColor = '#1e293b',
  frameWidth = 5.5,
  frameDepth = 10,
  sillHeight = 4,
  wireframe = false,
  unitScale = 0.01,
  showWall = true,
}) => {
  const doorPivotRef = useRef<THREE.Group>(null)

  // Door Hinge Spring Physics State
  const currentAngleRef = useRef(0)
  const velocityRef = useRef(0)

  // Read door config state from Zustand store
  const { doorConfig, wallColor } = useConfigStore()

  const topWidth = propTopWidth ?? doorConfig.topWidth ?? 84.0
  const bottomWidth = propBottomWidth ?? doorConfig.bottomWidth ?? 84.0
  const leftHeight = propLeftHeight ?? doorConfig.leftHeight ?? 210.0
  const rightHeight = propRightHeight ?? doorConfig.rightHeight ?? 210.0
  const thickness = propThickness ?? doorConfig.thickness ?? 4.5
  const openSide = propOpenSide ?? doorConfig.openSide ?? 'left'
  const doorColor = propDoorColor ?? doorConfig.doorColor ?? '#d4a373'
  const isDoorOpen = doorConfig.isDoorOpen

  // Convert cm to Three.js world meters
  const s = unitScale
  const W_top = topWidth * s
  const W_bot = bottomWidth * s
  const H_left = leftHeight * s
  const H_right = rightHeight * s
  const T_door = thickness * s
  const F_width = frameWidth * s
  const F_depth = frameDepth * s
  const S_height = sillHeight * s
  const clearance = 0.004 // 4mm gap

  // Target rotation: If openSide === 'left', swing outwards (+Math.PI / 2). If 'right', invert (-Math.PI / 2).
  const isLeft = openSide === 'left'
  const targetAngle = isLeft ? Math.PI / 2 : -Math.PI / 2
  const targetRad = isDoorOpen ? targetAngle : 0

  // Real-time 60FPS Frame Hinge Spring Solver
  useFrame((_, delta) => {
    if (!doorPivotRef.current) return

    const stiffness = 60
    const damping = 12
    const mass = 1.5

    const springForce = -stiffness * (currentAngleRef.current - targetRad)
    const dampingForce = -damping * velocityRef.current
    const acceleration = (springForce + dampingForce) / mass

    const dt = Math.min(delta, 0.05)
    velocityRef.current += acceleration * dt
    currentAngleRef.current += velocityRef.current * dt

    doorPivotRef.current.rotation.y = currentAngleRef.current
  })

  // -------------------------------------------------------------
  // Vector Mathematics for Custom Polygon Geometry (0,0), (W_bot,0), (W_top,H_right), (0,H_left)
  // -------------------------------------------------------------

  const outerBL = new THREE.Vector2(-W_bot / 2, 0)
  const outerBR = new THREE.Vector2(W_bot / 2, 0)
  const outerTR = new THREE.Vector2(W_top / 2, H_right)
  const outerTL = new THREE.Vector2(-W_top / 2, H_left)

  const innerBL = new THREE.Vector2(-W_bot / 2 + F_width, S_height)
  const innerBR = new THREE.Vector2(W_bot / 2 - F_width, S_height)

  const headerDir = new THREE.Vector2().subVectors(outerTR, outerTL).normalize()
  const headerNormal = new THREE.Vector2(-headerDir.y, headerDir.x)

  const innerTL = new THREE.Vector2()
    .copy(outerTL)
    .addScaledVector(headerNormal, -F_width)
    .add(new THREE.Vector2(F_width, 0))

  const innerTR = new THREE.Vector2()
    .copy(outerTR)
    .addScaledVector(headerNormal, -F_width)
    .add(new THREE.Vector2(-F_width, 0))

  // Door Panel 4 Corners (Fitting inside opening with clearance)
  const doorBL = new THREE.Vector2(innerBL.x + clearance, innerBL.y + clearance)
  const doorBR = new THREE.Vector2(innerBR.x - clearance, innerBR.y + clearance)
  const doorTR = new THREE.Vector2(innerTR.x - clearance, innerTR.y - clearance)
  const doorTL = new THREE.Vector2(innerTL.x + clearance, innerTL.y - clearance)

  // Pivot Point
  const pivotPos = isLeft ? doorBL : doorBR

  // -------------------------------------------------------------
  // 1. Procedural Door Panel Geometry
  // -------------------------------------------------------------
  const doorGeometry = useMemo(() => {
    const pivotX = pivotPos.x
    const pivotY = pivotPos.y

    const shape = new THREE.Shape()
    shape.moveTo(doorBL.x - pivotX, doorBL.y - pivotY)
    shape.lineTo(doorBR.x - pivotX, doorBR.y - pivotY)
    shape.lineTo(doorTR.x - pivotX, doorTR.y - pivotY)
    shape.lineTo(doorTL.x - pivotX, doorTL.y - pivotY)
    shape.closePath()

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: T_door,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.003,
      bevelThickness: 0.003,
    })
    geo.computeVertexNormals()
    return geo
  }, [doorBL.x, doorBL.y, doorBR.x, doorBR.y, doorTR.x, doorTR.y, doorTL.x, doorTL.y, pivotPos.x, pivotPos.y, T_door])

  // -------------------------------------------------------------
  // 2. Procedural Frame Geometries
  // -------------------------------------------------------------

  const sillGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(outerBL.x, 0)
    shape.lineTo(outerBR.x, 0)
    shape.lineTo(outerBR.x, S_height)
    shape.lineTo(outerBL.x, S_height)
    shape.closePath()

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: F_depth,
      bevelEnabled: true,
      bevelSegments: 1,
      bevelSize: 0.002,
      bevelThickness: 0.002,
    })
    geo.center()
    geo.translate(0, S_height / 2, 0)
    geo.computeVertexNormals()
    return geo
  }, [outerBL.x, outerBR.x, S_height, F_depth])

  const leftPillarGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(outerBL.x, S_height)
    shape.lineTo(innerBL.x, S_height)
    shape.lineTo(innerTL.x, innerTL.y)
    shape.lineTo(outerTL.x, outerTL.y)
    shape.closePath()

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: F_depth,
      bevelEnabled: true,
      bevelSegments: 1,
      bevelSize: 0.002,
      bevelThickness: 0.002,
    })
    geo.center()
    const midX = (outerBL.x + innerBL.x + innerTL.x + outerTL.x) / 4
    const midY = (S_height + S_height + innerTL.y + outerTL.y) / 4
    geo.translate(midX, midY, 0)
    geo.computeVertexNormals()
    return geo
  }, [outerBL.x, innerBL.x, innerTL.x, innerTL.y, outerTL.x, outerTL.y, S_height, F_depth])

  const rightPillarGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(innerBR.x, S_height)
    shape.lineTo(outerBR.x, S_height)
    shape.lineTo(outerTR.x, outerTR.y)
    shape.lineTo(innerTR.x, innerTR.y)
    shape.closePath()

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: F_depth,
      bevelEnabled: true,
      bevelSegments: 1,
      bevelSize: 0.002,
      bevelThickness: 0.002,
    })
    geo.center()
    const midX = (innerBR.x + outerBR.x + outerTR.x + innerTR.x) / 4
    const midY = (S_height + S_height + outerTR.y + innerTR.y) / 4
    geo.translate(midX, midY, 0)
    geo.computeVertexNormals()
    return geo
  }, [innerBR.x, outerBR.x, outerTR.x, outerTR.y, innerTR.x, innerTR.y, S_height, F_depth])

  const topHeaderGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(outerTL.x, outerTL.y)
    shape.lineTo(outerTR.x, outerTR.y)
    shape.lineTo(innerTR.x, innerTR.y)
    shape.lineTo(innerTL.x, innerTL.y)
    shape.closePath()

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: F_depth,
      bevelEnabled: true,
      bevelSegments: 1,
      bevelSize: 0.002,
      bevelThickness: 0.002,
    })
    geo.center()
    const midX = (outerTL.x + outerTR.x + innerTR.x + innerTL.x) / 4
    const midY = (outerTL.y + outerTR.y + innerTR.y + innerTL.y) / 4
    geo.translate(midX, midY, 0)
    geo.computeVertexNormals()
    return geo
  }, [outerTL.x, outerTL.y, outerTR.x, outerTR.y, innerTR.x, innerTR.y, innerTL.x, innerTL.y, F_depth])

  const doorWidth = doorBR.x - doorBL.x
  const handleHeight = (doorTL.y - doorBL.y) * 0.45
  const handleX = isLeft ? doorWidth * 0.85 : -doorWidth * 0.85

  return (
    <group>
      {/* 0. Environmental Context Surrounding Wall */}
      {showWall && (
        <ParametricWall
          topWidth={W_top}
          bottomWidth={W_bot}
          leftHeight={H_left}
          rightHeight={H_right}
          frameWidth={F_width}
          wallColor={wallColor}
          wireframe={wireframe}
        />
      )}

      {/* 1. Floor Sill */}
      <mesh geometry={sillGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={frameColor}
          roughness={0.7}
          metalness={0.15}
          wireframe={wireframe}
        />
      </mesh>

      {/* 2. Left Frame Pillar */}
      <mesh geometry={leftPillarGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={frameColor}
          roughness={0.7}
          metalness={0.15}
          wireframe={wireframe}
        />
      </mesh>

      {/* 3. Right Frame Pillar */}
      <mesh geometry={rightPillarGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={frameColor}
          roughness={0.7}
          metalness={0.15}
          wireframe={wireframe}
        />
      </mesh>

      {/* 4. Top Header Piece */}
      <mesh geometry={topHeaderGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={frameColor}
          roughness={0.7}
          metalness={0.15}
          wireframe={wireframe}
        />
      </mesh>

      {/* 5. Door Hinge Pivot Group (Positioned at bottom-left or bottom-right vertex) */}
      <group
        ref={doorPivotRef}
        position={[pivotPos.x, pivotPos.y, 0]}
      >
        {/* Main Door Panel Geometry */}
        <mesh geometry={doorGeometry} castShadow receiveShadow>
          <meshStandardMaterial
            color={new THREE.Color(doorColor)}
            roughness={0.8}
            metalness={0.08}
            wireframe={wireframe}
          />
        </mesh>

        {/* Stainless Steel Lever Handle & Rosette (Front) */}
        <group position={[handleX, handleHeight, T_door + 0.005]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.006, 24]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[isLeft ? 0.045 : -0.045, 0, 0.02]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.008, 0.008, 0.11, 16]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0, 0.012]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.009, 0.009, 0.022, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {/* Stainless Steel Lever Handle & Rosette (Back) */}
        <group position={[handleX, handleHeight, -0.005]} rotation={[0, Math.PI, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.006, 24]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[isLeft ? 0.045 : -0.045, 0, 0.02]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.008, 0.008, 0.11, 16]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0, 0.012]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.009, 0.009, 0.022, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {/* Butt Hinges on Pivot Axis */}
        {[0.15, 0.85].map((hingeRatio, idx) => (
          <group
            key={idx}
            position={[
              0,
              (doorTL.y - doorBL.y) * hingeRatio,
              T_door / 2,
            ]}
          >
            <mesh castShadow>
              <cylinderGeometry args={[0.007, 0.007, 0.06, 16]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

export default ParametricDoor
