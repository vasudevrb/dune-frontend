import {Image} from "@mantine/core";
import type {MantineSpacing} from "@mantine/core";

export function Card(props: { className?: string, src: string, ml?: MantineSpacing, style?: React.CSSProperties }) {
  return (
    <Image className={props.className}
           style={props.style}
           bg={"transparent"}
           w={"auto"}
           mah={"325"}
           maw={"225"}
           ml={props.ml}
           fit={"cover"}
           radius={"lg"}
           src={props.src}
           alt="Card"/>
  )
}