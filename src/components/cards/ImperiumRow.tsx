import '../../css/ImperiumRow.css'
import {ScrollArea, Divider, Drawer, Text, Space, Stack, Group} from "@mantine/core";
import {Card, CardButtonType} from "./Card.tsx";
import {useGameStore} from "../../store/GameStore.tsx";
import type {CardModel} from "../../model/PlayerModel.tsx";
import {ACQUIRE_COMMANDER_SKILL, ACQUIRE_IMPERIUM_CARD, ACQUIRE_RESERVE_CARD, ACQUIRE_TECH_TILE} from "../../const/Actions.tsx";
import use_card_icon from "../../assets/cards/use_card.png";
import {useWebSocket} from "../WebSocketContext.tsx";
import type {GameModel} from "../../model/GameModel.tsx";
import * as React from "react";

// Careful changing these values, they are used to send messages over websocket.
const SectionType = {
  IMPERIUM: "IMPERIUM",
  RESERVE: "RESERVE",
  TECH: "TECH",
  SKILL: "SKILL",
} as const;

export type SectionType = keyof typeof SectionType;

export function ImperiumRow(props: {
  game: GameModel
}) {
  const {sendMessage} = useWebSocket();
  const globalProps = useGameStore();

  if (!props.game.imperiumRow) {
    return <></>
  }

  const getSectionLabel = (cardType: SectionType) => {
    switch (cardType) {
      case SectionType.IMPERIUM: return "Imperium Row";
      case SectionType.RESERVE: return "Reserve Cards";
      case SectionType.TECH: return "Techs";
      case SectionType.SKILL: return "Sardaukar Skills";
    }
  }

  const getButtons = (cardType: SectionType, card: CardModel) => {
    const getOnClickActionType = () => {
      switch (cardType) {
        case SectionType.IMPERIUM: return ACQUIRE_IMPERIUM_CARD;
        case SectionType.RESERVE: return ACQUIRE_RESERVE_CARD;
        case SectionType.TECH: return ACQUIRE_TECH_TILE;
        case SectionType.SKILL: return ACQUIRE_COMMANDER_SKILL;
      }
    }
    const getButton = (label: string) => {
      return {
        type: CardButtonType.Icon,
        label: label,
        onclick: () => {sendMessage({action: getOnClickActionType(), body: {url: card.url}})}
      }
    }

    const acquireButton = getButton(use_card_icon)

    return [acquireButton]
  }

  const getCardSection = (type: SectionType, cards: CardModel[], width?: string, height?: string, fit?: React.CSSProperties['objectFit']) => {
    const sectionLabel = getSectionLabel(type);
    const cardElements = cards.map((card, index) => {
      return (
        <Card
          key={index}
          src={`${card.url}`}
          w={width}
          h={height}
          fit={fit}
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
      overlayProps={{backgroundOpacity: 0.7}}
      styles={{
        content: {
          height: 'auto'
        },
      }}>
      <Stack gap={0}>

        <Group ps={16} pb={50}>
          {getCardSection(SectionType.TECH, props.game.currentTechs, "195", "130", "contain")}
        </Group>

        <Group ps={16} pb={50}>
          {getCardSection(SectionType.SKILL, props.game.currentSkills, "150", "150", "contain")}
        </Group>

        <ScrollArea
          className="scrollarea-imperium-row"
          w={"100%"}
          style={{flexShrink: 0}}
          offsetScrollbars={false}
          type={"never"}
          scrollbars="x">
          <div style={{display: 'flex', gap: 16, padding: 16}}>
            {getCardSection(SectionType.IMPERIUM, props.game.imperiumRow)}
            {getCardSection(SectionType.RESERVE, props.game.reserveRow)}
            <Space w={16}/>
          </div>
        </ScrollArea>

      </Stack>
    </Drawer>
  )
}