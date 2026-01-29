import {ActionIcon, Button, Group, Image, type MantineRadius, Stack} from "@mantine/core";
import type {MantineSpacing} from "@mantine/core";
import * as React from "react";
import type {Property} from "csstype";

export const CardButtonType = {
  Text: "Text",
  Icon: "Icon",
} as const;

export type CardButtonType = keyof typeof CardButtonType;

export interface CardButton {
  type: CardButtonType,
  label: string,
  onclick: () => void,
  doubleClick?: boolean
}

export function Card(props: {
  className?: string,
  src: string | undefined,
  w?: Property.Width,
  h?: Property.Height,
  ml?: MantineSpacing,
  fit?: React.CSSProperties['objectFit'],
  style?: React.CSSProperties,
  onclick?: () => void,
  radius?: MantineRadius,
  buttons?: CardButton[]
}) {
  const getImageButton = (button: CardButton) => {
    return (
      <ActionIcon
        key={`button:${button.type}-${button.label}`}
        onClick={button.doubleClick ? undefined : button.onclick}
        onDoubleClick={button.doubleClick ? button.onclick : undefined }
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
    <Stack gap={0} justify={"flex-end"}>
      <Image className={props.className}
             style={props.style}
             bg={"transparent"}
             w={props.w ? props.w : "auto"}
             h={props.h ? props.h : "270"}
             mah={"270"}
             maw={"190"}
             ml={props.ml}
             draggable={false}
             fit={props.fit ? props.fit : "cover"}
             radius={props.radius ? props.radius: "md"}
             src={props.src}
             onClick={props.onclick}
             alt="Card"/>

      {getActionButtons()}

    </Stack>
  )
}