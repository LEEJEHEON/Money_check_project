import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const Sidebar = styled.div`
  width: 250px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  padding: 0 1rem;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-left: 3px solid transparent;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-left-color: white;
  }
  
  &.active {
    background-color: rgba(255, 255, 255, 0.2);
    border-left-color: white;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
`;

const Header = styled.div`
  background: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  color: #333;
  margin: 0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserBadge = styled.span`
  background-color: #007bff;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
`;

const AdminBadge = styled.span`
  background-color: #dc3545;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
`;

const LogoutButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #c82333;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const Card = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h3`
  color: #333;
  margin: 0 0 1rem 0;
`;

const CardContent = styled.div`
  color: #666;
  font-size: 2rem;
  font-weight: bold;
`;

const AdminMessage = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Dashboard: React.FC = () => {
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인 상태 확인
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const storedUsername = localStorage.getItem('username');
    
    if (!isLoggedIn || !storedUsername) {
      navigate('/login');
      return;
    }
    
    setUsername(storedUsername);
    // admin 계정인지 확인
    setIsAdmin(storedUsername === 'admin');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const renderMenu = () => {
    if (isAdmin) {
      return (
        <MenuList>
          <MenuItem className="active">🏷️ 카테고리 관리</MenuItem>
          <MenuItem>⚙️ 설정</MenuItem>
        </MenuList>
      );
    } else {
      return (
        <MenuList>
          <MenuItem className="active">📊 대시보드</MenuItem>
          <MenuItem>💰 거래 내역</MenuItem>
          <MenuItem>📝 거래 등록</MenuItem>
          <MenuItem>💳 예산 관리</MenuItem>
          <MenuItem>📈 리포트</MenuItem>
        </MenuList>
      );
    }
  };

  const renderContent = () => {
    if (isAdmin) {
      return (
        <AdminMessage>
          <h2>🔧 관리자 페이지</h2>
          <p>카테고리 관리와 시스템 설정을 담당합니다.</p>
          <p>왼쪽 메뉴에서 원하는 기능을 선택해주세요.</p>
        </AdminMessage>
      );
    } else {
      return (
        <DashboardGrid>
          <Card>
            <CardTitle>이번 달 총 수입</CardTitle>
            <CardContent style={{ color: '#28a745' }}>
              ₩ 0
            </CardContent>
          </Card>
          
          <Card>
            <CardTitle>이번 달 총 지출</CardTitle>
            <CardContent style={{ color: '#dc3545' }}>
              ₩ 0
            </CardContent>
          </Card>
          
          <Card>
            <CardTitle>이번 달 잔액</CardTitle>
            <CardContent style={{ color: '#007bff' }}>
              ₩ 0
            </CardContent>
          </Card>
          
          <Card>
            <CardTitle>예산 대비 지출</CardTitle>
            <CardContent style={{ color: '#ffc107' }}>
              0%
            </CardContent>
          </Card>
        </DashboardGrid>
      );
    }
  };

  return (
    <DashboardContainer>
      <Sidebar>
        <Logo>💲 가계부 💲</Logo>
        {renderMenu()}
      </Sidebar>
      
      <MainContent>
        <Header>
          <Title>{isAdmin ? '카테고리 관리' : '대시보드'}</Title>
          <UserInfo>
            <span>{username}님 환영합니다!</span>
            {isAdmin ? <AdminBadge>관리자</AdminBadge> : <UserBadge>사용자</UserBadge>}
            <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
          </UserInfo>
        </Header>
        
        {renderContent()}
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard; 