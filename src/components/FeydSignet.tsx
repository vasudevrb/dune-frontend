import "../css/FeydSignet.css";
import { Image, Box } from "@mantine/core";
import feyd_track from '../assets/feyd_track.png';
import feyd_token from '../assets/feyd_token.svg';
import type {CharacterModel} from "../model/PlayerModel.tsx";
import {useDraggable, useDroppable} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";
import type {Property} from "csstype";

interface TokenPosition {
  top: Property.Top;
  left: Property.Left;
}

interface TokenSize {
  width: Property.Width;
  height: Property.Height;
}

function FeydTokenDroppable(
  props: {signetStatus: number}
) {

  const tokenDroppable = useDroppable({
    id: `feyd-token-droppable-${props.signetStatus}`,
    data: {
      location: "feyd-rautha",
      type: "feyd-token",
      signetValue: props.signetStatus
    }
  });

  const tokenPositions: Map<number, TokenPosition> = new Map<number, TokenPosition>([
    [0, {top: "25px", left: "4px"}],
    [101, {top: "7px", left: "35px"}],
    [102, {top: "41px", left: "35px"}],
    [201, {top: "25px", left: "115px"}],
    [301, {top: "7px", left: "147px"}],
    [302, {top: "41px", left: "152px"}],
    [303, {top: "41px", left: "190px"}],
    [401, {top: "20px", left: "235px"}],
  ])

  const tokenSizes: Map<number, TokenSize> = new Map<number, TokenSize>([
    [0, {width: "25px", height: "25px"}],
    [101, {width: "74px", height: "25px"}],
    [102, {width: "74px", height: "25px"}],
    [201, {width: "25px", height: "25px"}],
    [301, {width: "74px", height: "25px"}],
    [302, {width: "25px", height: "25px"}],
    [303, {width: "25px", height: "25px"}],
    [401, {width: "35px", height: "35px"}],
  ])

  return (
    <Box
      ref={tokenDroppable.setNodeRef}
      pos={"absolute"}
      top={tokenPositions.get(props.signetStatus)!!.top}
      left={tokenPositions.get(props.signetStatus)!!.left}
      w={tokenSizes.get(props.signetStatus)!!.width}
      h={tokenSizes.get(props.signetStatus)!!.height}/>
  )
}

function FeydToken(
  props: {character: CharacterModel}
) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: "feyd-token",
    data: {
      type: "feyd-token",
      location: "feyd-rautha"
    }
  });

  const draggedStyle = transform ? {
    transform: CSS.Translate.toString(transform),
    zIndex: 10,
  } : undefined;

  const signetStatus = props.character.additionalInfo.signetStatus;

  const tokenPositions = {
    0: {top: "25px", left: "4px"},
    101: {top: "7px", left: "60px"},
    102: {top: "41px", left: "60px"},
    201: {top: "25px", left: "115px"},
    301: {top: "7px", left: "170px"},
    302: {top: "41px", left: "152px"},
    303: {top: "41px", left: "190px"},
    401: {top: "25px", left: "240px"},
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
      w={"25px"}
      opacity={1}
      src={feyd_token}/>
  )

}

export function FeydSignet(
  props: {characterModel: CharacterModel}
) {

  const signetStatuses = [0, 101, 102, 201, 301, 302, 303, 401]

  return (
    <Box
      pos={"relative"}>
      {signetStatuses.map((s) => <FeydTokenDroppable key={s} signetStatus={s}/>)}
      <FeydToken character={props.characterModel}/>
      <Image
        m={"0"}
        w={"100%"}
        src={feyd_track}/>
    </Box>
  )
}