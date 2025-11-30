import {useEffect, createContext, useRef, useContext, useCallback, useState} from "react";
import * as React from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {BASE_URL} from "../const/ApiConstants.tsx";

interface WebSocketContextType {
  subscribe: (actions: string[], component: string, callback: MessageCallback) => void;
  unsubscribe: (actions: string[], component: string) => void;
  sendMessage: (message: any) => void;
}

interface MessageCallback {
  onMessage: (action: string, body: any) => void;
}

type Props = {
  gameId: string;
  playerName: string;
  children: React.ReactNode;
};

// @ts-ignore
const WebSocketContext = createContext<WebSocketContextType>({})

export const WebSocketProvider: React.FC<Props> = ({ gameId, playerName, children }) => {
  // @ts-ignore
  const [wsClient, setWsClient] = useState<Client>(null)
  const callbackMap = useRef<Map<string, MessageCallback>>(new Map())

  const getCallbackKey = (action: string, component: string) => {
    return action + "#" + component;
  }

  /* called from a component that registers a callback for a channel */
  const subscribe = (actions: string[], component: string, callback: MessageCallback) => {
    actions.forEach(action => {
      const key = getCallbackKey(action, component)
      callbackMap.current.set(key, callback)
    })
  }
  /* remove callback  */
  const unsubscribe = (actions: string[], component: string) => {
    actions.forEach(action => {
      const key = getCallbackKey(action, component)
      callbackMap.current.delete(key)
    })
  }

  const sendMessage = useCallback((message: any) => {
    if (wsClient) {
      console.log("Sending WS message", message)
      wsClient.publish({
        destination: `/app/game/${gameId}`,
        body: JSON.stringify(message),
      });
    } else {
      console.warn("WebSocket is not open");
    }
  }, [wsClient])

  const dispatchMessageToComponents = (message: string) => {
    const { action, body } = JSON.parse(message)

    Array.from(callbackMap.current.keys())
      .filter(key => key.startsWith(action))
      .forEach(key => {
        const callback = callbackMap.current.get(key)
        callback?.onMessage(action, body)
      })
  }

  useEffect(() => {
    if (!gameId || gameId.trim() === "") {
      console.log("Game ID is unavailable. Not creating WS connection");
      return;
    }

    if (!playerName || playerName.trim() === "") {
      console.log("Player Name is unavailable. Not creating WS connection");
      return;
    }

    console.log("WSContext: Dependencies now available. Creating WS connection");

    /* WS initialization and cleanup */
    const ws = new SockJS(`${BASE_URL}/game`)
    const client = new Client({
      webSocketFactory: () => ws,
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
      connectHeaders: {
        "player-name": playerName
      },
      onConnect: () => {
        console.log(`Connected as ${playerName}`);
        client.subscribe(`/topic/game/${gameId}`, (msg) => {
          console.log(`Public message received: ${JSON.stringify(msg.body)}`);
          dispatchMessageToComponents(msg.body)
        });
        client.subscribe(`/user/queue/game/${gameId}`, (msg) => {
          console.log(`Private message received: ${JSON.stringify(msg.body)}`);
          dispatchMessageToComponents(msg.body)
        });
      },
    })

    client.activate();
    setWsClient(client)

    return () => { ws.close }
  }, [gameId, playerName]);

  const value = { subscribe, unsubscribe, sendMessage };
  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}