import React from "react";
import { FiPlus, FiMessageSquare, FiTrash2 } from "react-icons/fi";

function ChatSelectPane({ sessions, activeSessionId, onCreateSession, onSelectSession, onDeleteSession }) {
    return (
        <div className="chatSelectPaneContainer">
            <button className="newChatBtn" onClick={onCreateSession}>
                <FiPlus className="btnIcon" /> New Chat
            </button>

            <div className="recentChatsTitle">
                <span>Recent Conversations</span>
            </div>

            <div className="sessionsList">
                {sessions.length === 0 ? (
                    <div className="noSessionsText">No past chats</div>
                ) : (
                    sessions.map((session) => {
                        const isActive = session.id === activeSessionId;
                        return (
                            <div 
                                key={session.id} 
                                className={`sessionItem ${isActive ? 'active' : ''}`}
                                onClick={() => onSelectSession(session.id)}
                            >
                                <FiMessageSquare className="sessionIcon" />
                                <span className="sessionTitleText">{session.title}</span>
                                <button 
                                    className="deleteSessionBtn"
                                    onClick={(e) => onDeleteSession(session.id, e)}
                                    aria-label="Delete conversation"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default ChatSelectPane;