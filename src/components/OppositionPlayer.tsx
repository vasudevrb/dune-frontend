import '../css/Player.css'
import {Avatar, Divider, Text, Group, Stack, Tooltip} from "@mantine/core";
import water_icon from '../assets/water.svg';
import spice_icon from '../assets/spice.svg';
import solari_icon from '../assets/solari.svg';
import first_player_icon from '../assets/first_player_token.png';

export function OppositionPlayer() {
  return (
    <Group className="player-container" align="flex-start">
      <Stack align={"center"} gap={"5"}>
      <Avatar className={"player-avatar"}
              radius="xs"
              size="xl"
              src="https://i.postimg.cc/MTykNx6w/DIUDesign-Diary5-Hero-1200x675-1024x576.jpg" />

        <Group align="center" gap={"5"}>
          <Text fw="700" size="md">6</Text>
          <img width={20} src={solari_icon} alt="Victory points"/>
        </Group>
      </Stack>

      <Stack align="stretch">

        <Group align="center" gap={"5"}>
          <Text ta="left" fw={500} size={"1.8rem"}>
            Feyd Rautha
          </Text>
          <Tooltip label="First player">
            <img width={30} src={first_player_icon} alt="First player"/>
          </Tooltip>
        </Group>


        <Group align="center" gap={"xs"}>
          <Group align="center" gap={"5"}>
            <Text size="md">1</Text>
            <img width={20} src={water_icon} alt="Water drop icon"/>
          </Group>

          <Divider orientation="vertical" m={"0"} color={"#363636"} />

          <Group align="center" gap={"5"}>
            <Text size="md">2</Text>
            <img width={20} src={spice_icon} alt="Spice icon"/>
          </Group>

          <Divider orientation="vertical" m={"0"} color={"#363636"} />

          <Group align="center" gap={"5"}>
            <Text size="md">2</Text>
            <img width={20} src={solari_icon} alt="Solari icon"/>
          </Group>
        </Group>

        <Group align="center" gap={"xs"}>
          <Group align="center" gap={"5"}>
            <Text size="md">5</Text>
            <img width={20} src={water_icon} alt="Water drop icon"/>
          </Group>

          <Divider orientation="vertical" m={"0"} color={"#363636"} />

          <Group align="center" gap={"5"}>
            <Text size="md">3</Text>
            <img width={20} src={spice_icon} alt="Spice icon"/>
          </Group>
        </Group>

      </Stack>

    </Group>

  )
}