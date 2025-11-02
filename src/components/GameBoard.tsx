import '../css/GameBoard.css'
import {Avatar, Box, Divider, Flex, Group, Image, Stack, Text} from "@mantine/core";
import combat_icon_tinted from '../assets/combat_icon_tinted.png';
import troop_icon from '../assets/troop_icon.png';
import strength_icon from '../assets/strength_icon.png';
import worm_icon from '../assets/worm_icon.png';
import type {PlayerModel} from "../model/Player.tsx";

export function GameBoard(props: {players: PlayerModel[]}) {
  const playerConflictStats = (player: PlayerModel, dirLR: boolean) => {
    const playerAvatar = () => {
      return <Stack align={"center"} gap={"5"} style={{alignSelf: "flex-start"}}>
        <Avatar
          radius="0"
          size="lg"
          src={player.character.avatarUrl}/>

        <Group align="center" gap={"5"}>
          <Text size="1.3em" className={"player-container-text"}>
            {player.combat.troopsInGarrison}
          </Text>
          <img width={25} src={troop_icon} alt="Garrissoned troops"/>
        </Group>
      </Stack>
    }
    const combatStrength = () => {
      return <Stack align={"center"} gap={"5"} style={{flex: 1, textAlign: 'center', alignSelf: "center"}}>
        <Group align="center" gap={"5"}>
          <Text size="1.5em" className={"player-container-text"}>
            {player.combat.troopsInCombat}
          </Text>
          <img width={20} src={troop_icon} alt="Troop icon"/>

          <Divider mt="5px" mb="5px" orientation={"vertical"} color={"#ffffff"}/>

          <Text size="1.5em" className={"player-container-text"}>
            {player.combat.wormsInCombat}
          </Text>
          <img width={20} src={worm_icon} alt="Worm icon"/>
        </Group>

        <Divider w="50%" orientation={"horizontal"} color={"#ffffff"}/>

        <Group align="center" gap={"5"}>
          <Text size="1.7em" className={"player-container-text"}>
            {player.combat.strength}
          </Text>
          <img width={25} src={strength_icon} alt="Total strength"/>
        </Group>

      </Stack>
    }
    return (
      <Group w={"50%"} h={"100%"}>
        {dirLR ? playerAvatar() : combatStrength()}
        {dirLR ? combatStrength() : playerAvatar()}
      </Group>
    )
  }

  const conflictRow = (players: PlayerModel[], bottom: boolean) => {
    return (
      <Group
        pos={"absolute"}
        justify={"flex-start"}
        w={"100%"}
        h={"50%"}
        gap={"0"}
        style={{bottom: bottom ? "0" : "none"}}>
        {
          players.map((p: PlayerModel, index: number) => {
            return playerConflictStats(p, index % 2 === 0)
          })
        }
      </Group>
    )
  }
  return (
    <Box
      mb={"5%"}
      pos={"relative"}
      className="gameBoard"
      style={{flexGrow: 1}}>

      <Group
        h={"250px"}
        mah={"250px"}
        w={"55%"}
        style={{
          position: "absolute",
          bottom: 15,
          right: 15,
        }}>
        <Flex direction={"column"} justify={"flex-end"} w={"25%"} h={"100%"}>
          <Image
            maw={"100%"}
            mah={"100%"}
            fit={"contain"}
            radius={"md"}
            src={"https://api.dunecardshub.com/uploads/images/conflict_1lvl_uprising_02.png"}
            style={{
              objectPosition: "right center",
              boxShadow: "0 0 30px 7px #94664dca",
            }}
            alt="Combat icon"/>
        </Flex>
        <Box className={"combat-container"} w={"75%"} h={"100%"} style={{flex: 1}} pos={"relative"}>
          <Divider h={"20%"} orientation={"vertical"} style={{opacity: "0.3", position: "absolute", left: "50%"}}/>
          <Divider h={"20%"} orientation={"vertical"} style={{opacity: "0.3", position: "absolute", bottom: 0, left: "50%"}}/>
          <Divider w={"20%"} orientation={"horizontal"} style={{opacity: "0.3", position: "absolute", bottom: "50%"}}/>
          <Divider w={"20%"} orientation={"horizontal"} style={{opacity: "0.3", position: "absolute", bottom: "50%", right: 0}}/>
          {conflictRow(props.players.slice(0, 2), false)}
          {conflictRow(props.players.slice(2, 4), true)}

          <Image
            maw={"100%"}
            mah={"100%"}
            p="30"
            fit={"contain"}
            src={combat_icon_tinted}
            style={{
              opacity: "0.25"
            }}
            alt="Combat icon"/>
        </Box>
      </Group>
    </Box>
  )
}