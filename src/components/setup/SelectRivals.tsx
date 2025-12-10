import {Button, Image, ScrollArea, SimpleGrid, Stack} from "@mantine/core";
import type {DisplayableCharacter} from "./SelectCharacter.tsx";
import {useEffect, useState} from "react";
import {BASE_URL} from "../../const/ApiConstants.tsx";
import {useGameStore} from "../../store/GameStore.tsx";
import {useWebSocket} from "../WebSocketContext.tsx";
import {ADD_TO_GAME} from "../../const/Actions.tsx";

export interface DisplayableRival extends DisplayableCharacter {
  addedToGame: boolean;
}

export function SelectRivals(
  props: { stepper: () => void }
) {
  const baseUrl = BASE_URL;
  const globalProps = useGameStore();
  const {sendMessage} = useWebSocket();

  const [shownRivals, setShownRivals] = useState<DisplayableRival[]>([]);

  useEffect(() => {getRivals()}, []);

  const getRivals = async () => {
    try {
      const response = await fetch(`${baseUrl}/rivals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerName: globalProps.playerName,
          gameId: globalProps.gameId
        })
      }).then(res => res.json())
      setShownRivals(response)
    } catch (err) {
      console.error(`Error when fetching playable rivals: ${err}`)
    }
  }

  const selectRival = async (rival: DisplayableRival) => {
    try {
      const response = await fetch(`${baseUrl}/pick-rival`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId: globalProps.gameId,
          rivalName: rival.characterName
        })
      }).then((res) => res.json())

      sendMessage({
        action: ADD_TO_GAME,
        body: {gameId: globalProps.gameId, playerName: response.playerName}
      })
      rival.addedToGame = true;
    } catch (err) {
      console.log(`Error when picking character: ${err}`)
    }
  }

  return (
    <Stack align={"flex-end"}>
      <ScrollArea
        className={"fadeScroll-character-picker"}
        h={"100%"}
        offsetScrollbars={false}
        type={"never"}
        scrollbars="y">
        <Stack h={"80vh"}>
          <SimpleGrid cols={{ base: 3 }}>
            {
              shownRivals.map(r =>
                <Stack align={"flex-end"} p={8}>
                  <Image
                    bg={"transparent"}
                    w={"auto"}
                    mah={"300"}
                    fit={"cover"}
                    radius={"md"}
                    src={r.urls[0]}
                    alt="Character"/>

                  {!r.addedToGame &&
                    <Button
                      onClick={() => selectRival(r)}
                      w={"100"}
                      className={`setup-action-button-next`}
                      size="xs"
                      radius="0"
                      variant="filled">Select</Button>}
                </Stack>
              )
            }
          </SimpleGrid>
        </Stack>
      </ScrollArea>

      <Button
        onClick={() => props.stepper()}
        w={"150"}
        className={`setup-action-button-next`}
        size="md"
        radius="0"
        variant="filled">NEXT</Button>

    </Stack>
  )
}