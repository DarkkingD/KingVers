import { useEffect, useState } from 'react';
import api from '../api/client.js';
import { useSocket } from '../hooks/useSocket.js';
import { useAuth } from '../context/AuthContext.jsx';

const Chat = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('kv_token');
  const socket = useSocket(token);
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [newUserId, setNewUserId] = useState('');

  const loadConversations = async () => {
    const res = await api.get('/chat/conversations');
    setConversations(res.data.conversations || []);
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (!active) return;
    api.get(`/chat/conversations/${active._id}/messages`).then((res) => setMessages(res.data.messages || []));
  }, [active]);

  useEffect(() => {
    if (!socket) return;
    socket.on('private:message', (payload) => {
      if (payload.conversationId === active?._id) {
        setMessages((prev) => [...prev, payload.message]);
      }
      loadConversations();
    });
    return () => socket.off('private:message');
  }, [socket, active]);

  const send = () => {
    if (!text.trim() || !active || !user) return;
    const other = active.participants.find((p) => p._id !== user.id);
    socket.emit('private:message', {
      conversationId: active._id,
      toUserId: other?._id,
      text
    });
    setText('');
  };

  const startConversation = async () => {
    if (!newUserId) return;
    const res = await api.post('/chat/conversations', { userId: newUserId });
    setNewUserId('');
    setActive(res.data.conversation);
    loadConversations();
  };

  return (
    <div className="grid gap-4 md:grid-cols-[280px_1fr]">
      <div className="card p-4 space-y-3">
        <h2 className="text-lg text-dusk">Conversations</h2>
        <input
          className="w-full rounded-lg border border-dusk/20 px-3 py-2 text-sm"
          placeholder="User ID pour démarrer"
          value={newUserId}
          onChange={(e) => setNewUserId(e.target.value)}
        />
        <button onClick={startConversation} className="rounded-lg bg-ink px-3 py-2 text-white text-sm">
          Nouvelle discussion
        </button>
        <div className="space-y-2">
          {conversations.map((conv) => (
            <button
              key={conv._id}
              onClick={() => setActive(conv)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                active?._id === conv._id ? 'bg-ink text-white' : 'bg-parchment'
              }`}
            >
              {conv.participants.map((p) => p.displayName || p.username).join(' • ')}
            </button>
          ))}
        </div>
      </div>
      <div className="card p-4 flex flex-col">
        <h2 className="text-lg text-dusk">Messages</h2>
        <div className="flex-1 space-y-2 overflow-y-auto py-3">
          {messages.map((msg) => (
            <div key={msg._id} className="rounded-lg bg-parchment px-3 py-2 text-sm">
              {msg.text}
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input
            className="flex-1 rounded-lg border border-dusk/20 px-3 py-2"
            placeholder="Votre message"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={send} className="rounded-lg bg-ember px-4 py-2 text-white">
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
