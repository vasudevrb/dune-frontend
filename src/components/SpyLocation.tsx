import type {Property} from "csstype";
import {Center, Group, type MantineStyleProp, type StyleProp} from "@mantine/core";
import {useDraggable, useDroppable} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";
import spy_icon_red from "../assets/spies/spy_red.png";
import spy_icon_blue from "../assets/spies/spy_blue.png";
import spy_icon_gold from "../assets/spies/spy_gold.png";
import spy_icon_green from "../assets/spies/spy_green.png";
import {createPortal} from "react-dom";
import type {SpyLocationModel} from "../model/SpyLocationModel.tsx";

function Spy(props: {
  spyId: string;
  color: string;
  playerName: string
}) {
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
    id: `${props.spyId}`,
    data: {
      type: "spy",
      location: "boardspace"
    }
  });
  const draggedStyle = transform ? {
    transform: CSS.Translate.toString(transform),
    zIndex: 10,
    transition: !isDragging ? 'transform 300ms ease' : undefined,
  } : undefined;

  const getSpyIcon = (color: string) => {
    if (color === "RED") return spy_icon_red;
    else if (color === "BLUE") return spy_icon_blue;
    else if (color === "GOLD") return spy_icon_gold;
    else if (color === "GREEN") return spy_icon_green;
  }

  const node = (
    <img
      ref={setNodeRef}
      style={draggedStyle}
      {...listeners}
      {...attributes}
      width={25}
      src={getSpyIcon(props.color)}
      alt="Spy icon"
      className={"locations-spy-icon"}/>
  )

  return isDragging ? createPortal(node, document.body): node
}

export function SpyLocation(props: {
  spyLocation: SpyLocationModel;
  agentsContainerStyle?: { top: Property.Top, left: Property.Left };
  style?: MantineStyleProp
  w?: StyleProp<Property.Width>
  h?: StyleProp<Property.Height>
  maw?: StyleProp<Property.MaxWidth>
  mah?: StyleProp<Property.MaxHeight>
  bg?: string;
}) {
  const {setNodeRef} = useDroppable({
    id: `spy-droppable-${props.spyLocation.id}`,
    data: {
      location: "boardspace",
      type: "spy",
      id: props.spyLocation.id,
    }
  });

  return (
    <Center
      ref={setNodeRef}
      pos={"absolute"}
      w={props.w}
      h={props.h}
      maw={props.maw}
      mah={props.mah}
      bg={props.bg}
      style={props.style}>
      <Group
        className="locations-spy-icon-container"
        align="center"
        justify={"center"}
        gap={0}>
        {
          props.spyLocation.spies.map((spy) =>
            <Spy
              spyId={spy.spyId}
              color={spy.color}
              playerName={spy.playerName}
              key={spy.spyId}/>
          )
        }
      </Group>
    </Center>
  )
}
