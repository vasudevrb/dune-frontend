import {Box, Button, Group, Image, Overlay, Stack, Text} from "@mantine/core";
import createGameImage from "../../assets/create_game_bg.png";
import agent_icon_red from '../../assets/agents/agent_red.svg';
import agent_icon_blue from '../../assets/agents/agent_blue.svg';
import agent_icon_green from '../../assets/agents/agent_green.svg';
import agent_icon_gold from '../../assets/agents/agent_gold.svg'
import ornithopter from '../../assets/objectives/ornithopter_tr.png';
import desert_mouse from '../../assets/objectives/desert_mouse_tr.png';
import crysknife from '../../assets/objectives/crysknife_tr.png';
import type {LobbyPlayer} from "./Setup2.tsx";
import {randomId} from "@mantine/hooks";
import {ObjectiveType, type PlayerModel} from "../../model/PlayerModel.tsx";
import {playerStartState} from "../../const/Util.tsx";
import {useGameStore} from "../../store/GameStore.tsx";
import {useEffect} from "react";
import {GET_CHARACTER_READY_STATES} from "../../const/Actions.tsx";
import {useWebSocket} from "../WebSocketContext.tsx";

export function Lobby(props: {
  players: LobbyPlayer[];
  gameStartHandler: (players: PlayerModel[]) => void
}) {
  const {sendMessage} = useWebSocket();
  const globalProps = useGameStore();

  useEffect(() => {
    sendMessage({action: GET_CHARACTER_READY_STATES})
  }, []);

  const getAgentIcon = (color: string) => {
    switch (color) {
      case 'RED': return agent_icon_red;
      case 'GREEN': return agent_icon_green;
      case 'BLUE': return agent_icon_blue;
      default: return agent_icon_gold;
    }
  }

  const getObjectiveIcon = (objectiveType: ObjectiveType) => {
    switch (objectiveType) {
      case ObjectiveType.Ornithopter: return ornithopter;
      case ObjectiveType.DesertMouse: return desert_mouse;
      case ObjectiveType.Crysknife: return crysknife;
    }
  }

  const getPlayerInfo = (player: LobbyPlayer | undefined) => {
    if (!player) {
      return (
        <Stack
          w="250px"
          h="250px"
          p={"10px"}
          key={`${randomId("player")}}`}
          align={"center"}
          gap={0}>
          <Text className={"text-setup-lobby-name"} style={{visibility: "hidden"}}>Player</Text>
          <Text className={"text-setup-lobby-player-name"} style={{visibility: "hidden"}}>PNAME</Text>
          <Box pos="relative" w={"160"}>
            <Image
              maw={160}
              fit={"cover"}
              src={createGameImage}/>
            <Overlay zIndex={5} color={"#313131"} backgroundOpacity={0.8}/>
          </Box>
        </Stack>
      )
    }

    return (
      <Stack
        w="250px"
        h="250px"
        p={"10px"}
        key={player.playerName}
        align={"center"}
        gap={0}>
        <Text className={"text-setup-lobby-name"}>
          {player.characterName}
        </Text>
        <Text className={"text-setup-lobby-player-name"}>
          {player.playerName}
        </Text>
        <Box pos="relative" w={"160"}>
          <Image
            maw={160}
            fit={"cover"}
            className={"setup-lobby-player-image"}
            src={player.avatarUrl}/>

          <img
            style={{
              margin: "8px",
              position: "absolute",
              bottom: 0,
              left: 0,
              zIndex: 7
            }}
            draggable={false}
            width={35}
            src={getAgentIcon(player.color)}
            className={"lobby-agent-icon"}
            alt="Agent icon"/>

          <img
            style={{
              margin: "4px",
              position: "absolute",
              bottom: 0,
              right: 0,
              zIndex: 7
            }}
            draggable={false}
            width={35}
            src={getObjectiveIcon(player.objective)}
            className={"lobby-agent-icon"}
            alt="Agent icon"/>
          <Overlay zIndex={5} color={"#94664d"} backgroundOpacity={0.5}/>
        </Box>
      </Stack>
    )
  }

  const getPlayerInfoRow = (players: Array<LobbyPlayer | undefined>) => {
    return (
      <Group gap={0}>
        {players.map((player: LobbyPlayer | undefined) => getPlayerInfo(player))}
      </Group>
    )
  }

  const onNextClick = () => {
    // @ts-ignore
    const playerModels: PlayerModel[] = props.players.map(pi => {
      const characterModel = {
        name: pi.characterName,
        urls: pi.characterUrls,
        avatarUrl: pi.avatarUrl
      }

      return {
        ...playerStartState,
        name: pi.playerName,
        character: characterModel,
        color: pi.color,
        isThisPlayer: globalProps.playerName === pi.playerName,
        agents: [
          {id: `agent-${pi.playerName}#1`},
          {id: `agent-${pi.playerName}#2`},
          {id: `agent-${pi.playerName}#3`}
        ],
        spies: [
          {id: `spy-${pi.playerName}#1`},
          {id: `spy-${pi.playerName}#2`},
          {id: `spy-${pi.playerName}#3`}
        ],
        controlFlags: [
          {id: `control_flag-${pi.playerName}#1`},
          {id: `control_flag-${pi.playerName}#2`},
          {id: `control_flag-${pi.playerName}#3`}
        ],
      }
    });
    props.gameStartHandler(playerModels)
  }

  const getPlayerInfoBox = () => {
    const paddedPlayers = props.players.concat(
      Array(Math.max(0, 4 - props.players.length)).fill(undefined)
    )
    return (
      <Stack gap={0} align={"center"}>
        {getPlayerInfoRow(paddedPlayers.slice(0, 2))}
        {getPlayerInfoRow(paddedPlayers.slice(2, 4))}
        {props.players.length >= 1 &&
          <Button
            onClick={onNextClick}
            className={`setup-action-button-next`}
            size="md"
            radius="0"
            variant="filled">START GAME</Button>
        }
      </Stack>
    )
  }

  return (
    <Box pos={"relative"} style={{flexGrow: 1}}>
      {getPlayerInfoBox()}
    </Box>
  )
}