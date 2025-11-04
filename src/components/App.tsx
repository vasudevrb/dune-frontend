import '@mantine/core/styles.css'
import '@mantine/carousel/styles.css';
import '../css/App.css'
import {Drawer, MantineProvider, type MantineThemeOverride, Stack} from '@mantine/core';
import {useDisclosure} from "@mantine/hooks";
import {ImperiumRow} from "./ImperiumRow.tsx";
import {Players} from "./Players.tsx";
import {Setup} from "./setup/Setup.tsx";
import {useEffect, useState} from "react";
import type {PlayerModel} from "../model/PlayerModel.tsx";
import {START_GAME} from "../const/Actions.tsx";
import {InHandCards} from "./InHandCards.tsx";
import {useWebSocket, WebSocketProvider} from "./WebSocketContext.tsx";
import {
  gameStartState,
  PLAYER_1,
  PLAYER_2,
  PLAYER_3, PLAYER_4,
} from "../const/Util.tsx";
import {GameBoard} from "./GameBoard.tsx";
import { DndContext } from "@dnd-kit/core";
import {restrictToWindowEdges} from '@dnd-kit/modifiers';
import type {GameModel} from "../model/GameModel.tsx";
import {produce} from "immer";
import {getAgent, placeAgent} from "../const/GameUtils.tsx";

function Content(props: {
  game: GameModel
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
      <GameBoard game={props.game}/>
      <InHandCards/>
    </Stack>

    <div className="players"><Players playerList={props.game.players}/></div>
  </div>
}


function Game(props: {
  useGameId: (gameId: string) => void;
}) {
  const {subscribe, unsubscribe, sendMessage} = useWebSocket();

  const [gameStarted, setGameStarted] = useState(true);
  const [game, setGame] = useState<GameModel>({
    ...gameStartState,
    players: [PLAYER_1, PLAYER_2, PLAYER_3, PLAYER_4]
  });

  const setGlobalGameId = (gameId: string) => {
    props.useGameId(gameId);
    const newGame = {
      ...game,
      gameId: gameId,
    };
    setGame(newGame);
  }

  const gameStartHandler = (players: PlayerModel[]) => {
    game.players = players;
    setGame(game);
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
    return <Content game={game}/>
  }

  function handleDragEnd(event: { over: any; active: any; }) {
    const { over, active } = event;
    if (over) {
      console.log(`${active.id} dropped on ${over.id}`);
      // Update state here: move draggable into droppable area
    }

    if (over.id === 'droppable') {
      setGame(current =>
        produce(current, draft => {
          placeAgent(draft, active.id, draft.locations[0].id)
        })
      );
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
      <MantineProvider theme={duneTheme}>
        {gameStarted ? contentComponent() : setupComponent()}
      </MantineProvider>
    </DndContext>
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
