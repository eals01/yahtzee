import { useEffect } from 'react'
import Game from './components/Game/Game'
import socket from './socket'

export default function App() {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected')
    })
  }, [])

  return (
    <div>
      <Game />
    </div>
  )
}
