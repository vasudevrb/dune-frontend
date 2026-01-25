import '../../css/Players.css'
import {Button, Group, ScrollArea, Stack} from "@mantine/core";
import {Player} from "./Player.tsx";
import type {PlayerModel} from "../../model/PlayerModel.tsx";
import type {GameModel} from "../../model/GameModel.tsx";
import {useWebSocket} from "../WebSocketContext.tsx";
import {CLEAR_ROUND, END_TURN, REVEAL, USE_FAMILY_ATOMICS} from "../../const/Actions.tsx";
import {PopoverContainer} from "../PopoverContainer.tsx";
import atomics_token from "../../assets/atomics_token.png";
import {IconButton} from "./IconButton.tsx";
import {useGameStore} from "../../store/GameStore.tsx";
import {assertExists} from "../../const/GameUtils.tsx";

export function Players(props: { game: GameModel }) {

  const {gameState} = useGameStore();
  const {sendMessage} = useWebSocket();

  const isThisPlayerCurrentPlayer = assertExists(
    props.game.players.find(p => p.isThisPlayer),
    "This player not found"
  ).name === props.game.currentPlayer;

  const filterPlayers = (predicate: (player: PlayerModel) => boolean) => {
    return props.game.players.filter(predicate)
  }

  const getPlayerElements = (predicate: (player: PlayerModel) => boolean) => {
    return filterPlayers(predicate)
      .map(player => (
        <Player
          key={player.name}
          playerModel={player}
          currentPlayer={props.game.currentPlayer}
          firstPlayer={props.game.firstPlayer}
        />
      ))
  }

  const clearRound = () => {
    sendMessage({action: CLEAR_ROUND})
  }

  const getTextButton = (
    label: string,
    onClick?: () => void,
    variant?: string,
  ) => {
    return (
      <Button
        onClick={onClick}
        className={`setup-action-button-next`}
        color={"#A08170"}
        size="s"
        radius="0"
        variant={variant ? variant : "filled"}>{label}</Button>
    )
  }

  const endTurnAction = () => {
    sendMessage({action: END_TURN})
  }

  const revealAction = () => {
    sendMessage({action: REVEAL})
  }

  const showAtomicsToken = props.game.containsAtomics &&
    assertExists(
      props.game.players.find(p => p.isThisPlayer),
      "This player not found"
    ).hasAtomicsToken;

  return (
    <ScrollArea
      className={"scroll-area-players"}
      h={"100%"}
      offsetScrollbars={false}
      type={"never"}
      style={{
        zIndex: 5
      }}
      scrollbars="y">
      <Stack
        gap="0"
        w={"300px"}
        style={{minHeight: '100%'}}>
        {getPlayerElements(p => !p.isThisPlayer)}
        {getPlayerElements(p => p.isThisPlayer)}

        <Stack gap={12} p={12} className={"current-player-global-actions-container"}>
          <Group w={"100%"} gap={"xs"} justify={"flex-end"}>
            {
              isThisPlayerCurrentPlayer && showAtomicsToken &&
              <PopoverContainer
                label={"Use Atomics"}
                onclick={() => sendMessage({action: USE_FAMILY_ATOMICS})}
                style={{}}>
                <IconButton icon={atomics_token} h={"45"}/>
              </PopoverContainer>
            }
            {getTextButton("REVEAL", () => revealAction(), "outline")}
            {(isThisPlayerCurrentPlayer || gameState.containsRivals)
              && getTextButton("END TURN", () => endTurnAction())}
          </Group>

          <Button
            className={`setup-action-button-next`}
            color={"red"}
            onDoubleClick={clearRound}
            size="s"
            radius="0"
            variant={"light"}>CLEAR ROUND</Button>

        </Stack>
      </Stack>
    </ScrollArea>
  )
}