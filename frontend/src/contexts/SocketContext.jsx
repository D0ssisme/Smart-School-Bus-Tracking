import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children, userId }) => {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!userId) return;

        const newSocket = io('http://localhost:8080', {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        newSocket.on('connect', () => {
            console.log('✅ Socket connected:', newSocket.id);
            setConnected(true);

            // Register user
            newSocket.emit('register_user', userId);
        });

        newSocket.on('disconnect', () => {
            console.log('❌ Socket disconnected');
            setConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('🔴 Socket connection error:', error);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [userId]);

    // ⭐ Function để subscribe bus location
    const subscribeToBus = (busId) => {
        if (socket && connected) {
            socket.emit('subscribe_bus', busId);
            console.log(`📍 Subscribed to bus ${busId}`);
        }
    };

    const unsubscribeFromBus = (busId) => {
        if (socket && connected) {
            socket.emit('unsubscribe_bus', busId);
            console.log(`🚫 Unsubscribed from bus ${busId}`);
        }
    };

    return (
        <SocketContext.Provider value={{
            socket,
            connected,
            subscribeToBus,
            unsubscribeFromBus
        }}>
            {children}
        </SocketContext.Provider>
    );
};