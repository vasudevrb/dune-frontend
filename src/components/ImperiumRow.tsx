import '../css/ImperiumRow.css'
import {ScrollArea, Divider, Drawer, Text, Space, Stack, Group} from "@mantine/core";
import {Card, CardButtonType} from "./Card.tsx";
import {useGameStore} from "../store/GameStore.tsx";
import type {CardModel} from "../model/PlayerModel.tsx";
import {ACQUIRE_IMPERIUM_CARD, ACQUIRE_RESERVE_CARD} from "../const/Actions.tsx";
import use_card_icon from "../assets/cards/use_card.png";
import {useWebSocket} from "./WebSocketContext.tsx";
import type {GameModel} from "../model/GameModel.tsx";
import tech_tile from "../assets/tech_tile.png";

// Careful changing these values, they are used to send messages over websocket.
const ImperiumCardType = {
  IMPERIUM: "IMPERIUM",
  RESERVE: "RESERVE",
} as const;

export type ImperiumCardType = keyof typeof ImperiumCardType;

export function ImperiumRow(props: {
  game: GameModel
}) {
  const {sendMessage} = useWebSocket();
  const globalProps = useGameStore();

  if (!props.game.imperiumRow) {
    return <></>
  }

  const getSectionLabel = (cardType: ImperiumCardType) => {
    switch (cardType) {
      case ImperiumCardType.IMPERIUM: return "Imperium Row";
      case ImperiumCardType.RESERVE: return "Reserve Cards";
    }
  }

  const getButtons = (cardType: ImperiumCardType, card: CardModel) => {
    const getOnClickAction = () => {
      const action = cardType === ImperiumCardType.IMPERIUM ? ACQUIRE_IMPERIUM_CARD : ACQUIRE_RESERVE_CARD;
      return sendMessage({action: action, body: {url: card.url}})
    }
    const getButton = (label: string) => {
      return {
        type: CardButtonType.Icon,
        label: label,
        onclick: () => {getOnClickAction()}
      }
    }

    const acquireButton = getButton(use_card_icon)

    return [acquireButton]
  }

  const getCardSection = (type: ImperiumCardType, cards: CardModel[]) => {
    const sectionLabel = getSectionLabel(type);
    const cardElements = cards.map((card, index) => {
      return (
        <Card
          key={index}
          src={`${card.url}`}
          buttons={getButtons(type, card)}
        />)
    })
    return (
      <>
        <Divider orientation="vertical" mt={"50px"} mb={"50px"} color={"#cfcfcf45"}/>
        <Text className={"text-card-type"}>{sectionLabel}</Text>
        {cardElements}
      </>
    )
  }

  return (
    <Drawer
      h={"100%"}
      className="drawer-1"
      withCloseButton={false}
      position="bottom"
      opened={globalProps.imperiumRowOpened}
      onClose={() => globalProps.setImperiumRowOpened(false)}
      overlayProps={{backgroundOpacity: 0.5, blur: 4}}
      styles={{
        content: {
          height: 'auto'
        },
      }}>
      <Stack gap={0}>
        <Group gap={16} pb={48} ps={88}>
          <Card src={tech_tile}/>
          <Card src={tech_tile}/>
          <Card src={tech_tile}/>
          <Card src={tech_tile}/>
          <Card src={tech_tile}/>
        </Group>

      <Group gap={16} pb={48} ps={88}>
          <Card src={tech_tile}/>
          <Card src={tech_tile}/>
          <Card src={tech_tile}/>
          <Card src={tech_tile}/>
          <Card src={tech_tile}/>
      </Group>

        <ScrollArea
          className="scrollarea-imperium-row"
          w={"100%"}
          style={{flexShrink: 0}}
          offsetScrollbars={false}
          type={"never"}
          scrollbars="x">
          <div style={{display: 'flex', gap: 16, padding: 16}}>
            {getCardSection(ImperiumCardType.IMPERIUM, props.game.imperiumRow)}
            {getCardSection(ImperiumCardType.RESERVE, props.game.reserveRow)}
            <Space w={16}/>
          </div>
        </ScrollArea>

      </Stack>
    </Drawer>
  )
}