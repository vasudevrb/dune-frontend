import {ActionIcon, Button, Group, Image, Stack} from "@mantine/core";
import type {MantineSpacing} from "@mantine/core";
import * as React from "react";

export const CardButtonType = {
  Text: "Text",
  Icon: "Icon",
} as const;

export type CardButtonType = keyof typeof CardButtonType;

interface CardButton {
  type: CardButtonType,
  label: string,
  onclick: () => void,
}

export function Card(props: {
  className?: string,
  src: string | undefined,
  ml?: MantineSpacing,
  style?: React.CSSProperties,
  buttons?: CardButton[]
}) {
  const getImageButton = (button: CardButton) => {
    return (
      <ActionIcon
        key={`button:${button.type}-${button.label}`}
        onClick={button.onclick}
        w={31}
        h={50}
        className={"player-resource-modifier-button"}
        variant={"none"}
        radius={"0"}>
        <Image fit={"contain"} src={button.label} alt="Action button"/>
      </ActionIcon>
    )
  }

  const getTextButton = (button: CardButton) => {
    return (
      <Button
        onClick={button.onclick}
        className={`setup-action-button-next`}
        size="md"
        radius="0"
        variant="filled">{button.label}</Button>
    )
  }
  const getActionButtons = () => {
    if (!props.buttons) {
      return <></>;
    }
    return (
      <Group ps={"8"} mt={"8"} h={"50px"}>
        {props.buttons.map((button) => (
          button.type === CardButtonType.Text
            ? getTextButton(button)
            : getImageButton(button)
        ))}
      </Group>
    )
  }

  return (
    <Stack gap={0}>
      <Image className={props.className}
             style={props.style}
             bg={"transparent"}
             w={"auto"}
             mah={"270"}
             maw={"190"}
             ml={props.ml}
             draggable={false}
             fit={"cover"}
             radius={"md"}
             src={props.src}
             alt="Card"/>

      {getActionButtons()}

    </Stack>
  )
}