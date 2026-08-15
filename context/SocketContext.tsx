import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Socket, io } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {

    const socketUrl =process.env.NEXT_PUBLIC_SOCKET_SERVER;


    const socketInstance: Socket = io(socketUrl, {
      transports: ["websocket"],
      secure: true,
      autoConnect: true,
    });

    socketInstance.on("connect", () => {
      console.log("✅ Socket connected:", socketInstance.id);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("❌ Socket connect error:", err);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket(): Socket | null {
  const context = useContext(SocketContext);
  if (!context) {
    console.warn("useSocket must be used within a SocketProvider");
    return null;
  }
  return context.socket;
}
