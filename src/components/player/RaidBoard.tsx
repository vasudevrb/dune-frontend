import {type PlayerModel, type RaidModel} from "../../model/PlayerModel.tsx";
import {Image, Space} from "@mantine/core";
import raid_board from "../../assets/raid_board.png";
import raid_large_repeated from "../../assets/raid_large_repeated.png";
import raid_small_repeated from "../../assets/raid_small_repeated.png";
import {useWebSocket} from "../WebSocketContext.tsx";
import {produce} from "immer";
import {repeatRaid} from "../../const/GameUtils.tsx";
import {REPEAT_RAID} from "../../const/Actions.tsx";
import {useGameStore} from "../../store/GameStore.tsx";
import type {Property} from "csstype";

export function RaidBoard(props: {
  width?: Property.Width,
  player: PlayerModel;
  nonInteractive?: boolean;
}) {

  const {gameState, setGameState} = useGameStore();
  const {sendMessage} = useWebSocket();

  const raidClickAction = (raid: RaidModel) => {
    if (props.nonInteractive) return;

    const alreadyRepeated = raid.repeated;
    setGameState(produce(gameState, draft => {
      repeatRaid(draft, raid, !alreadyRepeated);
    }))
    sendMessage({
      action: REPEAT_RAID,
      body: {
        url: raid.url,
        repeated: !alreadyRepeated,
      }
    })
  }

  const raidOffsets = [
    {left: "2.5%", top: "2.5%"},
    {left: "17%", top: "46%"},
    {left: "35.7%", top: "2.5%"},
    {left: "54%", top: "46%"},
    {left: "69%", top: "2.5%"},
  ]

  const drawRaidToken = (id: number, raid: RaidModel) => {
    const getRepeatedRaidImage = (type: string) => {
      return type === "small" ? raid_small_repeated : raid_large_repeated;
    }

    return (
      <Image
        src={raid.repeated ? getRepeatedRaidImage(raid.type) : raid.url}
        pos={"absolute"}
        top={raidOffsets[id].top}
        left={raidOffsets[id].left}
        onClick={() => raidClickAction(raid)}
        w={"75px"}
      />
    )
  }

  return (
    <div style={{
      width: props.width ? props.width : "100%",
      position: "relative", display: 'flex', gap: 8
    }}>

      {
        props.player.raids.map((raid, index) => drawRaidToken(index, raid))
      }

      <Image
        src={raid_board}
        w={"100%"}
      />
      <div><Space w={"290px"}/></div>
    </div>
  )
}