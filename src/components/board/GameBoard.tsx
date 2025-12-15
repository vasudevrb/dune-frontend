import '../../css/GameBoard.css'
import {Box, ScrollArea, Space, Stack} from "@mantine/core";
import board from '../../assets/board.jpg';
import {AgentLocation} from "./AgentLocation.tsx";
import {CombatArea} from "./CombatArea.tsx";
import type {Property} from "csstype";
import type {AgentLocationModel} from "../../model/AgentLocationModel.tsx";
import {assertExists} from "../../const/GameUtils.tsx";
import {Faction} from "./Faction.tsx";
import {FactionType} from "../../model/PlayerModel.tsx";
import type {SpyLocationModel} from "../../model/SpyLocationModel.tsx";
import {SpyLocation} from "./SpyLocation.tsx";
import {useGameStore} from "../../store/GameStore.tsx";
import {Swordmaster} from "./Swordmaster.tsx";
import {ControlFlagLocation} from "./ControlFlagLocation.tsx";
import {BonusSpice} from "./BonusSpice.tsx";
import {Contract} from "./Contract.tsx";
import {ShieldWall} from "./ShieldWall.tsx";
import {HighCouncilToken} from "./HighCouncilToken.tsx";

export function GameBoard() {

  const {gameState} = useGameStore();

  const getAgentDroppable = (
    location: AgentLocationModel,
    top: Property.Top,
    left: Property.Left
  ) => {
    return (
      <AgentLocation
        key={`agent-droppable-${location.id}`}
        w={"8%"}
        h={"6%"}
        location={location}
        style={{
          position: "absolute",
          top: `${top}`,
          left: `${left}`,
          transform: `translate(-50%, -50%)`
        }}/>
    )
  }

  const getSpyDroppable = (
    spyLocation: SpyLocationModel,
    top: Property.Top,
    left: Property.Left
  ) => {
    return (
      <SpyLocation
        key={`spy-droppable-${spyLocation.id}`}
        spyLocation={spyLocation}
        w={"5%"}
        h={"2.5%"}
        style={{
          position: "absolute",
          top: `${top}`,
          left: `${left}`,
        }}
      />
    )
  }

  const getAgentDroppables = () => {
    const droppableOffsets = [
      {id: 1, top: "9.9%", left: "17.3%"},
      {id: 2, top: "20%", left: "17.3%"},
      {id: 3, top: "34.4%", left: "17.3%"},
      {id: 4, top: "44.5%", left: "17.3%"},
      {id: 5, top: "59%", left: "17.3%"},
      {id: 6, top: "69%", left: "17.3%"},
      {id: 7, top: "83.5%", left: "17.3%"},
      {id: 8, top: "93.8%", left: "17.3%"},
      {id: 9, top: "60.2%", left: "35.7%"},
      {id: 10, top: "53%", left: "54.1%"},
      {id: 11, top: "48%", left: "78.3%"},
      {id: 12, top: "49%", left: "33.6%"},
      {id: 13, top: "36.7%", left: "43.4%"},
      {id: 14, top: "34.5%", left: "64.9%"},
      {id: 15, top: "31.6%", left: "80.8%"},
      {id: 16, top: "6%", left: "34.6%"},
      {id: 17, top: "6%", left: "69.5%"},
      {id: 18, top: "16.2%", left: "34.7%"},
      {id: 19, top: "16%", left: "55%"},
      {id: 20, top: "16%", left: "69.4%"},
      {id: 21, top: "7.3%", left: "88.8%"},
      {id: 22, top: "16%", left: "88.8%"},
    ];
    const locations = gameState.locations;

    return droppableOffsets.map((offset) => {
      const location = assertExists(
        locations.find(l => l.id === offset.id),
        `Location with id: ${offset.id} not found `
      )
      return getAgentDroppable(location, offset.top, offset.left);
    })
  }

  const getSpyDroppables = () => {
    const droppableOffsets = [
      {id: 1, top: "13.7%", left: "22.5%"},
      {id: 2, top: "38.3%", left: "22.5%"},
      {id: 3, top: "62.7%", left: "22.5%"},
      {id: 4, top: "87.3%", left: "22.5%"},
      {id: 5, top: "53.8%", left: "41%"},
      {id: 6, top: "46.5%", left: "59.5%"},
      {id: 7, top: "41.8%", left: "83.9%"},
      {id: 8, top: "41.6%", left: "35.8%"},
      {id: 9, top: "30.1%", left: "52.4%"},
      {id: 10, top: "25.6%", left: "72.8%"},
      {id: 11, top: "10.8%", left: "44.8%"},
      {id: 12, top: "9.7%", left: "75.5%"},
      {id: 13, top: "10.3%", left: "93.5%"},
    ];
    const spyLocations = gameState.spyLocations;

    return droppableOffsets.map((offset) => {
      const spyLocation = assertExists(
        spyLocations.find(sl => sl.id === offset.id),
        `Location with id: ${offset.id} not found `
      )
      return getSpyDroppable(spyLocation, offset.top, offset.left);
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
          {getSpyDroppables()}
          <Faction
            factionType={FactionType.Emperor}
            players={gameState.players}
            top={"2.2%"}
            left={"3.8%"}/>

          <Faction
            factionType={FactionType.SpacingGuild}
            players={gameState.players}
            top={"26.7%"}
            left={"3.8%"}/>

          <Faction
            factionType={FactionType.BeneGesserit}
            players={gameState.players}
            top={"51.2%"}
            left={"3.8%"}/>

          <Faction
            factionType={FactionType.Fremen}
            players={gameState.players}
            top={"75.8%"}
            left={"3.8%"}/>

          <CombatArea/>

          <Swordmaster left={"60.8%"} top={"16.3%"} />

          <ControlFlagLocation
            location={gameState.locations.find(l => l.id === 11)!!}
            w={"55px"}
            h={"60px"}
            style={{top: "53%", left: "76.2%", transform: "translate(-50%, -50%)"}}
          />

          <ControlFlagLocation
            location={gameState.locations.find(l => l.id === 14)!!}
            w={"55px"}
            h={"60px"}
            style={{top: "39.6%", left: "62.8%", transform: "translate(-50%, -50%)"}}
          />

          <ControlFlagLocation
            location={gameState.locations.find(l => l.id === 15)!!}
            w={"55px"}
            h={"60px"}
            style={{top: "36.7%", left: "78.8%", transform: "translate(-50%, -50%)"}}
          />

          <BonusSpice locationId={9} top={"60.2%"} left={"40.1%"}/>
          <BonusSpice locationId={10} top={"53%"} left={"58.6%"}/>
          <BonusSpice locationId={11} top={"44.7%"} left={"86.4%"}/>

          <HighCouncilToken id={0} left={"42.2%"} top={"5.3%"}/>
          <HighCouncilToken id={1} left={"46%"} top={"5.3%"}/>
          <HighCouncilToken id={2} left={"49.8%"} top={"5.3%"}/>
          <HighCouncilToken id={3} left={"53.6%"} top={"5.3%"}/>

          {!gameState.shieldWallBroken && <ShieldWall top={"45.7%"} left={"67.6%"}/>}

          {gameState.currentContracts.length > 0 && <Contract url={gameState.currentContracts[0]} top={"25%"} left={"34.5%"}/>}
          {gameState.currentContracts.length > 1 && <Contract url={gameState.currentContracts[1]} top={"25%"} left={"45.5%"}/>}

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
    </Box>
  )
}