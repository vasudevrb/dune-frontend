import '../../css/Player.css'
import {ActionIcon, Box, Button, Center, Divider, Flex, Group, Image, Popover, ScrollArea, Space, Stack, Text} from "@mantine/core";
import signet_ring from '../../assets/cards/signet_ring.png';
import agent_icon_disabled from '../../assets/agents/agent_disabled.svg';
import agent_icon_red from '../../assets/agents/agent_red.svg';
import agent_icon_blue from '../../assets/agents/agent_blue.svg';
import agent_icon_green from '../../assets/agents/agent_green.svg';
import agent_icon_gold from '../../assets/agents/agent_gold.svg';
import alliance_bene_gesserit from '../../assets/alliances/alliance_bg.png';
import alliance_fremen from '../../assets/alliances/alliance_fremen.png';
import alliance_emperor from '../../assets/alliances/alliance_emperor.png';
import alliance_spacing_guild from '../../assets/alliances/alliance_spacing_guild.png';
import objective_desert_mouse from '../../assets/objectives/desert_mouse.png';
import objective_ornithopter from '../../assets/objectives/ornothopter.png';
import objective_cryskife from '../../assets/objectives/crysknife.png';
import objective_any from '../../assets/objectives/any.png';
import spy_icon_red from '../../assets/spies/spy_red.png';
import spy_icon_green from '../../assets/spies/spy_green.png';
import spy_icon_blue from '../../assets/spies/spy_blue.png';
import spy_icon_gold from '../../assets/spies/spy_gold.png';
import control_flag_red from '../../assets/control_flags/control_flag_red.png';
import control_flag_blue from '../../assets/control_flags/control_flag_blue.png';
import control_flag_gold from '../../assets/control_flags/control_flag_gold.png';
import control_flag_green from '../../assets/control_flags/control_flag_green.png';
import vp_icon from '../../assets/resources/victory_point.png';
import draw_intrigue_card from '../../assets/cards/draw_intrigue_card.png';
import contract_completed from '../../assets/contract_completed.png';
import steal_intrigue_card from '../../assets/cards/steal_intrigue_card.png';
import draw_card from '../../assets/cards/draw_card.png';
import {
  type AgentModel,
  CombatUnitType, type ContractModel,
  type ControlFlagModel, FactionType, ObjectiveType,
  type PlayerModel,
  type SpyModel
} from "../../model/PlayerModel.tsx";
import {type JSX} from "react";
import {range} from "../../const/Util.tsx";
import plus_icon from "../../assets/plus.svg";
import {useGameStore} from "../../store/GameStore.tsx";
import {FeydSignet} from "./FeydSignet.tsx";
import {useWebSocket} from "../WebSocketContext.tsx";
import {
  COMPLETE_CONTRACT,
  DRAW_CARD,
  END_TURN,
  GAIN_INTRIGUE_CARD,
  GAIN_OR_LOSE_ALLIANCE,
  GAIN_OR_LOSE_OBJECTIVE,
  GET_HAGAL_CARD,
  REVEAL,
  STEAL_INTRIGUE_CARD, TRASH_INTRIGUE_CARD
} from "../../const/Actions.tsx";
import {
  gainOrLoseAlliance,
  gainOrLoseObjective, getResourceIconByType, setContractCompleted
} from "../../const/GameUtils.tsx";
import {produce} from "immer";
import {useDisclosure} from "@mantine/hooks";
import {CharacterImage} from "./CharacterImage.tsx";
import {ResourceModifier} from "../modifiers/ResourceModifier.tsx";
import {VictoryPointModifier} from "../modifiers/VictoryPointModifier.tsx";
import {CombatModifier} from "../modifiers/CombatModifier.tsx";

function Agent(props: { player: PlayerModel, agentModel: AgentModel, index: number }) {

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

    return availableBefore < numAgentsUsed ? "GRAY" : props.player.color
  }

  const agentIcon = getAgentIcon(getAgentColor(props.index))

  return (
    <Image
      draggable={false}
      w={25}
      src={agentIcon}
      alt="Agent icon"
      className={"players-agent-icon"}/>
  )
}

function Spy(props: { player: PlayerModel, spyModel: SpyModel, index: number }) {

  const getSpyIcon = (color: string) => {
    if (color === "RED") return spy_icon_red;
    else if (color === "BLUE") return spy_icon_blue;
    else if (color === "GOLD") return spy_icon_gold;
    else if (color === "GREEN") return spy_icon_green;
  }

  const spyIcon = getSpyIcon(props.player.color)

  return (
    <Image
      draggable={false}
      w={30}
      src={spyIcon}
      alt="Spy icon"
      className={"players-spy-icon"}/>
  )
}

function ControlFlag(props: { player: PlayerModel, controlFlagModel: ControlFlagModel, index: number }) {

  const getControlFlagIcon = (color: string) => {
    if (color === "RED") return control_flag_red;
    else if (color === "BLUE") return control_flag_blue;
    else if (color === "GOLD") return control_flag_gold;
    else if (color === "GREEN") return control_flag_green;
  }

  const controlFlagIcon = getControlFlagIcon(props.player.color)

  return (
    <Image
      draggable={false}
      w={30}
      src={controlFlagIcon}
      alt="Control flag icon"
      className={"players-control-flag-icon"}/>
  )
}


export function Player(props: {
  playerModel: PlayerModel;
  currentPlayer: string;
  firstPlayer: string;
}) {
  const {sendMessage} = useWebSocket();

  const [opened, {close, toggle}] = useDisclosure(false);
  const isThisPlayerCurrentPlayer = props.playerModel.name === props.currentPlayer;
  const {gameState, setGameState, setImperiumRowOpened} = useGameStore();

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
      <Flex direction={"row"} pr={8} gap={0}>{elements}</Flex>
    );
  }


  const getResourcesDisplayElements = () => {
    const getResource = (quantity: number, resourceType: string) => {
      const icon = getResourceIconByType(resourceType);
      return (
        <Center pos={"relative"} w={40} h={40}>
          <Image w={40} src={icon}/>
          <Text size="1.2rem" className={"player-resource-modifier-text"}>{quantity}</Text>
        </Center>
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

  const getCardStats = () => {
    const getCardStat = (cardType: string, num: number) => {
      return (
        <Stack align="center" ps={"8"} pe={8} gap={"0"}>
          <Text size="md" c={"#fafafa"}>{num}</Text>
          <Text size="xs" c={"#fafafa"}>{cardType}</Text>
        </Stack>
      )
    }
    return (
        <>
          {getCardStat("Hand", props.playerModel.numCards.inHand)}
          {getCardStat("Discard", props.playerModel.numCards.inDiscardPile)}
          {getCardStat("Draw", props.playerModel.numCards.inDrawPile)}
          {getCardStat("Intrigues", props.playerModel.numCards.intrigues)}
        </>
    )
  }

  const getResourcesDisplayRivals = () => {
    const resourceModifierAction = (add: boolean, resourceType: string) => {
      sendMessage({
        action: ADD_OR_REMOVE_RESOURCE,
        body: {
          resourceType: resourceType,
          add: add,
          playerName: props.playerModel.name
        }
      })
    }
    const intrigueModifierAction = (add: boolean) => {
      const action = add ? GAIN_INTRIGUE_CARD : TRASH_INTRIGUE_CARD;
      sendMessage({
        action: action,
        body: {
          playerName: props.playerModel.name
        }
      })
    }
    const getResource = (quantity: number, resourceType: string) => {
      const icon = getResourceIconByType(resourceType);
      return (
        <Group gap={5}>
          {getButton(minus_icon, () => resourceModifierAction(false, resourceType))}
          <Box pos={"relative"} w={30} h={30}>
            <Image w={30} src={icon}/>
            <Text fw="500" size="1rem" className={"player-resource-modifier-text"}>{quantity}</Text>
          </Box>
          {getButton(plus_icon, () => resourceModifierAction(true, resourceType))}
        </Group>
      )
    }

    return (
      <Stack>
        {getResource(props.playerModel.resources.water, "water")}
        {getResource(props.playerModel.resources.spice, "spice")}
        {getResource(props.playerModel.resources.solari, "solari")}
        <Group gap={5}>
          {getButton(minus_icon, () => intrigueModifierAction(false))}
          <Box pos={"relative"} w={30} h={30}>
            <Image fit={"contain"} h={30} src={draw_intrigue_card}/>
            <Text fw="500" size="1rem" className={"player-resource-modifier-text"}>{props.playerModel.numCards.intrigues}</Text>
          </Box>
          {getButton(plus_icon, () => intrigueModifierAction(true))}
        </Group>
      </Stack>
    )
  }

  const getCombatDisplayRivals = () => {
    const combatModifierAction = (add: boolean, type: CombatUnitType) => {
      sendMessage({
        action: ADD_OR_REMOVE_COMBAT_UNIT,
        body: {
          unitType: type,
          add: add,
          playerName: props.playerModel.name
        }
      })
    }
    const VPModifierAction = (add: boolean) => {
      sendMessage({
        action: ADD_OR_REMOVE_VP,
        body: {
          add: add,
          playerName: props.playerModel.name
        }
      })
    }
    const getCombatModifierIconByType = (modifierType: CombatUnitType) => {
      switch (modifierType) {
        case CombatUnitType.Troop:
          return troop_icon;
        case CombatUnitType.Sandworm:
          return worm_icon;
        default:
          return strength_icon;
      }
    }
    const getCombatModifier = (modifierType: CombatUnitType) => {
      return (
        <Group gap={5}>
          {getButton(minus_icon, () => combatModifierAction(false, modifierType))}
          <Image w={30} src={getCombatModifierIconByType(modifierType)}/>
          {getButton(plus_icon, () => combatModifierAction(true, modifierType))}
        </Group>
      )
    }
    return (
      <Stack>
        <Group gap={5}>
          {getButton(minus_icon, () => VPModifierAction(false))}
          <Box pos={"relative"} w={30} h={30}>
            <Image w={30} src={vp_icon}/>
            <Text fw="500" size="1rem" className={"player-resource-modifier-text"}>{props.playerModel.victoryPoints}</Text>
          </Box>
          {getButton(plus_icon, () => VPModifierAction(true))}
        </Group>
        {getCombatModifier(CombatUnitType.Troop)}
        {getCombatModifier(CombatUnitType.Sandworm)}
        {getCombatModifier(CombatUnitType.Strength)}
      </Stack>
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
          {getCardStats()}
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
          {getIconButton(imperium_card, () => setImperiumRowOpened(true))}
        </Group>
        <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
        <Group w={"100%"} gap={"xs"}>
          {getIconButton(draw_hagal_card, () => {sendMessage({action: GET_HAGAL_CARD})})}
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
        <Divider orientation="vertical" m={"0"} color={"#cacaca44"}/>
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
    if (!props.playerModel.isThisPlayer && !props.playerModel.isRival) return;

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
    return props.playerModel.isRival ? getRivalPlayer() : (
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
          {getAgents()}
        </Group>
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
        <Group
          w={"100%"}
          wrap={"nowrap"}
          justify={"center"}
          align="center"
          gap={0}>
          {getAvatar()}
          {getVPAndAlliances()}
          {getAgents()}
        </Group>
        <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
        {getSpiesAndFlags()}
        <Group gap={8} align={"top"} pt={16}>
          {getResourcesDisplayRivals()}
          <Divider orientation={"vertical"} m={"md"} color={"#cacaca44"}/>
          {getCombatDisplayRivals()}
        </Group>
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

  const getContracts = () => {
    const contractClickAction = (contract: ContractModel) => {
      const alreadyCompleted = contract.completed;
      setGameState(produce(gameState, draft => {
        setContractCompleted(draft, contract, !alreadyCompleted);
      }))
      sendMessage({
        action: COMPLETE_CONTRACT,
        body: {
          url: contract.url,
          completed: !alreadyCompleted,
        }
      })
    }
    return (
      <>
        <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
        <ScrollArea
          w={"100%"}
          className={"fadeScroll"}
          scrollbars={"x"}
          offsetScrollbars={false}
          type={"never"}>
          <div style={{display: 'flex', gap: 16, alignItems: "center"}}>
            {props.playerModel.contracts.map(c => {
              return (
                <Image
                  w={140}
                  onClick={() => contractClickAction(c)}
                  src={c.completed ? contract_completed : c.url}/>
              )
            })}
          </div>
        </ScrollArea>
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
          {getAgents()}
        </Group>
        {getResourcesDisplay()}
        <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
        {getSpiesAndFlags()}
        <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
        {getFeydSignetComponent()}
        {getResourceModifierElements()}
        <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
        {getCombatModifierElements()}
        {props.playerModel.contracts.length > 0 && getContracts()}
        <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
        {getActions()}
      </Stack>
    )
  }

  return props.playerModel.isThisPlayer ? getThisPlayer() : getOppositionPlayer()
}