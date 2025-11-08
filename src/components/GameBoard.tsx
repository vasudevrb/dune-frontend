import '../css/GameBoard.css'
import {Box, Image, ScrollArea, Stack} from "@mantine/core";
import loc_deep_desert from '../assets/locations/deep_desert.png';
import {FactionType} from "../model/PlayerModel.tsx";
import {AgentLocation} from "./AgentLocation.tsx";
import type {GameModel} from "../model/GameModel.tsx";
import {SpyLocation} from "./SpyLocation.tsx";
import {Faction} from "./Faction.tsx";
import {CombatArea} from "./CombatArea.tsx";

export function GameBoard(props: { game: GameModel }) {

  return (
    <Box
      w={"100%"}
      h={"100%"}
      mb={"50px"}
      style={{ flexGrow: 1 }}
      className="gameBoard">

      <ScrollArea
        className={"scroll-area-faction-space"}
        w={"335px"}
        h={"100%"}
        offsetScrollbars={false}
        type={"never"}
        scrollbars="y">
        <Stack gap="0" style={{minHeight: '100%'}}>
          <Faction factionType={FactionType.Emperor} players={props.game.players} />
          <Faction factionType={FactionType.SpacingGuild} players={props.game.players}/>
          <Faction factionType={FactionType.BeneGesserit} players={props.game.players}/>
          <Faction factionType={FactionType.Fremen} players={props.game.players}/>
        </Stack>
      </ScrollArea>

      <Box
        pos={"absolute"}
        style={{
          top: "30%",
          left: "35%"
        }}>
        <AgentLocation
          w={"85%"}
          h={"63%"}
          location={props.game.locations[0]}
          style={{
            position: "absolute",
            top: "28%",
            left: "10%",
          }}
          agentsContainerStyle={{
            top: "22%",
            left: "18%",
          }}/>
        <SpyLocation
          w={"30%"}
          h={"20%"}
          location={props.game.locations[0]}
          style={{
            position: "absolute",
            top: "3%",
            left: "58%",
          }}
          agentsContainerStyle={{
            top: "-10%",
            left: "20%",
          }}/>

        <Image
          maw={"250px"}
          fit={"contain"}
          src={loc_deep_desert}
          alt="Location"/>
      </Box>

      <CombatArea game={props.game}/>
    </Box>
  )
}