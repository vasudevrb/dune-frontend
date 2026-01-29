import {useMemo} from "react";
import {Box, Image} from "@mantine/core";
import {range} from "../../const/Util.tsx";
import type {Property} from "csstype";

export default function IconGrid(
  props: {
    icon: string,
    size: number,
    iconSize?: number,
    pos: Property.Position,
    top?: Property.Top,
    left?: Property.Left,
    bottom?: Property.Bottom,
    right?: Property.Right,
    anchorToCenter?: boolean,
  }
) {
  const cols = useMemo(() => {
    if (props.size === 0) return 1;
    return Math.ceil(Math.sqrt(props.size));
  }, [props.size]);

  const iconSize = props.iconSize ? props.iconSize : 22;
  return (
    <Box
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${iconSize}px)`,
        justifyContent: "center",
      }}
    >

      {
        range(1, props.size).map((_) => (<Image w={iconSize} src={props.icon}/>))
      }
    </Box>
  );
}
