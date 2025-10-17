import '../css/Player.css'
import {Avatar, Divider, Text, Group, Stack, Tooltip, Space, ActionIcon} from "@mantine/core";
import water_icon from '../assets/water.svg';
import spice_icon from '../assets/spice.svg';
import solari_icon from '../assets/solari.svg';
import plus_icon from '../assets/plus.svg';
import minus_icon from '../assets/minus.svg';
import first_player_icon from '../assets/first_player_token.png';

export function Player(props) {
  return (
    <Stack className="current-player-container"
           align={"ce"}
           gap={"5"}>
      <Group align="flex-start">
        <Stack align={"center"} gap={"5"}>
          <Avatar className={"player-avatar"}
                  radius="xs"
                  size="xl"
                  src="https://i.postimg.cc/MTykNx6w/DIUDesign-Diary5-Hero-1200x675-1024x576.jpg"/>
        </Stack>

        <Stack align="stretch">
          <Group align="center" gap={"5"}>
            <Text ta="left" fw={500} size={"1.8rem"}>
              Feyd Rautha
            </Text>
            <Tooltip label="First player">
              <img width={30}
                   src={first_player_icon}
                   alt="First player"
                   hidden={!props.first_player}/>
            </Tooltip>
          </Group>

          <Group align="center" gap={"xs"}>
            <Group align="center" gap={"5"}>
              <Text size="md">5</Text>
              <img width={20} src={water_icon} alt="Water drop icon"/>
            </Group>

            <Divider orientation="vertical" m={"0"} color={"#363636"}/>

            <Group align="center" gap={"5"}>
              <Text size="md">3</Text>
              <img width={20} src={spice_icon} alt="Spice icon"/>
            </Group>
          </Group>
        </Stack>
      </Group>

      <Space h="md"/>

      <Group w={"100%"} justify="center" gap={"xs"}>
        <Stack align="center">
          <img width={50} src={water_icon} alt="Water drop icon"/>
          <Group align="center" gap={"xs"}>
            <ActionIcon>
              <img width={30} src={minus_icon} alt="Add water icon"/>
            </ActionIcon>
            <Text size="xl">1</Text>
            <ActionIcon>
              <img width={30} src={plus_icon} alt="Add water icon"/>
            </ActionIcon>
          </Group>
        </Stack>

        <Stack align="center">
          <img width={50} src={spice_icon} alt="Water drop icon"/>
          <Group align="center" gap={"xs"}>
            <ActionIcon>
              <img width={30} src={minus_icon} alt="Add water icon"/>
            </ActionIcon>
            <Text size="xl">1</Text>
            <ActionIcon>
              <img width={30} src={plus_icon} alt="Add water icon"/>
            </ActionIcon>
          </Group>
        </Stack>

        <Stack align="center">
          <img width={50} src={solari_icon} alt="Water drop icon"/>
          <Group align="center" gap={"xs"}>
            <ActionIcon>
              <img width={30} src={minus_icon} alt="Add water icon"/>
            </ActionIcon>
            <Text size="xl">1</Text>
            <ActionIcon>
              <img width={30} src={plus_icon} alt="Add water icon"/>
            </ActionIcon>
          </Group>
        </Stack>
      </Group>
    </Stack>
  )
}