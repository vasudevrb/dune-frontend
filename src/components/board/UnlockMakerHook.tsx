import '../../css/Swordmaster.css';
import {Button, Popover, Box, Group} from "@mantine/core";
import type {Property} from "csstype";
import {useWebSocket} from "../WebSocketContext.tsx";
import {UNLOCK_MAKER_HOOK} from "../../const/Actions.tsx";
import {useGameStore} from "../../store/GameStore.tsx";
import {assertExists} from "../../const/GameUtils.tsx";
import {produce} from "immer";
import {useDisclosure} from "@mantine/hooks";

export function UnlockMakerHook(
  props: { left: Property.Left, top: Property.Top },
) {

  const [opened, {close, toggle}] = useDisclosure(false);

  const {gameState, setGameState} = useGameStore();
  const {sendMessage} = useWebSocket();

  const unlockMakerHook = () => {
    setGameState(produce(gameState, draft => {
      const thisPlayer = assertExists(
        draft.players.find(p => p.isThisPlayer),
        "This player not found"
      )
      thisPlayer.makerHookUnlocked = true;
    }));

    sendMessage({action: UNLOCK_MAKER_HOOK});
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
          <Box w={50} h={80} onClick={toggle}/>
        </Popover.Target>
        <Popover.Dropdown className={"popover-dialog"}>
          <Group justify={"center"}>
            <Button
              onClick={unlockMakerHook}
              className={`setup-action-button-next`}
              size="xs"
              radius="0"
              variant={"filled"}>Unlock Maker Hook</Button>
          </Group>
        </Popover.Dropdown>
      </Popover>
    </Box>
  )
}