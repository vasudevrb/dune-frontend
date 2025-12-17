import type {PlayerModel} from "../../model/PlayerModel.tsx";
import {Stack, Text} from "@mantine/core";

export function CardStats(props: {
  playerModel: PlayerModel;
}) {
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