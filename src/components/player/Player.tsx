import '../../css/Player.css'
import {ActionIcon, Button, Divider, Flex, Group, Image, ScrollArea, Stack, Text} from "@mantine/core";
import signet_ring from '../../assets/cards/signet_ring.png';
import draw_intrigue_card from '../../assets/cards/draw_intrigue_card.png';
import steal_intrigue_card from '../../assets/cards/steal_intrigue_card.png';
import draw_card from '../../assets/cards/draw_card.png';
import imperium_card from '../../assets/cards/imperium_card.jpg';
import maker_hook_icon from '../../assets/combat/maker_hook.png';
import draw_hagal_card from "../../assets/cards/draw_hagal.png";
import sardaukar_commander_icon from "../../assets/combat/sardaukar_commander.png";
import {CombatUnitType, type PlayerModel} from "../../model/PlayerModel.tsx";
import {useGameStore} from "../../store/GameStore.tsx";
import {FeydSignet} from "./FeydSignet.tsx";
import {useWebSocket} from "../WebSocketContext.tsx";
import {
  DRAW_CARD,
  END_TURN,
  GAIN_INTRIGUE_CARD,
  REVEAL,
  GET_HAGAL_CARD,
  STEAL_INTRIGUE_CARD, UNLOCK_MAKER_HOOK, UNLOCK_SWORDMASTER
} from "../../const/Actions.tsx";
import {
  getAgentIcon,
  getColoredTroopIcon,
  getResourceIconByType,
  getResourceTextColorByType
} from "../../const/GameUtils.tsx";
import {CharacterImage} from "./CharacterImage.tsx";
import {ResourceModifier} from "../modifiers/ResourceModifier.tsx";
import {VictoryPointModifier} from "../modifiers/VictoryPointModifier.tsx";
import {CombatModifier} from "../modifiers/CombatModifier.tsx";
import {Agent, ControlFlag, Spy} from "./PlayableComponents.tsx";
import {CardStats} from "./CardStats.tsx";
import {Contracts} from "./Contracts.tsx";
import {QuantityIcon} from "./QuantityIcon.tsx";
import {ObjectivesAlliances} from "./ObjectivesAlliances.tsx";
import {IntrigueModifier} from "../modifiers/IntrigueModifier.tsx";
import {SardaukarSkills} from "./SardaukarSkills.tsx";
import {ChaniSignet} from "./ChaniSignet.tsx";
import {TechTiles} from "./TechTiles.tsx";

export function Player(props: {
  playerModel: PlayerModel;
  currentPlayer: string;
  firstPlayer: string;
}) {
  const {gameState} = useGameStore();
  const {sendMessage} = useWebSocket();
  const isThisPlayerCurrentPlayer = props.playerModel.name === props.currentPlayer;
  const {setImperiumRowOpened} = useGameStore();

  const getResourcesDisplayElements = () => {
    const getResource = (quantity: number, resourceType: string) => {
      const icon = getResourceIconByType(resourceType);
      const textColor = getResourceTextColorByType(resourceType);
      return (
        <QuantityIcon icon={icon} text={quantity} size={40} textSize={"1.2em"} textColor={textColor} />
      )
    }

    return (
      <>
        {getResource(props.playerModel.resources.water, "water")}
        {getResource(props.playerModel.resources.spice, "spice")}
        {getResource(props.playerModel.resources.solari, "solari")}
      </>
    )
  }

  const getResourcesDisplay = () => {
    const resources = (
      <>
        {getResourcesDisplayElements()}
        <Divider orientation="vertical" m={"8"} color={"#cacaca44"}/>
      </>
    )
    return (
      <ScrollArea
        w={"100%"}
        className={"fadeScroll"}
        scrollbars={"x"}
        offsetScrollbars={false}
        type={"never"}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          {!props.playerModel.isThisPlayer ? resources : <></>}
          <CardStats playerModel={props.playerModel}/>
        </div>
      </ScrollArea>
    )
  }

  const getModifiers = () => {
    return (
      <>
        <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
        <Group w={"100%"} justify="center" align={"stretch"} gap={0}>
          <Stack>
            <VictoryPointModifier player={props.playerModel}/>
            <ResourceModifier player={props.playerModel} resourceType={"water"}/>
            <ResourceModifier player={props.playerModel} resourceType={"spice"}/>
            <ResourceModifier player={props.playerModel} resourceType={"solari"}/>
          </Stack>
          <Divider orientation={"vertical"} m={"md"} color={"#cacaca44"}/>
          <Stack>
            <CombatModifier player={props.playerModel} modifierType={CombatUnitType.Troop}/>
            <CombatModifier player={props.playerModel} modifierType={CombatUnitType.Sandworm}/>
            <CombatModifier player={props.playerModel} modifierType={CombatUnitType.Commander}/>
            <CombatModifier player={props.playerModel} modifierType={CombatUnitType.Strength}/>
            {props.playerModel.isRival ? <IntrigueModifier player={props.playerModel}/> : null}
          </Stack>
        </Group>
      </>
    )
  }

  const endTurnAction = () => {
    sendMessage({action: END_TURN})
  }

  const revealAction = () => {
    sendMessage({action: REVEAL})
  }

  const getActions = () => {
    const getIconButton = (
      icon: string,
      onClick?: () => void,
    ) => {
      return (
        <ActionIcon
          onClick={onClick}
          w={"auto"}
          h={50}
          className={"player-resource-modifier-button"}
          variant={"none"}
          radius={"0"}>
          <Image fit="contain" h={50} src={icon}/>
        </ActionIcon>
      )
    }
    const getTextButton = (
      label: string,
      onClick?: () => void,
      variant?: string,
    ) => {
      return (
        <Button
          onClick={onClick}
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
          {getIconButton(draw_card, () => {sendMessage({action: DRAW_CARD})})}
          {getIconButton(draw_intrigue_card, () => {sendMessage({action: GAIN_INTRIGUE_CARD})})}
          {getIconButton(steal_intrigue_card, () => {sendMessage({action: STEAL_INTRIGUE_CARD})})}
          {getIconButton(imperium_card, () => setImperiumRowOpened(true))}
        </Group>
        <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
        <Group w={"100%"} gap={"xs"} justify={"flex-end"}>
          {getTextButton("REVEAL", () => revealAction(), "outline")}
          {(isThisPlayerCurrentPlayer || gameState.containsRivals)
            && getTextButton("END TURN", () => endTurnAction())}
        </Group>

      </>
    )
  }

  const getRivalActions = () => {
    const getIconButton = (
      icon: string,
      onClick?: () => void,
    ) => {
      return (
        <ActionIcon
          onClick={onClick}
          w={"auto"}
          h={35}
          className={"player-resource-modifier-button"}
          variant={"none"}
          radius={"0"}>
          <Image fit="contain" h={35} src={icon}/>
        </ActionIcon>

      )
    }

    const unlockSwordMasterAction = () => {
      sendMessage(
        {action: UNLOCK_SWORDMASTER, body: {playerName: props.playerModel.name}}
      )
    }

    const unlockMakerHookAction = () => {
      sendMessage(
        {action: UNLOCK_MAKER_HOOK, body: {playerName: props.playerModel.name}}
      )
    }

    return (
      <Group ps={16} pb={8}>
        {getIconButton(draw_hagal_card, () => {sendMessage({action: GET_HAGAL_CARD})})}
        {getIconButton(getAgentIcon("gray"), () => {unlockSwordMasterAction()})}
        {getIconButton(maker_hook_icon, () => {unlockMakerHookAction()})}
      </Group>
    )
  }

  const getAgentsSpiesFlags = () => {
    return (
      <>
        <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
        <Flex justify="space-between" align="center">
          <Group w={"33%"} className={"players-agent-icon-container"} justify="center">
            {
              props.playerModel.agents.map((agent, index) =>
                <Agent
                  player={props.playerModel}
                  agentModel={agent}
                  index={index}
                  key={agent.id}/>
              )
            }
          </Group>
          <Divider orientation="vertical" m={"0"} color={"#cacaca44"}/>
          <Group w={"33%"} className={"players-spy-icon-container"} justify="center">
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
          <Divider orientation="vertical" m={"0"} color={"#cacaca44"}/>
          <Group w={"33%"} className={"players-control-flag-icon-container"} justify="center">
            {
              props.playerModel.controlFlags.map((cf, index) =>
                <ControlFlag
                  key={cf.id}
                  player={props.playerModel}
                  controlFlagModel={cf}
                  index={index}/>
              )
            }
          </Group>
        </Flex>
      </>
    )
  }

  const getTroopsCommanders = () => {
    return (
      <>
        <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
        <Group ps={16} gap={5} justify={"center"}>
          <Text
            c={"white"}
            className={"player-resource-info-text"}
            size={"1.4em"}>{props.playerModel.combat.troopsInSupply}</Text>
          <Image
            w={30}
            src={getColoredTroopIcon(props.playerModel.color)}/>
          <Divider orientation="vertical" ms={"10"} me={"10"} color={"#cacaca44"}/>
          <Text
            c={"white"}
            className={"player-resource-info-text"}
            size={"1.4em"}>{props.playerModel.combat.commandersInSupply}</Text>
          <Image
            w={30}
            src={sardaukar_commander_icon}/>
        </Group>
      </>
    )
  }

  const getCurrentPlayerStyleClass = () => {
    switch (props.playerModel.color) {
      case "RED":
        return "player-container-current-player-red";
      case "BLUE":
        return "player-container-current-player-blue";
      case "GOLD":
        return "player-container-current-player-gold";
      default:
        return "player-container-current-player-green";
    }
  }

  const getAvatar = () => {
    return (
      <CharacterImage playerModel={props.playerModel} firstPlayer={props.firstPlayer}/>
    )
  }

  const currentPlayerStyleClass = isThisPlayerCurrentPlayer
    ? getCurrentPlayerStyleClass()
    : null;

  const getOppositionPlayer = () => {
    return props.playerModel.isRival ? getRivalPlayer() : (
      <Stack
        className={`player-container ${currentPlayerStyleClass}`}
        w={"100%"}
        gap={0}>
        <Text ta="left" className={"player-container-text"}>
          {props.playerModel.character.name} ({props.playerModel.name})
        </Text>
        <Group w={"100%"} wrap={"nowrap"} gap={0}>
          {getAvatar()}
          <ObjectivesAlliances player={props.playerModel}/>
        </Group>
        {getAgentsSpiesFlags()}
        {getResourcesDisplay()}
      </Stack>
    )
  }

  const getRivalPlayer = () => {
    return (
      <Stack
        className={`player-container ${currentPlayerStyleClass}`}
        w={"100%"}
        gap={0}>
        <Text ta="left" className={"player-container-text"}>
          {props.playerModel.character.name}
        </Text>
        <Group w={"100%"} wrap={"nowrap"} gap={0}>
          {getAvatar()}
          <ObjectivesAlliances player={props.playerModel}/>
        </Group>
        {getAgentsSpiesFlags()}
        {getModifiers()}
        <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
        {getRivalActions()}
      </Stack>
    )
  }

  const getFeydSignetComponent = () => {
    if (props.playerModel.character.name !== "Feyd Rautha") return;
    return (
      <>
        <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
        <Image draggable={false} fit={"contain"} w={"100%"} h={40} src={signet_ring}/>
        <FeydSignet characterModel={props.playerModel.character}/>

      </>
    )
  }

  const getChaniSignetComponent = () => {
    if (props.playerModel.character.name !== "Chani") return;
    return (
      <>
        <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
        <Image draggable={false} fit={"contain"} w={"100%"} h={30} mb={8} src={signet_ring}/>
        <ChaniSignet characterModel={props.playerModel.character}/>
      </>
    )
  }

  const getContracts = () => {
    if (props.playerModel.contracts.length < 1) {
      return;
    }
    return (
      <>
        <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
        <Contracts player={props.playerModel}/>
      </>
    )
  }

  const getSkills = () => {
    if (props.playerModel.skills.length < 1) {
      return;
    }

    return (
      <>
        <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
        <SardaukarSkills player={props.playerModel}/>
      </>
    )
  }

  const getTechs = () => {
    if (props.playerModel.techs.length < 1) {
      return;
    }

    return (
      <>
        <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
        <TechTiles player={props.playerModel}/>
      </>
    )
  }

  const getThisPlayer = () => {
    return (
      <Stack className={`current-player-container ${currentPlayerStyleClass}`} gap={"0"}>
        <Text ta="left" className={"player-container-text"}>{props.playerModel.character.name} ({props.playerModel.name})</Text>
        <Group w={"100%"} wrap={"nowrap"} gap={0}>
          {getAvatar()}
          <ObjectivesAlliances player={props.playerModel}/>
        </Group>
        {getResourcesDisplay()}
        {getAgentsSpiesFlags()}
        {getTroopsCommanders()}
        {getModifiers()}
        {getFeydSignetComponent()}
        {getChaniSignetComponent()}
        {getContracts()}
        {getSkills()}
        {getTechs()}
        <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
        {getActions()}
      </Stack>
    )
  }

  return props.playerModel.isThisPlayer ? getThisPlayer() : getOppositionPlayer()
}