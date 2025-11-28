import '../css/Players.css'
import {ScrollArea, Stack} from "@mantine/core";
import {Player} from "./Player.tsx";
import type {PlayerModel} from "../model/PlayerModel.tsx";
import type {GameModel} from "../model/GameModel.tsx";

export function Players(props: { game: GameModel }) {
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
      </Stack>
    </ScrollArea>
  )
}