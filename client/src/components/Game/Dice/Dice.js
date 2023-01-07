import { useEffect, useState } from 'react'
import { Vector3, Quaternion } from 'three'
import { useGLTF } from '@react-three/drei'
import { useBox } from '@react-three/cannon'

import model from './Dice.gltf'
import socket from '../../../socket'
import { useFrame } from '@react-three/fiber'

export default function Dice({ id }) {
  const [awaitingResult, setAwaitingResult] = useState(false)
  const [locked, setLocked] = useState(false)

  const [position, setPosition] = useState([0, 0, 0])
  const [velocity, setVelocity] = useState([0, 0, 0])
  const [quaternion, setQuaternion] = useState([0, 0, 0, 0])

  const positions = [
    [-1.25, -3],
    [1.25, -1.5],
    [-1.25, 0],
    [1.25, 1.5],
    [-1.25, 3],
  ]

  useEffect(() => {
    socket.on('throwDice', (dieInfo) => {
      const diceInfo = dieInfo.filter((value) => value.id === id)[0]

      if (!diceInfo.locked) {
        diceApi.position.set(positions[id][0], 0, positions[id][1])
        diceApi.position.set(positions[id][0], 10, positions[id][1])
        diceApi.velocity.set(5, 3, 10)
        diceApi.rotation.set(
          diceInfo.rotation[0],
          diceInfo.rotation[1],
          diceInfo.rotation[2]
        )
        diceApi.angularVelocity.set(
          diceInfo.angularVelocity[0],
          diceInfo.angularVelocity[1],
          diceInfo.angularVelocity[2]
        )
      }

      setTimeout(() => {
        setAwaitingResult(true)
      }, 500)
    })

    const unsubscribeVelocity = diceApi.velocity.subscribe((velocity) =>
      setVelocity(velocity)
    )
    const unsubscribeQuaternion = diceApi.quaternion.subscribe((quaternion) =>
      setQuaternion(quaternion)
    )
    const unsubscribePosition = diceApi.position.subscribe((position) =>
      setPosition(position)
    )

    return () => {
      socket.off('throwDice')

      unsubscribeVelocity()
      unsubscribeQuaternion()
      unsubscribePosition()
    }
  }, [])

  useFrame(() => {
    const stopped =
      Math.abs(velocity[0]) + Math.abs(velocity[1]) + Math.abs(velocity[2]) <
        0.01 && position[1] < 3

    if (stopped && awaitingResult) {
      socket.emit('diceResultReady', getResult())
      setAwaitingResult(false)
    }
  })

  function getResult() {
    let vectors = [
      new Vector3(1, 0, 0),
      new Vector3(0, 0, -1),
      new Vector3(0, 1, 0),
      new Vector3(0, -1, 0),
      new Vector3(0, 0, 1),
      new Vector3(-1, 0, 0),
    ]

    const finalQuaternion = new Quaternion(
      quaternion[0],
      quaternion[1],
      quaternion[2],
      quaternion[3]
    )

    for (const vector of vectors) {
      vector.applyQuaternion(finalQuaternion)
    }

    let highestVector = vectors[0]
    for (const vector of vectors) {
      if (vector.y > highestVector.y) {
        highestVector = vector
      }
    }
    return vectors.indexOf(highestVector) + 1
  }

  function toggleLock(event) {
    event.stopPropagation()
    socket.emit('toggleLock', id)
    setLocked(!locked)
  }

  const [diceRef, diceApi] = useBox(() => ({
    mass: 1,
    type: 'Dynamic',
    args: [2, 2, 2],
    position: [positions[id][0], 1, positions[id][1]],
    sleepSpeedLimit: 0,
  }))

  const { nodes, materials } = useGLTF(model)
  return (
    <>
      <mesh
        ref={diceRef}
        geometry={nodes.Dice.geometry}
        material={materials.Material}
        onClick={toggleLock}
      >
        {locked && (
          <mesh>
            <boxGeometry args={[2.01, 2.01, 2.01]} />
            <meshPhongMaterial color='#000000' opacity={0.4} transparent />
          </mesh>
        )}
      </mesh>
    </>
  )
}

useGLTF.preload(model)
