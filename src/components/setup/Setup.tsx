import {ActionIcon, Box, Button, Flex, Group, Image, Stack, Stepper, Text, TextInput, Title} from "@mantine/core";
import '../../css/Setup.css'
import {useState} from "react";
import arrow_right_icon from "../../assets/arrow_right.svg";
import {Carousel} from "@mantine/carousel";

export interface Character {
  characterName: string;
  urls: Array<string>;
  shownImageId: number;
}

export function Setup() {
  const [active, setActive] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [nameError, setNameError] = useState("");
  const [gameType, setGameType] = useState(-1);
  const [gameId, setGameId] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState<Character>();
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

  const nextStep = () => setActive((current) => (current < 2 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

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
        setGameId(newId)
        console.log(`Game id is ${newId}`)
        nextStep()
        getCharacters()
      }
    } else {
      const joinResponse = await joinGame(gameId)
      if (joinResponse == 200) {
        console.log(`Joined game with id ${gameId}`)
        nextStep()
        getCharacters()
      }
    }
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
        return 200
      }
    } catch (err) {
      if (err instanceof Error) {
        setNameError(err.message);
      } else {
        setNameError("Something went wrong. Please check the console.")
      }
    }
  }

  const getCharacters = async () => {
    try {
      const response = await fetch(`http://localhost:8080/characters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerName: playerName,
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

  const selectCharacter = (character: Character) => {

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
              onChange={(event) => setPlayerName(event.currentTarget.value)}
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
                  onChange={(event) => setGameId(event.currentTarget.value)}
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