import type {PlayerModel} from "../../model/PlayerModel.tsx";
import {Center} from "@mantine/core";
import IconGrid from "./IconGrid.tsx";
import sardaukar_commander_icon from "../../assets/combat/sardaukar_commander.png";
import {getColoredTroopIcon} from "../../const/GameUtils.tsx";

export function Garrison(props: {
  player: PlayerModel;
  index: number
}) {

  const garrissonedTroopsPositions = [
    {top: "83%", left: "44.5%"},
    {top: "71.5%", left: "44.5%"},
    {top: "71.5%", left: "85.5%"},
    {top: "83%", left: "85.5%"},
  ]

  return (
    <Center
      w={"150px"}
      h={"150px"}
      p={16}
      pos={"absolute"}
      top={garrissonedTroopsPositions[props.index].top}
      left={garrissonedTroopsPositions[props.index].left}
      style={{
        pointerEvents: 'none',
        transform: "translate(-50%, -50%)",
      }}>

      <IconGrid
        icon={getColoredTroopIcon(props.player.color)}
        size={props.player.combat.troopsInGarrison}
        pos={"relative"}
        anchorToCenter={true}/>

      {
        props.player.combat.commandersInGarrison > 0 &&
        <IconGrid
          icon={sardaukar_commander_icon}
          iconSize={40}
          size={props.player.combat.commandersInGarrison}
          pos={"relative"}
          anchorToCenter={true}/>
      }

    </Center>
  )
}