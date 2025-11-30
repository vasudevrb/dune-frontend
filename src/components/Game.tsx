import type {GameModel} from "../model/GameModel.tsx";
import {useWebSocket} from "./WebSocketContext.tsx";
import {useEffect, useState} from "react";
import type {AgentCardPreview} from "../model/AgentCardPreview.tsx";
import {
  cardPreviewStartState,
  gameStartState,
  PLAYER_1,
  PLAYER_2,
  PLAYER_3,
  PLAYER_4,
  revealPreviewStartState,
  showNotification
} from "../const/Util.tsx";
import {
  CARD_USED,
  PLACE_AGENT,
  PLACE_SPY,
  RECALL_AGENT,
  RECALL_SPY, REVEAL_CARDS, SET_FACTION_INFLUENCE,
  SHOW_NOTIFICATION,
  START_GAME, TRASH_CARD, UPDATE_COMBAT,
  UPDATE_LOCATION,
  UPDATE_PLAYER, UPDATE_RESOURCES, USE_CARD
} from "../const/Actions.tsx";
import {Box, Group, MantineProvider, type MantineThemeOverride, Stack, Text} from "@mantine/core";
import {Card} from "./Card.tsx";
import {ImperiumRow} from "./ImperiumRow.tsx";
import {GameBoard} from "./GameBoard.tsx";
import {InHandCards} from "./InHandCards.tsx";
import {Players} from "./Players.tsx";
import {useGameStore} from "../store/GameStore.tsx";
import type {CombatModel, PlayerModel, ResourcesModel} from "../model/PlayerModel.tsx";
import {produce} from "immer";
import {
  assertExists,
  moveThisPlayerToLast,
  placeAgent,
  placeSpy,
  recallAgent,
  recallSpy,
  setFactionInfluence,
  setFeydSignetStatus
} from "../const/GameUtils.tsx";
import type {AgentLocationModel} from "../model/AgentLocationModel.tsx";
import {Setup2} from "./setup/Setup2.tsx";
import {DndContext, type DragEndEvent} from "@dnd-kit/core";
import {restrictToWindowEdges} from "@dnd-kit/modifiers";
import {Notifications} from "@mantine/notifications";
import type {RevealCardsPreview} from "../model/RevealCardsPreview.tsx";

function Content() {
  const {gameState} = useGameStore();
  const {subscribe, unsubscribe} = useWebSocket();
  const [agentCardPreview, setAgentCardPreview] = useState<AgentCardPreview>(cardPreviewStartState);
  const [revealCardPreview, setRevealCardPreview] = useState<RevealCardsPreview>(revealPreviewStartState);

  useEffect(() => {
    const componentName = "content_component";
    console.log(`In ${componentName}. Subscribing to WS messages`)

    const actions = [CARD_USED, REVEAL_CARDS]
    subscribe(actions, componentName, {
      onMessage: (action: string, body: any) => {
        if (action === CARD_USED) {
          let type;
          switch (body.type) {
            case USE_CARD: type = "played"; break;
            case TRASH_CARD: type = "trashed"; break;
            default: type = "discarded"; break;
          }
          const message = body.playerName + " " + type
          setAgentCardPreview({...body, message: message, show: true});
          setTimeout(() => {
            setAgentCardPreview(prev => ({...prev, show: false}))
          }, 5000);
        } else if (action === REVEAL_CARDS) {
          setRevealCardPreview({...body, show:true})
          setTimeout(() => {
            setRevealCardPreview(prev => ({...prev, show: false}))
          }, 7000);
        }
      }
    });

    return () => {
      unsubscribe(actions, componentName)
    }
  })

  const getCardPreview = () => {
    const show = agentCardPreview.show ? "show" : ""
    const color = gameState
      .players
      .find(p => p.name === agentCardPreview.playerName)
      ?.color
    let bgColor;
    switch (color) {
      case "RED":
        bgColor = "card-used-preview-red";
        break;
      case "BLUE":
        bgColor = "card-used-preview-blue";
        break;
      case "GREEN":
        bgColor = "card-used-preview-green";
        break;
      default:
        bgColor = "card-used-preview-gold";
        break;
    }
    return (
      <Stack
        className={`card-used-preview ${show} ${bgColor}`}
        p={"40"}
        style={{
          position: "absolute",
          top: "10%",
          zIndex: 5,
        }}>
        <Text className={"card-used-preview-text"}>{agentCardPreview.message}</Text>
        <Card src={agentCardPreview.url}/>
      </Stack>
    )
  }

  const getRevealPreview = () => {
    const show = revealCardPreview.show ? "show" : ""
    const color = gameState
      .players
      .find(p => p.name === revealCardPreview.playerName)
      ?.color
    let bgColor;
    switch (color) {
      case "RED":
        bgColor = "card-used-preview-red";
        break;
      case "BLUE":
        bgColor = "card-used-preview-blue";
        break;
      case "GREEN":
        bgColor = "card-used-preview-green";
        break;
      default:
        bgColor = "card-used-preview-gold";
        break;
    }
    return (
      <Stack
        className={`card-used-preview ${show} ${bgColor}`}
        p={"40"}
        style={{
          position: "absolute",
          top: "10%",
          zIndex: 5,
        }}>
        <Text style={{textAlign: "start"}} className={"card-used-preview-text"}>{revealCardPreview.playerName} revealed</Text>
        <Group gap={5}>
          {revealCardPreview.urls.map((url) => (<Card src={url}/>))}
        </Group>
      </Stack>
    )
  }

  return <Box w={"100%"} h={"100%"}>
    <ImperiumRow game={gameState}/>
    {getCardPreview()}
    {getRevealPreview()}

    <Stack
      className="board-area"
      h={"100%"}
      w={"100%"}
      style={{ position: "relative", minHeight: 0 }}
      gap={0}>
      <GameBoard/>
      <InHandCards player={gameState.players.find(p => p.isThisPlayer)!!}/>
    </Stack>

    <Box
      h={"100%"}
      pos={"absolute"}
      style={{
        right: "0",
        top: "0"
      }}>
      <Players game={gameState}/>
    </Box>
  </Box>
}


export function Game() {
  const duneTheme: MantineThemeOverride = {
    colors: {
      'dune-brown': [
        '#B0A199', '#A79185', '#A08170', '#9B735D', '#94664D',
        '#7F5E4C', '#6E5649', '#5F4E45', '#49403C', '#413A37'
      ],
    },
    primaryColor: 'dune-brown',
  };
  const { gameState, setGameState, playerName } = useGameStore();
  const {subscribe, unsubscribe, sendMessage} = useWebSocket();

  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const setup = false;
    if (setup) {
      setGameStarted(true);
      setGameState({
        ...gameStartState,
        players: [PLAYER_1, PLAYER_2, PLAYER_3, PLAYER_4]
      })
    }
  }, []);

  const gameStartHandler = (players: PlayerModel[]) => {
    gameState.players = players;
    setGameState(gameState);
    sendMessage({action: START_GAME})
  }

  const updateGame = (updatedGame: GameModel) => {
    console.log("Updating game: ", updatedGame);
    setGameState(produce(updatedGame, draft => {
        draft.players = draft.players
          .map(player => {
            if (player.name === playerName) {
              player.isThisPlayer = true;
              const currentPlayerData = gameState.players.find(p => p.name === player.name)
              player.private = currentPlayerData ? currentPlayerData.private : undefined;
            } else {
              player.isThisPlayer = false;
            }
            return player;
          })
        draft.players = moveThisPlayerToLast(draft.players);
      }));
  }

  const updatePlayer = (player: PlayerModel) => {
    setGameState(produce(gameState, draft => {
      const pl = draft.players.findIndex(p => p.name == player.name)
      const isThisPlayer = draft.players[pl].isThisPlayer;
      draft.players[pl] = {...player, isThisPlayer: isThisPlayer};
    }))
  }

  const updateLocation = (location: AgentLocationModel) => {
    setGameState(produce(gameState, draft => {
      const loc = draft.locations.findIndex(l => l.id === location.id);
      draft.locations[loc] = location;
    }));
  }

  const updateCombat = (playerName: string, combat: CombatModel) => {
    setGameState(produce(gameState, draft => {
      const player = assertExists(
        draft.players.find(p => p.name == playerName),
        `Player with name ${playerName} not found`
      )

      player.combat = combat;
    }))
  }

  const updateResources = (playerName: string, resources: ResourcesModel) => {
    setGameState(produce(gameState, draft => {
      const player = assertExists(
        draft.players.find(p => p.name == playerName),
        `Player with name ${playerName} not found`
      )

      player.resources = resources;
    }))
  }

  useEffect(() => {
    const componentName = "game_component";
    console.log(`In ${componentName}. Subscribing to WS messages`)

    const actions = [
      START_GAME,
      UPDATE_PLAYER,
      UPDATE_LOCATION,
      SHOW_NOTIFICATION,
      UPDATE_COMBAT,
      UPDATE_RESOURCES,
      REVEAL_CARDS
    ]
    subscribe(actions, componentName, {
      onMessage: (action: string, body: any) => {
        if (action === START_GAME) {
          setGameStarted(true);
          updateGame(body);
        } else if (action === UPDATE_PLAYER) {
          updatePlayer(body)
        } else if (action === UPDATE_LOCATION) {
          updateLocation(body);
        } else if (action === UPDATE_COMBAT){
          updateCombat(body.playerName, body.combat);
        } else if (action === UPDATE_RESOURCES){
          updateResources(body.playerName, body.resources);
        } else if (action === SHOW_NOTIFICATION) {
          showNotification(body.message);
        }
      }
    });

    return () => {
      unsubscribe(actions, componentName)
    }
  })

  const setupComponent = () => {
    return (
      <Setup2
        gameStartHandler={(players: PlayerModel[]) => gameStartHandler(players)}
      />
    )
  }

  const contentComponent = () => {
    return <Content/>
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

    setGameState(produce(gameState, draft => {
      if (activeData.location === "player" && overData.location === "boardspace") {
        if (activeData.type === "agent") {
          placeAgent(draft, active.id, overData.id)
          action = PLACE_AGENT
        } else {
          placeSpy(draft, active.id, overData.id)
          action = PLACE_SPY
        }
      } else if (activeData.location === "boardspace" && overData.location === "player") {
        if (activeData.type === "agent"){
          recallAgent(draft, active.id)
          action = RECALL_AGENT
        } else {
          recallSpy(draft, active.id)
          action = RECALL_SPY
        }
      } else if (activeData.location === 'faction' && overData.location === 'faction') {
        if (activeData.factionType === overData.factionType) {
          setFactionInfluence(draft, activeData.playerName, overData.factionType, overData.influenceLevel)
          action = SET_FACTION_INFLUENCE
        }
      } else if (activeData.location === 'feyd-rautha' && overData.location === 'feyd-rautha') {
        setFeydSignetStatus(draft, overData.signetValue)
      }
    }))

    if (action) {
      switch (action) {
        case PLACE_AGENT:
          sendMessage({action: PLACE_AGENT, body: {
              agentId: active.id,
              locationId: overData.id,
            }});
          break;
        case RECALL_AGENT:
          sendMessage({action: RECALL_AGENT, body: {
              agentId: active.id,
            }});
          break;
        case PLACE_SPY:
          sendMessage({action: PLACE_SPY, body: {
              spyId: active.id,
              spyLocationId: overData.id
            }})
          break;
        case RECALL_SPY:
          sendMessage({action: RECALL_SPY, body: {
              spyId: active.id,
            }})
          break;
          case SET_FACTION_INFLUENCE:
            sendMessage({action: SET_FACTION_INFLUENCE, body: {
              factionType: overData.factionType,
                influenceLevel: overData.influenceLevel
              }})
          break;
      }
    }
  }

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
      autoScroll={false}>
      <MantineProvider theme={duneTheme}>
        <Notifications position={"bottom-right"}/>
        {gameStarted ? contentComponent() : setupComponent()}
      </MantineProvider>
    </DndContext>
  )
}