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
  CARD_USED, DISCARD_CARD,
  PLACE_AGENT, PLACE_CONTROL_FLAG,
  PLACE_SPY,
  RECALL_AGENT, RECALL_CONTROL_FLAG,
  RECALL_SPY, REVEAL_CARDS, SET_CHANI_SIGNET_STATUS, SET_FACTION_INFLUENCE, SET_FEYD_SIGNET_STATUS,
  SHOW_NOTIFICATION,
  START_GAME, TRASH_CARD, UPDATE_COMBAT, UPDATE_GAME,
  UPDATE_LOCATION,
  UPDATE_PLAYER, UPDATE_RESOURCES, UPDATE_SPY_LOCATION, USE_CARD
} from "../const/Actions.tsx";
import {Box, Image, Group, MantineProvider, type MantineThemeOverride, Stack, Text} from "@mantine/core";
import {Card} from "./cards/Card.tsx";
import {ImperiumRow} from "./cards/ImperiumRow.tsx";
import {GameBoard} from "./board/GameBoard.tsx";
import {InHandCards} from "./cards/InHandCards.tsx";
import {Players} from "./player/Players.tsx";
import {useGameStore} from "../store/GameStore.tsx";
import type {CombatModel, PlayerModel, ResourcesModel} from "../model/PlayerModel.tsx";
import {produce} from "immer";
import {
  assertExists,
  moveThisPlayerToLast,
  placeAgent, placeControlFlag,
  placeSpy,
  recallAgent, recallControlFlag,
  recallSpy, setChaniSignetStatus,
  setFactionInfluence,
  setFeydSignetStatus
} from "../const/GameUtils.tsx";
import type {AgentLocationModel} from "../model/AgentLocationModel.tsx";
import {Setup2} from "./setup/Setup2.tsx";
import {DndContext, type DragEndEvent} from "@dnd-kit/core";
import {restrictToWindowEdges} from "@dnd-kit/modifiers";
import {Notifications} from "@mantine/notifications";
import type {RevealCardsPreview} from "../model/RevealCardsPreview.tsx";
import type {SpyLocationModel} from "../model/SpyLocationModel.tsx";

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
            case DISCARD_CARD: type = "discarded"; break;
            default: type = ""; break;
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
        <Image mah="200" src={agentCardPreview.url}/>
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
    const setup = true;
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

  const updateSpyLocation = (location: SpyLocationModel) => {
    setGameState(produce(gameState, draft => {
      const loc = draft.spyLocations.findIndex(l => l.id === location.id);
      draft.spyLocations[loc] = location;
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
      UPDATE_GAME,
      UPDATE_LOCATION,
      UPDATE_SPY_LOCATION,
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
        } else if (action === UPDATE_GAME){
          updateGame(body);
        } else if (action === UPDATE_PLAYER) {
          updatePlayer(body)
        } else if (action === UPDATE_LOCATION) {
          updateLocation(body);
        } else if (action === UPDATE_SPY_LOCATION){
          updateSpyLocation(body);
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
        } else if (activeData.type === "spy") {
          placeSpy(draft, active.id, overData.id)
          action = PLACE_SPY
        } else if (activeData.type === "control_flag") {
          placeControlFlag(draft, active.id, overData.id);
          action = PLACE_CONTROL_FLAG
        }
      } else if (activeData.location === "boardspace" && overData.location === "player") {
        if (activeData.type === "agent"){
          recallAgent(draft, active.id)
          action = RECALL_AGENT
        } else if (activeData.type === "spy") {
          recallSpy(draft, active.id)
          action = RECALL_SPY
        } else if (activeData.type === "control_flag") {
          recallControlFlag(draft, active.id)
          action = RECALL_CONTROL_FLAG
        }
      } else if (activeData.location === 'faction' && overData.location === 'faction') {
        if (activeData.factionType === overData.factionType) {
          setFactionInfluence(draft, activeData.playerName, overData.factionType, overData.influenceLevel)
          action = SET_FACTION_INFLUENCE
        }
      } else if (activeData.location === 'feyd-rautha' && overData.location === 'feyd-rautha') {
        setFeydSignetStatus(draft, overData.signetValue)
        action = SET_FEYD_SIGNET_STATUS
      }  else if (activeData.location === 'chani' && overData.location === 'chani') {
        setChaniSignetStatus(draft, overData.signetValue)
        action = SET_CHANI_SIGNET_STATUS
      }
    }))

    if (action) {
      switch (action) {
        case PLACE_AGENT:
          sendMessage({
            action: PLACE_AGENT, body: {
              agentId: active.id,
              locationId: overData.id,
              playerName: activeData.playerName
            }
          });
          break;
        case RECALL_AGENT:
          sendMessage({
            action: RECALL_AGENT, body: {
              agentId: active.id,
              playerName: activeData.playerName
            }
          });
          break;
        case PLACE_SPY:
          sendMessage({
            action: PLACE_SPY, body: {
              spyId: active.id,
              spyLocationId: overData.id,
              playerName: activeData.playerName
            }
          })
          break;
        case RECALL_SPY:
          sendMessage({
            action: RECALL_SPY, body: {
              spyId: active.id,
              playerName: activeData.playerName
            }
          })
          break;
        case SET_FACTION_INFLUENCE:
          sendMessage({
            action: SET_FACTION_INFLUENCE, body: {
              factionType: overData.factionType,
              influenceLevel: overData.influenceLevel,
              playerName: activeData.playerName
            }
          })
          break;
        case PLACE_CONTROL_FLAG:
          sendMessage({
            action: PLACE_CONTROL_FLAG, body: {
              controlFlagId: active.id,
              locationId: overData.id,
              playerName: activeData.playerName
            }
          });
          break;
        case RECALL_CONTROL_FLAG:
          sendMessage({
            action: RECALL_CONTROL_FLAG, body: {
              controlFlagId: active.id,
              playerName: activeData.playerName
            }
          });
          break;
        case SET_FEYD_SIGNET_STATUS:
          sendMessage({action: SET_FEYD_SIGNET_STATUS, body: {status: overData.signetValue}})
          break;
        case SET_CHANI_SIGNET_STATUS:
          sendMessage({action: SET_CHANI_SIGNET_STATUS, body: {status: overData.signetValue}})
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
        <ImperiumRow game={gameState}/>
        {gameStarted ? contentComponent() : setupComponent()}
      </MantineProvider>
    </DndContext>
  )
}