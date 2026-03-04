import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { fetchNotifications, fetchUnreadCount, markAsRead as apiMarkAsRead } from "../services/notificationService";
import { connectWebSocket, disconnectWebSocket } from "../services/websocketService";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const loadInitialData = useCallback(async () => {
        try {
            const count = await fetchUnreadCount();
            setUnreadCount(count);

            const firstPage = await fetchNotifications(0, 10);
            setNotifications(firstPage.content);
            setHasMore(!firstPage.last);
            setPage(0);
        } catch (error) {
            console.error("Failed to load initial notifications:", error);
        }
    }, []);

    const loadMoreNotifications = async () => {
        if (!hasMore || loading) return;
        setLoading(true);
        try {
            const nextPage = page + 1;
            const data = await fetchNotifications(nextPage, 10);
            setNotifications(prev => [...prev, ...data.content]);
            setHasMore(!data.last);
            setPage(nextPage);
        } catch (error) {
            console.error("Failed to load more notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            // Optimistic update
            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === id ? { ...notif, read: true } : notif
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));

            await apiMarkAsRead(id);
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
            // Revert on failure
            loadInitialData();
        }
    };

    const handleIncomingNotification = useCallback((message) => {
        const isRead = message.isRead === true || message.isRead === "true";

        // Add to list avoiding duplicates
        setNotifications(prev => {
            if (message.id && prev.some(n => n.id === message.id)) {
                return prev;
            }
            return [message, ...prev];
        });

        if (!isRead) {
            setUnreadCount(prev => prev + 1);
        }

        // Show toast
        const textMessage = message.message || "New notification!";
        toast(textMessage, {
            icon: '🔔',
            duration: 5000,
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
    }, []);

    useEffect(() => {
        const initProvider = async () => {
            const userStr = localStorage.getItem("user");
            const token = localStorage.getItem("accessToken");

            if (userStr && token) {
                const user = JSON.parse(userStr);
                await loadInitialData();

                try {
                    await connectWebSocket(user.id, (message) => {
                        console.log("Context received WebSocket message:", message);
                        // All notifications should pass through handleIncomingNotification
                        handleIncomingNotification(message);
                    });
                } catch (error) {
                    console.error("WebSocket connection failed in context:", error);
                }
            }
        };

        initProvider();

        const handleStorageChange = (e) => {
            if (e.key === "accessToken" && e.newValue) {
                initProvider();
            } else if (e.key === "accessToken" && !e.newValue) {
                disconnectWebSocket();
                setNotifications([]);
                setUnreadCount(0);
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            disconnectWebSocket();
        };
    }, [loadInitialData, handleIncomingNotification]);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            hasMore,
            loading,
            loadMoreNotifications,
            markAsRead,
            loadInitialData
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
