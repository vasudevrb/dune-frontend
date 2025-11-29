import '@mantine/core/styles.css'
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import '../css/App.css'
import {WebSocketProvider} from "./WebSocketContext.tsx";
import {useGameStore} from "../store/GameStore.tsx";
import {Game} from "./Game.tsx";

function App() {
  const { playerName, gameId } = useGameStore();

  return (
    <WebSocketProvider gameId={gameId} playerName={playerName}>
        <Game/>
    </WebSocketProvider>
  )
}

export default App
