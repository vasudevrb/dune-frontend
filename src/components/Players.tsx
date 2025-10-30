import '../css/Players.css'
import {ScrollArea} from "@mantine/core";
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
    <ScrollArea h={"100%"} offsetScrollbars={false} type={"never"} scrollbars="y">
      {getPlayerElements(p => !p.isThisPlayer)}
      {getPlayerElements(p => p.isThisPlayer)}
    </ScrollArea>
  )
}