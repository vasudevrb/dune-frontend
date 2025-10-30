import '../css/ImperiumRow.css'
import {ScrollArea, Divider, Box} from "@mantine/core";
import {Card} from "./Card.tsx";

export function ImperiumRow() {
  return (
    <ScrollArea
      className="scrollarea-imperium-row"
      w={"100%"}
      offsetScrollbars={false}
      type={"never"}
      scrollbars="x">
      <div style={{display: 'flex', gap: 16, padding: 16}}>
        <Card src="https://api.dunecardshub.com/uploads/images/68.png"/>
        <Card src="https://api.dunecardshub.com/uploads/images/68.png"/>
        <Card src="https://api.dunecardshub.com/uploads/images/68.png"/>
        <Card src="https://api.dunecardshub.com/uploads/images/68.png"/>
        <Card src="https://api.dunecardshub.com/uploads/images/68.png"/>

        <Divider orientation="vertical" color={"gray"}/>

        <Box className={"photo-stack"} mr={"16"}>
          <Card className="reserve-row" src="https://i.postimg.cc/90wJzHB8/Main-Deck-The-Spice-Must-Flow.jpg"/>
          <Card className="reserve-row" src="https://i.postimg.cc/90wJzHB8/Main-Deck-The-Spice-Must-Flow.jpg"/>
          <Card className="reserve-row" src="https://i.postimg.cc/90wJzHB8/Main-Deck-The-Spice-Must-Flow.jpg"/>
          <Card className="reserve-row" src="https://i.postimg.cc/90wJzHB8/Main-Deck-The-Spice-Must-Flow.jpg"/>
        </Box>

        <Box className={"photo-stack"}>
          <Card className="reserve-row" src="https://i.postimg.cc/WzqXtc7m/5423452f6a46e4fabf737020b6b234d60ad6ea60-modified-1.jpg"/>
          <Card className="reserve-row" src="https://i.postimg.cc/WzqXtc7m/5423452f6a46e4fabf737020b6b234d60ad6ea60-modified-1.jpg"/>
          <Card className="reserve-row" src="https://i.postimg.cc/WzqXtc7m/5423452f6a46e4fabf737020b6b234d60ad6ea60-modified-1.jpg"/>
          <Card className="reserve-row" src="https://i.postimg.cc/WzqXtc7m/5423452f6a46e4fabf737020b6b234d60ad6ea60-modified-1.jpg"/>
        </Box>
      </div>
    </ScrollArea>
  )
}