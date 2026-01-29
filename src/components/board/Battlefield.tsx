import {Center, Group, Image, Stack} from "@mantine/core";
import IconGrid from "./IconGrid.tsx";
import {getAgentIcon, getColoredTroopIcon} from "../../const/GameUtils.tsx";
import worm_icon from "../../assets/combat/worm.png";
import sardaukar_commander_icon from "../../assets/combat/sardaukar_commander.png";
import type {PlayerModel} from "../../model/PlayerModel.tsx";

export function Battlefield(props: {
  player: PlayerModel;
  index: number;
}) {

  const battlefieldPosition = [
    {top: "83%", left: "58.5%"},
    {top: "71.5%", left: "58.5%"},
    {top: "71.5%", left: "71.7%"},
    {top: "83%", left: "71.7%"},
  ]

  const commandersAndWorms = (
    <Stack w={"50%"} h={"100%"} gap={0}>
      <Center h={"50%"} w={"100%"}>
        <IconGrid
          pos={"relative"}
          iconSize={40}
          icon={sardaukar_commander_icon}
          size={props.player.combat.commandersInCombat}/>
      </Center>
      <Center h={"50%"} w={"100%"}>
        <IconGrid
          pos={"relative"}
          iconSize={40}
          icon={worm_icon}
          size={props.player.combat.wormsInCombat}/>
      </Center>
    </Stack>
  )

  const troops = (
    <Center w={"50%"} h={"100%"}>
      <IconGrid
        pos={"relative"}
        icon={getColoredTroopIcon(props.player.color)}
        size={props.player.combat.troopsInCombat}/>
    </Center>
  )

  const shouldShowDuncanAgent = props.player.character.name === "Duncan Idaho"
    && props.player.character.additionalInfo.duncanAgentDeployed;

  const duncanAgent = (
    <Image
      draggable={false}
      w={55}
      pos={"absolute"}
      top={"50%"}
      left={"50%"}
      style={{
        transform: "translate(-50%, -50%)",
        zIndex: 0,
        opacity: 0.3
      }}
      src={getAgentIcon(props.player.color)}
      className={"locations-agent-icon"}/>
  )

  return (
    <Group
      w={"175px"}
      h={"150px"}
      gap={0}
      align={"center"}
      pos={"absolute"}
      top={battlefieldPosition[props.index].top}
      left={battlefieldPosition[props.index].left}
      style={{
        transform: "translate(-50%, -50%)",
      }}>

      {shouldShowDuncanAgent && duncanAgent}
      {props.index === 0 || props.index === 1 ? commandersAndWorms : troops}
      {props.index === 0 || props.index === 1 ? troops : commandersAndWorms}
    </Group>

  );
}