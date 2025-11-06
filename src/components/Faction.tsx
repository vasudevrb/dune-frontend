import '../css/Faction.css'
import {FactionType, type PlayerModel} from "../model/PlayerModel.tsx";
import {Box, Group, Image} from "@mantine/core";
import fremen_image from '../assets/locations/fremen_faction.png';
import bene_gesserit_image from '../assets/locations/bene_gesserit_faction.png';
import emperor_image from '../assets/locations/emperor_faction.png';
import spacing_guild_image from '../assets/locations/spacing_guild_faction.png';
import faction_marker_red from '../assets/faction_marker/faction_marker_red.svg';
import faction_marker_blue from '../assets/faction_marker/faction_marker_blue.svg';
import faction_marker_green from '../assets/faction_marker/faction_marker_green.svg';
import faction_marker_gold from '../assets/faction_marker/faction_marker_gold.svg';
import {range} from "../const/Util.tsx";
import {useDraggable} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";
import {createPortal} from "react-dom";

function FactionInfluenceMarker(props: {
  player: PlayerModel,
  factionType: FactionType,
  influence: number
}) {
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
    id: `marker-${props.factionType}-${props.player.name}-${props.influence}`,
    data: {
      type: "faction_marker",
      location: "boardspace"
    }
  });

  console.log(JSON.stringify(props.player));

  const draggedStyle = transform ? {
    transform: CSS.Translate.toString(transform),
    zIndex: 10,
    transition: !isDragging ? 'transform 300ms ease' : undefined,
    width: isDragging ? '25px' : '15%',
    height: isDragging ? '25px' : '45%'
  } : undefined;

  const draggableProps = (props.player.isThisPlayer)
    ? {
      ref: setNodeRef,
      ...listeners,
      ...attributes,
    }
    : {
      draggable: false
    };

  let marker;
  switch (props.player.color) {
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

  const node = (
    <img
      className={"faction-influence-marker"}
      {...draggableProps}
      src={marker}
      style={{visibility: isFactionInfluence(props.player, props.influence) ? "visible" : "hidden", ...draggedStyle}}/>
  )
  return isDragging ? createPortal(node, document.body): node
}


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

  const getFactionTrack = (influence: number, bottomPosition: string) => {
    const getInfluenceMarker = (player: PlayerModel) => {
      return (
        <FactionInfluenceMarker
          key={`${player.name}-${props.factionType}-${influence}`}
          player={player}
          factionType={props.factionType}
          influence={influence}/>
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
          mt={"2%"}
          ms={"8%"}
          gap={"1%"}
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