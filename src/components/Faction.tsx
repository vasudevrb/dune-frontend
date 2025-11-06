import {FactionType, type PlayerModel} from "../model/PlayerModel.tsx";
import {Box, Group, Image} from "@mantine/core";
import fremen_image from '../assets/locations/fremen_faction.png';
import bene_gesserit_image from '../assets/locations/bene_gesserit_faction.png';
import emperor_image from '../assets/locations/emperor_faction.png';
import spacing_guild_image from '../assets/locations/spacing_guild_faction.png';
import faction_marker_red from '../assets/faction_marker/faction_marker_red.png';
import faction_marker_blue from '../assets/faction_marker/faction_marker_blue.png';
import faction_marker_green from '../assets/faction_marker/faction_marker_green.png';
import faction_marker_gold from '../assets/faction_marker/faction_marker_gold.png';
import {range} from "../const/Util.tsx";

export function Faction(props: {
  factionType: FactionType
  players: PlayerModel[]
}) {
  const getFactionBoardImage = () => {
    switch (props.factionType) {
      case FactionType.Fremen :
        return fremen_image;
      case FactionType.BeneGesserit :
        return bene_gesserit_image;
      case FactionType.Emperor :
        return emperor_image;
      case FactionType.SpacingGuild:
        return spacing_guild_image;
    }
  }

  const isFactionInfluence = (player: PlayerModel, influenceIndex: number) => {
    const playerFactions = player.factionInfluences;
    let playerInfluence = 0;
    switch (props.factionType) {
      case FactionType.Fremen :
        playerInfluence = playerFactions.Fremen;
        break;
      case FactionType.BeneGesserit :
        playerInfluence = playerFactions.BeneGesserit;
        break;
      case FactionType.Emperor :
        playerInfluence = playerFactions.Emperor;
        break;
      case FactionType.SpacingGuild:
        playerInfluence = playerFactions.SpacingGuild;
        break;
    }
    return playerInfluence === influenceIndex;
  }

  const getFactionTrack = (influence: number, bottomPosition: string) => {
    const getInfluenceMarker = (player: PlayerModel) => {
      let marker;
      switch (player.color) {
        case "RED":
          marker = faction_marker_red;
          break;
        case "BLUE":
          marker = faction_marker_blue;
          break;
        case "GREEN":
          marker = faction_marker_green;
          break;
        case "GOLD":
          marker = faction_marker_gold;
          break;
      }
      return (
        <Image
          w={"15%"}
          h={"45%"}
          src={marker}
          style={{visibility: isFactionInfluence(player, influence) ? "visible" : "hidden"}}/>
      )
    }

    return (
      <Box
        bg={"#ffffff32"}
        w={"35%"}
        h={"13%"}
        style={{
          position: "absolute",
          bottom: `${bottomPosition}`,
          left: "5%",
        }}>
        <Group
          w={"100%"}
          h={"100%"}
          mt={"10%"}
          ms={"9%"}
          gap={"7%"}
          align={"stretch"}>
          {
            props.players.map((player) => getInfluenceMarker(player))
          }
        </Group>
      </Box>
    )
  }

  const getFactionTracks = () => {
    const bottomPositions: string[] = [
      "1%",
      "16%",
      "31%",
      "46%",
      "61%",
      "73%",
      "85%",
    ]
    return range(0, 6).map(influence => getFactionTrack(influence, bottomPositions[influence]));
  }

  return (
    <Box pos={"relative"}>
      {getFactionTracks()}
      <Image
        maw={"335px"}
        fit={"contain"}
        src={getFactionBoardImage()}
        alt="Location"/>
    </Box>
  )
}