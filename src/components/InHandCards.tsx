import '../css/InHandCards.css'
import {Card} from "./Card.tsx";
import {Group} from "@mantine/core";

export function InHandCards() {
  return (
    <Group className={"in-hand-cards-row"} justify="center" align="center">
      <Card className={"in-hand-card"} src="https://api.dunecardshub.com/uploads/images/68.png" ml={"-15%"}/>
      <Card className={"in-hand-card"} src="https://api.dunecardshub.com/uploads/images/68.png" ml={"-15%"} />
      <Card className={"in-hand-card"} src="https://api.dunecardshub.com/uploads/images/68.png" ml={"-15%"} />
      <Card className={"in-hand-card"} src="https://api.dunecardshub.com/uploads/images/68.png" ml={"-15%"} />
      <Card className={"in-hand-card"} src="https://api.dunecardshub.com/uploads/images/68.png" ml={"-15%"} />
      <Card className={"in-hand-card"} src="https://api.dunecardshub.com/uploads/images/68.png" ml={"-15%"} />
    </Group>
  )
}