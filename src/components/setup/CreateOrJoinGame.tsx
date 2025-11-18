import {useWebSocket} from "../WebSocketContext.tsx";
import {type ChangeEvent, type MouseEventHandler, useState} from "react";
import {useGameStore} from "../../store/GameStore.tsx";
import {ActionIcon, Box, Button, Group, Image, Overlay, Stack, Text, TextInput} from "@mantine/core";
import {SERVER_BASE_URL, showNotification} from "../../const/Util.tsx";
import createGameImage from "../../assets/create_game_bg.png";
import joinGameImage from "../../assets/join_game_bg.png";
import {RESUME_GAME} from "../../const/Actions.tsx";

export function CreateOrJoinGame(props: {
  stepper: (toStep: number) => void
}) {
  const baseUrl = SERVER_BASE_URL;
  const {sendMessage} = useWebSocket();
  const [isHost, setIsHost] = useState<boolean>(true);
  const globalProps = useGameStore();

  const getGameId = async () => {
    const url = `${baseUrl}/create-game?playerName=${globalProps.playerName}`
    try {
      const response = await fetch(url).then(res => res.json())
      return response.gameId
    } catch (err) {
      console.error(err);
    }
  }

  const joinGame = async () => {
    const name = globalProps.playerName
    const id = globalProps.gameId
    const url = `${baseUrl}/join-game?playerName=${name}&gameId=${id}`
    try {
      return await fetch(url).then(res => res.json());
    } catch (err) {
      console.error(err);
    }
  }

  const getActionIcon = (
    image: string,
    text: string,
    selected: boolean,
    onclick?: MouseEventHandler<HTMLButtonElement>) => {
    return (
      <ActionIcon
        onClick={onclick}
        m={0}
        className={`setup-action-button ${selected ? "setup-action-button-selected" : ""}`}
        variant={"filled"}
        size={"10em"}
        radius={0}>
        <Box pos="relative" w="100%" h="100%">
          <Image maw={160} fit={"cover"} src={image} alt="Create game icon"/>
          <Overlay zIndex={1} color={selected ? "#94664d": "#313131"} backgroundOpacity={0.8}/>
          <Text className={"setup-action-button-text"}>{text}</Text>
        </Box>
      </ActionIcon>
    )
  }

  const getTextBox = (
    label: string,
    value: string,
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
  ) => {
    return (
      <TextInput
        w={"100%"}
        size="lg"
        label={label}
        radius={0}
        value={value}
        onChange={(event) => onChange(event)}
        styles={(theme) => {
          return {
            input: {
              borderRadius: 0,
              backgroundColor: theme.colors[theme.primaryColor][5],
              borderColor: theme.colors[theme.primaryColor][3],
              color: theme.white,
            },
            label: {
              textAlign: "left",
              display: "block",
              color: "#cfcfcf",
            },
            error: {
              textAlign: "left",
              display: "block",
              color: "#810000",
            },
          }
        }}/>

    )
  }

  const onNextClick = async () => {
    if (globalProps.playerName === "") {
      showNotification("Enter a player name")
      return;
    } else if (!isHost && globalProps.gameId === "") {
      showNotification("Enter a Game ID")
      return;
    }

    if (isHost) {
      const newId = await getGameId();
      if (newId) {
        globalProps.setGameId(newId);
        props.stepper(1)
      }
    } else {
      const response = await joinGame();
      switch(response.joinGameState) {
        case "JOINED":
          props.stepper(1)
          break;
        case "PREVIOUSLY_JOINED":
          props.stepper(1)
          break;
        case "IN_LOBBY":
          props.stepper(2)
          break;
        case "IN_GAME":
          sendMessage({action: RESUME_GAME})
          break;
        case "CANNOT_JOIN_MAX_PLAYERS":
          showNotification("This game already has 4 players.")
          break;
        case "CANNOT_JOIN_GAME_STARTED":
          showNotification("This game has already started. You cannot join now.")
          break;
      }
    }
  }

  return (
    <Group
      align={"center"}
      h={"60%"}
      gap={0}>

      <Stack p={"50px"}>
        {getActionIcon(createGameImage, "CREATE", isHost, () => setIsHost(true))}
        {getActionIcon(joinGameImage, "JOIN", !isHost, () => setIsHost(false))}
      </Stack>

      <Stack
        pos={"relative"}
        w={"400px"}
        h={"400px"}
        p={"48px"}
        align={"center"}
        bg={"#94664d45"}>
        {
          getTextBox(
            "Player name",
            globalProps.playerName,
            ev => globalProps.setPlayerName(ev.currentTarget.value)
          )
        }

        {!isHost &&
          getTextBox(
            "Game ID",
            globalProps.gameId,
            ev => globalProps.setGameId(ev.currentTarget.value)
          )
        }

        <Button
          onClick={onNextClick}
          className={`setup-action-button-next`}
          size="md"
          radius="0"
          style={{
            position: "absolute",
            bottom: 24,
          }}
          variant="filled">NEXT</Button>
      </Stack>
    </Group>
  )
}
