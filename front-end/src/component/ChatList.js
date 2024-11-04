import React, { useEffect, useState } from 'react';
import { List, Avatar, Spin, Button, Modal, Input } from 'antd';
import axios from 'axios';
import moment from 'moment';
import './styles.css';

const ChatList = ({ token }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/chat', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChats(data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des conversations", error);
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const { data } = await axios.get(`/api/messages/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await axios.post(
        '/api/messages', // Route API pour envoyer un message
        { content: newMessage, chatId: selectedChat._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMessage('');
      fetchMessages(selectedChat._id); // Recharger les messages après l'envoi
    } catch (error) {
      console.error("Erreur lors de l'envoi du message", error);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;
    try {
      await axios.post(
        '/api/chat/group',
        { name: groupName, users: '["user1", "user2"]' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsModalVisible(false);
      fetchChats(); // Recharger les chats
    } catch (error) {
      console.error("Erreur lors de la création du groupe", error);
    }
  };

  const openModal = (chat) => {
    setSelectedChat(chat);
    setIsModalVisible(true);
    fetchMessages(chat._id); // Récupérer les messages lorsque la modal s'ouvre
  };

  return (
    <div className="chat-list-container">
      <div className="chat-header">
        <h2>Mes Conversations</h2>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Créer un groupe
        </Button>
      </div>

      <Spin spinning={loading}>
        <List
          itemLayout="horizontal"
          dataSource={chats}
          renderItem={(chat) => (
            <List.Item
              actions={[
                <Button type="link" onClick={() => openModal(chat)}>
                  Détails
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar src={chat.isGroupChat ? 'group.png' : 'user.png'} />
                }
                title={chat.chatName}
                description={
                  chat.latestMessage
                    ? `Dernier message: ${chat.latestMessage.content}`
                    : 'Pas encore de message'
                }
              />
              <div>
                {chat.latestMessage && moment(chat.updatedAt).fromNow()}
              </div>
            </List.Item>
          )}
        />
      </Spin>

      <Modal
        title={selectedChat ? `Chat avec ${selectedChat.chatName}` : 'Créer un groupe'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {selectedChat ? (
          <div>
            <h3>Messages</h3>
            <div className="messages-container">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`message ${msg.sender._id === selectedChat._id ? 'sent' : 'received'}`}
                >
                  <p><strong>{msg.sender.name}:</strong> {msg.content}</p>
                  <span>{moment(msg.createdAt).fromNow()}</span>
                </div>
              ))}
            </div>
            <Input
              placeholder="Écrire un message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onPressEnter={handleSendMessage}
            />
            <Button type="primary" onClick={handleSendMessage}>
              Envoyer
            </Button>
          </div>
        ) : (
          <div>
            <Input
              placeholder="Nom du groupe"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <Button type="primary" onClick={handleCreateGroup}>
              Créer
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ChatList;
