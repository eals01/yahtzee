import { useBox } from '@react-three/cannon'

export default function Table() {
  const [tableRef] = useBox(() => ({
    mass: 1,
    type: 'Static',
    args: [100, 2, 200],
    position: [0, -1.3, 0],
    sleepSpeedLimit: 1,
  }))

  return (
    <group>
      <mesh ref={tableRef} receiveShadow castShadow>
        <boxGeometry args={[100, 2, 200]} />
        <meshPhysicalMaterial color='#C6A27E' />
      </mesh>
      <mesh position={[-40, -17.3, -74]} receiveShadow castShadow>
        <boxGeometry args={[6, 30, 6]} />
        <meshPhysicalMaterial color='#C6A27E' />
      </mesh>
      <mesh position={[40, -17.3, -74]} receiveShadow castShadow>
        <boxGeometry args={[6, 30, 6]} />
        <meshPhysicalMaterial color='#C6A27E' />
      </mesh>
      <mesh position={[-40, -17.3, 74]} receiveShadow castShadow>
        <boxGeometry args={[6, 30, 6]} />
        <meshPhysicalMaterial color='#C6A27E' />
      </mesh>
      <mesh position={[40, -17.3, 74]} receiveShadow castShadow>
        <boxGeometry args={[6, 30, 6]} />
        <meshPhysicalMaterial color='#C6A27E' />
      </mesh>
    </group>
  )
}
