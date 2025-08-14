// const { Socket } = require("socket.io");

document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    const toggleBtn = document.querySelector("#sidebarToggle");
    const messageInput = document.querySelector("#messageInput");
    const sendBtn = document.querySelector(".mic-btn");
    const messagesContainer = document.querySelector(".messages");
    const newChatBtn = document.querySelector(".sidebar button"); // "New Chat" button

    let currentChatMessages = []; // current chat store
    let chatHistory = []; // all old chats
    let isNewChat = true; // flag to track if chat is fresh

    // Sidebar Toggle
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            sidebar.classList.toggle("show");
        });
    }

    // Send Message
    function sendMessage() {
        if (messageInput.value.trim() !== "") {
            appendMessage("user", messageInput.value.trim());
            messageInput.value = "";

            
        }
    }

    // Append Message
    function appendMessage(sender, text) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message", sender);
        msgDiv.innerHTML = text;
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        currentChatMessages.push({ sender, text });

        if(sender === "user"){
            socket.emit('ai-message', text)
        }
    }

    socket.on('ai-message-response', (result)=>{
        appendMessage("bot", result)
    })
    

    // Send on button click
    sendBtn.addEventListener("click", sendMessage);

    // Send on Enter key
    messageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    // New Chat Button
    newChatBtn.addEventListener("click", () => {
        if (currentChatMessages.length > 0 && isNewChat) {
            chatHistory.push(currentChatMessages);
            addChatToSidebar(currentChatMessages);
        }
        currentChatMessages = [];
        messagesContainer.innerHTML = "";
        isNewChat = true; // reset for new conversation
    });

    // Add Chat to Sidebar History
    function addChatToSidebar(chat) {
        const firstMsg = chat[0]?.text || "Untitled Chat";
        const chatDiv = document.createElement("div");
        chatDiv.classList.add("chat-item");
        chatDiv.textContent = firstMsg.length > 20 ? firstMsg.slice(0, 20) + "..." : firstMsg;

        chatDiv.addEventListener("click", () => {
            loadChat(chat);
        });

        sidebar.appendChild(chatDiv);
    }

    // Load Chat from History
        function loadChat(chat) {
        messagesContainer.innerHTML = "";
        currentChatMessages = chat; // 🔹 direct reference, no copy
        messagesContainer.innerHTML = ""; // clear UI
        chat.forEach(msg => {
            const msgDiv = document.createElement("div");
            msgDiv.classList.add("message", msg.sender);
            msgDiv.innerHTML = msg.text;
            messagesContainer.appendChild(msgDiv);
        });
        isNewChat = false; // history se load hua
    }

});
