// @ts-expect-error msg can be any
export const sendMessage = (wsRef: RefObject<WebSocket | null>, msg) => {
  if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
    wsRef.current.send(JSON.stringify(msg));
  } else {
    console.warn("WebSocket is not open");
  }
};