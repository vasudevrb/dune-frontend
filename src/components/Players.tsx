import '../css/Players.css'
import {Box} from "@mantine/core";
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
    <Box mt="10" h={"100%"}>
      {getPlayerElements(p => !p.isThisPlayer)}
      {getPlayerElements(p => p.isThisPlayer)}
    </Box>
  )
}