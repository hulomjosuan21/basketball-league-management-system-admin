// lib/socketService.ts
import { io, Socket } from "socket.io-client";

export enum SocketEvent {
    CONNECT = "connect",
    CONNECT_ERROR = "connect_error",
    ERROR = "error",
    DISCONNECT = "disconnect",
    REGISTER = "register",
    ECHO = "echo",
    ECHO_RESPONSE = "echo_response",
    PRIVATE_MESSAGE = "private_message",
    NOTIFICATION = "notification",
}

class SocketService {
    private static instance: SocketService;
    private socket: Socket | null = null;
    private isInitialized = false;
    private hasErrorListeners = false;

    private constructor() { }

    static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    get isConnected(): boolean {
        return !!this.socket?.connected;
    }

    get isReady(): boolean {
        return this.isInitialized;
    }

    async waitUntilConnected(timeout = 5000): Promise<void> {
        const start = Date.now();
        while (!this.isConnected) {
            if (Date.now() - start > timeout) {
                throw new Error("Socket connection timed out.");
            }
            await new Promise((res) => setTimeout(res, 100));
        }
    }

    init(userId: string) {
        if (this.isInitialized) return;

        const url = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
        this.socket = io(url, {
            transports: ["websocket"],
            autoConnect: false,
        });

        // Register connect listener
        this.on(SocketEvent.CONNECT, () => {
            console.log("✅ Connected:", this.socket?.id);
            this.emit(SocketEvent.REGISTER, { user_id: userId });
        });

        this.socket.connect();

        if (!this.hasErrorListeners) {
            this.hasErrorListeners = true;

            this.on(SocketEvent.CONNECT_ERROR, (payload) => {
                console.error("❌ connect_error:", payload);
            });

            this.on(SocketEvent.ERROR, (payload) => {
                console.warn("⚠️ error:", payload);
            });

            this.on(SocketEvent.DISCONNECT, () => {
                console.log("🔌 disconnected");
            });
        }

        this.isInitialized = true;
    }

    emit(event: SocketEvent, payload: any) {
        this.socket?.emit(event, payload);
    }

    on(event: SocketEvent, handler: (payload: any) => void) {
        this.socket?.on(event, handler);
    }

    off(event: SocketEvent) {
        this.socket?.off(event);
    }

    dispose() {
        this.socket?.disconnect();
        this.socket = null;
        this.isInitialized = false;
        this.hasErrorListeners = false;
    }
}

export const socketService = SocketService.getInstance();
