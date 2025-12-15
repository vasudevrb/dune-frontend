import {Center, Text} from "@mantine/core";

export function QuantityIcon(props: {
  icon: string,
  text?: number,
  size?: number
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
        size="1.4em"
        className={"player-resource-modifier-text"}>
        {props.text}
      </Text>
    </Center>
  )
}