import type {Property} from "csstype";
import {Center, Image, Group, type MantineStyleProp, type StyleProp} from "@mantine/core";
import spy_icon_red from "../../assets/spies/spy_red.png";
import spy_icon_blue from "../../assets/spies/spy_blue.png";
import spy_icon_gold from "../../assets/spies/spy_gold.png";
import spy_icon_green from "../../assets/spies/spy_green.png";
import type {SpyLocationModel} from "../../model/SpyLocationModel.tsx";
import {useGameStore} from "../../store/GameStore.tsx";
import {useWebSocket} from "../WebSocketContext.tsx";
import {produce} from "immer";
import {assertExists, canMoveComponent, placeSpy, recallSpy} from "../../const/GameUtils.tsx";
import {PLACE_SPY, RECALL_SPY} from "../../const/Actions.tsx";
import {showNotification} from "../../const/Util.tsx";

function Spy(props: {
  spyId: string;
  color: string;
  playerName: string
}) {

  const {gameState, setGameState} = useGameStore();
  const {sendMessage} = useWebSocket();

  const getSpyIcon = (color: string) => {
    if (color === "RED") return spy_icon_red;
    else if (color === "BLUE") return spy_icon_blue;
    else if (color === "GOLD") return spy_icon_gold;
    else if (color === "GREEN") return spy_icon_green;
  }

  const recallSpyAction = () => {
    setGameState(produce(gameState, draft => {
      recallSpy(draft, props.spyId);
    }))
    sendMessage({
      action: RECALL_SPY, body: {
        spyId: props.spyId,
        playerName: props.playerName,
      }
    })
  }

  return (
    <Image
      onClick={canMoveComponent(gameState, props.playerName) ? recallSpyAction : undefined}
      draggable={false}
      w={25}
      src={getSpyIcon(props.color)}
      alt="Spy icon"
      className={"locations-spy-icon"}/>
  );
}

export function SpyLocation(props: {
  spyLocation: SpyLocationModel;
  agentsContainerStyle?: { top: Property.Top, left: Property.Left };
  style?: MantineStyleProp
  w?: StyleProp<Property.Width>
  h?: StyleProp<Property.Height>
  maw?: StyleProp<Property.MaxWidth>
  mah?: StyleProp<Property.MaxHeight>
  bg?: string;
}) {

  const {gameState, setGameState} = useGameStore();
  const {sendMessage} = useWebSocket();

  const sendSpy = () => {
    const player = gameState.containsRivals
      ? assertExists(
        gameState.players.find(p => p.name === gameState.currentPlayer),
        "Current player not found"
      )
      : assertExists(
        gameState.players.find(p => p.isThisPlayer),
        "Current player not found"
      )

    if (player.spies.length < 1) {
      showNotification("No available spies");
      return;
    }

    const spyId = player.spies[0].id
    setGameState(produce(gameState, draft => {
      placeSpy(draft, spyId, props.spyLocation.id)
    }));

    sendMessage({
      action: PLACE_SPY, body: {
        spyId: spyId,
        spyLocationId: props.spyLocation.id,
        playerName: player.name,
      }
    })
  }

  const canSendSpy = () => {
    const player = gameState.containsRivals
      ? assertExists(
        gameState.players.find(p => p.name === gameState.currentPlayer),
        "Current player not found"
      )
      : assertExists(
        gameState.players.find(p => p.isThisPlayer),
        "Current player not found"
      )

    return !props.spyLocation.spies.map(s => s.playerName).includes(player.name)
  }

  return (
    <Center
      onClick={canSendSpy() ? sendSpy : undefined}
      className={"pulse-bg agent-spy-container"}
      pos={"absolute"}
      w={props.w}
      h={props.h}
      maw={props.maw}
      mah={props.mah}
      bg={props.bg}
      style={props.style}>
      <Group
        className="locations-spy-icon-container"
        align="center"
        justify={"center"}
        gap={0}>
        {
          props.spyLocation.spies.map((spy) =>
            <Spy
              spyId={spy.spyId}
              color={spy.color}
              playerName={spy.playerName}
              key={spy.spyId}/>
          )
        }
      </Group>
    </Center>
  )
}
