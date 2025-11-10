import '../css/CombatArea.css'
import {Box, Divider, Image, Flex, Group, Stack, Avatar, Text} from "@mantine/core";
import type {PlayerModel} from "../model/PlayerModel.tsx";
import combat_icon_tinted from '../assets/combat/combat_tinted.png';
import troop_icon from "../assets/combat/troop.png";
import worm_icon from "../assets/combat/worm.png";
import maker_hook_icon from "../assets/combat/maker_hook.png";
import strength_icon from "../assets/combat/strength.png";
import type {GameModel} from "../model/GameModel.tsx";

export function CombatArea(props: { game: GameModel }) {
  const playerConflictStats = (player: PlayerModel, dirLR: boolean) => {
    const playerAvatar = () => {
      return <Stack align={"center"} gap={"5"} style={{alignSelf: "flex-start"}}>
        <Avatar
          radius="0"
          size="lg"
          src={player.character.avatarUrl}/>

        <Group align="center" gap={"5"}>
          <Text className={"player-container-text"}>{player.combat.troopsInGarrison}</Text>
          <img width={20} src={troop_icon} alt="Garrissoned troops"/>
        </Group>

        {
          player.makerHookUnlocked &&
          <img width={40} src={maker_hook_icon} alt="Maker hook"/>
        }
      </Stack>
    }
    const combatStrength = () => {
      return <Stack align={"center"} gap={"5"} style={{flex: 1, textAlign: 'center', alignSelf: "center"}}>
        <Group align="center" gap={"5"}>
          <Text className={"combat-container-text"}>{player.combat.troopsInCombat}</Text>
          <img width={15} src={troop_icon} alt="Troop icon"/>
          <Divider color={"#cacaca"} m={2} orientation={"vertical"} style={{opacity:0.5}}/>
          <Text className={"combat-container-text"}>{player.combat.wormsInCombat}</Text>
          <img width={15} src={worm_icon} alt="Worm icon"/>
        </Group>

        <Divider color={"#cacaca"} w="65%" orientation={"horizontal"} style={{opacity:0.5}} />

        <Group align="center" gap={"5"}>
          <Text size="1.3em" className={"combat-container-text"}>
            {player.combat.strength}
          </Text>
          <img width={20} src={strength_icon} alt="Total strength"/>
        </Group>

      </Stack>
    }
    return (
      <Group w={"50%"} h={"100%"} key={`combat-area-${player.name}-${dirLR ? "left": "right"}`}>
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

  const getConflictCard = () => {
    return (
      <Flex direction={"column"} justify={"flex-end"} w={"25%"} h={"100%"}>
        <Image
          mah={"175px"}
          fit={"contain"}
          radius={"10"}
          src={"https://api.dunecardshub.com/uploads/images/conflict_1lvl_uprising_02.png"}
          style={{
            objectPosition: "right center",
            filter: `drop-shadow(0 0 30px #94664dca)`
          }}
          alt="Combat icon"/>
      </Flex>
    )
  }

  return (
    <Group
      h={"250px"}
      mah={"250px"}
      w={"500px"}
      style={{
        position: "absolute",
        bottom: "80px",
        right: "320px",
      }}>
      {getConflictCard()}
      <Box
        className={"combat-container"}
        maw={"500px"}
        w={"75%"}
        h={"100%"}
        style={{flex: 1}}
        pos={"relative"}>

        <Divider color={"#cacaca"} h={"30%"} orientation={"vertical"} style={{opacity: "0.2", position: "absolute", top:"10%", left: "50%"}}/>
        <Divider color={"#cacaca"} h={"30%"} orientation={"vertical"} style={{opacity: "0.2", position: "absolute", bottom: "10%", left: "50%"}}/>
        <Divider color={"#cacaca"} w={"30%"} orientation={"horizontal"} style={{opacity: "0.2", position: "absolute", left:"10%", bottom: "50%"}}/>
        <Divider color={"#cacaca"} w={"30%"} orientation={"horizontal"} style={{opacity: "0.2", position: "absolute", bottom: "50%", right: "10%"}}/>

        {conflictRow(props.game.players.slice(0, 2), false)}
        {conflictRow(props.game.players.slice(2, 4), true)}

        <Image
          maw={"100%"}
          mah={"100%"}
          p="40"
          fit={"contain"}
          src={combat_icon_tinted}
          draggable={false}
          style={{opacity: "0.1"}}
          alt="Combat icon"/>
      </Box>
    </Group>
  )
}