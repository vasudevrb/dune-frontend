import type {PlayerModel} from "../../model/PlayerModel.tsx";
import {Avatar, Box, Button, Image, Modal, Stack, Tooltip} from "@mantine/core";
import first_player_icon from "../../assets/agents/first_player_token.png";
import {useDisclosure} from "@mantine/hooks";
import {useState} from "react";

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
        styles={{
          content: {
            backgroundColor: 'transparent'
          },
        }}
        centered>
        <Stack align={"flex-end"}>
          <Image
            bg={"transparent"}
            w={"auto"}
            maw={"700"}
            fit={"cover"}
            radius={"xs"}
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