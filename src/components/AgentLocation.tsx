import type {AgentLocationModel} from "../model/AgentLocationModel.tsx";
import {Box, Group, type MantineStyleProp, type StyleProp} from "@mantine/core";
import agent_icon_blue from '../assets/agents/agent_blue.svg';
import type {Property} from "csstype";

export function AgentLocation(props: {
  location: AgentLocationModel;
  agentsContainerStyle?: {top: Property.Top, left: Property.Left};
  style?: MantineStyleProp
  w?: StyleProp<Property.Width>
  h?: StyleProp<Property.Height>
  maw?: StyleProp<Property.MaxWidth>
  mah?: StyleProp<Property.MaxHeight>
  bg?: string;
}) {

  const getAgentIcon = () => {
    return (
      <img
        width={25}
        src={agent_icon_blue}
        alt="Agent icon"
        className={"locations-agent-icon"}/>
    )
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
          top: props.agentsContainerStyle.top,
          left: props.agentsContainerStyle.left,
        }}>
        {
          props.location.agents.map((agent) => getAgentIcon())
        }
      </Group>
    </Box>
  )
}