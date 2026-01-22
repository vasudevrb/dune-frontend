import '../css/Swordmaster.css';
import {Box, Button, Group, type MantineStyleProp, Popover} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import type {ReactNode} from "react";

export function PopoverContainer(props: {
  label: string,
  onclick: () => void,
  children: ReactNode,
  style: MantineStyleProp
}) {

  const [opened, {close, toggle}] = useDisclosure(false);

  const clickAction = () => {
    props.onclick();
    close();
  }

  return (
    <Box style={props.style}>
      <Popover
        opened={opened}
        onChange={toggle}
        width={200}
        position="bottom"
        clickOutsideEvents={['mouseup', 'touchend']}>
        <Popover.Target>
          <Box onClick={toggle}>
            {props.children}
          </Box>
        </Popover.Target>
        <Popover.Dropdown className={"popover-dialog"}>
          <Group justify={"center"}>
            <Button
              onClick={clickAction}
              className={`setup-action-button-next`}
              size="xs"
              radius="0"
              variant={"filled"}>{props.label}</Button>
          </Group>
        </Popover.Dropdown>
      </Popover>
    </Box>
  )
}