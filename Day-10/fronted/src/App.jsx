import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import "./index.css";

function App() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([

  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new message added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Connect to socket when component mounts
  useEffect(() => {
    const socketInstance = io("http://localhost:3000/");
    setSocket(socketInstance);

    // OPTIONAL: handle incoming messages from server
    socketInstance.on('ai-message-response', (response)=>{
      const botMessage = {
        id: Date.now() + 1,
        text: response,
        timestamp: new Date().toLocaleTimeString(),
        sender: 'bot'
      }

      setMessages(prevMessage => [...prevMessage, botMessage])
    });

    return () => socketInstance.disconnect(); // cleanup on unmount
  }, []);

  // Send message
  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    // Emit message to server
    socket.emit('ai-message', input)

    setInput("");
  };

  return (
    <div className="app-container">
      <div className="chat-box">
        <header className="chat-header">🤖 BotX - AI Chat Assistant </header>

        <div className="chat-body">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.type === "user" ? "user" : "bot"}`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
