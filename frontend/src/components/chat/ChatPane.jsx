import React, { useEffect, useRef, useState } from "react";
import InputBox from "./chatPane/InputBox.jsx";
import MessageBox from "./chatPane/MessageBox.jsx";

const FeatureCards = () => (
    <div className="welcome-features-grid">
        <div className="feature-card">
            <span className="feature-card-icon">🩺</span>
            <h4>Symptom Analysis</h4>
            <p>Enter your symptoms to receive detailed possible conditions and structured guidance.</p>
        </div>
        <div className="feature-card">
            <span className="feature-card-icon">📊</span>
            <h4>Health Risk Score</h4>
            <p>Get a dynamic risk rating from 1/10 to 10/10 based on clinical assessments.</p>
        </div>
        <div className="feature-card">
            <span className="feature-card-icon">🚨</span>
            <h4>Emergency Alerts</h4>
            <p>Immediate detection and high-visibility warnings for critical warning signs.</p>
        </div>
    </div>
);

function ChatPane({ activeSession, onCreateSession, onUpdateMessages }) {
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const messages = activeSession ? activeSession.messages : [];

    // Scroll to bottom whenever messages or loading state changes
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading]);

    const setMessagesWrapper = (updater) => {
        if (!activeSession) return;
        const newMsgs = typeof updater === 'function' ? updater(messages) : updater;
        onUpdateMessages(newMsgs);
    };

    return (
        <div className="chatPaneContainer">
            {!activeSession ? (
                <div className="introTextContainer">
                    <h1>Your Intelligent Health Screening Assistant</h1>
                    <h3>Analyze Symptoms • Assess Risk • Get Personalized Guidance</h3>
                    <FeatureCards />
                    <button className="startChatBtn" onClick={onCreateSession}>
                        ➕ Start a New Chat
                    </button>
                </div>
            ) : (
                <>
                    {messages.length === 0 && !isLoading && (
                        <div className="introTextContainer">
                            <h1>Your Intelligent Health Screening Assistant</h1>
                            <h3>Analyze Symptoms • Assess Risk • Get Personalized Guidance</h3>
                            <FeatureCards />
                        </div>
                    )}

                    <div className="MessagesContainer">
                        {messages.map((msg) => (
                            <MessageBox key={msg.id} content={msg.content} bot={msg.bot} />
                        ))}

                        {isLoading && (
                            <div className="MessageBoxContainer bot">
                                <div className="ProfileContainer">
                                    <img src="/ai_avatar.png" alt="AI Avatar" />
                                </div>
                                <div className="MessageBodyContainer">
                                    <div className="typing-indicator">
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                    </div>

                    <InputBox 
                        messages={messages} 
                        setMessages={setMessagesWrapper} 
                        isLoading={isLoading} 
                        setIsLoading={setIsLoading} 
                    />
                </>
            )}
        </div>
    );
}

export default ChatPane;