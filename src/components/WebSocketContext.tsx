import {useEffect, createContext, useRef, useContext, useCallback, useState} from "react";
import * as React from "react";

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
  children: React.ReactNode;
};

const WebSocketContext = createContext<WebSocketContextType>({})

export const WebSocketProvider: React.FC<Props> = ({ gameId, children }) => {
  const [socket, setSocket] = useState<WebSocket>(null)
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
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log("Sending WS message", message)
      socket.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not open");
    }
  }, [socket])

  useEffect(() => {
    if (!gameId || gameId.trim() === "") {
      console.log("Game ID is unavailable. Not creating WS connection");
      return;
    }

    console.log("Game ID is now available. Creating WS connection");

    /* WS initialization and cleanup */
    const ws = new WebSocket(`ws://localhost:8080/game/${gameId}`)
    ws.onopen = () => { console.log('WS open') }
    ws.onclose = () => { console.log('WS close') }
    ws.onmessage = (message) => {
      const { action, body } = JSON.parse(message.data)

      Array.from(callbackMap.current.keys())
        .filter(key => key.startsWith(action))
        .forEach(key => {
          const callback = callbackMap.current.get(key)
          callback?.onMessage(action, body)
        })
    }

    setSocket(ws)

    return () => { ws.close() }
  }, [gameId]);

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