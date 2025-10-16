import '../css/Players.css'
import {Avatar, Box, Divider, Flex, Group, Stack, Text, Tooltip} from "@mantine/core";
import water_icon from '../assets/water.svg';
import spice_icon from '../assets/spice.svg';
import solari_icon from '../assets/solari.svg';
import first_player_icon from '../assets/first_player_token.png';

export function Players() {
  return (
    <Box mt="10" h={"100%"}>
      <div className="player-container">

        <Flex>
          <Avatar radius="xs" size="xl" src="https://i.postimg.cc/MTykNx6w/DIUDesign-Diary5-Hero-1200x675-1024x576.jpg" />

          <Stack
            w={"100%"}
            pl={10}
            align="stretch">

            <Group align="center" gap={"5"}>
              <Text ta="left" fw={500}
                    size={"1.8rem"}>
                Feyd Rautha
              </Text>
              <Tooltip label="First player">
                <img width={30} src={first_player_icon}/>
              </Tooltip>
            </Group>


            <Group align="center" gap={"xs"}>

              <Group align="center" gap={"5"}>
                <Text size="md">6</Text>
                <img width={20} src={solari_icon}/>
              </Group>

              <Divider orientation="vertical" m={"0"} color={"#363636"} />

              <Group align="center" gap={"5"}>
                <Text size="md">1</Text>
                <img width={20} src={water_icon}/>
              </Group>

              <Divider orientation="vertical" m={"0"} color={"#363636"} />

              <Group align="center" gap={"5"}>
                <Text size="md">2</Text>
                <img width={20} src={spice_icon}/>
              </Group>

              <Divider orientation="vertical" m={"0"} color={"#363636"} />

              <Group align="center" gap={"5"}>
                <Text size="md">2</Text>
                <img width={20} src={solari_icon}/>
              </Group>
            </Group>

          </Stack>
        </Flex>

      </div>

      <div className="player-container">
        <Avatar variant="light" radius="xs" size="xl" src="https://i.postimg.cc/MTykNx6w/DIUDesign-Diary5-Hero-1200x675-1024x576.jpg" />
      </div>

      <div className="player-container">
        <Avatar variant="light" radius="xs" size="xl" src="https://i.postimg.cc/MTykNx6w/DIUDesign-Diary5-Hero-1200x675-1024x576.jpg" />
      </div>

      <div className="current-player-container">
        <Avatar variant="light" radius="xs" size="xl" src="https://i.postimg.cc/MTykNx6w/DIUDesign-Diary5-Hero-1200x675-1024x576.jpg" />
      </div>
    </Box>
  )
}