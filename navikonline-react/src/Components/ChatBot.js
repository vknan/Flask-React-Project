import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [usage, setUsage] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchChatHistory();
        fetchUsageStatus();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchChatHistory = async () => {
        try {
            const response = await axios.get('/api/chat/history/');
            setMessages(response.data.history);
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    };

    const fetchUsageStatus = async () => {
        try {
            const response = await axios.get('/api/chat/usage/');
            setUsage(response.data);
        } catch (error) {
            console.error('Error fetching usage status:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setIsLoading(true);
        const userMessage = input;
        setInput('');

        try {
            const response = await axios.post('/api/chat/', {
                message: userMessage
            });

            setMessages(prev => [...prev, {
                message: userMessage,
                response: response.data.response,
                timestamp: new Date().toISOString()
            }]);

            setUsage(prev => ({
                ...prev,
                free_requests_used: prev.free_requests_used + 1
            }));
        } catch (error) {
            if (error.response?.status === 403) {
                alert('Free trial limit reached. Please upgrade to premium.');
            } else {
                console.error('Error sending message:', error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto my-8 bg-white rounded-xl shadow-md flex flex-col h-[80vh]">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">AI Assistant</h2>
                {usage && (
                    <div className="text-sm">
                        {usage.is_premium ? (
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full font-medium">Premium</span>
                        ) : (
                            <span className="text-gray-500">
                                {10 - usage.free_requests_used} free requests remaining
                            </span>
                        )}
                    </div>
                )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {messages.map((msg, index) => (
                    <div key={index} className="flex flex-col gap-2">
                        <div className="self-end max-w-[80%] bg-blue-500 text-white p-3 rounded-xl rounded-br-sm">
                            {msg.message}
                        </div>
                        <div className="self-start max-w-[80%] bg-gray-100 text-gray-800 p-3 rounded-xl rounded-bl-sm">
                            {msg.response}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="self-start max-w-[80%] bg-gray-100 text-gray-800 p-3 rounded-xl rounded-bl-sm">
                        <div className="flex gap-1 p-2">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isLoading || (usage && !usage.is_premium && usage.free_requests_used >= 10)}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none transition-colors focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
                <button 
                    type="submit" 
                    disabled={isLoading || !input.trim()}
                    className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg transition-colors hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatBot; 