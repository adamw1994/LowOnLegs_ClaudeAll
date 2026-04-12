import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr'
import { useEffect, useRef, useState } from 'react'

export interface ScoreUpdate {
  leftScore: number
  rightScore: number
}

export function useSignalR() {
  const [singleScore, setSingleScore] = useState<ScoreUpdate | null>(null)
  const [doubleScore, setDoubleScore] = useState<ScoreUpdate | null>(null)
  const [connected, setConnected] = useState(false)
  const connectionRef = useRef<ReturnType<typeof HubConnectionBuilder.prototype.build> | null>(null)

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl('/scoreboardhub')
      .withAutomaticReconnect()
      .build()

    connection.on('UpdateScore', (data: ScoreUpdate) => setSingleScore(data))
    connection.on('UpdateDoubleScore', (data: ScoreUpdate) => setDoubleScore(data))

    connection.start()
      .then(() => setConnected(true))
      .catch(err => console.error('SignalR error:', err))

    connection.onreconnected(() => setConnected(true))
    connection.onclose(() => setConnected(false))

    connectionRef.current = connection

    return () => {
      if (connection.state !== HubConnectionState.Disconnected) {
        connection.stop()
      }
    }
  }, [])

  return { singleScore, doubleScore, connected }
}
