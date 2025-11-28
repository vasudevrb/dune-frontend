import '../css/CombatArea.css'
import {Image, Group} from "@mantine/core";
import troop_icon_red from "../assets/combat/troop_red.png";
import troop_icon_blue from "../assets/combat/troop_blue.png";
import troop_icon_green from "../assets/combat/troop_green.png";
import troop_icon_gold from "../assets/combat/troop_gold.png";
import worm_icon from "../assets/combat/worm.png";
import conflict_bg_1 from "../assets/conflicts/conflict_l1.jpg";
import conflict_bg_2 from "../assets/conflicts/conflict_l2.jpg";
import conflict_bg_3 from "../assets/conflicts/conflict_l3.jpg";
import maker_hook_icon from "../assets/combat/maker_hook.png";
import type {GameModel} from "../model/GameModel.tsx";
import type {JSX} from "react";
import IconGrid from "./IconGrid.tsx";

export function CombatArea(props: { game: GameModel }) {

  const getNextConflictBackground = () => {
    const getBg = () => {
      switch (props.game.nextConflictLevel) {
        case 1: return conflict_bg_1;
        case 2: return conflict_bg_2;
        case 3: return conflict_bg_3;
      }
    }

    return (
      <Image
        w={"auto"}
        mah={"200px"}
        fit={"contain"}
        radius={"7"}
        src={getBg()}
        style={{
          position: "absolute",
          top: "65.5%",
          left: "29%"
        }}/>
    )
  }

  const getConflictCard = () => {
    return (
      <Image
        w={"auto"}
        mah={"200px"}
        fit={"contain"}
        radius={"7"}
        src={props.game.currentConflict}
        style={{
          position: "absolute",
          top: "79.5%",
          left: "29%"
        }}
        alt="Combat icon"/>
    )
  }

  const getTroopIcon = (color: string) => {
    switch (color) {
      case "RED": return troop_icon_red;
      case "BLUE": return troop_icon_blue;
      case "GREEN": return troop_icon_green;
      default: return troop_icon_gold;
    }
  }

  const getCombatComponents = () => {
    const elements: JSX.Element[] = [];
    const makerHookPositions = [
      {top: "84.2%", left: "38.5%"},
      {top: "67.2%", left: "38.5%"},
      {top: "67.2%", left: "87%"},
      {top: "84.2%", left: "87%"},
    ]

    const garrissonedTroopsPositions = [
      {top: "83%", left: "44.5%"},
      {top: "71.5%", left: "44.5%"},
      {top: "71.5%", left: "85.5%"},
      {top: "83%", left: "85.5%"},
    ]

    const combatUnitsPositions = [
      {top: "78%", right: "36%"},
      {right: "36%", bottom: "23.4%"},
      {left: "66%", bottom: "23.4%"},
      {top: "78%", left: "66%"},
    ]

    props.game.players.forEach((p, index) => {
      if (p.makerHookUnlocked) {
        const flipY = index === 2 || index === 3? "-1": "1";
        const flipX = index === 1 || index === 2 ? "-1": "1";
        elements.push(
          <Image
            pos={"absolute"}
            w={72}
            top={makerHookPositions[index].top}
            left={makerHookPositions[index].left}
            src={maker_hook_icon}
            style={{ transform: `rotate(90deg) scaleX(${flipX}) scaleY(${flipY})` }}
            alt="Maker hook"/>
        )
      }

      elements.push(
        <IconGrid
          icon={getTroopIcon(p.color)}
          size={p.combat.troopsInGarrison}
          pos={"absolute"}
          anchorToCenter={true}
          top={garrissonedTroopsPositions[index].top}
          left={garrissonedTroopsPositions[index].left} />
      )

      const wormIcons = (
        <IconGrid
          icon={worm_icon}
          size={p.combat.wormsInCombat}
          iconSize={45}
          pos={"unset"}/>
      )
      const troopIcons = (
        <IconGrid
          icon={getTroopIcon(p.color)}
          size={p.combat.troopsInCombat}
          pos={"unset"}/>
      )
      elements.push(
        <Group
          pos={"absolute"}
          align={"flex-end"}
          top={combatUnitsPositions[index].top}
          left={combatUnitsPositions[index].left}
          right={combatUnitsPositions[index].right}
          bottom={combatUnitsPositions[index].bottom}>
          {index === 2 || index === 3 ? troopIcons : wormIcons}
          {index === 0 || index === 1 ? troopIcons: wormIcons}
        </Group>
      )
    })
    return elements
  }

  return (
    <>
      {getConflictCard()}
      {getNextConflictBackground()}
      {getCombatComponents()}

    </>
  )
}