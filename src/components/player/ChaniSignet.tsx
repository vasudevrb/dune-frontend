import "../../css/FeydSignet.css";
import { Image, Box } from "@mantine/core";
import chani_track from '../../assets/chani_track.png';
import feyd_token from '../../assets/feyd_token.svg';
import type {CharacterModel} from "../../model/PlayerModel.tsx";
import {useDraggable, useDroppable} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";
import type {Property} from "csstype";

interface TokenPosition {
  top: Property.Top;
  left: Property.Left;
}

function ChaniTokenDroppable(
  props: {signetStatus: number}
) {

  const tokenDroppable = useDroppable({
    id: `chani-token-droppable-${props.signetStatus}`,
    data: {
      location: "chani",
      type: "chani",
      signetValue: props.signetStatus
    }
  });

  const tokenPositions: Map<number, TokenPosition> = new Map<number, TokenPosition>([
    [0, {top: "4px", left: "27px"}],
    [1, {top: "4px", left: "54px"}],
    [2, {top: "4px", left: "81px"}],
    [3, {top: "4px", left: "108px"}],
    [4, {top: "4px", left: "136px"}],
    [5, {top: "4px", left: "162px"}],
    [6, {top: "4px", left: "190px"}],
    [7, {top: "4px", left: "217px"}],
    [8, {top: "4px", left: "244px"}],
  ])

  return (
    <Box
      ref={tokenDroppable.setNodeRef}
      pos={"absolute"}
      top={tokenPositions.get(props.signetStatus)!!.top}
      left={tokenPositions.get(props.signetStatus)!!.left}
      w={20}
      h={20}/>
  )
}

function ChaniToken(
  props: {character: CharacterModel}
) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: "chani-token",
    data: {
      type: "chani",
      location: "chani"
    }
  });

  const draggedStyle = transform ? {
    transform: CSS.Translate.toString(transform),
    zIndex: 10,
  } : undefined;

  const signetStatus = props.character.additionalInfo.signetStatus;

  const tokenPositions = {
    0: {top: "4px", left: "27px"},
    1: {top: "4px", left: "54px"},
    2: {top: "4px", left: "81px"},
    3: {top: "4px", left: "108px"},
    4: {top: "4px", left: "136px"},
    5: {top: "4px", left: "162px"},
    6: {top: "4px", left: "190px"},
    7: {top: "4px", left: "217px"},
    8: {top: "4px", left: "244px"},
  }
  // @ts-ignore
  const tokenPos: TokenPosition = tokenPositions[signetStatus];

  return (
    <Image
      pos={"absolute"}
      ref={setNodeRef}
      style={draggedStyle}
      {...listeners}
      {...attributes}
      className={"feyd-token"}
      top={tokenPos.top}
      left={tokenPos.left}
      w={"20px"}
      opacity={1}
      src={feyd_token}/>
  )

}

export function ChaniSignet(
  props: {characterModel: CharacterModel}
) {

  const signetStatuses = [0, 1, 2, 3, 4, 5, 6, 7, 8]

  return (
    <Box
      pos={"relative"}>
      {signetStatuses.map((s) => <ChaniTokenDroppable key={s} signetStatus={s}/>)}
      <ChaniToken character={props.characterModel}/>
      <Image
        m={"0"}
        w={"100%"}
        src={chani_track}/>
    </Box>
  )
}