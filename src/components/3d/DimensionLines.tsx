import React from 'react'
import { Line, Text } from '@react-three/drei'
import { useConfigStore } from '../../store/useConfigStore'

/**
 * DimensionLines - Overlay 3D Dimension Lines & Real-Time Labels
 * Renders cyan vector lines (#00FFFF) and white text labels (#FFFFFF) for Width and Height
 * with depthTest={false} so they float cleanly over the 3D model.
 */
export const DimensionLines: React.FC = () => {
  const { doorConfig } = useConfigStore()

  const width = doorConfig.bottomWidth ?? 84.0
  const heightLeft = doorConfig.leftHeight ?? 210.0
  const heightRight = doorConfig.rightHeight ?? 210.0
  const height = (heightLeft + heightRight) / 2

  // Convert cm to 3D world meters (0.01)
  const s = 0.01
  const w = width * s
  const h = height * s

  // 5cm offset in meters = 0.05m (+ clearance offset for frame)
  const topOffset = 0.08
  const sideOffset = 0.08
  const zPos = 0.08

  // Horizontal line points (Top Width)
  const horizontalPoints: [number, number, number][] = [
    [-w / 2, h + topOffset, zPos],
    [w / 2, h + topOffset, zPos],
  ]

  // Vertical line points (Right Height)
  const verticalPoints: [number, number, number][] = [
    [w / 2 + sideOffset, 0, zPos],
    [w / 2 + sideOffset, h, zPos],
  ]

  return (
    <group>
      {/* Top Horizontal Width Line */}
      <Line
        points={horizontalPoints}
        color="#00FFFF"
        lineWidth={1}
        depthTest={false}
        renderOrder={100}
      />
      {/* Top Horizontal Width Text Label */}
      <Text
        position={[0, h + topOffset + 0.05, zPos]}
        color="#FFFFFF"
        fontSize={0.08}
        anchorX="center"
        anchorY="bottom"
        material-depthTest={false}
        renderOrder={101}
      >
        {`${width.toFixed(1)} cm`}
      </Text>

      {/* Right Vertical Height Line */}
      <Line
        points={verticalPoints}
        color="#00FFFF"
        lineWidth={1}
        depthTest={false}
        renderOrder={100}
      />
      {/* Right Vertical Height Text Label */}
      <Text
        position={[w / 2 + sideOffset + 0.06, h / 2, zPos]}
        color="#FFFFFF"
        fontSize={0.08}
        anchorX="left"
        anchorY="middle"
        material-depthTest={false}
        renderOrder={101}
      >
        {`${height.toFixed(1)} cm`}
      </Text>
    </group>
  )
}

export default DimensionLines
