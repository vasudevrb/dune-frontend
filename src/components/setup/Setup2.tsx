import '../../css/Setup2.css'
import type {ObjectiveType, PlayerModel} from "../../model/PlayerModel.tsx";
import {useGameStore} from "../../store/GameStore.tsx";
import {Box, Group, Text} from "@mantine/core";
import {useEffect, useState} from "react";
import {CreateOrJoinGame} from "./CreateOrJoinGame.tsx";
import {SelectCharacter} from "./SelectCharacter.tsx";
import {Lobby} from "./Lobby.tsx";
import {useWebSocket} from "../WebSocketContext.tsx";
import {GET_CHARACTER_READY_STATES} from "../../const/Actions.tsx";

export interface LobbyPlayer {
  playerName: string;
  characterName: string;
  characterUrls: string[];
  avatarUrl: string;
  objective: ObjectiveType;
  color: string;
  status: string;
}

export function Setup2(props: {
  gameStartHandler: (players: PlayerModel[]) => void
}) {

  const globalProps = useGameStore();
  const {subscribe, unsubscribe} = useWebSocket();
  const [step, setStep] = useState(0);
  const [players, setPlayers] = useState<LobbyPlayer[]>([]);

  useEffect(() => {
    const componentName = "setup_component";
    console.log(`In ${componentName}. Subscribing to WS messages`)

    const actions = [GET_CHARACTER_READY_STATES]
    subscribe(actions, componentName, {
      onMessage: (action: string, body: any) => {
        if (action === GET_CHARACTER_READY_STATES) {
          setPlayers(body);
        }
      }
    });

    return () => {
      unsubscribe(actions, componentName)
    }
  })

  return (
    <Group
      justify={"center"}
      className={"setup-container"}
      w={"100%"}
      h={"100%"}
      gap={0}>
      {(step === 0) && <CreateOrJoinGame stepper={(toStep) => setStep(toStep)}/>}
      {step === 1 && <SelectCharacter stepper={() => setStep(prev => prev + 1)}/>}
      {step === 2 && <Lobby players={players} gameStartHandler={props.gameStartHandler}/>}

      <Box
        hidden={globalProps.gameId === ""}
        pos={"absolute"}
        bottom={0}
        right={0}>
        <Text className={"text-setup-step-name"}>Game Id: {globalProps.gameId}</Text>
      </Box>
    </Group>
  )
}