import type {AgentLocationModel} from "../../model/AgentLocationModel.tsx";
import '../../css/Swordmaster.css';
import {Button, Center, Group, Image, type MantineStyleProp, Popover, type StyleProp} from "@mantine/core";
import agent_icon_blue from '../../assets/agents/agent_blue.svg';
import type {Property} from "csstype";
import agent_icon_red from "../../assets/agents/agent_red.svg";
import agent_icon_gold from "../../assets/agents/agent_gold.svg";
import agent_icon_green from "../../assets/agents/agent_green.svg";
import agent_icon_disabled from "../../assets/agents/agent_disabled.svg";
import {useGameStore} from "../../store/GameStore.tsx";
import {useDisclosure} from "@mantine/hooks";
import {assertExists, canMoveComponent, hasAvailableAgent, placeAgent, recallAgent} from "../../const/GameUtils.tsx";
import {produce} from "immer";
import {PLACE_AGENT, RECALL_AGENT} from "../../const/Actions.tsx";
import {useWebSocket} from "../WebSocketContext.tsx";
import {showNotification} from "../../const/Util.tsx";

function Agent(props: {
  agentId: string;
  color: string;
  playerName: string
}) {
  const {gameState, setGameState} = useGameStore();
  const {sendMessage} = useWebSocket();
  const [opened, {close, toggle}] = useDisclosure(false);

  const getAgentIcon = (color: string) => {
    if (color === "RED") return agent_icon_red;
    else if (color === "BLUE") return agent_icon_blue;
    else if (color === "GOLD") return agent_icon_gold;
    else if (color === "GREEN") return agent_icon_green;
    else if (color === "GRAY") return agent_icon_disabled;
  }

  const recallAgentAction = () => {
    setGameState(produce(gameState, draft => {
      recallAgent(draft, props.agentId)
    }));
    sendMessage({
      action: RECALL_AGENT, body: {
        agentId: props.agentId,
        playerName: props.playerName,
      }
    });
    close();
  }

  return (
    <Popover
      opened={opened}
      onChange={toggle}
      position="bottom"
      clickOutsideEvents={['mouseup', 'touchend']}>
      <Popover.Target>
        <Image
          onClick={canMoveComponent(gameState, props.playerName) ? toggle : undefined}
          draggable={false}
          w={25}
          src={getAgentIcon(props.color)}
          className={"locations-agent-icon"}/>
      </Popover.Target>
      <Popover.Dropdown className={"popover-dialog"}>
        <Group justify={"center"}>
          <Button
            onClick={recallAgentAction}
            className={`setup-action-button-next`}
            size="xs"
            radius="0"
            variant={"filled"}>Recall agent</Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  )
}


export function AgentLocation(props: {
  location: AgentLocationModel;
  style?: MantineStyleProp
  w?: StyleProp<Property.Width>
  h?: StyleProp<Property.Height>
  maw?: StyleProp<Property.MaxWidth>
  mah?: StyleProp<Property.MaxHeight>
  bg?: string;
}) {

  const {gameState, setGameState} = useGameStore();
  const {sendMessage} = useWebSocket();

  const sendAgent = () => {
    const player = gameState.containsRivals
      ? assertExists(
        gameState.players.find(p => p.name === gameState.currentPlayer),
        "Current player not found"
      )
      : assertExists(
      gameState.players.find(p => p.isThisPlayer),
      "Current player not found"
    )

    if (!hasAvailableAgent(player)) {
      showNotification("No available agents");
      return;
    }

    const agentId = player.agents[0].id
    setGameState(produce(gameState, draft => {
      placeAgent(draft, agentId, props.location.id)
    }));

    sendMessage({
      action: PLACE_AGENT, body: {
        agentId: agentId,
        locationId: props.location.id,
      }
    });
  }

  const canSendAgent = () => {
    const player = gameState.containsRivals
      ? assertExists(
        gameState.players.find(p => p.name === gameState.currentPlayer),
        "Current player not found"
      )
      : assertExists(
        gameState.players.find(p => p.isThisPlayer),
        "Current player not found"
      )

    return !props.location.agents.map(a => a.playerName).includes(player.name)
  }

  return (
    <Center
      onClick={canSendAgent() ? sendAgent : undefined}
      className={"pulse-bg agent-location-container"}
      pos={"absolute"}
      w={props.w}
      h={props.h}
      maw={props.maw}
      mah={props.mah}
      bg={props.bg}
      style={props.style}>
      <Group
        className="locations-agent-icon-container"
        align="center"
        justify={"center"}
        gap={0}>
        {
          props.location.agents.map((agent) =>
           <Agent
             agentId={agent.agentId}
             color={agent.color}
             playerName={agent.playerName}
             key={agent.agentId}/>
          )
        }
      </Group>
    </Center>
  )
}