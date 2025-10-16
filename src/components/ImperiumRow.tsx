import { ScrollArea, Image } from "@mantine/core";

export function ImperiumRow() {
  return (
    <ScrollArea className="scrollarea-imperium-row" w={"100%"} offsetScrollbars={false} type={"never"} scrollbars="x">
      <div style={{ display: 'flex', gap: 16, padding: 16 }}>
        <Image bg={"transparent"} w={"auto"} mah={"325"} maw={"225"} fit={"cover"} radius={"lg"}
               src="https://api.dunecardshub.com/uploads/images/68.png" alt="Card">
        </Image>

        <Image bg={"transparent"} w={"auto"} mah={"325"} maw={"225"} fit={"cover"} radius={"lg"}
               src="https://api.dunecardshub.com/uploads/images/68.png" alt="Card">
        </Image>

        <Image bg={"transparent"} w={"auto"} mah={"325"} maw={"225"} fit={"cover"} radius={"lg"}
               src="https://api.dunecardshub.com/uploads/images/68.png" alt="Card">
        </Image>

        <Image bg={"transparent"} w={"auto"} mah={"325"} maw={"225"} fit={"cover"} radius={"lg"}
               src="https://api.dunecardshub.com/uploads/images/68.png" alt="Card">
        </Image>

        <Image bg={"transparent"} w={"auto"} mah={"325"} maw={"225"} fit={"cover"} radius={"lg"}
               src="https://api.dunecardshub.com/uploads/images/68.png" alt="Card">
        </Image>
      </div>
    </ScrollArea>
  )
}