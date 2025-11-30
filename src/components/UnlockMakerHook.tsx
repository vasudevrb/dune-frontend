import '../css/Swordmaster.css';
import {Button, Text, Popover, Box, Stack, Group} from "@mantine/core";
import type {Property} from "csstype";
import {useWebSocket} from "./WebSocketContext.tsx";
import {UNLOCK_MAKER_HOOK} from "../const/Actions.tsx";
import {useGameStore} from "../store/GameStore.tsx";
import {assertExists} from "../const/GameUtils.tsx";
import {produce} from "immer";

export function UnlockMakerHook(
  props: {left: Property.Left, top: Property.Top},
) {

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
  }

  return (
    <Box
    pos={"absolute"}
    top={props.top}
    left={props.left}
    style={{transform: `translate(-50%, -50%`}}
    >
      <Popover width={200} position="bottom" clickOutsideEvents={['mouseup', 'touchend']}>
        <Popover.Target>
          <Box w={50} h={80} />
        </Popover.Target>
        <Popover.Dropdown className={"swordmaster-popover"}>
          <Stack>
            <Text c="#cacaca" size="xs">Would you like to unlock your Maker Hook?</Text>
            <Group>
              <Button
                onClick={unlockMakerHook}
                className={`setup-action-button-next`}
                color={"#A08170"}
                size="xs"
                radius="0"
                variant={"filled"}>Yes</Button>
            </Group>
          </Stack>
        </Popover.Dropdown>
      </Popover>
    </Box>
  )
}