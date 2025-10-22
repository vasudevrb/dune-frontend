import '../css/InHandCards.css'
import {Card} from "./Card.tsx";
import {Box, Divider, Group, ScrollArea} from "@mantine/core";

export function InHandCards() {
  return (
    <ScrollArea className={"in-hand-card in-hand-cards-row"} w={"100%"} offsetScrollbars={false} type={"never"} scrollbars="x">
    <div style={{ display: 'flex', gap: 16, padding: "16px" }}>
      <Box className={"photo-stack"}>
        <Card className="reserve-row" src="https://api.dunecardshub.com/uploads/images/68.png"/>
        <Card className="reserve-row" src="https://api.dunecardshub.com/uploads/images/68.png"/>
        <Card className="reserve-row" src="https://api.dunecardshub.com/uploads/images/68.png"/>
        <Card className="reserve-row" src="https://api.dunecardshub.com/uploads/images/68.png"/>
      </Box>

      <Divider orientation="vertical" color={"gray"} />

      <div style={{ display: 'flex', gap: 16 }}>
        <Card src="https://api.dunecardshub.com/uploads/images/68.png"/>
        <Card src="https://api.dunecardshub.com/uploads/images/68.png" />
        <Card src="https://api.dunecardshub.com/uploads/images/68.png" />
        <Card src="https://api.dunecardshub.com/uploads/images/68.png" />
      </div>
    </div>
    </ScrollArea>
  )
}