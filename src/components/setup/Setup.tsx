import {ActionIcon, Box, Button, Flex, Group, Image, Stack, Stepper, Table, Text, TextInput} from "@mantine/core";
import '../../css/Setup.css'
import {useEffect, useState} from "react";
import arrow_right_icon from "../../assets/arrow_right.svg";
import {Carousel} from "@mantine/carousel";
import type {PlayerModel} from "../../model/PlayerModel.tsx";
import {ADD_TO_GAME, GET_CHARACTER_READY_STATES, RESUME_GAME, START_GAME} from "../../const/Actions.tsx";
import {useWebSocket} from "../WebSocketContext.tsx";
import {playerStartState} from "../../const/Util.tsx";
import {useGameStore} from "../../store/GameStore.tsx";

export interface Character {
  characterName: string;
  urls: Array<string>;
  shownImageId: number;
}

export interface PlayerInfo {
  id: number,
  name: string;
  characterName: string;
  characterUrls: string[];
  avatarUrl: string;
  color: string;
  status: string;
}

export function Setup(props: {
  gameStartHandler: (players: PlayerModel[]) => void
}) {

  const globalProps = useGameStore();
  const { subscribe, unsubscribe, sendMessage } = useWebSocket();

  const [active, setActive] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [nameError, setNameError] = useState("");
  const [gameType, setGameType] = useState(-1); // 0 for create; 1 for join
  const [gameId, setGameId] = useState("");
  const [, setSelectedCharacter] = useState<Character>();
  const [firstChar, setFirstChar] = useState<Character>({
    characterName: "",
    urls: [],
    shownImageId: 0
  });
  const [secondChar, setSecondChar] = useState<Character>({
    characterName: "",
    urls: [],
    shownImageId: 0
  });

  const [players, setPlayers] = useState<PlayerInfo[]>([]);

  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));

  useEffect(() => {
    const componentName = "setup_component";
    console.log(`In ${componentName}. Subscribing to WS messages`)

    const actions = [ADD_TO_GAME, GET_CHARACTER_READY_STATES, START_GAME]
    subscribe(actions, componentName, {
      onMessage: (action: string, body: any) => {
        console.log(`Message received: ${body}`);
        if (action === GET_CHARACTER_READY_STATES) {
          handlePlayerInfoResponse(body)
        } else if (action === START_GAME) {
          handleStartGameClick()
        }
      }
    });

    return () => { unsubscribe(actions, componentName) }
  })

  const handleCreateGameClick = () => {
    setGameType(0);
    nextStep()
  }

  const handleJoinGameClick = () => {
    setGameType(1);
    nextStep()
  }

  const handleNameNextClick = async () => {
    if (playerName.trim() === "") {
      setNameError("Invalid name.")
    } else if (gameId.trim() === "") {
      const newId = await getGameId()
      if (newId) {
        setAndUpdateGameId(newId)
        console.log(`Game id is ${newId}`)
        globalProps.setPlayerName(playerName)
        nextStep()
        getCharacters(newId)
      }
    } else {
      globalProps.setPlayerName(playerName)
      const alreadyPresentInGame = await joinGame(gameId)
      if (!alreadyPresentInGame) {
        console.log(`Joined game with id ${gameId}`)
        nextStep()
        await getCharacters(gameId)
      } else {
        sendMessage({action: RESUME_GAME})
      }
    }
  }

  const setAndUpdateGameId = (gameId: string) => {
    setGameId(gameId);
    globalProps.setGameId(gameId);
  }

  const setAndUpdatePlayerName = (playerName: string) => {
    setPlayerName(playerName);
    globalProps.setPlayerName(playerName);
  }

  const getGameId = async () => {
    try {
      const response = await fetch(`http://localhost:8080/create-game?playerName=${playerName}`)
        .then(res => res.json())
      console.log(response)
      return response.gameId
    } catch (err) {
      if (err instanceof Error) {
        setNameError(err.message);
      } else {
        setNameError("Something went wrong. Please check the console.")
      }
    }
  }

  const joinGame = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/join-game?playerName=${playerName}&gameId=${id}`)
        .then(res => res.json())
      if (id === response.gameId) {
        return response.alreadyPresentInGame;
      }
    } catch (err) {
      if (err instanceof Error) {
        setNameError(err.message);
      } else {
        setNameError("Something went wrong. Please check the console.")
      }
    }
  }

  const getCharacters = async (newGameId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/characters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerName: playerName,
          gameId: newGameId
        })
      }).then(res => res.json())
      console.log(response)
      const firstCharacter = response[0]
      firstCharacter["shownImageId"] = 0
      const secondCharacter = response[1]
      secondCharacter["shownImageId"] = 0

      setFirstChar(firstCharacter)
      setSecondChar(secondCharacter)
    } catch (err) {
      console.log(`Error when fetching playable characters: ${err}`)
    }
  }

  const flipCharacterCard = (charIndex: number, character: Character) => {
    const newShownImageId = character.shownImageId ^ 1;
    if (charIndex == 0) {
      setFirstChar(prev => ({...prev, shownImageId: newShownImageId}))
    } else {
      setSecondChar(prev => ({...prev, shownImageId: newShownImageId}))
    }
  }

  const handlePlayerInfoResponse = (body: PlayerInfo[]) => {
    const p = body.map((item: PlayerInfo, index: number) => {
      return {
        id: index,
        name: item.name,
        characterName: item.characterName,
        characterUrls: item.characterUrls,
        avatarUrl: item.avatarUrl,
        color: item.color,
        status: item.status,
      }
    })
    setPlayers(p)
  }

  const selectCharacter = async (character: Character) => {
    setSelectedCharacter(character)
    try {
      const response = await fetch(`http://localhost:8080/pick-character`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId: gameId,
          playerName: playerName,
          characterName: character.characterName
        })
      }).then(res => res.json())
      console.log(response)
    } catch (err) {
      console.log(`Error when picking character: ${err}`)
    }
    nextStep()
    sendMessage({
      action: ADD_TO_GAME,
      body: {gameId: gameId, playerName: playerName}
    })
  }

  const handleStartGameClick = () => {
    const playerModels = players.map(pi => {
      const characterModel = {
        name: pi.characterName,
        urls: pi.characterUrls,
        avatarUrl: pi.avatarUrl
      }

      return {
        ...playerStartState,
        name: pi.name,
        character: characterModel,
        color: pi.color,
        isThisPlayer: playerName === pi.name,
        agents: [
          {id: `agent-${pi.name}#1`},
          {id: `agent-${pi.name}#2`},
          {id: `agent-${pi.name}#3`}
        ],
        spies: [
          {id: `spy-${pi.name}#1`},
          {id: `spy-${pi.name}#2`},
          {id: `spy-${pi.name}#3`}
        ],
        controlFlags: [
          {id: `control_flag-${pi.name}#1`},
          {id: `control_flag-${pi.name}#2`},
          {id: `control_flag-${pi.name}#3`}
        ],
      }
    })
    props.gameStartHandler(playerModels)
  }

  return (
    <Flex justify="center"
          direction={"column"}
          align="center"
          h="100%"
          pl={"100px"}
          pr={"100px"}
          pt={"100px"}>
      <Stepper
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
        bg="#B0A19999"
        p={"20"}
        w={"100%"}
        h={"100%"}
        size={"xl"}
        styles={{
          separator: {
            flex: 0.3,
          },
          step: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          steps: {
            display: "flex",
            justifyContent: "center",
            width: "60%",
            gap: "5px"
          },
          stepBody: {
            display: "none",
          },
          stepIcon: {
            margin: "0 auto",
            borderRadius: 0,
            width: 32,
            height: 32,
          }
        }}
      >
        <Stepper.Step>
          <Group p={"10%"}
                 w={"100%"}
                 justify="center"
                 gap={"xl"}>
            <Stack>
              <ActionIcon
                onClick={handleCreateGameClick}
                variant={"filled"}
                size={"10em"}
                radius={"xs"}>
                <img src={arrow_right_icon} alt="Create game icon"/>
              </ActionIcon>
              <Text size="md">Create game</Text>
            </Stack>

            <Stack>
              <ActionIcon
                onClick={handleJoinGameClick}
                variant={"filled"}
                size={"10em"}
                radius={"xs"}>
                <img src={arrow_right_icon} alt="Join game icon"/>
              </ActionIcon>
              <Text size="md">Join game</Text>
            </Stack>
          </Group>
        </Stepper.Step>

        <Stepper.Step>
          <Stack align={"center"} mt={"60"}>
            <TextInput
              size="lg"
              label="Player name"
              radius={"xs"}
              value={playerName}
              onChange={(event) => setAndUpdatePlayerName(event.currentTarget.value)}
              error={nameError}
              styles={(theme) => ({
                input: {
                  borderRadius: 0,
                  backgroundColor: theme.colors[theme.primaryColor][5],
                  borderColor: theme.colors[theme.primaryColor][3],
                  color: theme.white,
                },
                label: {
                  textAlign: "left",
                  display: "block",
                  color: theme.colors[theme.primaryColor][9],
                },
                error: {
                  textAlign: "left",
                  display: "block",
                  color: "#810000",
                },
              })}/>

            {
              (gameType === 1) && (
                <TextInput
                  size="lg"
                  label="Game ID"
                  radius={"xs"}
                  value={gameId}
                  onChange={(event) => setAndUpdateGameId(event.currentTarget.value)}
                  styles={(theme) => ({
                    input: {
                      borderRadius: 0,
                      backgroundColor: theme.colors[theme.primaryColor][5],
                      borderColor: theme.colors[theme.primaryColor][3],
                      color: theme.white,
                    },
                    label: {
                      textAlign: "left",
                      display: "block",
                      color: theme.colors[theme.primaryColor][9],
                    },
                  })}/>
              )
            }

            <ActionIcon onClick={handleNameNextClick}
                        variant={"light"}
                        size={"xl"}
                        radius={"xs"}>
              <img src={arrow_right_icon} alt="Next step"/>
            </ActionIcon>
          </Stack>

        </Stepper.Step>

        <Stepper.Step>
          <Carousel slideGap="md"
                    slideSize="50%"
                    controlSize={40}
                    w={"100%"}
                    h={"100%"}
                    mt={"20px"}
          >
            <Carousel.Slide>
              <Flex w={"100%"} justify={"center"}>
                <Box pos="relative" w={"700px"} h={"450px"}>
                  <Image bg={"transparent"}
                         fit={"contain"}
                         radius={"lg"}
                         w="100%"
                         h="400px"
                         src={firstChar.urls[firstChar.shownImageId]} alt="Card">
                  </Image>

                  <Group pos="absolute"
                         bottom={10}
                         right={70}
                         gap={"md"}>

                    {
                      (firstChar.urls.length > 1) &&
                      <Button
                        onClick={() => flipCharacterCard(0, firstChar)}
                        size="xs"
                        radius="xl"
                        variant="filled">
                        Flip Card
                      </Button>
                    }

                    <Button
                      onClick={() => selectCharacter(firstChar)}
                      size="xs"
                      radius="xl"
                      variant="filled">
                      Select
                    </Button>
                  </Group>
                </Box>
              </Flex>
            </Carousel.Slide>

            <Carousel.Slide>
              <Flex w={"100%"} justify={"center"}>
                <Box pos="relative" w={"700px"} h={"450px"}>
                  <Image bg={"transparent"}
                         fit={"contain"}
                         radius={"lg"}
                         w="100%"
                         h="400px"
                         src={secondChar.urls[secondChar.shownImageId]} alt="Card">
                  </Image>

                  <Group pos="absolute"
                         bottom={10}
                         right={70}
                         gap={"md"}>

                    {
                      (secondChar.urls.length > 1) &&
                      <Button
                        onClick={() => flipCharacterCard(1, secondChar)}
                        size="xs"
                        radius="xl"
                        variant="filled">
                        Flip Card
                      </Button>
                    }

                    <Button
                      onClick={() => selectCharacter(secondChar)}
                      size="xs"
                      radius="xl"
                      variant="filled">
                      Select
                    </Button>
                  </Group>
                </Box>
              </Flex>
            </Carousel.Slide>
          </Carousel>
        </Stepper.Step>


        <Stepper.Step>
          <Stack p={"40px"}
                 w={"100%"}
                 align={"center"}
                 justify={"center"}
                 gap={"md"}>

            <Table w={"50%"}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Player name</Table.Th>
                  <Table.Th>Character</Table.Th>
                  <Table.Th>Color</Table.Th>
                  <Table.Th>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {
                players.map(pl =>
                  <Table.Tr key={pl.id}>
                    <Table.Td style={{ textAlign: 'left' }}>{pl.name}</Table.Td>
                    <Table.Td style={{ textAlign: 'left' }}>{pl.characterName}</Table.Td>
                    <Table.Td style={{ textAlign: 'left' }}>{pl.color}</Table.Td>
                    <Table.Td style={{ textAlign: 'left' }}>{pl.status}</Table.Td>
                  </Table.Tr>
                )
              }
              </Table.Tbody>
            </Table>

            {
              (gameType === 0 && players.length >= 2 && players.map(p => p.status).every(s => s === "Ready")) &&
              <Button
                mt={"40px"}
                onClick={() => handleStartGameClick()}
                size="xs"
                radius="xl"
                variant="filled">
                Start Game
              </Button>
            }

          </Stack>

        </Stepper.Step>
      </Stepper>
      <Text p={"10px"}
            bg="#B0A19999"
            w={"100%"}
            hidden={gameId === ""}
            style={{
              color: 'white',
              textAlign: 'left'
            }}>
        Game ID: {gameId}
      </Text>
    </Flex>
  )
}