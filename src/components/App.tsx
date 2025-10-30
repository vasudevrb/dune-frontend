import '@mantine/core/styles.css'
import '@mantine/carousel/styles.css';
import '../css/App.css'
import {Drawer, MantineProvider, type MantineThemeOverride, Stack} from '@mantine/core';
import {useDisclosure} from "@mantine/hooks";
import {ImperiumRow} from "./ImperiumRow.tsx";
import {Players} from "./Players.tsx";
import {Setup} from "./setup/Setup.tsx";
import {useEffect, useState} from "react";
import  {PlayerModel} from "../model/Player.tsx";
import {START_GAME} from "../const/Actions.tsx";
import {InHandCards} from "./InHandCards.tsx";
import {useWebSocket, WebSocketProvider} from "./WebSocketContext.tsx";
import {EMPEROR_SHADDAM, GURNEY_HALLECK, MUAD_DIB, PRINCESS_IRULAN} from "../const/Util.tsx";
import {GameBoard} from "./GameBoard.tsx";


function Content(props: {
  players: PlayerModel[]
}) {
  const [opened, {open, close}] = useDisclosure(false);

  return <div className="game-screen">
    <Drawer className="drawer-1"
            withCloseButton={false}
            position="bottom"
            opened={opened}
            onClose={close}
            overlayProps={{backgroundOpacity: 0.5, blur: 4}}
            styles={{
              content: {
                height: 'auto'
              },
            }}>

      <ImperiumRow/>
    </Drawer>

    <Stack className="board-area">
      <GameBoard players={props.players}/>
      <InHandCards/>
    </Stack>

    <div className="players"><Players playerList={props.players}/></div>
  </div>
}


function Game(props: {
  useGameId: (gameId: string) => void;
}) {
  const {subscribe, unsubscribe, sendMessage} = useWebSocket();

  const [gameStarted, setGameStarted] = useState(true);
  const [, setGameId] = useState("");
  const [players, setPlayers] = useState<PlayerModel[]>([
    new PlayerModel("p1", PRINCESS_IRULAN, "RED", false),
    new PlayerModel("p2", MUAD_DIB, "BLUE", false),
    new PlayerModel("p3", EMPEROR_SHADDAM, "GOLD", true),
    new PlayerModel("p4", GURNEY_HALLECK, "GREEN", false)
  ]);

  const setGlobalGameId = (gameId: string) => {
    props.useGameId(gameId);
    setGameId(gameId);
  }

  const gameStartHandler = (players: PlayerModel[]) => {
    setPlayers(players);
    sendMessage({action: START_GAME})
  }

  useEffect(() => {
    const componentName = "game_component";
    console.log(`In ${componentName}. Subscribing to WS messages`)

    const actions = [START_GAME]
    subscribe(actions, componentName, {
      onMessage: (action: string, body: any) => {
        console.log(`Message received: ${body}`);
        if (action === START_GAME) {
          setGameStarted(true);
        }
      }
    });

    return () => {
      unsubscribe(actions, componentName)
    }
  })

  const duneTheme: MantineThemeOverride = {
    colors: {
      'dune-brown': [
        '#B0A199', '#A79185', '#A08170', '#9B735D', '#94664D',
        '#7F5E4C', '#6E5649', '#5F4E45', '#49403C', '#413A37'
      ],
    },
    primaryColor: 'dune-brown',
  };

  const setupComponent = () => {
    return (
      <Setup
        useSetGameId={(gameId: string) => setGlobalGameId(gameId)}
        gameStartHandler={(players: PlayerModel[]) => gameStartHandler(players)}
      />
    )
  }

  const contentComponent = () => {
    return <Content players={players}/>
  }

  return (
    <MantineProvider theme={duneTheme}>
      {gameStarted ? contentComponent() : setupComponent()}
    </MantineProvider>
  )
}

function App() {
  const [gameId, setGameId] = useState("");

  return (
    <WebSocketProvider gameId={gameId}>
      <Game useGameId={(gameId: string) => setGameId(gameId)}/>
    </WebSocketProvider>
  )
}

export default App
