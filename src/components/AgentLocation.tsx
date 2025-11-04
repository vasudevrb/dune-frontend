import type {AgentLocationModel} from "../model/AgentLocationModel.tsx";
import {Box, Group, type MantineStyleProp, type StyleProp} from "@mantine/core";
import agent_icon_blue from '../assets/agents/agent_blue.svg';
import type {Property} from "csstype";
import agent_icon_red from "../assets/agents/agent_red.svg";
import agent_icon_gold from "../assets/agents/agent_gold.svg";
import agent_icon_green from "../assets/agents/agent_green.svg";
import agent_icon_disabled from "../assets/agents/agent_disabled.svg";

export function AgentLocation(props: {
  location: AgentLocationModel;
  agentsContainerStyle?: { top: Property.Top, left: Property.Left };
  style?: MantineStyleProp
  w?: StyleProp<Property.Width>
  h?: StyleProp<Property.Height>
  maw?: StyleProp<Property.MaxWidth>
  mah?: StyleProp<Property.MaxHeight>
  bg?: string;
}) {

  const getAgentIcon = (color: string) => {
    if (color === "RED") return agent_icon_red;
    else if (color === "BLUE") return agent_icon_blue;
    else if (color === "GOLD") return agent_icon_gold;
    else if (color === "GREEN") return agent_icon_green;
    else if (color === "GRAY") return agent_icon_disabled;
  }

  console.log(`Agents: ${JSON.stringify(props.location)}`);

  return (
    <Box
      pos={"absolute"}
      w={props.w}
      h={props.h}
      maw={props.maw}
      mah={props.mah}
      bg={props.bg}
      style={props.style}>
      <Group
        className="locations-agent-icon-container"
        align="center"
        gap={0}
        style={{
          position: "absolute",
          top: props.agentsContainerStyle?.top,
          left: props.agentsContainerStyle?.left,
        }}>
        {
          props.location.agents.map((agent) =>
            <img
              width={25}
              src={getAgentIcon(agent.color)}
              alt="Agent icon"
              className={"locations-agent-icon"}/>
          )
        }
      </Group>
    </Box>
  )
}