import type {PlayerModel} from "../../model/PlayerModel.tsx";
import {Image} from "@mantine/core";
import raid_board from "../../assets/raid_board.png";

export function RaidBoard(props: {
  player: PlayerModel;
  nonInteractive?: boolean;
}) {

  return (
    <Image
      src={raid_board}
      w={"100%"}
    />
  )
}