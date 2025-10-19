import {ActionIcon, Flex, Group, Stack, Stepper, Text, TextInput} from "@mantine/core";
import '../../css/Setup.css'
import {useState} from "react";
import arrow_right_icon from "../../assets/arrow_right.svg";


export function Setup() {
  const [active, setActive] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [nameError, setNameError] = useState("");
  const [gameType, setGameType] = useState(-1);
  const [gameId, setGameId] = useState("");

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
    } else {
      setNameError("")
      if(await getGameId() == 200) {
        console.log(`Game id is ${gameId}`)
        nextStep()
      }
    }
  }

  const getGameId = async () => {
    try {
      const response = await fetch(`http://localhost:8080/create-game?playerName=${playerName}`)
        .then(res => res.json())
      console.log(response)
      gameId = response.gameId
      return 200
    } catch (err) {
      if (err instanceof Error) {
        setNameError(err.message);
      } else {
        setNameError("Something went wrong. Please check the console.")
      }
    }
  }

  return (
    <Flex justify="center" align="center" h="100vh">
      <Stepper
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
        bg="#B0A19999"
        p={"20"}
        w={"60%"}
        h={"60%"}
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
            width: "50%",
            gap:"5px"
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

        <Stepper.Step/>
      </Stepper>
    </Flex>
  )
}