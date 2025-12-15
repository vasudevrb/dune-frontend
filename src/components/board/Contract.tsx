import {Button, Popover, Box, Group, Image} from "@mantine/core";
import type {Property} from "csstype";
import {useWebSocket} from "../WebSocketContext.tsx";
import {ACQUIRE_CONTRACT} from "../../const/Actions.tsx";
import {useGameStore} from "../../store/GameStore.tsx";
import {acquireContract} from "../../const/GameUtils.tsx";
import {produce} from "immer";
import {useDisclosure} from "@mantine/hooks";

export function Contract(
  props: {
    url: string,
    left: Property.Left,
    top: Property.Top
  }) {

  const [opened, {close, toggle}] = useDisclosure(false);

  const {gameState, setGameState} = useGameStore();
  const {sendMessage} = useWebSocket();

  const acquireContractAction = () => {
    setGameState(produce(gameState, draft => {
      acquireContract(draft, props.url)
    }));

    sendMessage({action: ACQUIRE_CONTRACT, body: {url: props.url}});
    close();
  }

  return (
    <Box
      pos={"absolute"}
      top={props.top}
      left={props.left}
      style={{transform: `translate(-50%, -50%`}}
    >
      <Popover
        opened={opened}
        onChange={toggle}
        width={200}
        position="bottom"
        clickOutsideEvents={['mouseup', 'touchend']}>
        <Popover.Target>
          <Image
            onClick={toggle}
            w={"155px"}
            src={props.url}/>
        </Popover.Target>
        <Popover.Dropdown className={"swordmaster-popover"}>
          <Group justify={"center"}>
            <Button
              onClick={() => acquireContractAction()}
              className={`setup-action-button-next`}
              color={"#A08170"}
              size="xs"
              radius="0"
              variant={"filled"}>Acquire Contract</Button>
          </Group>
        </Popover.Dropdown>
      </Popover>
    </Box>
  )
}