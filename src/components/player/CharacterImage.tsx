import type {PlayerModel} from "../../model/PlayerModel.tsx";
import {Avatar, Box, Button, Divider, Group, Image, Modal, Stack, Text, Tooltip} from "@mantine/core";
import first_player_icon from "../../assets/agents/first_player_token.png";
import {useDisclosure} from "@mantine/hooks";
import {useState} from "react";
import {Contracts} from "./Contracts.tsx";
import {SardaukarSkills} from "./SardaukarSkills.tsx";
import {getColoredTroopIcon} from "../../const/GameUtils.tsx";
import sardaukar_commander_icon from "../../assets/combat/sardaukar_commander.png";
import {TechTiles} from "./TechTiles.tsx";

export function CharacterImage(
  props: {
    playerModel: PlayerModel,
    firstPlayer: string
  }
) {
  const [selectedImageSide, setSelectedImageSide] = useState<number>(0);
  const [opened, {open, close}] = useDisclosure(false);

  const flipCharacterCard = () => {
    if (selectedImageSide === 0) setSelectedImageSide(1);
    else setSelectedImageSide(0);
  }

  return (
    <>
      <Modal
        size={"auto"}
        opened={opened}
        onClose={close}
        withCloseButton={false}
        transitionProps={{ transition: 'fade' }}
        overlayProps={{
          backgroundOpacity: 0.85,
        }}
        styles={{
          content: {
            backgroundColor: 'transparent'
          },
        }}
        centered>
        <Stack align={"center"}>
          <Image
            bg={"transparent"}
            w={"auto"}
            mah={"400"}
            fit={"cover"}
            radius={"md"}
            src={props.playerModel.character.urls[selectedImageSide]}
            alt="Character"/>

          {props.playerModel.character.urls.length > 1 &&
            <Button
              onClick={flipCharacterCard}
              w={"150"}
              className={`setup-action-button-next`}
              size="md"
              radius="0"
              variant="filled">Flip card</Button>}

          <Group ps={16} gap={5} justify={"center"}>
            <Text
              c={"white"}
              className={"player-resource-info-text"}
              size={"1.4em"}>{props.playerModel.combat.troopsInSupply}</Text>
            <Image
              w={30}
              src={getColoredTroopIcon(props.playerModel.color)}/>
            <Divider orientation="vertical" ms={"10"} me={"10"} color={"#cacaca44"}/>
            <Text
              c={"white"}
              className={"player-resource-info-text"}
              size={"1.4em"}>{props.playerModel.combat.commandersInSupply}</Text>
            <Image
              w={30}
              src={sardaukar_commander_icon}/>
          </Group>

          <Contracts player={props.playerModel} nonInteractive={true}/>
          <SardaukarSkills player={props.playerModel} nonInteractive={true}/>
          <TechTiles player={props.playerModel} nonInteractive={true}/>
        </Stack>
      </Modal>

      <Box pos={"relative"} w={65} h={65}>
        {props.firstPlayer === props.playerModel.name &&
          <Tooltip label="First player">
            <Image
              pos={"absolute"}
              m={4}
              w={25}
              style={{zIndex: 10}}
              src={first_player_icon}
              hidden={props.firstPlayer != props.playerModel.name}/>
          </Tooltip>
        }
        <Avatar
          onClick={open}
          radius="xs"
          size="65"
          src={props.playerModel.character.avatarUrl}/>
      </Box>
    </>
  )
}