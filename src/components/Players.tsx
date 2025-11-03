import '../css/Players.css'
import {ScrollArea, Stack} from "@mantine/core";
import {Player} from "./Player.tsx";
import type {PlayerModel} from "../model/Player.tsx";

export function Players(props: { playerList: PlayerModel[] }) {
  const filterPlayers = (predicate: (player: PlayerModel) => boolean) => {
    return props.playerList.filter(predicate)
  }

  const getPlayerElements = (predicate: (player: PlayerModel) => boolean) => {
    return filterPlayers(predicate)
      .map(player => (
        <Player key={player.name} playerModel={player}/>
      ))
  }

  return (
    <ScrollArea h={"100%"} style={{ flex: 1 }} offsetScrollbars={false} type={"never"} scrollbars="y">
      <Stack gap="0" style={{ minHeight: '100%' }}>
      {getPlayerElements(p => !p.isThisPlayer)}
      {getPlayerElements(p => p.isThisPlayer)}
      </Stack>
    </ScrollArea>
  )
}