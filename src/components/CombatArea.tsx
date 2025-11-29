import '../css/CombatArea.css'
import {Image, Group, ActionIcon} from "@mantine/core";
import troop_icon_red from "../assets/combat/troop_red.png";
import troop_icon_blue from "../assets/combat/troop_blue.png";
import troop_icon_green from "../assets/combat/troop_green.png";
import troop_icon_gold from "../assets/combat/troop_gold.png";
import worm_icon from "../assets/combat/worm.png";
import conflict_bg_1 from "../assets/conflicts/conflict_l1.jpg";
import conflict_bg_2 from "../assets/conflicts/conflict_l2.jpg";
import conflict_bg_3 from "../assets/conflicts/conflict_l3.jpg";
import maker_hook_icon from "../assets/combat/maker_hook.png";
import combat_marker_red_1 from "../assets/combat/combat_marker_red_1.png";
import combat_marker_red_2 from "../assets/combat/combat_marker_red_2.png";
import combat_marker_blue_1 from "../assets/combat/combat_marker_blue_1.png";
import combat_marker_blue_2 from "../assets/combat/combat_marker_blue_2.png";
import combat_marker_green_1 from "../assets/combat/combat_marker_green_1.png";
import combat_marker_green_2 from "../assets/combat/combat_marker_green_2.png";
import combat_marker_gold_1 from "../assets/combat/combat_marker_gold_1.png";
import combat_marker_gold_2 from "../assets/combat/combat_marker_gold_2.png";
import minus_icon from "../assets/minus.svg";
import plus_icon from "../assets/plus.svg";
import cross_icon from "../assets/cross.svg";
import type {JSX} from "react";
import IconGrid from "./IconGrid.tsx";
import {useGameStore} from "../store/GameStore.tsx";
import {produce} from "immer";
import {moveUnit, TroopMovementLocation} from "../const/GameUtils.tsx";
import {useWebSocket} from "./WebSocketContext.tsx";
import {MOVE_COMBAT_UNIT} from "../const/Actions.tsx";

export function CombatArea() {

  const {gameState, setGameState} = useGameStore();
  const {sendMessage} = useWebSocket();
  const getNextConflictBackground = () => {
    const getBg = () => {
      switch (gameState.nextConflictLevel) {
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
        src={gameState.currentConflict}
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

  const getCombatMarkerIcon = (color: string, strength: number) => {
    switch (color) {
      case "RED": return strength > 20 ? combat_marker_red_2 : combat_marker_red_1;
      case "BLUE": return strength > 20 ? combat_marker_blue_2 : combat_marker_blue_1;
      case "GREEN": return strength > 20 ? combat_marker_green_2 : combat_marker_green_1;
      case "GOLD": return strength > 20 ? combat_marker_gold_2 : combat_marker_gold_1;
    }
  }

  const moveTroop = (destination: TroopMovementLocation) => {
    let success = false;
    setGameState(produce(gameState, (draft) => {
      success = moveUnit(draft, destination)
    }));

    if (success) {
      sendMessage({
        action: MOVE_COMBAT_UNIT,
        body: {
          unitType: "troop",
          destination: destination,
        }
      });
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

    const combatMarkerPositions = [
      {top: "94%", left: "43.5%"},
      {top: "91%", left: "50.8%"},
      {top: "91%", left: "55.1%"},
      {top: "91%", left: "59.4%"},
      {top: "91%", left: "63.8%"},
      {top: "91%", left: "68.1%"},
      {top: "91%", left: "72.5%"},
      {top: "91%", left: "76.8%"},
      {top: "91%", left: "81.2%"},
      {top: "91%", left: "85.5%"},
      {top: "91%", left: "90%"},
      {top: "95.6%", left: "50.8%"},
      {top: "95.6%", left: "55.1%"},
      {top: "95.6%", left: "59.4%"},
      {top: "95.6%", left: "63.8%"},
      {top: "95.6%", left: "68.1%"},
      {top: "95.6%", left: "72.5%"},
      {top: "95.6%", left: "76.8%"},
      {top: "95.6%", left: "81.2%"},
      {top: "95.6%", left: "85.5%"},
      {top: "95.6%", left: "90%"},
    ]

    const combatMarkerDeviations = [
      "-20px", "-10px", "10px", "20px"
    ]

    gameState.players.forEach((p, index) => {
      if (p.isThisPlayer) index = 3;

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

      let normalizedStrength = p.combat.strength > 20 ? p.combat.strength - 20: p.combat.strength;
      normalizedStrength = Math.min(normalizedStrength, 20);
      elements.push(
        <Image
          pos={"absolute"}
          w={40}
          top={combatMarkerPositions[normalizedStrength].top}
          left={combatMarkerPositions[normalizedStrength].left}
          src={getCombatMarkerIcon(p.color, p.combat.strength)}
          style={{transform: `translate(-50%, -50%) translateY(${combatMarkerDeviations[index]})`}}/>
      )

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

    elements.push(
      <ActionIcon
        onClick={() => moveTroop(TroopMovementLocation.Combat)}
        pos={"absolute"}
        right={"25%"}
        bottom={"12%"}
        className={"player-resource-modifier-button"}
        variant={"outline"}
        radius={"0"}>
        <img width={30} src={plus_icon} alt="Resource modifier button"/>
      </ActionIcon>
    )

    elements.push(
      <ActionIcon
        onClick={() => moveTroop(TroopMovementLocation.Garrison)}
        pos={"absolute"}
        right={"22.5%"}
        bottom={"12%"}
        className={"player-resource-modifier-button"}
        variant={"outline"}
        radius={"0"}>
        <img width={30} src={minus_icon} alt="Resource modifier button"/>
      </ActionIcon>
    )

    elements.push(
      <ActionIcon
        onClick={() => moveTroop(TroopMovementLocation.Supply)}
        pos={"absolute"}
        right={"20%"}
        bottom={"12%"}
        className={"player-resource-modifier-button"}
        variant={"outline"}
        radius={"0"}>
        <img width={30} src={cross_icon} alt="Resource modifier button"/>
      </ActionIcon>
    )
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