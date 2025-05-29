import React, { useState } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
`;

const LoginForm = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  z-index: 1;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover:not(:disabled) {
    background-color: #357abd;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const RegisterLink = styled(Link)`
  display: block;
  text-align: center;
  color: #4a90e2;
  text-decoration: none;
  margin-top: 1rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  margin-top: 1rem;
  text-align: center;
`;

const Footer = styled.div`
  position: absolute;
  bottom: 20px;
  text-align: center;
  color: white;
  font-size: 0.9rem;
  opacity: 0.8;
`;

// 커피챗 관련 스타일 컴포넌트들
const CoffeeChatContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

const CoffeeChatButton = styled.button<{ isOpen: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  
  &:hover {
    transform: ${props => props.isOpen ? 'rotate(180deg) scale(1.1)' : 'scale(1.1)'};
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }
  
  &:active {
    transform: ${props => props.isOpen ? 'rotate(180deg) scale(0.95)' : 'scale(0.95)'};
  }
`;

const ChatWindow = styled.div<{ isOpen: boolean }>`
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 300px;
  height: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  transform: ${props => props.isOpen ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(20px)'};
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
  color: white;
  padding: 1rem;
  border-radius: 12px 12px 0 0;
  text-align: center;
  font-weight: bold;
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ChatMessage = styled.div<{ isBot?: boolean }>`
  background: ${props => props.isBot ? '#f0f0f0' : '#4a90e2'};
  color: ${props => props.isBot ? '#333' : 'white'};
  padding: 0.5rem 1rem;
  border-radius: ${props => props.isBot ? '12px 12px 12px 4px' : '12px 12px 4px 12px'};
  align-self: ${props => props.isBot ? 'flex-start' : 'flex-end'};
  max-width: 80%;
  font-size: 0.9rem;
  animation: slideIn 0.3s ease;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ChatInput = styled.div`
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  gap: 0.5rem;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  
  &:focus {
    border-color: #4a90e2;
  }
`;

const SendButton = styled.button`
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #357abd;
  }
`;

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { text: "안녕하세요! ☕️ 가계부 사용에 도움이 필요하시면 언제든 말씀해주세요!", isBot: true },
    { text: "로그인에 문제가 있으시거나 궁금한 점이 있으시면 채팅으로 문의해주세요! 😊", isBot: true }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // axios 기본 설정으로 쿠키 포함
      axios.defaults.withCredentials = true;
      
      const response = await axios.post('http://localhost:8000/api/auth/login/', {
        username,
        password,
      }, {
        withCredentials: true
      });

      if (response.data.status === 'success') {
        // 사용자 정보를 localStorage에 저장
        localStorage.setItem('user_id', response.data.user_id);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('is_admin', response.data.is_admin.toString());
        localStorage.setItem('token', response.data.token || 'logged_in');
        localStorage.setItem('isLoggedIn', 'true');
        
        console.log('Login successful, session should be set'); // 디버깅용
        
        // 대시보드로 이동
        navigate('/dashboard');
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const sendMessage = () => {
    if (currentMessage.trim()) {
      const newMessages = [
        ...chatMessages,
        { text: currentMessage, isBot: false }
      ];
      setChatMessages(newMessages);
      setCurrentMessage('');
      
      // 봇 응답 시뮬레이션
      setTimeout(() => {
        const botResponses = [
            "추가 문의사항은 dlwpgjs0723@naver.com 으로 문의해주세요! 감사합니다. 💻"
        ];
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
        setChatMessages(prev => [...prev, { text: randomResponse, isBot: true }]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <Title>💲 가계부 💲</Title>
        <InputGroup>
          <Label htmlFor="username">아이디</Label>
          <Input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="password">비밀번호</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </InputGroup>
        <Button type="submit" disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </Button>
        <RegisterLink to="/register">계정이 없으신가요? 회원가입하기</RegisterLink>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </LoginForm>
      
      <Footer>
        개발/기획/디자인 : JeHeon Lee
      </Footer>

      {/* 커피챗 컴포넌트 */}
      <CoffeeChatContainer>
        <ChatWindow isOpen={isChatOpen}>
          <ChatHeader>
            ☕️ 커피챗 도우미
          </ChatHeader>
          <ChatBody>
            {chatMessages.map((message, index) => (
              <ChatMessage key={index} isBot={message.isBot}>
                {message.text}
              </ChatMessage>
            ))}
          </ChatBody>
          <ChatInput>
            <MessageInput
              type="text"
              placeholder="메시지를 입력하세요..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <SendButton onClick={sendMessage}>
              ➤
            </SendButton>
          </ChatInput>
        </ChatWindow>
        <CoffeeChatButton isOpen={isChatOpen} onClick={toggleChat}>
          ☕️
        </CoffeeChatButton>
      </CoffeeChatContainer>
    </LoginContainer>
  );
};

export default Login; 