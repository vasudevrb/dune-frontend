import type {AgentModel, ControlFlagModel, PlayerModel, SpyModel} from "../../model/PlayerModel.tsx";
import {Image} from "@mantine/core";
import spy_icon_red from '../../assets/spies/spy_red.png';
import spy_icon_green from '../../assets/spies/spy_green.png';
import spy_icon_blue from '../../assets/spies/spy_blue.png';
import spy_icon_gold from '../../assets/spies/spy_gold.png';
import control_flag_red from '../../assets/control_flags/control_flag_red.png';
import control_flag_blue from '../../assets/control_flags/control_flag_blue.png';
import control_flag_gold from '../../assets/control_flags/control_flag_gold.png';
import control_flag_green from '../../assets/control_flags/control_flag_green.png';
import {range} from "../../const/Util.tsx";
import {getAgentIcon} from "../../const/GameUtils.tsx";

export function Agent(props: { player: PlayerModel, agentModel: AgentModel, index: number }) {

  const getAgentColor = (index: number): string => {
    const totalNumUsableAgents = props.player.swordmasterUnlocked ? 3 : 2;
    const agentAvailability = range(0, totalNumUsableAgents)
      .map(i => {
        return i === 0 ? props.player.swordmasterUnlocked : true;
      });

    if (!agentAvailability[index]) return "GRAY"
    const availableBefore = agentAvailability.slice(0, index).filter(a => a).length;
    const numAgentsUsed = props.player.agents.filter(a => a.atLocation).length;

    return availableBefore < numAgentsUsed ? "GRAY" : props.player.color
  }

  const agentIcon = getAgentIcon(getAgentColor(props.index))

  return (
    <Image
      draggable={false}
      w={25}
      src={agentIcon}
      alt="Agent icon"
      className={"players-agent-icon"}/>
  )
}

export function Spy(props: { player: PlayerModel, spyModel: SpyModel, index: number }) {

  const getSpyIcon = (color: string) => {
    if (color === "RED") return spy_icon_red;
    else if (color === "BLUE") return spy_icon_blue;
    else if (color === "GOLD") return spy_icon_gold;
    else if (color === "GREEN") return spy_icon_green;
  }

  const spyIcon = getSpyIcon(props.player.color)

  return (
    <Image
      draggable={false}
      w={25}
      src={spyIcon}
      alt="Spy icon"
      className={"players-spy-icon"}/>
  )
}

export function ControlFlag(props: { player: PlayerModel, controlFlagModel: ControlFlagModel, index: number }) {

  const getControlFlagIcon = (color: string) => {
    if (color === "RED") return control_flag_red;
    else if (color === "BLUE") return control_flag_blue;
    else if (color === "GOLD") return control_flag_gold;
    else if (color === "GREEN") return control_flag_green;
  }

  const controlFlagIcon = getControlFlagIcon(props.player.color)

  return (
    <Image
      draggable={false}
      w={30}
      src={controlFlagIcon}
      alt="Control flag icon"
      className={"players-control-flag-icon"}/>
  )
}