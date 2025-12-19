import {FactionType, ObjectiveType, type PlayerModel} from "../../model/PlayerModel.tsx";
import {Divider, Group, Image, Popover, ScrollArea, Space, Stack, Text} from "@mantine/core";
import {QuantityIcon} from "./QuantityIcon.tsx";
import vp_icon from "../../assets/resources/victory_point.png";
import {produce} from "immer";
import {gainOrLoseAlliance, gainOrLoseObjective, getObjectiveIcon} from "../../const/GameUtils.tsx";
import {GAIN_OR_LOSE_ALLIANCE, GAIN_OR_LOSE_OBJECTIVE} from "../../const/Actions.tsx";
import plus_icon from "../../assets/plus.svg";
import alliance_fremen from "../../assets/alliances/alliance_fremen.png";
import alliance_bene_gesserit from "../../assets/alliances/alliance_bg.png";
import alliance_spacing_guild from "../../assets/alliances/alliance_spacing_guild.png";
import alliance_emperor from "../../assets/alliances/alliance_emperor.png";
import objective_desert_mouse from "../../assets/objectives/desert_mouse_tr.png";
import objective_ornithopter from "../../assets/objectives/ornithopter_tr.png";
import objective_cryskife from "../../assets/objectives/crysknife_tr.png";
import objective_any from "../../assets/objectives/any.png";
import {useDisclosure} from "@mantine/hooks";
import {useGameStore} from "../../store/GameStore.tsx";
import {useWebSocket} from "../WebSocketContext.tsx";

export function ObjectivesAlliances(props: {
  player: PlayerModel
}) {
  const [opened, {close, toggle}] = useDisclosure(false);
  const {gameState, setGameState} = useGameStore();

  const {sendMessage} = useWebSocket();

  const allianceModifierAction = (gained: boolean, type: FactionType) => {
    let success;
    setGameState(produce(gameState, draft => {
      success = gainOrLoseAlliance(draft, gained, type)
    }));
    if (success) {
      sendMessage({
        action: GAIN_OR_LOSE_ALLIANCE,
        body: {type: type, gained: gained, playerName: props.player.name}
      })
    }
    close()
  }

  const objectiveModifierAction = (gained: boolean, type: ObjectiveType) => {
    let success;
    setGameState(produce(gameState, draft => {
      success = gainOrLoseObjective(draft, gained, type)
    }));
    if (success) {
      sendMessage({
        action: GAIN_OR_LOSE_OBJECTIVE,
        body: {type: type, gained: gained, playerName: props.player.name}
      })
    }
    close()
  }

  const getAllianceObjectiveModifier = () => {
    if (!props.player.isThisPlayer && !props.player.isRival) return;

    return (
      <Popover opened={opened} onChange={toggle} width={275} position="bottom" clickOutsideEvents={['mouseup', 'touchend']}>
        <Popover.Target>
          <Image w={25} h={25} src={plus_icon} onClick={toggle}/>
        </Popover.Target>
        <Popover.Dropdown onClick={close} className={"popover-dialog"}>
          <Stack align={"center"}>
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

    return props.player.factionAlliances.length > 0 ? (
      <>
        <Divider orientation="vertical" m={"8"} color={"#cacaca44"}/>
        {props.player.factionAlliances.map(type =>
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
    return (
      <>
        {props.player.objectives.map(type =>
          <Image
            onClick={() => objectiveModifierAction(false, type)}
            m={5}
            w={35}
            src={getObjectiveIcon(type)}/>
        )}
      </>
    )
  }

  return (
    <ScrollArea
      w={"100%"}
      className={"fadeScroll"}
      scrollbars={"x"}
      offsetScrollbars={false}
      type={"never"}>
      <div style={{display: 'flex', alignItems: "center"}}>
        <QuantityIcon icon={vp_icon} text={props.player.victoryPoints} size={50}/>
        {getAlliances()}
        <Divider orientation="vertical" m={"8"} color={"#cacaca44"}/>
        {getObjectives()}
        {getAllianceObjectiveModifier()}
        <Space w={16} h={16}></Space>
      </div>
    </ScrollArea>
  )
}