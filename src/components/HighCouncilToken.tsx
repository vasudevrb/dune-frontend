import '../css/Swordmaster.css';
import {Button, Popover, Image, Box, Group} from "@mantine/core";
import type {Property} from "csstype";
import {useWebSocket} from "./WebSocketContext.tsx";
import {GET_HIGH_COUNCIL} from "../const/Actions.tsx";
import token_red from "../assets/council_tokens/high_council_token_red.png";
import token_blue from "../assets/council_tokens/high_council_token_blue.png"
import token_green from "../assets/council_tokens/high_council_token_green.png"
import token_gold from "../assets/council_tokens/high_council_token_gold.png"
import {useGameStore} from "../store/GameStore.tsx";
import {assertExists} from "../const/GameUtils.tsx";
import {produce} from "immer";
import {useDisclosure} from "@mantine/hooks";

export function HighCouncilToken(
  props: {
    id: number,
    left: Property.Left,
    top: Property.Top
  },
) {

  const [opened, {close, toggle}] = useDisclosure(false);

  const {gameState, setGameState} = useGameStore();
  const {sendMessage} = useWebSocket();

  const getHighCouncil = () => {
    let success;
    setGameState(produce(gameState, draft => {
      const thisPlayer = assertExists(
        draft.players.find(p => p.isThisPlayer),
        "This player not found"
      )

      if (draft.highCouncil.includes(thisPlayer.name)) {
        success = false;
      } else {
        for (let i = 0; i < draft.highCouncil.length; i++) {
          if (draft.highCouncil[i] === "") {
            draft.highCouncil[i] = thisPlayer.name;
            success = true;
            break;
          }
        }
      }

    }));

    if (success) sendMessage({action: GET_HIGH_COUNCIL});
    close();
  }

  const getIcon = () => {
    const player = gameState.players.find(p => p.name === gameState.highCouncil[props.id])
    if (player) {
      switch (player.color) {
        case "RED": return token_red;
        case "BLUE": return token_blue;
        case "GREEN": return token_green;
        case "GOLD": return token_gold;
      }
    }
    return null;
  }

  return (
    <Box
      pos={"absolute"}
      top={props.top}
      left={props.left}
      style={{transform: `translate(-50%, -50%`}}>
      <Popover opened={opened} onChange={toggle} width={200} position="bottom" clickOutsideEvents={['mouseup', 'touchend']}>
        <Popover.Target>
          <Box w={45} h={45} onClick={toggle}>
            {getIcon() && <Image h={45} src={getIcon()} />}
          </Box>
        </Popover.Target>
        <Popover.Dropdown className={"swordmaster-popover"}>
          <Group justify={"center"}>
            <Button
              onClick={getHighCouncil}
              className={`setup-action-button-next`}
              size="xs"
              radius="0"
              variant={"filled"}>Get High Council seat</Button>
          </Group>
        </Popover.Dropdown>
      </Popover>
    </Box>
  )
}