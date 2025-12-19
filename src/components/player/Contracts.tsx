import {Divider, Image, ScrollArea} from "@mantine/core";
import type {ContractModel, PlayerModel} from "../../model/PlayerModel.tsx";
import {useGameStore} from "../../store/GameStore.tsx";
import {useWebSocket} from "../WebSocketContext.tsx";
import {produce} from "immer";
import {setContractCompleted} from "../../const/GameUtils.tsx";
import {COMPLETE_CONTRACT} from "../../const/Actions.tsx";
import contract_completed from '../../assets/contract_completed.png';

export function Contracts(props: {
  player: PlayerModel;
}) {

  const {gameState, setGameState} = useGameStore();
  const {sendMessage} = useWebSocket();

  const contractClickAction = (contract: ContractModel) => {
    const alreadyCompleted = contract.completed;
    setGameState(produce(gameState, draft => {
      setContractCompleted(draft, contract, !alreadyCompleted);
    }))
    sendMessage({
      action: COMPLETE_CONTRACT,
      body: {
        url: contract.url,
        completed: !alreadyCompleted,
      }
    })
  }

  const getContracts = () => {
    return props.player.contracts
      .map(c => {
      return (
        <Image
          w={120}
          onClick={() => contractClickAction(c)}
          src={c.completed ? contract_completed : c.url}/>
      )
    })
  }

  return (
    <>
      <Divider orientation={"horizontal"} m={"md"} color={"#cacaca44"}/>
      <ScrollArea
        w={"100%"}
        className={"fadeScroll"}
        scrollbars={"x"}
        offsetScrollbars={false}
        type={"never"}>
        <div style={{display: 'flex', gap: 16, alignItems: "center"}}>
          {getContracts()}
        </div>
      </ScrollArea>
    </>
  )
}
