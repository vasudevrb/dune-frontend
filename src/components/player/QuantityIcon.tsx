import {Center, Text} from "@mantine/core";

export function QuantityIcon(props: {
  icon: string,
  text?: number,
  size?: number,
  textSize?: string
}) {
  return (
    <Center
      pos={"relative"}
      w={props.size ? props.size : 50}
      h={props.size ? props.size : 50}>
      <img
        width={props.size ? props.size : 50}
        src={props.icon}
        alt="Resource icon"/>
      <Text
        size={props.textSize ? props.textSize : "1.4em"}
        className={"player-resource-modifier-text"}>
        {props.text}
      </Text>
    </Center>
  )
}