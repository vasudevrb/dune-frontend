import '../../css/Setup2.css'
import type {PlayerModel} from "../../model/PlayerModel.tsx";
import {useGameStore} from "../../store/GameStore.tsx";
import {Box, Divider, Group, Space, Stack, Text} from "@mantine/core";
import {useState} from "react";
import {CreateOrJoinGame} from "./CreateOrJoinGame.tsx";
import {SelectCharacter} from "./SelectCharacter.tsx";

export function Setup2(props: {
  gameStartHandler: (players: PlayerModel[]) => void
}) {
  const globalProps = useGameStore();
  const [step, setStep] = useState(0);

  const getStepper = () => {
    return (
      <Stack
        w={"20%"}
        h={"100%"}
        align={"start"}>
        <Space h={"30%"}/>
        <Text className={"text-setup-step-name"}>1. CREATE / JOIN</Text>
        <Text className={"text-setup-step-name"}>2. SELECT CHARACTER</Text>
        <Text className={"text-setup-step-name"}>3. START GAME</Text>
        <Space h={"30%"}/>
      </Stack>
    )
  }

  return (
    <Group
      w={"100%"}
      h={"100%"}
      gap={0}>
      {getStepper()}
      <Divider h={"100%"} orientation={"vertical"} color={"#fafafa32"}/>

      {(step === 0) && <CreateOrJoinGame stepper={() => setStep(prev => prev + 1)}/>}
      {step === 1 && <SelectCharacter stepper={() => setStep(prev => prev + 1)}/>}

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