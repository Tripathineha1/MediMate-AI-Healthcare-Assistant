import React, { useState } from "react";
import axios from 'axios';

function InputBox({ messages, setMessages, isLoading, setIsLoading }) {
    const [query, setQuery] = useState('');

    const suggestions = [
        { text: "I have a high fever and body aches.", label: "Fever 🤒" },
        { text: "I have a mild runny nose and am sneezing.", label: "Cold 🤧" },
        { text: "I have a severe, throbbing headache.", label: "Headache 🤕" },
        { text: "I have sudden severe chest pain and short of breath.", label: "Chest Pain 🚨" }
    ];

    async function onSubmit(e) {
        e.preventDefault();
        if (!query.trim() || isLoading) return;

        const userMsg = {
            id: 'user-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
            content: query,
            bot: false
        };

        setMessages(prev => [...prev, userMsg]);
        const currentQuery = query;
        setQuery('');
        setIsLoading(true);

        try {
            const url = axios.defaults.baseURL ? '/query' : 'http://localhost:8081/query';
            const response = await axios.post(url, { query: currentQuery });
            
            if (response.data && response.data.data) {
                setMessages(prev => [...prev, {
                    id: 'bot-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
                    content: response.data.data,
                    bot: true
                }]);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error) {
            console.error("API error:", error);
            setMessages(prev => [...prev, {
                id: 'err-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
                content: "I'm sorry, I'm having trouble reaching my clinical knowledge base right now. Please verify that the MediMate backend server is running and try again.",
                bot: true
            }]);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="InputBoxContainer">
            <div className="suggestion-chips-container">
                {suggestions.map((s, idx) => (
                    <button 
                        key={idx} 
                        type="button" 
                        className="suggestion-chip"
                        onClick={() => setQuery(s.text)}
                        disabled={isLoading}
                    >
                        {s.label}
                    </button>
                ))}
            </div>
            <form className="InputForm" onSubmit={onSubmit}>
                <input
                    type="text"
                    placeholder={isLoading ? "Analyzing symptoms..." : "Describe your symptoms (e.g., severe headache and high fever)..."}
                    className="InputBox"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !query.trim()}
                    aria-label="Send query"
                >
                    <img src="/send.png" alt="Send" />
                </button>
            </form>
        </div>
    );
}

export default InputBox;
