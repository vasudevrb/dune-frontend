import '../css/InHandCards.css'
import {Card} from "./Card.tsx";
import {Box, Divider, ScrollArea, Space} from "@mantine/core";

export function InHandCards() {
  return (
    <ScrollArea
      className={"in-hand-card in-hand-cards-row"}
      w={"100%"}
      h={"300px"}
      style={{flexShrink: 0}}
      offsetScrollbars={false}
      type={"never"}
      scrollbars="x">
    <div style={{ display: 'flex', gap: 8, padding: "16px" }}>
      <Box className={"photo-stack"} ml={8}>
        <Card className="reserve-row" src="https://api.dunecardshub.com/uploads/images/68.png"/>
        <Card className="reserve-row" src="https://api.dunecardshub.com/uploads/images/68.png"/>
        <Card className="reserve-row" src="https://api.dunecardshub.com/uploads/images/68.png"/>
        <Card className="reserve-row" src="https://api.dunecardshub.com/uploads/images/68.png"/>
      </Box>

      <Divider orientation="vertical" color={"gray"} />

      <div style={{ display: 'flex', gap: 8, paddingRight: 8 }}>
        <Card src="https://api.dunecardshub.com/uploads/images/33.png"/>
        <Card src="https://api.dunecardshub.com/uploads/images/30.png" />
        <Card src="https://api.dunecardshub.com/uploads/images/48.png" />
        <Card src="https://api.dunecardshub.com/uploads/images/63.png" />
        <Card src="https://api.dunecardshub.com/uploads/images/35.png" />
        <Card src="https://api.dunecardshub.com/uploads/images/47.png" />
        <Card src="https://api.dunecardshub.com/uploads/images/47.png" />
        <Card src="https://api.dunecardshub.com/uploads/images/47.png" />
        <Card src="https://api.dunecardshub.com/uploads/images/47.png" />
        <Card src="https://api.dunecardshub.com/uploads/images/47.png" />
        <Space w={"15%"}/>
      </div>
    </div>
    </ScrollArea>
  )
}