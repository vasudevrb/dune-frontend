import '../css/Players.css'
import {Box} from "@mantine/core";
import {OppositionPlayer} from "./OppositionPlayer.tsx";
import {Player} from "./Player.tsx";

export function Players() {
  return (
    <Box mt="10" h={"100%"}>
      <OppositionPlayer/>
      <OppositionPlayer/>
      <OppositionPlayer/>
      <Player/>
    </Box>
  )
}