import '../css/Swordmaster.css';
import {Button, Text, Popover, Box, Stack, Group} from "@mantine/core";
import type {Property} from "csstype";
import {useWebSocket} from "./WebSocketContext.tsx";
import {UNLOCK_SWORDMASTER} from "../const/Actions.tsx";
import {useGameStore} from "../store/GameStore.tsx";
import {assertExists} from "../const/GameUtils.tsx";
import {produce} from "immer";

export function Swordmaster(
  props: {left: Property.Left, top: Property.Top},
) {

  const {gameState, setGameState} = useGameStore();
  const {sendMessage} = useWebSocket();

  const unlockSwordmaster = () => {
    setGameState(produce(gameState, draft => {
      const thisPlayer = assertExists(
        draft.players.find(p => p.isThisPlayer),
        "This player not found"
      )
      thisPlayer.swordmasterUnlocked = true;
    }));

    sendMessage({action: UNLOCK_SWORDMASTER});
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
          <Box w={50} h={80} bg={"#cacaca11"} />
        </Popover.Target>
        <Popover.Dropdown className={"swordmaster-popover"}>
          <Stack>
            <Text c="#cacaca" size="xs">Would you like to unlock your Swordmaster?</Text>
            <Group>
              <Button
                onClick={unlockSwordmaster}
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