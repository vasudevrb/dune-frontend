import '../css/Player.css'
import {ActionIcon, Avatar, Box, Divider, Group, Space, Stack, Text, Tooltip} from "@mantine/core";
import water_icon from '../assets/water.svg';
import spice_icon from '../assets/spice.svg';
import solari_icon from '../assets/solari.svg';
import first_player_icon from '../assets/first_player_token.png';
import agent_icon_disabled from '../assets/agent_icon_disabled.svg';
import agent_icon_red from '../assets/agent_icon_red.svg';
import agent_icon_blue from '../assets/agent_icon_blue.svg';
import agent_icon_green from '../assets/agent_icon_green.svg';
import agent_icon_gold from '../assets/agent_icon_gold.svg';
import vp_icon from '../assets/vp_icon.png';
import objective_card_icon from '../assets/objective_icon.png'
import hand_icon from '../assets/hand_icon.png';
import {CombatModifierType, type PlayerModel, ResourceType} from "../model/Player.tsx";
import type {JSX} from "react";
import {range} from "../const/Util.tsx";
import minus_icon from "../assets/minus.svg";
import plus_icon from "../assets/plus.svg";

export function Player(props: { playerModel: PlayerModel; }) {

  const getAgents = () => {
    const playerModel = props.playerModel;

    const getAgentIcon = (color: string) => {
      if (color === "RED") return agent_icon_red;
      else if (color === "BLUE") return agent_icon_blue;
      else if (color === "GOLD") return agent_icon_gold;
      else if (color === "GREEN") return agent_icon_green;
      else if (color === "GRAY") return agent_icon_disabled;
    }

    const getAgentColor = (index: number) => {
      const totalNumUsableAgents = playerModel.swordmasterUnlocked ? 3 : 2;
      const agentAvailability = range(0, totalNumUsableAgents)
        .map(i => {
          return i === 0 ? playerModel.swordmasterUnlocked : true;
        });

      if (!agentAvailability[index]) return getAgentIcon("GRAY")
      const availableBefore = agentAvailability.slice(0, index).filter(a => a).length;

      return availableBefore < playerModel.numAgentsUsed ?
        getAgentIcon("GRAY") :
        getAgentIcon(playerModel.color);
    }

    const elements: JSX.Element[] = [];
    for (let i = 0; i < props.playerModel.numAgentsAvailable; i++) {
      elements.push(
        <img key={i} width={40} src={getAgentColor(i)} alt="Agent icon" className={"agent-icon"}/>
      );
    }
    return (
      <Stack className="agent-icon-container" align="stretch" style={{marginLeft: 'auto'}}>
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

        <Group align="center" gap={"5"}>
          <Text fw="700" size="md" className={"player-container-text"}>
            {props.playerModel.victoryPoints}
          </Text>
          <img width={15} src={vp_icon} alt="Victory points"/>
        </Group>
      </Stack>
    )
  }

  const getResourceIconByType = (resourceType: ResourceType) => {
    switch (resourceType) {
      case ResourceType.Water: return water_icon;
      case ResourceType.Spice: return spice_icon;
      default: return solari_icon
    }
  }

  const getResourcesDisplayElements = () => {
    const getResource = (resourceType: ResourceType) => {
      const text = props.playerModel.resources.get(resourceType);
      const icon = getResourceIconByType(resourceType);
      return (
        <Group align="center" gap={"5"}>
          <Text size="md" className={"player-container-text"}>{text}</Text>
          <img width={15} src={icon} alt="Resource icon"/>
        </Group>
      )
    }
    const divider = () => {
      return <Divider orientation="vertical" m={"0"} color={"#cacaca"}/>
    }

    return (
      <Group align="center" gap={"xs"}>
        {getResource(ResourceType.Water)}
        {divider()}
        {getResource(ResourceType.Spice)}
        {divider()}
        {getResource(ResourceType.Solari)}
      </Group>
    )
  }

  const getCardElements = () => {
    return (
      <Group align="center" gap={"xs"}>
        <img width={20} src={hand_icon} alt="Water drop icon"/>
        <Divider orientation="vertical" m={"0"} color={"#363636"}/>
        <img width={20} src={objective_card_icon} alt="Spice icon"/>
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
            <img width={20}
                 src={first_player_icon}
                 alt="First player token"
                 hidden={!props.playerModel.firstPlayer}/>
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
  const getLabelElement = (icon: string, text: number | undefined) => {
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
    const getResourceLabel = (resourceType: ResourceType) => {
      const text = props.playerModel.resources.get(resourceType)
      const icon = getResourceIconByType(resourceType)
      return getLabelElement(icon, text)
    }
    const getResourceModifier = (resourceType: ResourceType) => {
      return (
        <Stack align="center" gap={"xs"}>
          {getButton(plus_icon)}
          {getResourceLabel(resourceType)}
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
        {getResourceModifier(ResourceType.Water)}
        {resourceModifierDivider()}
        {getResourceModifier(ResourceType.Spice)}
        {resourceModifierDivider()}
        {getResourceModifier(ResourceType.Solari)}
        {resourceModifierDivider()}
        {getVictoryPointModifier()}
      </Group>
    )
  }

  const getCombatModifierElements = () => {
    const getCombatModifierIconByType = (modifierType: CombatModifierType) => {
      switch (modifierType) {
        case CombatModifierType.Troop: return water_icon;
        case CombatModifierType.Worm: return spice_icon;
        default: return solari_icon
      }
    }
    const getCombatModifierText = (modifierType: CombatModifierType) => {
      switch (modifierType) {
        case CombatModifierType.Troop: return props.playerModel.combat.troopsInCombat;
        case CombatModifierType.Worm: return props.playerModel.combat.wormsInCombat;
        case CombatModifierType.Strength: return props.playerModel.combat.strength;
      }
    }
    const getCombatLabel = (modifierType: CombatModifierType) => {
      const text = getCombatModifierText(modifierType)
      const icon = getCombatModifierIconByType(modifierType)
      return getLabelElement(icon, text)
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

  const getOppositionPlayer = () => {
    return (
      <Group className="player-container" align="flex-start">
        {getAvatar()}
        {getNameAndResources()}
        {getAgents()}
      </Group>
    )
  }

  const getThisPlayer = () => {
    return (
      <Stack className="current-player-container" gap={"5"}>
        <Group align={"flex-start"}>
          {getAvatar()}
          {getNameAndResources()}
          {getAgents()}
        </Group>
        <Space h={"md"}/>
        {getResourceModifierElements()}
        <Divider orientation={"horizontal"} m={"md"} color={"#313131ff"}/>
        {getCombatModifierElements()}
      </Stack>
    )
  }

  return props.playerModel.isThisPlayer ? getThisPlayer() : getOppositionPlayer()
}