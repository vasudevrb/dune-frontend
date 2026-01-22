import {ActionIcon, Image} from "@mantine/core";
import {useDebouncedCallback} from "use-debounce";
import {useState} from "react";

export function DebouncedButton(props: {
  onclick: (numClicks: number) => void,
  icon: string
}) {
  const [, setClickCount] = useState(0);

  const debouncedCall = useDebouncedCallback((quantity: number) => {
    props.onclick(quantity)
    setClickCount(0)
  }, 200)

  const handleClick = () =>  {
    setClickCount((prev) => {
      const next = prev + 1;
      debouncedCall(next);
      return next;
    })
  };

  return (
    <ActionIcon
      onClick={handleClick}
      className={"player-resource-modifier-button"}
      variant={"outline"}
      radius={"0"}>
      <Image w={30} src={props.icon}/>
    </ActionIcon>

  )
}