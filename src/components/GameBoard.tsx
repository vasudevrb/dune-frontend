import '../css/GameBoard.css'
import {Box, ScrollArea, Space, Stack} from "@mantine/core";
import board from '../assets/board.png';
import {AgentLocation} from "./AgentLocation.tsx";
import type {GameModel} from "../model/GameModel.tsx";
import {CombatArea} from "./CombatArea.tsx";
import type {Property} from "csstype";

export function GameBoard(props: { game: GameModel }) {

  const getAgentDroppable = (top: Property.Top, left: Property.Left) => {
    return (
      <AgentLocation
        w={"9.5%"}
        h={"7%"}
        bg={"#fefefe33"}
        location={props.game.locations[0]}
        style={{
          position: "absolute",
          top: `${top}`,
          left: `${left}`,
        }}/>
    )
  }

  const getBoard = () => {
    return (
      <Stack>
        <div style={{display: 'flex', gap: 8}}>
          {getAgentDroppable("8.5%", "16.5%")}
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