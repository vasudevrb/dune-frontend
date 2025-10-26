import '../css/Player.css'
import {Avatar, Divider, Group, Stack, Text, Tooltip} from "@mantine/core";
import water_icon from '../assets/water.svg';
import spice_icon from '../assets/spice.svg';
import solari_icon from '../assets/solari.svg';
import first_player_icon from '../assets/first_player_token.png';
import agent_icon_disabled from '../assets/agent_icon_disabled.svg';
import agent_icon_red from '../assets/agent_icon_red.svg';
import agent_icon_blue from '../assets/agent_icon_blue.svg';
import agent_icon_green from '../assets/agent_icon_green.svg';
import agent_icon_gold from '../assets/agent_icon_gold.svg';
import vp_icon from '../assets/vp_icon.png';
import objective_card_icon from '../assets/objective_icon.png'
import hand_icon from '../assets/hand_icon.png';
import {type PlayerModel, ResourceType} from "../model/Player.tsx";

export function OppositionPlayer(props: { playerModel: PlayerModel; }) {

  const getAgentIcon = (color: string) => {
    if (color === "RED") return agent_icon_red;
    else if (color === "BLUE") return agent_icon_blue;
    else if (color === "GOLD") return agent_icon_gold;
    else if (color === "GREEN") return agent_icon_green;
  }

  return (
    <Group className="player-container" align="flex-start">

      <Stack align={"center"} gap={"5"}>
      <Avatar className={"player-avatar"}
              radius="xs"
              size="xl"
              src={props.playerModel.character.avatarUrl} />

        <Group align="center" gap={"5"}>
          <Text fw="700" size="lg" className={"player-container-text"}>6</Text>
          <img width={25} src={vp_icon} alt="Victory points"/>
        </Group>
      </Stack>

      <Stack align="stretch" style={{ flex: 1, textAlign: 'center' }}>
        <Group align="center" gap={"5"}>
          <Text ta="left" fw={500} size={"1.1rem"} className={"player-container-text"}>
            {props.playerModel.character.name}
          </Text>
          <Tooltip label="First player">
            <img width={20}
                 src={first_player_icon}
                 alt="First player"
                 hidden={!props.playerModel.firstPlayer}/>
          </Tooltip>
        </Group>

        <Group align="center" gap={"xs"}>
          <Group align="center" gap={"5"}>
            <Text size="md" className={"player-container-text"}>
              {props.playerModel.resources.get(ResourceType.Water)}
            </Text>
            <img width={20} src={water_icon} alt="Water drop icon"/>
          </Group>

          <Divider orientation="vertical" m={"0"} color={"#363636"}/>

          <Group align="center" gap={"5"}>
            <Text size="md" className={"player-container-text"}>
              {props.playerModel.resources.get(ResourceType.Spice)}
            </Text>
            <img width={20} src={spice_icon} alt="Spice icon"/>
          </Group>

          <Divider orientation="vertical" m={"0"} color={"#363636"}/>

          <Group align="center" gap={"5"}>
            <Text size="md" className={"player-container-text"}>
              {props.playerModel.resources.get(ResourceType.Solari)}
            </Text>
            <img width={20} src={solari_icon} alt="Solari icon"/>
          </Group>
        </Group>

        {/*<Group align="center" gap={"xs"}>*/}
        {/*  <Group align="center" gap={"5"}>*/}
        {/*    <Text size="md" className={"player-container-text"}>5</Text>*/}
        {/*    <img width={20} src={hand_icon} alt="Water drop icon"/>*/}
        {/*  </Group>*/}

        {/*  <Divider orientation="vertical" m={"0"} color={"#363636"}/>*/}

        {/*  <Group align="center" gap={"5"}>*/}
        {/*    <Text size="md" className={"player-container-text"}>3</Text>*/}
        {/*    <img width={20} src={discard_icon} alt="Spice icon"/>*/}
        {/*  </Group>*/}

        {/*  <Divider orientation="vertical" m={"0"} color={"#363636"}/>*/}

        {/*  <Group align="center" gap={"5"}>*/}
        {/*    <Text size="md" className={"player-container-text"}>3</Text>*/}
        {/*    <img width={20} src={draw_icon} alt="Spice icon"/>*/}
        {/*  </Group>*/}
        {/*</Group>*/}

        <Group align="center" gap={"xs"}>
          <img width={20} src={hand_icon} alt="Water drop icon"/>
          <Divider orientation="vertical" m={"0"} color={"#363636"}/>
          <img width={20} src={objective_card_icon} alt="Spice icon"/>
        </Group>


      </Stack>

      <Stack align="stretch" style={{ marginLeft: 'auto' }}>
        <img width={45} src={agent_icon_disabled} alt="Agent icon" style={{
          filter: `
          drop-shadow(3px 3px 6px rgba(0,0,0,0.5))
          drop-shadow(0px 0 0 #94664d)
      `
        }}/>
        <img width={45} src={getAgentIcon(props.playerModel.color)} alt="Agent icon" className={"agent-icon"}/>
        <img width={45} src={getAgentIcon(props.playerModel.color)} alt="Agent icon" className={"agent-icon"}/>
      </Stack>

    </Group>

  )
}