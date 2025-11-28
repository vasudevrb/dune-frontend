import '../css/Player.css'
import {CSS} from '@dnd-kit/utilities';
import {ActionIcon, Avatar, Box, Button, Divider, Group, Image, Popover, Stack, Text, Tooltip} from "@mantine/core";
import water_icon from '../assets/resources/water.png';
import spice_icon from '../assets/resources/spice.png';
import solari_icon from '../assets/resources/solari.png';
import troop_icon from '../assets/combat/troop.png';
import strength_icon from '../assets/combat/strength.png';
import worm_icon from '../assets/combat/worm.png';
import first_player_icon from '../assets/agents/first_player_token.png';
import signet_ring from '../assets/cards/signet_ring.png';
import agent_icon_disabled from '../assets/agents/agent_disabled.svg';
import agent_icon_red from '../assets/agents/agent_red.svg';
import agent_icon_blue from '../assets/agents/agent_blue.svg';
import agent_icon_green from '../assets/agents/agent_green.svg';
import agent_icon_gold from '../assets/agents/agent_gold.svg';
import spy_icon_red from '../assets/spies/spy_red.png';
import spy_icon_green from '../assets/spies/spy_green.png';
import spy_icon_blue from '../assets/spies/spy_blue.png';
import spy_icon_gold from '../assets/spies/spy_gold.png';
import control_flag_red from '../assets/control_flags/control_flag_red.png';
import control_flag_blue from '../assets/control_flags/control_flag_blue.png';
import control_flag_gold from '../assets/control_flags/control_flag_gold.png';
import control_flag_green from '../assets/control_flags/control_flag_green.png';
import vp_icon from '../assets/resources/victory_point.png';
import objective_card_icon from '../assets/cards/objective_card.jpg'
import imperium_card from '../assets/cards/imperium_card.jpg';
import draw_intrigue_card from '../assets/cards/draw_intrigue_card.png';
import steal_intrigue_card from '../assets/cards/steal_intrigue_card.png';
import draw_card from '../assets/cards/draw_card.png';
import desert_mouse from '../assets/objectives/desert_mouse.png';
import crysknife from '../assets/objectives/crysknife.png';
import ornithopter from '../assets/objectives/ornothopter.png';
import objective_any from '../assets/objectives/any.png';
import {type AgentModel, CombatModifierType, type ControlFlagModel, ObjectiveType, type PlayerModel, type SpyModel} from "../model/PlayerModel.tsx";
import {type JSX, type MouseEventHandler, type ReactElement} from "react";
import {range} from "../const/Util.tsx";
import minus_icon from "../assets/minus.svg";
import plus_icon from "../assets/plus.svg";
import {useDisclosure} from "@mantine/hooks";
import {useDraggable, useDroppable} from "@dnd-kit/core";
import {createPortal} from "react-dom";
import {useGameStore} from "../store/GameStore.tsx";
import {FeydSignet} from "./FeydSignet.tsx";
import {useWebSocket} from "./WebSocketContext.tsx";
import {DRAW_CARD} from "../const/Actions.tsx";

function Agent(props: {player: PlayerModel, agentModel: AgentModel, index: number}) {
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
    id: props.agentModel.id,
    data: {
      type: "agent",
      location: "player"
    }
  });

  const draggedStyle = transform ? {
    transform: CSS.Translate.toString(transform),
    zIndex: 10,
    transition: !isDragging ? 'transform 300ms ease' : undefined,
  } : undefined;

  const getAgentIcon = (color: string) => {
    if (color === "RED") return agent_icon_red;
    else if (color === "BLUE") return agent_icon_blue;
    else if (color === "GOLD") return agent_icon_gold;
    else if (color === "GREEN") return agent_icon_green;
    else if (color === "GRAY") return agent_icon_disabled;
  }

  const getAgentColor = (index: number): string => {
    const totalNumUsableAgents = props.player.swordmasterUnlocked ? 3 : 2;
    const agentAvailability = range(0, totalNumUsableAgents)
      .map(i => {
        return i === 0 ? props.player.swordmasterUnlocked : true;
      });

    if (!agentAvailability[index]) return "GRAY"
    const availableBefore = agentAvailability.slice(0, index).filter(a => a).length;
    const numAgentsUsed = props.player.agents.filter(a => a.atLocation).length;

    return availableBefore <  numAgentsUsed ? "GRAY" : props.player.color
  }

  const agentIcon = getAgentIcon(getAgentColor(props.index))

  const draggableProps = (props.player.isThisPlayer && agentIcon != agent_icon_disabled)
    ? {
      ref: setNodeRef,
      style: draggedStyle,
      ...listeners,
      ...attributes,
    }
    : {
      draggable: false
    };

  const node = (
    <img
      {...draggableProps}
      width={40}
      src={agentIcon}
      alt="Agent icon"
      className={"players-agent-icon"}/>
  )
  return isDragging ? createPortal(node, document.body): node
}

function Spy(props: {player: PlayerModel, spyModel: SpyModel, index: number}) {
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
    id: props.spyModel.id,
    data: {
      type: "spy",
      location: "player"
    }
  });

  const draggedStyle = transform ? {
    transform: CSS.Translate.toString(transform),
    zIndex: 10,
  } : undefined;

  const getSpyIcon = (color: string) => {
    if (color === "RED") return spy_icon_red;
    else if (color === "BLUE") return spy_icon_blue;
    else if (color === "GOLD") return spy_icon_gold;
    else if (color === "GREEN") return spy_icon_green;
  }

  const spyIcon = getSpyIcon(props.player.color)

  const draggableProps = (props.player.isThisPlayer)
    ? {
      ref: setNodeRef,
      style: draggedStyle,
      ...listeners,
      ...attributes,
    }
    : {
      draggable: false
    };

  const node = (
    <img
      {...draggableProps}
      width={30}
      src={spyIcon}
      alt="Spy icon"
      className={"players-spy-icon"}/>
  )
  return isDragging ? createPortal(node, document.body): node
}

function ControlFlag(props: {player: PlayerModel, controlFlagModel: ControlFlagModel, index: number}) {
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
    id: props.controlFlagModel.id,
    data: {
      type: "control_flag",
      location: "player"
    }
  });

  const draggedStyle = transform ? {
    transform: CSS.Translate.toString(transform),
    zIndex: 10,
  } : undefined;

  const getControlFlagIcon = (color: string) => {
    if (color === "RED") return control_flag_red;
    else if (color === "BLUE") return control_flag_blue;
    else if (color === "GOLD") return control_flag_gold;
    else if (color === "GREEN") return control_flag_green;
  }

  const controlFlagIcon = getControlFlagIcon(props.player.color)

  const draggableProps = (props.player.isThisPlayer)
    ? {
      ref: setNodeRef,
      style: draggedStyle,
      ...listeners,
      ...attributes,
    }
    : {
      draggable: false
    };

  const node = (
    <img
      {...draggableProps}
      width={30}
      src={controlFlagIcon}
      alt="Control flag icon"
      className={"players-control-flag-icon"}/>
  )
  return isDragging ? createPortal(node, document.body): node
}


export function Player(props: {
  playerModel: PlayerModel;
  currentPlayer: string;
  firstPlayer: string;
}) {
  const {sendMessage} = useWebSocket();

  const globalProps = useGameStore();
  const [inHandCardsPopoverOpened, setInHandCardsPopoverState] = useDisclosure(false);
  const [objectivesPopoverOpened, setObjectivesPopoverState] = useDisclosure(false);

  const playerDroppable = useDroppable({
    id: `this-player-container`,
    data: {
      location: "player",
      type: "spy,agent"
    }
  });


  const getAgents = () => {
    const elements: JSX.Element[] = [];
    props.playerModel.agents.forEach((agentModel, index) => {
      elements.push(
        <Agent
          player={props.playerModel}
          agentModel={agentModel}
          index={index}
          key={agentModel.id}/>
      );
    })
    return (
      <Stack className="players-agent-icon-container" h="100" align="stretch" style={{marginLeft: 'auto'}}>
        {elements}
      </Stack>
    );
  }

  const getAvatar = () => {
    return (
      <Stack align={"center"} gap={"5"}>
        <Avatar className={"player-avatar"}
                radius="xs"
                size="lg"
                src={props.playerModel.character.avatarUrl}/>

        {
          !props.playerModel.isThisPlayer &&
          <Group align="center" gap={"5"}>
            <Text fw="700" size="md" className={"player-container-text"}>
              {props.playerModel.victoryPoints}
            </Text>
            <img width={15} src={vp_icon} alt="Victory points"/>
          </Group>
        }
      </Stack>
    )
  }

  const getResourceIconByType = (resourceType: string) => {
    switch (resourceType) {
      case "water":
        return water_icon;
      case "spice":
        return spice_icon;
      default:
        return solari_icon
    }
  }

  const getResourcesDisplayElements = () => {
    const getResource = (quantity: number, resourceType: string) => {
      const icon = getResourceIconByType(resourceType);
      return (
        <Group align="center" gap={"5"}>
          <Text size="md" className={"player-container-text"}>{quantity}</Text>
          <img width={15} src={icon} alt="Resource icon"/>
        </Group>
      )
    }
    const divider = () => {
      return <Divider orientation="vertical" m={"0"} color={"#cacaca"}/>
    }

    return (
      <Group align="center" gap={"xs"}>
        {getResource(props.playerModel.resources.water, "water")}
        {divider()}
        {getResource(props.playerModel.resources.spice, "spice")}
        {divider()}
        {getResource(props.playerModel.resources.solari, "solari")}
      </Group>
    )
  }

  const getIconPopover = (
    targetIcon: string,
    dropdown: ReactElement,
    popoverOpened: boolean,
    setPopoverState: { open: MouseEventHandler; close: MouseEventHandler; }
  ) => {
    return (
      <Popover radius={"0"} position="top" shadow="md" opened={popoverOpened}>
        <Popover.Target>
          <img width={20}
               onMouseEnter={setPopoverState.open}
               onMouseLeave={setPopoverState.close}
               src={targetIcon}
               alt="Popover"/>
        </Popover.Target>
        <Popover.Dropdown className="cards-popover" style={{pointerEvents: 'none'}}>
          {dropdown}
        </Popover.Dropdown>
      </Popover>
    )
  }

  const getCardStats = () => {
    const getCardStat = (cardType: string, num: number) => {
      return (
        <Stack align="center" gap={"0"}>
          <Text size="md" c={"#fafafa"}>{num}</Text>
          <Text size="xs" c={"#fafafa"}>{cardType}</Text>
        </Stack>
      )
    }
    return (
      <Group align="center" justify={"center"} gap={"5"}>
        {getCardStat("In hand", props.playerModel.numCards.inHand)}
        <Divider orientation="vertical" m={"0"} color={"#cacaca55"}/>
        {getCardStat("In discard", props.playerModel.numCards.inDiscardPile)}
        <Divider orientation="vertical" m={"0"} color={"#cacaca55"}/>
        {getCardStat("In draw", props.playerModel.numCards.inDrawPile)}
        <Divider orientation="vertical" m={"0"} color={"#cacaca55"}/>
        {getCardStat("Intrigues", props.playerModel.numCards.intrigues)}
      </Group>
    )
  }

  const getObjectiveStats = () => {
    const getObjectiveImage = (objectiveType: ObjectiveType) => {
      switch (objectiveType) {
        case ObjectiveType.DesertMouse: return desert_mouse;
        case ObjectiveType.Crysknife: return crysknife;
        case ObjectiveType.Ornithopter: return ornithopter;
        default: return objective_any;
      }
    }
    return (
      <Group align="center" justify={"center"} gap={"xs"}>
        {
          props.playerModel.objectives.map((obj, index) =>
            <img key={index} width={20} src={getObjectiveImage(obj)} alt="Objective"/>
          )
        }
      </Group>
    )
  }

  const getCardElements = () => {
    return (
      <Group align="center" gap={"xs"}>
        {
          getIconPopover(
            imperium_card,
            getCardStats(),
            inHandCardsPopoverOpened,
            setInHandCardsPopoverState
          )
        }
        <Divider orientation="vertical" m={"0"} color={"#363636"}/>
        {
          getIconPopover(
            objective_card_icon,
            getObjectiveStats(),
            objectivesPopoverOpened,
            setObjectivesPopoverState
          )
        }
      </Group>
    )
  }

  const getNameAndResources = () => {
    return (
      <Stack align="stretch" style={{flex: 1, textAlign: 'center'}} gap={5}>
        <Group align="center" gap={"5"}>
          <Text ta="left" fw={500} className={"player-container-text"}>
            {props.playerModel.character.name}
          </Text>
          <Tooltip label="First player">
            <img width={25}
                 src={first_player_icon}
                 alt="First player token"
                 hidden={props.firstPlayer != props.playerModel.name}/>
          </Tooltip>
        </Group>

        {getResourcesDisplayElements()}
        {getCardElements()}
      </Stack>
    )
  }

  const getButton = (icon: string) => {
    return (
      <ActionIcon
        className={"player-resource-modifier-button"}
        variant={"outline"}
        radius={"0"}>
        <img width={30} src={icon} alt="Resource modifier button"/>
      </ActionIcon>
    )
  }
  const getLabelElement = (icon: string, text?: number) => {
    return (
      <Box pos={"relative"} w={50} h={50}>
        <img width={50} src={icon} alt="Resource icon"/>
        <Text size="1.4em" className={"player-resource-modifier-text"}>{text}</Text>
      </Box>
    )
  }
  const resourceModifierDivider = () => {
    return <Divider orientation="vertical" color={"#31313123"}/>
  }
  const getResourceModifierElements = () => {
    const getResourceLabel = (quantity: number, resourceType: string) => {
      const icon = getResourceIconByType(resourceType)
      return getLabelElement(icon, quantity)
    }
    const getResourceModifier = (quantity: number, resourceType: string) => {
      return (
        <Stack align="center" gap={"xs"}>
          {getButton(plus_icon)}
          {getResourceLabel(quantity, resourceType)}
          {getButton(minus_icon)}
        </Stack>
      )
    }
    const getVictoryPointModifier = () => {
      const text = props.playerModel.victoryPoints
      const icon = vp_icon

      return (
        <Stack align="center" gap={"xs"}>
          {getButton(plus_icon)}
          {getLabelElement(icon, text)}
          {getButton(minus_icon)}
        </Stack>
      )
    }
    return (
      <Group w={"100%"} justify="center" gap={"xs"}>
        {getResourceModifier(props.playerModel.resources.water, "water")}
        {resourceModifierDivider()}
        {getResourceModifier(props.playerModel.resources.spice, "spice")}
        {resourceModifierDivider()}
        {getResourceModifier(props.playerModel.resources.solari, "solari")}
        {resourceModifierDivider()}
        {getVictoryPointModifier()}
      </Group>
    )
  }

  const getCombatModifierElements = () => {
    const getCombatModifierIconByType = (modifierType: CombatModifierType) => {
      switch (modifierType) {
        case CombatModifierType.Troop: return troop_icon;
        case CombatModifierType.Worm: return worm_icon;
        default: return strength_icon;
      }
    }
    const getCombatLabel = (modifierType: CombatModifierType) => {
      const icon = getCombatModifierIconByType(modifierType)
      return getLabelElement(icon)
    }
    const getCombatModifier = (modifierType: CombatModifierType) => {
      return (
        <Stack align="center" gap={"xs"}>
          {getButton(plus_icon)}
          {getCombatLabel(modifierType)}
          {getButton(minus_icon)}
        </Stack>
      )
    }

    return (
      <Group w={"100%"} justify="center" gap={"xs"}>
        {getCombatModifier(CombatModifierType.Troop)}
        {resourceModifierDivider()}
        {getCombatModifier(CombatModifierType.Worm)}
        {resourceModifierDivider()}
        {getCombatModifier(CombatModifierType.Strength)}
      </Group>
    )
  }

  const getActions = () => {
    const getIconButton = (
      icon: string,
      onClick?: () => void,
    ) => {
      return (
        <ActionIcon
          onClick={onClick}
          w={45}
          h={54}
          className={"player-resource-modifier-button"}
          variant={"none"}
          radius={"0"}>
          <Image fit="contain" w={50} height={54} src={icon}/>
        </ActionIcon>
      )
    }
    const getTextButton = (
      label: string,
      variant?: string
    ) => {
      return (
        <Button
          className={`setup-action-button-next`}
          color={"#A08170"}
          size="md"
          radius="0"
          variant={variant ? variant : "filled"}>{label}</Button>
      )
    }
    return (
      <>
        <Group w={"100%"} gap={"xs"}>
          {getIconButton(draw_card, () => {
            sendMessage({action: DRAW_CARD})
          })}
          {getIconButton(draw_intrigue_card)}
          {getIconButton(steal_intrigue_card)}
        </Group>
        <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
        <Group w={"100%"} gap={"xs"} justify={"flex-end"}>
          {getTextButton("REVEAL", "outline")}
          {getTextButton("END TURN")}
        </Group>

      </>
    )
  }

  const getSpiesAndFlags = () => {
    return (
      <Group w={"100%"} justify="center" align={"stretch"} gap={0}>
        <Group w={"48%"} className={"players-spy-icon-container"} justify="center">
          {
            props.playerModel.spies.map((spy, index) =>
              <Spy
                key={spy.id}
                player={props.playerModel}
                spyModel={spy}
                index={index}/>
            )
          }
        </Group>
        <Divider orientation="vertical" m={"0"} color={"#cacaca"}/>
        <Group w={"48%"} h={"100%"} className={"players-control-flag-icon-container"} justify="center">
          {
            props.playerModel.controlFlags.map((cf, index) =>
              <ControlFlag player={props.playerModel} controlFlagModel={cf} index={index}/>
            )
          }
        </Group>
      </Group>
    )
  }

  const getCurrentPlayerStyleClass = () => {
    switch (props.playerModel.color) {
      case "RED": return "player-container-current-player-red";
      case "BLUE": return "player-container-current-player-blue";
      case "GOLD": return "player-container-current-player-gold";
      default: return "player-container-current-player-green";
    }
  }

  const currentPlayerStyleClass = (props.playerModel.name === props.currentPlayer)
  ? getCurrentPlayerStyleClass()
    : null;

  const getOppositionPlayer = () => {
    return (
      <Group className={`player-container ${currentPlayerStyleClass}`}>
        {getAvatar()}
        {getNameAndResources()}
        {getAgents()}
      </Group>
    )
  }

  const getFeydSignetComponent = () => {
    if (props.playerModel.character.name !== "Feyd Rautha") return;
    return (
      <>
        <Image draggable={false} fit={"contain"} w={"100%"} h={40} src={signet_ring}/>
        <FeydSignet characterModel={props.playerModel.character}/>
        <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
      </>
    )
  }

  const getThisPlayer = () => {
    return (
      <Stack
        className={`current-player-container ${currentPlayerStyleClass}`}
        gap={"5"}>
        <Group align={"flex-start"} ref={playerDroppable.setNodeRef}>
          {getAvatar()}
          {getNameAndResources()}
          {getAgents()}
        </Group>
        {getSpiesAndFlags()}
        <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
        {getFeydSignetComponent()}
        {getResourceModifierElements()}
        <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
        {getCombatModifierElements()}
        <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
        {getActions()}
      </Stack>
    )
  }

  return props.playerModel.isThisPlayer ? getThisPlayer() : getOppositionPlayer()
}