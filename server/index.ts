import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
})

function generateDiceValues() {
  return {
    rotation: [
      Math.random() * 2 * Math.PI,
      Math.random() * 2 * Math.PI,
      Math.random() * 2 * Math.PI
    ],
    angularVelocity: [
      Math.ceil(Math.random() * 10 - 5),
      Math.ceil(Math.random() * 10 - 5),
      Math.ceil(Math.random() * 10 - 5)
    ]
  }
}

function generateDieInfo(dieLocked: boolean[]) {
  return [
    {
      id: 0,
      locked: dieLocked[0],
      ...generateDiceValues()
    },
    {
      id: 1,
      locked: dieLocked[1],
      ...generateDiceValues()
    },
    {
      id: 2,
      locked: dieLocked[2],
      ...generateDiceValues()
    },
    {
      id: 3,
      locked: dieLocked[3],
      ...generateDiceValues()
    },
    {
      id: 4,
      locked: dieLocked[4],
      ...generateDiceValues()
    }
  ]
}

io.on('connection', socket => {
  let die = [
    {
      id: 0,
      locked: false
    },
    {
      id: 1,
      locked: false
    },
    {
      id: 2,
      locked: false
    },
    {
      id: 3,
      locked: false
    },
    {
      id: 4,
      locked: false
    }
  ]
  let diceResults: Number[] = []

  console.log(socket.id.substring(0, 3) + ' connected')

  socket.on('throwDice', () => {
    io.emit('throwDice', generateDieInfo(die.map(dice => dice.locked)))
  })

  socket.on('diceResultReady', result => {
    diceResults.push(result)
    if (diceResults.length === 5) {
      socket.emit('finalResult', diceResults)
      diceResults = []
    }
  })

  socket.on('toggleLock', id => {
    die[id].locked = !die[id].locked
  })

  socket.on('disconnect', () => {
    console.log(socket.id.substring(0, 3) + ' disconnected')
  })
})

httpServer.listen(4949)
console.log('listening on port 4949')
