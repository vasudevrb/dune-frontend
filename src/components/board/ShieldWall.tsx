import '../../css/Swordmaster.css';
import {Button, Popover, Image, Box, Group} from "@mantine/core";
import type {Property} from "csstype";
import {useWebSocket} from "../WebSocketContext.tsx";
import {BREAK_SHIELD_WALL} from "../../const/Actions.tsx";
import {useGameStore} from "../../store/GameStore.tsx";
import {produce} from "immer";
import {useDisclosure} from "@mantine/hooks";
import shield_wall from "../../assets/combat/shield_wall.png";

export function ShieldWall(
  props: { left: Property.Left, top: Property.Top },
) {

  const [opened, {close, toggle}] = useDisclosure(false);

  const {gameState, setGameState} = useGameStore();
  const {sendMessage} = useWebSocket();

  const destroyShieldWall = () => {
    setGameState(produce(gameState, draft => {
      draft.shieldWallBroken = true
    }));

    sendMessage({action: BREAK_SHIELD_WALL});
    close();
  }

  return (
    <Box
      pos={"absolute"}
      top={props.top}
      left={props.left}
      style={{transform: `translate(-50%, -50%`}}
    >
      <Popover opened={opened} onChange={toggle} width={200} position="bottom" clickOutsideEvents={['mouseup', 'touchend']}>
        <Popover.Target>
          <Image w={100} src={shield_wall} onClick={toggle}/>
        </Popover.Target>
        <Popover.Dropdown className={"swordmaster-popover"}>
          <Group justify={"center"}>
            <Button
              onClick={destroyShieldWall}
              className={`setup-action-button-next`}
              size="xs"
              radius="0"
              variant={"filled"}>Break Shield Wall</Button>
          </Group>
        </Popover.Dropdown>
      </Popover>
    </Box>
  )
}