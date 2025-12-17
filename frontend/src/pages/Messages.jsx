import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';

const Messages = () => {
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('studentId');
  
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (studentId) {
      selectConversationByStudent(studentId);
    }
  }, [studentId, conversations]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get('/api/messages/conversations', { withCredentials: true });
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectConversationByStudent = (studentId) => {
    const conversation = conversations.find(conv => 
      conv.participant._id === studentId
    );
    if (conversation) {
      setSelectedConversation(conversation);
      fetchMessages(studentId);
    }
  };

  const fetchMessages = async (participantId) => {
    try {
      const response = await axios.get(`/api/messages/${participantId}`, { withCredentials: true });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await axios.post('/api/messages/send', {
        recipientId: selectedConversation.participant._id,
        content: newMessage
      }, { withCredentials: true });
      
      setNewMessage('');
      fetchMessages(selectedConversation.participant._id);
      fetchConversations(); // Refresh conversations
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingBottom: '80px' }}>
        <h1>Messages</h1>
        
        <div style={{ display: 'flex', gap: '20px', height: '600px' }}>
          {/* Conversations List */}
          <div style={{ width: '300px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <div style={{ padding: '15px', borderBottom: '1px solid #ddd', backgroundColor: '#f8f9fa' }}>
              <h3 style={{ margin: 0 }}>Conversations</h3>
            </div>
            <div style={{ overflowY: 'auto', height: '550px' }}>
              {conversations.length === 0 ? (
                <p style={{ padding: '15px' }}>No conversations yet</p>
              ) : (
                conversations.map((conversation) => (
                  <div
                    key={conversation.participant._id}
                    onClick={() => {
                      setSelectedConversation(conversation);
                      fetchMessages(conversation.participant._id);
                    }}
                    style={{
                      padding: '15px',
                      borderBottom: '1px solid #eee',
                      cursor: 'pointer',
                      backgroundColor: selectedConversation?.participant._id === conversation.participant._id ? '#e3f2fd' : 'white'
                    }}
                  >
                    <h4 style={{ margin: '0 0 5px 0' }}>
                      {conversation.participant.firstName} {conversation.participant.lastName}
                    </h4>
                    <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>
                      {conversation.participant.department} - {conversation.participant.registerNumber}
                    </p>
                    {conversation.lastMessage && (
                      <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>
                        {conversation.lastMessage.content.substring(0, 50)}...
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, border: '1px solid #ddd', borderRadius: '4px', display: 'flex', flexDirection: 'column' }}>
            {selectedConversation ? (
              <>
                {/* Header */}
                <div style={{ padding: '15px', borderBottom: '1px solid #ddd', backgroundColor: '#f8f9fa' }}>
                  <h3 style={{ margin: 0 }}>
                    {selectedConversation.participant.firstName} {selectedConversation.participant.lastName}
                  </h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                    {selectedConversation.participant.department} - {selectedConversation.participant.registerNumber}
                  </p>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, padding: '15px', overflowY: 'auto', backgroundColor: '#fafafa' }}>
                  {messages.length === 0 ? (
                    <p>No messages yet. Start the conversation!</p>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message._id}
                        style={{
                          marginBottom: '15px',
                          display: 'flex',
                          justifyContent: message.sender._id === selectedConversation.participant._id ? 'flex-start' : 'flex-end'
                        }}
                      >
                        <div
                          style={{
                            maxWidth: '70%',
                            padding: '10px 15px',
                            borderRadius: '18px',
                            backgroundColor: message.sender._id === selectedConversation.participant._id ? 'white' : '#007bff',
                            color: message.sender._id === selectedConversation.participant._id ? 'black' : 'white',
                            border: message.sender._id === selectedConversation.participant._id ? '1px solid #ddd' : 'none'
                          }}
                        >
                          <p style={{ margin: 0 }}>{message.content}</p>
                          <small style={{ 
                            opacity: 0.7, 
                            fontSize: '11px',
                            color: message.sender._id === selectedConversation.participant._id ? '#666' : '#ccc'
                          }}>
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </small>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={sendMessage} style={{ padding: '15px', borderTop: '1px solid #ddd' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '20px' }}
                    />
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      style={{ borderRadius: '20px', padding: '10px 20px' }}
                    >
                      Send
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Messages;