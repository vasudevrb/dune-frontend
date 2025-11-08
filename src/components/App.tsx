import '@mantine/core/styles.css'
import '@mantine/carousel/styles.css';
import '../css/App.css'
import {Box, Drawer, MantineProvider, type MantineThemeOverride, Stack} from '@mantine/core';
import {useDisclosure} from "@mantine/hooks";
import {ImperiumRow} from "./ImperiumRow.tsx";
import {Players} from "./Players.tsx";
import {Setup} from "./setup/Setup.tsx";
import {useEffect, useState} from "react";
import type {PlayerModel} from "../model/PlayerModel.tsx";
import {PLACE_AGENT, START_GAME, UPDATE_LOCATION, UPDATE_PLAYER} from "../const/Actions.tsx";
import {InHandCards} from "./InHandCards.tsx";
import {useWebSocket, WebSocketProvider} from "./WebSocketContext.tsx";
import {gameStartState} from "../const/Util.tsx";
import {GameBoard} from "./GameBoard.tsx";
import {DndContext, type DragEndEvent} from "@dnd-kit/core";
import {restrictToWindowEdges} from '@dnd-kit/modifiers';
import type {GameModel} from "../model/GameModel.tsx";
import {produce} from "immer";
import {moveThisPlayerToLast, placeAgent, placeSpy, recallAgent, recallSpy, setFactionInfluence} from "../const/GameUtils.tsx";
import type {AgentLocationModel} from "../model/AgentLocationModel.tsx";
import {useGameStore} from "../store/GameStore.tsx";

function Content(props: {
  game: GameModel
}) {
  const [opened, {close}] = useDisclosure(false);

  return <Box
    w={"100%"}
    h={"100%"}>
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

    <Stack
      className="board-area"
      h={"100%"}
      w={"100%"}
      style={{ position: "relative", minHeight: 0 }}
      gap={0}>
      <GameBoard game={props.game}/>
      <InHandCards />
    </Stack>

    <Box h={"100%"}
         pos={"absolute"}
         style={{
           right: "0",
           top: "0"
         }}>
      <Players game={props.game}/>
    </Box>
  </Box>
}


function Game() {
  const { playerName } = useGameStore();
  const {subscribe, unsubscribe, sendMessage} = useWebSocket();

  const [gameStarted, setGameStarted] = useState(false);
  const [game, setGame] = useState<GameModel>({
    ...gameStartState
  });

  const gameStartHandler = (players: PlayerModel[]) => {
    game.players = players;
    setGame(game);
    sendMessage({action: START_GAME})
  }

  const updateGame = (game: GameModel) => {
    setGame(() =>
    produce(game, draft => {
      draft.players.findIndex(player => {
        player.isThisPlayer = player.name === playerName;
      });
      draft.players = moveThisPlayerToLast(draft.players);
    }));
  }

  const updatePlayer = (player: PlayerModel) => {
    setGame(current =>
      produce(current, draft => {
        const pl = draft.players.findIndex(p => p.name == player.name)
        const isThisPlayer = draft.players[pl].isThisPlayer;
        draft.players[pl] = {...player, isThisPlayer: isThisPlayer};
      })
    )
  }

  const updateLocation = (location: AgentLocationModel) => {
    setGame(current =>
    produce(current, draft => {
      const loc = draft.locations.findIndex(l => l.id === location.id);
      draft.locations[loc] = location;
      })
    );
  }

  useEffect(() => {
    const componentName = "game_component";
    console.log(`In ${componentName}. Subscribing to WS messages`)

    const actions = [START_GAME, UPDATE_PLAYER, UPDATE_LOCATION]
    subscribe(actions, componentName, {
      onMessage: (action: string, body: any) => {
        console.log(`Message received: ${action}: ${body}`);
        if (action === START_GAME) {
          setGameStarted(true);
          updateGame(body);
        } else if (action === UPDATE_PLAYER) {
          updatePlayer(body)
        } else if (action === UPDATE_LOCATION) {
          updateLocation(body);
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
        gameStartHandler={(players: PlayerModel[]) => gameStartHandler(players)}
      />
    )
  }

  const contentComponent = () => {
    return <Content game={game}/>
  }

  function handleDragEnd(event: DragEndEvent) {
    const active = event.active;
    const over = event.over;
    if (!over || !active) return;

    const activeData = event.active.data.current;
    const overData = event.over?.data.current;
    if (!overData || !activeData) return;

    console.log(`${active.id} dropped on ${over.id}`);
    if (!(overData.type as string).includes(activeData.type)) return;

    let action;

    setGame(current =>
      produce(current, draft => {
        if (activeData.location === "player" && overData.location === "boardspace") {
          if (activeData.type === "agent") {
            console.log("Placing agent")
            placeAgent(draft, active.id, draft.locations[0].id)
            action = PLACE_AGENT
          } else {
            placeSpy(draft, active.id, draft.locations[0].id)
          }
        } else if (activeData.location === "boardspace" && overData.location === "player") {
          if (activeData.type === "agent"){
            recallAgent(draft, active.id, draft.locations[0].id)
          } else {
            recallSpy(draft, active.id, draft.locations[0].id)
          }
        } else if (activeData.location === 'faction' && overData.location === 'faction') {
          if (activeData.factionType === overData.factionType) {
            setFactionInfluence(draft, activeData.playerName, overData.factionType, overData.influenceLevel)
          }
        }
      })
    );

    if (action) {
      switch (action) {
        case PLACE_AGENT:
          sendMessage({action: "PLACE_AGENT", body: {
              agentId: active.id,
              locationId: game.locations[0].id,
            }});
          break;
      }
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
  const { playerName, gameId } = useGameStore();

  return (
    <WebSocketProvider gameId={gameId} playerName={playerName}>
      <Game/>
    </WebSocketProvider>
  )
}

export default App
