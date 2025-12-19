import '../../css/Player.css'
import {ActionIcon, Box, Button, Divider, Flex, Group, Image, Popover, ScrollArea, Space, Stack, Text} from "@mantine/core";
import signet_ring from '../../assets/cards/signet_ring.png';
import alliance_bene_gesserit from '../../assets/alliances/alliance_bg.png';
import alliance_fremen from '../../assets/alliances/alliance_fremen.png';
import alliance_emperor from '../../assets/alliances/alliance_emperor.png';
import alliance_spacing_guild from '../../assets/alliances/alliance_spacing_guild.png';
import objective_desert_mouse from '../../assets/objectives/desert_mouse.png';
import objective_ornithopter from '../../assets/objectives/ornothopter.png';
import objective_cryskife from '../../assets/objectives/crysknife.png';
import objective_any from '../../assets/objectives/any.png';
import vp_icon from '../../assets/resources/victory_point.png';
import draw_intrigue_card from '../../assets/cards/draw_intrigue_card.png';

import steal_intrigue_card from '../../assets/cards/steal_intrigue_card.png';
import draw_card from '../../assets/cards/draw_card.png';
import {
  CombatUnitType,
  FactionType, ObjectiveType,
  type PlayerModel,
} from "../../model/PlayerModel.tsx";
import plus_icon from "../../assets/plus.svg";
import {useGameStore} from "../../store/GameStore.tsx";
import {FeydSignet} from "./FeydSignet.tsx";
import {useWebSocket} from "../WebSocketContext.tsx";
import {
  DRAW_CARD,
  END_TURN,
  GAIN_INTRIGUE_CARD, GAIN_OR_LOSE_ALLIANCE, GAIN_OR_LOSE_OBJECTIVE,
  REVEAL,
  STEAL_INTRIGUE_CARD
} from "../../const/Actions.tsx";
import {
  gainOrLoseAlliance,
  gainOrLoseObjective, getResourceIconByType
} from "../../const/GameUtils.tsx";
import {produce} from "immer";
import {useDisclosure} from "@mantine/hooks";
import {CharacterImage} from "./CharacterImage.tsx";
import {ResourceModifier} from "../modifiers/ResourceModifier.tsx";
import {VictoryPointModifier} from "../modifiers/VictoryPointModifier.tsx";
import {CombatModifier} from "../modifiers/CombatModifier.tsx";
import {Agent, ControlFlag, Spy} from "./PlayableComponents.tsx";
import {CardStats} from "./CardStats.tsx";
import {Contracts} from "./Contracts.tsx";
import {QuantityIcon} from "./QuantityIcon.tsx";

export function Player(props: {
  playerModel: PlayerModel;
  currentPlayer: string;
  firstPlayer: string;
}) {
  const {sendMessage} = useWebSocket();

  const [opened, {close, toggle}] = useDisclosure(false);
  const isThisPlayerCurrentPlayer = props.playerModel.name === props.currentPlayer;
  const {gameState, setGameState, setImperiumRowOpened} = useGameStore();


  const getResourcesDisplayElements = () => {
    const getResource = (quantity: number, resourceType: string) => {
      const icon = getResourceIconByType(resourceType);
      return (
        <QuantityIcon icon={icon} text={quantity} size={40} textSize={"1.2em"}/>
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
        pt={"10"}
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

  const getResourceModifierElements = () => {
    return (
      <Group w={"100%"} justify="center" gap={"xs"}>
        <ResourceModifier player={props.playerModel} resourceType={"water"}/>
        <Divider orientation="vertical" color={"#31313123"}/>
        <ResourceModifier player={props.playerModel} resourceType={"spice"}/>
        <Divider orientation="vertical" color={"#31313123"}/>
        <ResourceModifier player={props.playerModel} resourceType={"solari"}/>
        <Divider orientation="vertical" color={"#31313123"}/>
        <VictoryPointModifier player={props.playerModel}/>
      </Group>
    )
  }

  const getCombatModifierElements = () => {
    return (
      <Group w={"100%"} justify="center" gap={"xs"}>
        <CombatModifier player={props.playerModel} modifierType={CombatUnitType.Troop}/>
        <Divider orientation="vertical" color={"#31313123"}/>
        <CombatModifier player={props.playerModel} modifierType={CombatUnitType.Sandworm}/>
        <Divider orientation="vertical" color={"#31313123"}/>
        <CombatModifier player={props.playerModel} modifierType={CombatUnitType.Strength}/>
      </Group>
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
        </Group>
        <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
        <Group w={"100%"} gap={"xs"}>
          {getTextButton("Imperium Row", () => setImperiumRowOpened(true))}
        </Group>
        <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
        <Group w={"100%"} gap={"xs"} justify={"flex-end"}>
          {getTextButton("REVEAL", () => revealAction(), "outline")}
          {isThisPlayerCurrentPlayer && getTextButton("END TURN", () => endTurnAction())}
        </Group>

      </>
    )
  }

  const getSpiesAndFlags = () => {
    return (
      <Flex justify="space-between" align="center">
        <Group className={"players-agent-icon-container"} justify="center">
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
        <Group className={"players-spy-icon-container"} justify="center">
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
        <Group className={"players-control-flag-icon-container"} justify="center">
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

  const allianceModifierAction = (gained: boolean, type: FactionType) => {
    if (!props.playerModel.isThisPlayer) return;
    let success;
    setGameState(produce(gameState, draft => {
      success = gainOrLoseAlliance(draft, gained, type)
    }));
    if (success) {
      sendMessage({
        action: GAIN_OR_LOSE_ALLIANCE,
        body: {type: type, gained: gained}
      })
    }
    close()
  }

  const objectiveModifierAction = (gained: boolean, type: ObjectiveType) => {
    if (!props.playerModel.isThisPlayer) return;
    let success;
    setGameState(produce(gameState, draft => {
      success = gainOrLoseObjective(draft, gained, type)
    }));
    if (success) {
      sendMessage({
        action: GAIN_OR_LOSE_OBJECTIVE,
        body: {type: type, gained: gained}
      })
    }
    close()
  }

  const getAllianceObjectiveModifier = () => {
    if (!props.playerModel.isThisPlayer) return;

    return (
      <Popover opened={opened} onChange={toggle} width={200} position="bottom" clickOutsideEvents={['mouseup', 'touchend']}>
        <Popover.Target>
          <Image w={25} h={25} src={plus_icon} onClick={toggle}/>
        </Popover.Target>
        <Popover.Dropdown onClick={close} className={"popover-dialog"}>
          <Stack>
            <Text c="#cacaca" size="xs">Select Alliance or Objective</Text>
            <Group>
              <Image w={40} h={40} src={alliance_fremen} onClick={() => allianceModifierAction(true, FactionType.Fremen)}/>
              <Image w={40} h={40} src={alliance_bene_gesserit} onClick={() => allianceModifierAction(true, FactionType.BeneGesserit)}/>
              <Image w={40} h={40} src={alliance_spacing_guild} onClick={() => allianceModifierAction(true, FactionType.SpacingGuild)}/>
              <Image w={40} h={40} src={alliance_emperor} onClick={() => allianceModifierAction(true, FactionType.Emperor)}/>
            </Group>
            <Group>
              <Image w={35} h={35} src={objective_desert_mouse} onClick={() => objectiveModifierAction(true, ObjectiveType.DesertMouse)}/>
              <Image w={35} h={35} src={objective_ornithopter} onClick={() => objectiveModifierAction(true, ObjectiveType.Ornithopter)}/>
              <Image w={35} h={35} src={objective_cryskife} onClick={() => objectiveModifierAction(true, ObjectiveType.Crysknife)}/>
              <Image w={35} h={35} src={objective_any} onClick={() => objectiveModifierAction(true, ObjectiveType.Any)}/>
            </Group>
          </Stack>
        </Popover.Dropdown>
      </Popover>
    )
  }

  const getAlliances = () => {
    const getFactionAllianceToken = (type: FactionType) => {
      switch (type) {
        case FactionType.Fremen:
          return alliance_fremen;
        case FactionType.BeneGesserit:
          return alliance_bene_gesserit;
        case FactionType.Emperor:
          return alliance_emperor;
        case FactionType.SpacingGuild:
          return alliance_spacing_guild;
      }
    }

    return props.playerModel.factionAlliances.length > 0 ? (
      <>
        <Divider orientation="vertical" m={"8"} color={"#cacaca44"}/>
        {props.playerModel.factionAlliances.map(type =>
          <Image
            onClick={() => allianceModifierAction(false, type)}
            m={5}
            w={35}
            src={getFactionAllianceToken(type)}/>
        )}
      </>
    ) : null
  }

  const getObjectives = () => {
    const getObjectiveToken = (type: ObjectiveType) => {
      switch (type) {
        case ObjectiveType.DesertMouse:
          return objective_desert_mouse;
        case ObjectiveType.Ornithopter:
          return objective_ornithopter;
        case ObjectiveType.Crysknife:
          return objective_cryskife;
        case ObjectiveType.Any:
          return objective_any;
      }
    }

    return (
      <>
        {props.playerModel.objectives.map(type =>
          <Image
            onClick={() => objectiveModifierAction(false, type)}
            m={5}
            w={35}
            src={getObjectiveToken(type)}/>
        )}
      </>
    )
  }

  const getVPAndAlliances = () => {
    return (
      <ScrollArea
        w={"100%"}
        className={"fadeScroll"}
        scrollbars={"x"}
        offsetScrollbars={false}
        type={"never"}>
        <div style={{display: 'flex', alignItems: "center"}}>
          <Box pos={"relative"} w={50} h={50}>
            <Image w={50} src={vp_icon}/>
            <Text size="1.4em" className={"player-resource-modifier-text"}>{props.playerModel.victoryPoints}</Text>
          </Box>
          {getAlliances()}
          <Divider orientation="vertical" m={"8"} color={"#cacaca44"}/>
          {getObjectives()}
          {getAllianceObjectiveModifier()}
          <Space w={16} h={16}></Space>
        </div>
      </ScrollArea>
    )
  }

  const currentPlayerStyleClass = isThisPlayerCurrentPlayer
    ? getCurrentPlayerStyleClass()
    : null;

  const getOppositionPlayer = () => {
    return (
      <Stack
        className={`player-container ${currentPlayerStyleClass}`}
        w={"100%"}
        gap={0}>
        <Text ta="left" className={"player-container-text"}>
          {props.playerModel.character.name}
        </Text>
        <Group
          w={"100%"}
          wrap={"nowrap"}
          justify={"center"}
          align="center"
          gap={0}>
          {getAvatar()}
          {getVPAndAlliances()}
        </Group>
        {getResourcesDisplay()}
      </Stack>
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
        <Text ta="left" className={"player-container-text"}>
          {props.playerModel.character.name}
        </Text>
        <Group
          w={"100%"}
          wrap={"nowrap"}
          justify={"center"}
          align="center"
          gap={0}>
          {getAvatar()}
          {getVPAndAlliances()}
        </Group>
        {getResourcesDisplay()}
        <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
        {getSpiesAndFlags()}
        <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
        {getFeydSignetComponent()}
        {getResourceModifierElements()}
        <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
        {getCombatModifierElements()}
        {props.playerModel.contracts.length > 0 && <Contracts player={props.playerModel}/>}
        <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
        {getActions()}
      </Stack>
    )
  }

  return props.playerModel.isThisPlayer ? getThisPlayer() : getOppositionPlayer()
}