import '../css/ImperiumRow.css'
import {ScrollArea, Divider, Box} from "@mantine/core";
import {Card} from "./Card.tsx";

export function ImperiumRow() {
  return (
    <ScrollArea className="scrollarea-imperium-row" w={"100%"} offsetScrollbars={false} type={"never"} scrollbars="x">
      <div style={{ display: 'flex', gap: 16, padding: 16 }}>
        <Card src="https://api.dunecardshub.com/uploads/images/68.png"/>
        <Card src="https://api.dunecardshub.com/uploads/images/68.png"/>
        <Card src="https://api.dunecardshub.com/uploads/images/68.png"/>
        <Card src="https://api.dunecardshub.com/uploads/images/68.png"/>
        <Card src="https://api.dunecardshub.com/uploads/images/68.png"/>

        <Divider orientation="vertical" color={"gray"} />

        <Box className={"photo-stack"} mr={"16"}>
          <Card className="reserve-row" src="https://api.dunecardshub.com/uploads/images/68.png"/>
          <Card className="reserve-row" src="https://api.dunecardshub.com/uploads/images/68.png"/>
          <Card className="reserve-row" src="https://api.dunecardshub.com/uploads/images/68.png"/>
          <Card className="reserve-row" src="https://api.dunecardshub.com/uploads/images/68.png"/>
        </Box>

        <Box className={"photo-stack"}>
          <Card className="reserve-row" src="https://api.dunecardshub.com/uploads/images/68.png"/>
          <Card className="reserve-row" src="https://api.dunecardshub.com/uploads/images/68.png"/>
          <Card className="reserve-row" src="https://api.dunecardshub.com/uploads/images/68.png"/>
          <Card className="reserve-row" src="https://api.dunecardshub.com/uploads/images/68.png"/>
        </Box>
      </div>
    </ScrollArea>
  )
}