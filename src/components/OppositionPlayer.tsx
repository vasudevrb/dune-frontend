import '../css/Player.css'
import {Avatar, Divider, Text, Group, Stack, Tooltip} from "@mantine/core";
import water_icon from '../assets/water.svg';
import spice_icon from '../assets/spice.svg';
import solari_icon from '../assets/solari.svg';
import first_player_icon from '../assets/first_player_token.png';
import agent_icon from '../assets/agent_icon_2.svg';
import vp_icon from '../assets/vp_icon.png';
import discard_icon from '../assets/icon_discard.png';
import draw_icon from '../assets/draw_icon.png';
import hand_icon from '../assets/hand_icon.png';

export function OppositionPlayer(props: { first_player: boolean; }) {
  return (
    <Group className="player-container" align="flex-start">
      <Stack align={"center"} gap={"5"}>
      <Avatar className={"player-avatar"}
              radius="xs"
              size="xl"
              src="https://i.postimg.cc/MTykNx6w/DIUDesign-Diary5-Hero-1200x675-1024x576.jpg" />

        <Group align="center" gap={"5"}>
          <Text fw="700" size="lg" className={"player-container-text"}>6</Text>
          <img width={25} src={vp_icon} alt="Victory points"/>
        </Group>
      </Stack>

      <Stack align="stretch">

        <Group align="center" gap={"5"}>
          <Text ta="left" fw={500} size={"1.1rem"} className={"player-container-text"}>
            Feyd Rautha
          </Text>
          <Tooltip label="First player">
            <img width={20}
                 src={first_player_icon}
                 alt="First player"
                 hidden={!props.first_player}/>
          </Tooltip>
        </Group>

        <Group align="center" gap={"xs"}>
          <Group align="center" gap={"5"}>
            <Text size="md" className={"player-container-text"}>1</Text>
            <img width={20} src={water_icon} alt="Water drop icon"/>
          </Group>

          <Divider orientation="vertical" m={"0"} color={"#363636"}/>

          <Group align="center" gap={"5"}>
            <Text size="md" className={"player-container-text"}>2</Text>
            <img width={20} src={spice_icon} alt="Spice icon"/>
          </Group>

          <Divider orientation="vertical" m={"0"} color={"#363636"}/>

          <Group align="center" gap={"5"}>
            <Text size="md" className={"player-container-text"}>2</Text>
            <img width={20} src={solari_icon} alt="Solari icon"/>
          </Group>
        </Group>

        <Group align="center" gap={"xs"}>
          <Group align="center" gap={"5"}>
            <Text size="md" className={"player-container-text"}>5</Text>
            <img width={20} src={hand_icon} alt="Water drop icon"/>
          </Group>

          <Divider orientation="vertical" m={"0"} color={"#363636"}/>

          <Group align="center" gap={"5"}>
            <Text size="md" className={"player-container-text"}>3</Text>
            <img width={20} src={discard_icon} alt="Spice icon"/>
          </Group>

          <Divider orientation="vertical" m={"0"} color={"#363636"}/>

          <Group align="center" gap={"5"}>
            <Text size="md" className={"player-container-text"}>3</Text>
            <img width={20} src={draw_icon} alt="Spice icon"/>
          </Group>
        </Group>

      </Stack>

      <Stack align="stretch">
        <img width={45} src={agent_icon} alt="Agent icon" style={{
          filter: `
          drop-shadow(3px 3px 6px rgba(0,0,0,0.5))
          drop-shadow(0px 0 0 #94664d)
      `
        }}/>
        <img width={45} src={agent_icon} alt="Agent icon" className={"agent-icon"}/>
      </Stack>

    </Group>

  )
}