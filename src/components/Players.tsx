import '../css/Players.css'
import {Button, Group, Popover, ScrollArea, Stack, Text} from "@mantine/core";
import {Player} from "./Player.tsx";
import type {PlayerModel} from "../model/PlayerModel.tsx";
import type {GameModel} from "../model/GameModel.tsx";
import {useDisclosure} from "@mantine/hooks";
import {useWebSocket} from "./WebSocketContext.tsx";
import {CLEAR_ROUND} from "../const/Actions.tsx";

export function Players(props: { game: GameModel }) {
  const [opened, {close, toggle}] = useDisclosure(false);

  const {sendMessage} = useWebSocket();
  const filterPlayers = (predicate: (player: PlayerModel) => boolean) => {
    return props.game.players.filter(predicate)
  }

  const getPlayerElements = (predicate: (player: PlayerModel) => boolean) => {
    return filterPlayers(predicate)
      .map(player => (
        <Player
          key={player.name}
          playerModel={player}
          currentPlayer={props.game.currentPlayer}
          firstPlayer={props.game.firstPlayer}
        />
      ))
  }

  const clearRound = () => {
    sendMessage({action: CLEAR_ROUND})
    close()
  }

  return (
    <ScrollArea
      className={"scroll-area-players"}
      h={"100%"}
      offsetScrollbars={false}
      type={"never"}
      scrollbars="y">
      <Stack
        gap="0"
        w={"300px"}
        style={{minHeight: '100%'}}>
        {getPlayerElements(p => !p.isThisPlayer)}
        {getPlayerElements(p => p.isThisPlayer)}

        <Popover opened={opened} onChange={toggle} width={200} position="bottom" clickOutsideEvents={['mouseup', 'touchend']}>
          <Popover.Target>
            <Button
              mb={16}
              onClick={toggle}
              className={`setup-action-button-next`}
              color={"#A08170"}
              size="md"
              radius="0"
              variant={"filled"}>CLEAR ROUND</Button>
          </Popover.Target>
          <Popover.Dropdown className={"swordmaster-popover"}>
            <Stack>
              <Text c="#cacaca" size="xs">Would you like to move to the next round?</Text>
              <Group>
                <Button
                  onClick={clearRound}
                  className={`setup-action-button-next`}
                  color={"#A08170"}
                  size="xs"
                  radius="0"
                  variant={"filled"}>Yes</Button>
              </Group>
            </Stack>
          </Popover.Dropdown>
        </Popover>

      </Stack>
    </ScrollArea>
  )
}