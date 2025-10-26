import '../css/Players.css'
import {Box} from "@mantine/core";
import {OppositionPlayer} from "./OppositionPlayer.tsx";
import {Player} from "./Player.tsx";
import type {PlayerModel} from "../model/Player.tsx";

export function Players(props: { playerList: PlayerModel[] }) {
  return (
    <Box mt="10" h={"100%"}>
      {
        props.playerList
          .filter(player => !player.isThisPlayer)
          .map(player => (<OppositionPlayer playerModel={player}/>))
      }
      {
        props.playerList
          .filter(player => player.isThisPlayer)
          .map(player => (<Player playerModel={player}/>))
      }
    </Box>
  )
}