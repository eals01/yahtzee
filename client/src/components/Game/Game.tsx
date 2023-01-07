import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import styled from 'styled-components'
import socket from '../../socket'

import Dice from './Dice/Dice'
import Table from '../Table/Table'

export default function Game() {
  useEffect(() => {
    socket.on('finalResult', (result) => {
      console.log('Final result: ', result)
    })

    return () => {
      socket.off('finalResult')
    }
  }, [])

  function throwDice() {
    socket.emit('throwDice')
  }

  return (
    <GameContainer>
      <Canvas>
        <OrbitControls />
        <ambientLight />
        <Physics>
          <Dice id={0} />
          <Dice id={1} />
          <Dice id={2} />
          <Dice id={3} />
          <Dice id={4} />
          <Table />
        </Physics>
      </Canvas>
      <button onClick={throwDice}>Throw Dice</button>
    </GameContainer>
  )
}

const GameContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;

  > button {
    position: absolute;
    bottom: 2em;
  }
`
