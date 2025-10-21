import '@mantine/core/styles.css'
import '@mantine/carousel/styles.css';
import '../css/App.css'
import {Button, Drawer, MantineProvider} from '@mantine/core';
import {useDisclosure} from "@mantine/hooks";
import {ImperiumRow} from "./ImperiumRow.tsx";
import {Players} from "./Players.tsx";
import {Setup} from "./setup/Setup.tsx";
import {useRef} from "react";

function Content() {
  const [opened, { open, close }] = useDisclosure(false);

  return <div className="game-screen">
    <Drawer className="drawer-1"
            withCloseButton={false}
            position="bottom"
            opened={opened}
            onClose={close}
            overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
            styles={{
              content: {
                height: 'auto'
              },
            }}>

      <ImperiumRow />
    </Drawer>

    <div className="game-board">
      <Button className="text-button"
              radius="xs"
              variant="filled"
              onClick={open}>
        Imperium Row
      </Button>
    </div>


    <div className="players">
      <Players/>
    </div>
  </div>
}


function App() {
  const wsRef = useRef<WebSocket | null>(null);

  const createWebSocket = (gameId: string) => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    wsRef.current = new WebSocket(`ws://localhost:8080/game/${gameId}`);
    return wsRef;
  }
  return <MantineProvider theme={{
    colors: {
      'dune-brown': ['#B0A199', '#A79185', '#A08170', '#9B735D', '#94664D',
        '#7F5E4C', '#6E5649', '#5F4E45', '#49403C', '#413A37']
    },
    primaryColor: 'dune-brown'
  }} >
    <Setup
    webSocketRetriever={(gameId: string) => createWebSocket(gameId)}/>
  </MantineProvider>
}

export default App
