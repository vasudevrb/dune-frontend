import '../css/GameBoard.css'
import {Box, ScrollArea, Space, Stack} from "@mantine/core";
import board from '../assets/board.png';
import {AgentLocation} from "./AgentLocation.tsx";
import type {GameModel} from "../model/GameModel.tsx";
import {CombatArea} from "./CombatArea.tsx";
import type {Property} from "csstype";
import type {AgentLocationModel} from "../model/AgentLocationModel.tsx";
import {assertExists} from "../const/GameUtils.tsx";
import {Faction} from "./Faction.tsx";
import {FactionType} from "../model/PlayerModel.tsx";

export function GameBoard(props: { game: GameModel }) {

  const getAgentDroppable = (
    location: AgentLocationModel,
    top: Property.Top,
    left: Property.Left
  ) => {
    return (
      <AgentLocation
        key={`agent-droppable-${location.id}`}
        w={"9.5%"}
        h={"7%"}
        location={location}
        style={{
          position: "absolute",
          top: `${top}`,
          left: `${left}`,
        }}/>
    )
  }

  const getAgentDroppables = () => {
    const droppableOffsets = [
      {id: 1, top: "6.5%", left: "12.5%"},
      {id: 2, top: "16.5%", left: "12.5%"},
      {id: 3, top: "31%", left: "12.5%"},
      {id: 4, top: "41%", left: "12.5%"},
      {id: 5, top: "55.5%", left: "12.5%"},
      {id: 6, top: "65.5%", left: "12.5%"},
      {id: 7, top: "80%", left: "12.5%"},
      {id: 8, top: "90.2%", left: "12.5%"},
      {id: 9, top: "56.8%", left: "31%"},
      {id: 10, top: "49.3%", left: "49.4%"},
      {id: 11, top: "44.5%", left: "73.5%"},
      {id: 12, top: "45.5%", left: "29%"},
      {id: 13, top: "33%", left: "38.5%"},
      {id: 14, top: "31%", left: "60%"},
      {id: 15, top: "28.5%", left: "76%"},
      {id: 16, top: "2.7%", left: "30%"},
      {id: 17, top: "2.7%", left: "64.5%"},
      {id: 18, top: "12.7%", left: "30%"},
      {id: 19, top: "12.7%", left: "50%"},
      {id: 20, top: "12.7%", left: "64.5%"},
      {id: 21, top: "4%", left: "84%"},
      {id: 22, top: "12.5%", left: "84%"},
    ];
    const locations = props.game.locations;

    return droppableOffsets.map((offset) => {
      const location = assertExists(
        locations.find(l => l.id === offset.id),
        `Location with id: ${offset.id} not found `
      )
      return getAgentDroppable(location, offset.top, offset.left);
    })
  }

  const getBoard = () => {
    return (
      <Stack>
        <div style={{
          width: 2000 * 0.75,
          height: 1998 * 0.75,
          position: "relative", display: 'flex', gap: 8}}>
          {getAgentDroppables()}

          <Faction
            factionType={FactionType.Emperor}
            players={props.game.players}
            top={"2.2%"}
            left={"3.8%"}/>

          <Faction
            factionType={FactionType.SpacingGuild}
            players={props.game.players}
            top={"26.7%"}
            left={"3.8%"}/>

          <Faction
            factionType={FactionType.BeneGesserit}
            players={props.game.players}
            top={"51.2%"}
            left={"3.8%"}/>

          <Faction
            factionType={FactionType.Fremen}
            players={props.game.players}
            top={"75.8%"}
            left={"3.8%"}/>

          <img
            src={board}
            alt="Large"
            style={{
              paddingRight: '0px',
              width: 2000 * 0.75,
              height: 1998 * 0.75,
            }}/>
          <div><Space w={"290px"}/></div>
        </div>
        <div><Space h={"60px"}/></div>
      </Stack>
    );
  }

  return (
    <Box
      w={"100%"}
      h={"100%"}
      bg={"#1f1f1f"}
      style={{flexGrow: 1}}
      className="gameBoard">

      <ScrollArea
        w={"100%"}
        h={"100%"}
        type="never"
        scrollHideDelay={0}>
        {getBoard()}
      </ScrollArea>

      <CombatArea game={props.game}/>
    </Box>
  )
}