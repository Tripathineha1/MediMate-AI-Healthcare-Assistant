import React, { useState, useEffect } from "react";
import ChatPane from "./chat/ChatPane.jsx";
import ChatSelectPane from "./chat/ChatSelectPane.jsx";
import "./chat/mainChatCSS.css"

function MainChat() {
    const [sessions, setSessions] = useState(() => {
        const saved = localStorage.getItem("medimate_sessions");
        return saved ? JSON.parse(saved) : [];
    });

    const [activeSessionId, setActiveSessionId] = useState(() => {
        const saved = localStorage.getItem("medimate_active_session_id");
        return saved || null;
    });

    // Save sessions to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("medimate_sessions", JSON.stringify(sessions));
    }, [sessions]);

    // Save activeSessionId to localStorage whenever it changes
    useEffect(() => {
        if (activeSessionId) {
            localStorage.setItem("medimate_active_session_id", activeSessionId);
        } else {
            localStorage.removeItem("medimate_active_session_id");
        }
    }, [activeSessionId]);

    const handleCreateSession = () => {
        const newSession = {
            id: 'session-' + Date.now(),
            title: "New Chat",
            messages: []
        };
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
    };

    const handleSelectSession = (id) => {
        setActiveSessionId(id);
    };

    const handleDeleteSession = (id, e) => {
        e.stopPropagation(); // Prevent switching session when clicking delete
        setSessions(prev => {
            const filtered = prev.filter(s => s.id !== id);
            if (activeSessionId === id) {
                setActiveSessionId(filtered.length > 0 ? filtered[0].id : null);
            }
            return filtered;
        });
    };

    const handleUpdateMessages = (id, newMessages) => {
        setSessions(prev => prev.map(s => {
            if (s.id === id) {
                // Determine a nice title based on the first user query
                let newTitle = s.title;
                if (newTitle === "New Chat" || newTitle === "New Conversation") {
                    const firstUserMsg = newMessages.find(m => !m.bot);
                    if (firstUserMsg && typeof firstUserMsg.content === 'string') {
                        newTitle = firstUserMsg.content.length > 25 
                            ? firstUserMsg.content.substring(0, 25) + '...' 
                            : firstUserMsg.content;
                    }
                }
                return {
                    ...s,
                    title: newTitle,
                    messages: newMessages
                };
            }
            return s;
        }));
    };

    // If activeSessionId is set but doesn't exist in sessions, clean it up
    useEffect(() => {
        if (activeSessionId && !sessions.some(s => s.id === activeSessionId)) {
            setActiveSessionId(sessions.length > 0 ? sessions[0].id : null);
        }
    }, [sessions, activeSessionId]);

    const activeSession = sessions.find(s => s.id === activeSessionId);

    return (
        <div style={{display: "flex", height: "100vh"}}>
            <div className="mainChatContainer" style={{height: "inherit"}}>
                <ChatSelectPane 
                    sessions={sessions}
                    activeSessionId={activeSessionId}
                    onCreateSession={handleCreateSession}
                    onSelectSession={handleSelectSession}
                    onDeleteSession={handleDeleteSession}
                />
                <ChatPane 
                    activeSession={activeSession}
                    onCreateSession={handleCreateSession}
                    onUpdateMessages={(newMsgs) => activeSessionId && handleUpdateMessages(activeSessionId, newMsgs)}
                />
            </div>
        </div>
    );
}

export default MainChat;