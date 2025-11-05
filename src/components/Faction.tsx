import {FactionType} from "../model/PlayerModel.tsx";
import {Box, Image} from "@mantine/core";
import fremen_image from '../assets/locations/fremen_faction.png';
import bene_gesserit_image from '../assets/locations/bene_gesserit_faction.png';
import emperor_image from '../assets/locations/emperor_faction.png';
import spacing_guild_image from '../assets/locations/spacing_guild_faction.png';

export function Faction(props: {
  factionType: FactionType
}) {
  const getFactionBoardImage = () => {
    switch (props.factionType) {
      case FactionType.Fremen : return fremen_image;
      case FactionType.BeneGesserit : return bene_gesserit_image;
      case FactionType.Emperor : return emperor_image;
      case FactionType.SpacingGuild: return spacing_guild_image;
    }
  }

  return (
    <Box bg={"#ffffff32"}>
        <Image
          maw={"335px"}
          fit={"contain"}
          src={getFactionBoardImage()}
          alt="Location"/>
    </Box>
  )
}