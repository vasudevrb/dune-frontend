import {ActionIcon, Image, Center, Group, Stack, Text} from "@mantine/core";
import spice_icon from '../../assets/resources/spice.png';
import minus_icon from "../../assets/minus.svg";
import plus_icon from "../../assets/plus.svg";
import type {Property} from "csstype";
import {useWebSocket} from "../WebSocketContext.tsx";
import {SET_BONUS_SPICE} from "../../const/Actions.tsx";
import {useGameStore} from "../../store/GameStore.tsx";
import {addOrRemoveBonusSpice} from "../../const/GameUtils.tsx";
import {produce} from "immer";

export function BonusSpice(
  props: {
    locationId: number,
    top: Property.Top,
    left: Property.Left,
  }
) {
  const {gameState, setGameState} = useGameStore();
  const {sendMessage} = useWebSocket();

  const clickAction = (id: number, add: boolean) => {
    let success;
    setGameState(produce(gameState, draft => {
      success = addOrRemoveBonusSpice(draft, id, add);
    }));

    if (success) {
      sendMessage({action: SET_BONUS_SPICE, body: {
          locationId: id,
          add: add
        }})
    }
  }

  const getSpiceValue = () => {
    switch (props.locationId) {
      case 9:
        return gameState.bonusSpice.deepDesert;
      case 10:
        return gameState.bonusSpice.haggaBasin;
      case 11:
        return gameState.bonusSpice.imperialBasin;
    }
  }

  const plusIcon = (
    <ActionIcon
      onClick={() => clickAction(props.locationId, true)}
      className={"player-resource-modifier-button"}
      variant={"outline"}
      radius={"0"}>
      <img width={30} src={plus_icon} alt="Resource modifier button"/>
    </ActionIcon>
  )
  const minusIcon = (
    <ActionIcon
      onClick={() => clickAction(props.locationId, false)}
      className={"player-resource-modifier-button"}
      variant={"outline"}
      radius={"0"}>
      <img width={30} src={minus_icon} alt="Resource modifier button"/>
    </ActionIcon>
  )
  const text = (
    <Center pos={"relative"} w={50} h={50}>
      <Image w={50} src={spice_icon} alt="Resource icon"/>
      <Text
        lh={1}
        display="flex"
        style={{ alignItems: 'center' }}
        size="1.4em" className={"player-resource-modifier-text"}>
        {getSpiceValue()}
      </Text>
    </Center>
  )


  const horizontalLayout = (
    <Group
      align={"center"}
      gap={0}
      pos={"absolute"}
      top={props.top}
      left={props.left}>
      {minusIcon}
      {text}
      {plusIcon}
    </Group>
  )

  const verticalLayout = (
    <Stack
      align={"center"}
      gap={0}
      pos={"absolute"}
      top={props.top}
      left={props.left}>
      {plusIcon}
      {text}
      {minusIcon}
    </Stack>
  )
  return (
    props.locationId === 11 ? verticalLayout: horizontalLayout
  )
}