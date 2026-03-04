const chats = [
  {
    id: "1",
    name: "MANLIX Новости",
    status: "214 908 подписчиков",
    messages: [
      { fromMe: false, text: "Добро пожаловать в MANLIX!", time: "09:12" },
      { fromMe: true, text: "Интерфейс очень похож на Telegram 👀", time: "09:13" }
    ]
  },
  {
    id: "2",
    name: "Команда разработки",
    status: "6 участников",
    messages: [
      { fromMe: false, text: "Готовим релиз мессенджера", time: "10:01" },
      { fromMe: false, text: "Добавьте голосовые и стикеры позже", time: "10:02" }
    ]
  },
  {
    id: "3",
    name: "Алексей",
    status: "был(а) недавно",
    messages: [
      { fromMe: false, text: "Привет! Проверяю новый MANLIX", time: "11:25" }
    ]
  }
];

const chatListEl = document.getElementById("chatList");
const messagesEl = document.getElementById("messages");
const chatTitleEl = document.getElementById("chatTitle");
const chatStatusEl = document.getElementById("chatStatus");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const chatSearch = document.getElementById("chatSearch");

let activeChatId = chats[0]?.id ?? null;

function renderChatList(filter = "") {
  const normalized = filter.trim().toLowerCase();
  const filteredChats = chats.filter((chat) => chat.name.toLowerCase().includes(normalized));

  chatListEl.innerHTML = "";

  filteredChats.forEach((chat) => {
    const last = chat.messages[chat.messages.length - 1];
    const li = document.createElement("li");
    li.className = `chat-item ${chat.id === activeChatId ? "active" : ""}`;
    li.dataset.chatId = chat.id;
    li.innerHTML = `
      <div>
        <div class="chat-item__name">${chat.name}</div>
        <div class="chat-item__preview">${last?.text ?? "Нет сообщений"}</div>
      </div>
      <div class="chat-item__time">${last?.time ?? ""}</div>
    `;

    li.addEventListener("click", () => {
      activeChatId = chat.id;
      render();
    });

    chatListEl.appendChild(li);
  });
}

function renderMessages(chat) {
  messagesEl.innerHTML = "";
  chat.messages.forEach((message) => {
    const node = document.createElement("article");
    node.className = `message ${message.fromMe ? "me" : "other"}`;
    node.innerHTML = `
      <div>${message.text}</div>
      <div class="message__meta">${message.time}</div>
    `;
    messagesEl.appendChild(node);
  });
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function getNow() {
  return new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

function render() {
  const active = chats.find((chat) => chat.id === activeChatId);
  renderChatList(chatSearch.value);

  if (!active) {
    chatTitleEl.textContent = "Выберите чат";
    chatStatusEl.textContent = "Оффлайн";
    messagesEl.innerHTML = "";
    return;
  }

  chatTitleEl.textContent = active.name;
  chatStatusEl.textContent = active.status;
  renderMessages(active);
}

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = messageInput.value.trim();
  if (!text || !activeChatId) return;

  const active = chats.find((chat) => chat.id === activeChatId);
  active.messages.push({
    fromMe: true,
    text,
    time: getNow()
  });

  messageInput.value = "";
  render();
});

chatSearch.addEventListener("input", () => renderChatList(chatSearch.value));

render();
