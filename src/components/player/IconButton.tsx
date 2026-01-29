import {ActionIcon, Image, type StyleProp} from "@mantine/core";
import {useRef} from "react";
import type {Property} from "csstype";

export function IconButton(props: {
  icon: string;
  h?: StyleProp<Property.Height>
  onClick?: () => void;
  onHover?: () => void;
}) {
  const timerRef = useRef<number>(null);
  const firedRef = useRef(false);

  const handleMouseEnter = () => {
    if (firedRef.current) return;

    timerRef.current = setTimeout(() => {
      firedRef.current = true;
      props.onHover && props.onHover();
    }, 1000);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      firedRef.current = false;
    }
  };

  return (
    <ActionIcon
      onClick={props.onClick}
      onMouseEnter={props.onHover ? handleMouseEnter : undefined}
      onMouseLeave={props.onHover ? handleMouseLeave : undefined}
      w={"auto"}
      h={props.h ? props.h : 50}
      className={"player-resource-modifier-button"}
      variant={"none"}
      radius={"0"}>
      <Image fit="contain" h={props.h ? props.h : 50} src={props.icon}/>
    </ActionIcon>
  )
}