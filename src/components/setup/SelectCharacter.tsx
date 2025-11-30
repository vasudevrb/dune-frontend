import {ActionIcon, Box, Button, Group, Image, Overlay, Stack, Text} from "@mantine/core";
import {useGameStore} from "../../store/GameStore.tsx";
import {type MouseEventHandler, useEffect, useState} from "react";

import {ADD_TO_GAME} from "../../const/Actions.tsx";
import {useWebSocket} from "../WebSocketContext.tsx";
import {BASE_URL} from "../../const/ApiConstants.tsx";

export interface DisplayableCharacter {
  characterName: string;
  urls: string[];
  avatarUrl: string;
  shownImageId: number;
}

export function SelectCharacter(props: {
  stepper: () => void
}) {
  const baseUrl = BASE_URL;
  const globalProps = useGameStore();
  const {sendMessage} = useWebSocket();
  const [selectedCharacter, setSelectedCharacter] = useState<DisplayableCharacter>();
  const [shownCharacters, setShownCharacters] = useState<DisplayableCharacter[]>([]);

  useEffect(() => {
    getCharacters();
  }, []);

  const getCharacters = async () => {
    try {
      const response = await fetch(`${baseUrl}/characters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerName: globalProps.playerName,
          gameId: globalProps.gameId
        })
      }).then(res => res.json())
      setShownCharacters(response)
      setSelectedCharacter(response[0])
    } catch (err) {
      console.error(`Error when fetching playable characters: ${err}`)
    }
  }

  const getActionIcon = (
    image: string,
    text: string,
    selected: boolean,
    onclick?: MouseEventHandler<HTMLButtonElement>) => {
    return (
      <ActionIcon
        key={image}
        onClick={onclick}
        m={0}
        className={`setup-action-button ${selected ? "setup-action-button-selected" : ""}`}
        variant={"filled"}
        size={"5em"}
        radius={0}>
        <Box pos="relative" w="100%" h="100%">
          <Image maw={160} fit={"cover"} src={image} alt="Create game icon"/>
          <Overlay zIndex={1} color={selected ? "#94664d": "#313131"} backgroundOpacity={0.8}/>
          <Text className={"setup-action-button-text"}>{text}</Text>
        </Box>
      </ActionIcon>
    )
  }

  const flipCharacterCard = () => {
    if (selectedCharacter) {
      const currentImageId = getCurrentlyShownImageId(selectedCharacter);
      const updated = {...selectedCharacter, shownImageId: currentImageId == 1 ? 0: 1}
      setSelectedCharacter(updated)
    }
  }

  const getCurrentlyShownImageId = (character?: DisplayableCharacter) => {
    if (character) {
      return character.shownImageId === 1 ? 1 : 0;
    }
    return 0
  }

  const onNextClick = async () => {
    try {
      await fetch(`${baseUrl}/pick-character`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId: globalProps.gameId,
          playerName: globalProps.playerName,
          characterName: selectedCharacter?.characterName
        })
      }).then(() => {
        sendMessage({
          action: ADD_TO_GAME,
          body: {gameId: globalProps.gameId, playerName: globalProps.playerName}
        })
        props.stepper();
      })
    } catch (err) {
      console.log(`Error when picking character: ${err}`)
    }
  }


  return (
    <Group
      align={"center"}
      h={"60%"}
      gap={0}>

      <Stack p={"50px"}>
        {
          shownCharacters.map((ch) =>
            getActionIcon(
              ch.avatarUrl,
              "",
              ch.characterName === selectedCharacter?.characterName,
              () => setSelectedCharacter(ch))
          )
        }
      </Stack>

      <Stack
        align={"center"}>

        <Image
          bg={"transparent"}
          w={"auto"}
          mah={"400"}
          fit={"cover"}
          ps={"50"}
          radius={"xs"}
          src={selectedCharacter?.urls[getCurrentlyShownImageId(selectedCharacter)]}
          alt="Character"/>

        <Group w={"100%"} justify={"flex-end"}>
          {(selectedCharacter && selectedCharacter.urls.length > 1) &&
            <Button
              onClick={flipCharacterCard}
              className={`setup-action-button-next`}
              size="md"
              radius="0"
              variant="filled">FLIP CARD</Button>
          }

          <Button
            onClick={onNextClick}
            className={`setup-action-button-next`}
            size="md"
            radius="0"
            variant="filled">NEXT</Button>
        </Group>

      </Stack>
    </Group>
  )

}