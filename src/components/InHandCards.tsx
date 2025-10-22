import '../css/InHandCards.css'
import {Card} from "./Card.tsx";
import {Box, Divider, Group, ScrollArea} from "@mantine/core";

export function InHandCards() {
  return (
    <div className={"in-hand-cards-row"} style={{ display: 'flex', gap: 16, padding: "16px" }}>
      <Box className={"photo-stack in-hand-card"}>
        <Card className="reserve-row" src="https://api.dunecardshub.com/uploads/images/68.png"/>
        <Card className="reserve-row" src="https://api.dunecardshub.com/uploads/images/68.png"/>
        <Card className="reserve-row" src="https://api.dunecardshub.com/uploads/images/68.png"/>
        <Card className="reserve-row" src="https://api.dunecardshub.com/uploads/images/68.png"/>
      </Box>

      <Divider orientation="vertical" color={"gray"} />

      <div style={{
        display: 'flex',
        gap: '16px',
      }}>
        <Group justify="start" align="center" style={{ overflow: 'visible' }}>
          <Card className={"in-hand-card"} src="https://api.dunecardshub.com/uploads/images/68.png"/>
          <Card className={"in-hand-card"} src="https://api.dunecardshub.com/uploads/images/68.png" ml={"-15%"} />
          <Card className={"in-hand-card"} src="https://api.dunecardshub.com/uploads/images/68.png" ml={"-15%"} />
          <Card className={"in-hand-card"} src="https://api.dunecardshub.com/uploads/images/68.png" ml={"-15%"} />
        </Group>
      </div>

    </div>

  )
}