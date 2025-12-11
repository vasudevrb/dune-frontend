import '../css/Faction.css'
import {FactionType, type PlayerModel} from "../model/PlayerModel.tsx";
import {Group, Space, Stack} from "@mantine/core";
import faction_marker_red from '../assets/faction_marker/faction_marker_red.svg';
import faction_marker_blue from '../assets/faction_marker/faction_marker_blue.svg';
import faction_marker_green from '../assets/faction_marker/faction_marker_green.svg';
import faction_marker_gold from '../assets/faction_marker/faction_marker_gold.svg';
import {useDraggable, useDroppable} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";
import {createPortal} from "react-dom";
import type {Property} from "csstype";

function FactionInfluenceMarker(props: {
  player: PlayerModel,
  factionType: FactionType,
  influence: number
}) {
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
    id: `marker-${props.factionType}-${props.player.name}-${props.influence}`,
    data: {
      type: "faction_space",
      location: "faction",
      factionType: props.factionType,
      playerName: props.player.name
    }
  });

  const draggedStyle = transform ? {
    transform: CSS.Translate.toString(transform),
    zIndex: 10,
    transition: !isDragging ? 'transform 300ms ease' : undefined,
    width: isDragging ? '25px' : '15%',
    height: isDragging ? '25px' : '45%'
  } : undefined;

  const draggableProps = (props.player.isThisPlayer || props.player.isRival)
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

export function FactionTrack(props: {
  factionType: FactionType,
  influenceLevel: number,
  players: PlayerModel[],
}) {
  const factionTrackDroppable = useDroppable({
    id: `faction-track-${props.factionType}-${props.influenceLevel}`,
    data: {
      location: `faction`,
      type: "faction_space",
      factionType: props.factionType,
      influenceLevel: props.influenceLevel,
    }
  });

  const getInfluenceMarker = (player: PlayerModel) => {
    return (
      <FactionInfluenceMarker
        key={`${player.name}-${props.factionType}-${props.influenceLevel}`}
        player={player}
        factionType={props.factionType}
        influence={props.influenceLevel}/>
    )
  }

  return (
      <Group
        ref={factionTrackDroppable.setNodeRef}
        w={"100%"}
        h={"100%"}
        gap={"5"}
        align={"stretch"}>
        {props.players.map((player) => getInfluenceMarker(player))}
      </Group>
  )
}


export function Faction(props: {
  factionType: FactionType
  players: PlayerModel[],
  top: Property.Top,
  left: Property.Left,
}) {
  return (
    <Stack
      gap={0}
      style={{
      position: "absolute",
      top: props.top,
      left: props.left,
    }}>
      <FactionTrack
        key={`${props.factionType}-6`}
        factionType={props.factionType}
        influenceLevel={6}
        players={props.players}/>

      <Space h={20}/>

      <FactionTrack
        key={`${props.factionType}-5`}
        factionType={props.factionType}
        influenceLevel={5}
        players={props.players}/>

      <Space h={20}/>

      <FactionTrack
        key={`${props.factionType}-4`}
        factionType={props.factionType}
        influenceLevel={4}
        players={props.players}/>

      <Space h={30}/>

      <FactionTrack
        key={`${props.factionType}-3`}
        factionType={props.factionType}
        influenceLevel={3}
        players={props.players}/>

      <Space h={30}/>

      <FactionTrack
        key={`${props.factionType}-2`}
        factionType={props.factionType}
        influenceLevel={2}
        players={props.players}/>

      <Space h={30}/>

      <FactionTrack
        key={`${props.factionType}-1`}
        factionType={props.factionType}
        influenceLevel={1}
        players={props.players}/>

      <Space h={30}/>

      <FactionTrack
        key={`${props.factionType}-0`}
        factionType={props.factionType}
        influenceLevel={0}
        players={props.players}/>
    </Stack>
  )
}