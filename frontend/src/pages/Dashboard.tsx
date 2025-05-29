import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TransactionManagement from './TransactionManagement';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const Header = styled.div`
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 250px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  min-height: calc(100vh - 80px);
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

const SubMenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: rgba(255, 255, 255, 0.1);
  border-left: 3px solid #ffffff;
`;

const MenuItem = styled.li<{ isActive?: boolean }>`
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

const ContentArea = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background-color: #f8f9fa;
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

const UserBadge = styled.span<{ isAdmin?: boolean }>`
  background-color: ${props => props.isAdmin ? '#dc3545' : '#007bff'};
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

// 유저 관리 관련 스타일 컴포넌트들
const UserManagementContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const TableHeader = styled.th`
  background-color: #f8f9fa;
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid #dee2e6;
  font-weight: bold;
  color: #495057;
`;

const TableRow = styled.tr`
  &:nth-of-type(even) {
    background-color: #f8f9fa;
  }
  
  &:hover {
    background-color: #e9ecef;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  color: #495057;
`;

const UserBadgeInTable = styled.span<{ isAdmin?: boolean }>`
  background-color: ${props => props.isAdmin ? '#dc3545' : '#007bff'};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
`;

const StatusBadge = styled.span<{ isActive?: boolean }>`
  background-color: ${props => props.isActive ? '#28a745' : '#6c757d'};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6c757d;
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const SubMenuItem = styled.li<{ isActive?: boolean }>`
  padding: 0.75rem 2rem;
  cursor: pointer;
  background-color: ${props => props.isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  color: #ffffff;
  border-left: ${props => props.isActive ? '3px solid #ffffff' : '3px solid transparent'};
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
    color: #ffffff;
    transform: translateX(5px);
  }
`;

const ServerManagementContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

// 설정 메뉴 컨테이너 스타일 추가
const SettingsMenuContainer = styled.div`
  position: relative;
`;

// 모달 관련 스타일 컴포넌트들
const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: bold;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    color: #666;
  }
`;

const FormSelect = styled.select`
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;
`;

const SaveButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover:not(:disabled) {
    background-color: #218838;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover:not(:disabled) {
    background-color: #c82333;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    background-color: #5a6268;
  }
`;

const ClickableTableRow = styled(TableRow)`
  cursor: pointer;
  
  &:hover {
    background-color: #e3f2fd !important;
  }
`;

const FormTextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h2 {
    margin: 0;
    color: #333;
  }
`;

const AddButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background-color: #218838;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #dee2e6;
  }
  
  th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #495057;
  }
  
  tbody tr:hover {
    background-color: #f8f9fa;
  }
`;

// 사용자 인터페이스 타입 정의
interface User {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  date_joined: string;
  last_login: string;
}

interface Category {
  id: number;
  type: string;
  type_display: string;
  name: string;
  remark: string;
  created_by: string;
  created_at: string;
}

interface Transaction {
  id: number;
  transaction_type: string;
  transaction_type_display: string;
  amount: string;
  description: string;
  transaction_date: string;
  memo: string;
  category: {
    id: number;
    name: string;
    type_display: string;
  };
  created_at: string;
}

const Dashboard: React.FC = () => {
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [isSettingsHovered, setIsSettingsHovered] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    password: '',
    is_active: true
  });
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    type: '',
    name: '',
    remark: ''
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>([]);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactionForm, setTransactionForm] = useState({
    category_id: '',
    transaction_type: '',
    amount: '',
    description: '',
    transaction_date: '',
    memo: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedIsAdmin = localStorage.getItem('is_admin') === 'true';
    
    if (!token || !storedUsername) {
      navigate('/login');
      return;
    }
    
    setUsername(storedUsername);
    setIsAdmin(storedIsAdmin);
    
    // 사용자 권한에 따라 기본 메뉴 설정 및 데이터 로딩
    if (storedIsAdmin) {
      setActiveMenu('dashboard');
      // 카테고리 관리 화면이 기본이므로 카테고리 목록을 미리 불러옴
      setTimeout(() => {
        fetchCategories();
      }, 100);
    } else {
      setActiveMenu('dashboard');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    localStorage.removeItem('is_admin');
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // axios 기본 설정으로 쿠키 포함
      axios.defaults.withCredentials = true;
      
      const response = await axios.get('http://localhost:8000/api/auth/users/', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('API Response:', response.data); // 디버깅용
      
      if (response.data.status === 'success') {
        setUsers(response.data.users);
      }
    } catch (err: any) {
      console.error('API Error:', err); // 디버깅용
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError('로그인이 필요합니다. 다시 로그인해주세요.');
        // 로그인 페이지로 리다이렉트
        localStorage.clear();
        navigate('/login');
      } else {
        setError('사용자 목록을 불러오는데 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/categories/', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setCategories(data.categories);
      } else {
        setError(data.message || '카테고리 목록을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      setError('서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/auth/api/transactions/', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setTransactions(data.transactions);
      } else {
        setError(data.message || '거래 내역을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      setError('서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
    setError(null);
    
    if (menu === 'user-management') {
      fetchUsers();
    } else if (menu === 'category-management') {
      fetchCategories();
    } else if (menu === 'transactions') {
      fetchTransactions();
    }
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      username: user.username,
      email: user.email,
      password: '',
      is_active: user.is_active
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setEditForm({
      username: '',
      email: '',
      password: '',
      is_active: true
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    
    setModalLoading(true);
    
    try {
      const updateData: any = {
        username: editForm.username,
        email: editForm.email,
        is_active: editForm.is_active
      };
      
      // 비밀번호가 입력된 경우에만 포함
      if (editForm.password.trim()) {
        updateData.password = editForm.password;
      }
      
      const response = await axios.put(
        `http://localhost:8000/api/auth/users/${selectedUser.id}/`,
        updateData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (response.data.status === 'success') {
        // 사용자 목록 업데이트
        setUsers(prev => prev.map(user => 
          user.id === selectedUser.id ? response.data.user : user
        ));
        handleCloseModal();
        alert('사용자 정보가 수정되었습니다.');
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert('사용자 정보 수정에 실패했습니다.');
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    if (!confirm(`정말로 "${selectedUser.username}" 사용자를 삭제하시겠습니까?`)) {
      return;
    }
    
    setModalLoading(true);
    
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/auth/users/${selectedUser.id}/delete/`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (response.data.status === 'success') {
        // 사용자 목록에서 제거
        setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
        handleCloseModal();
        alert(response.data.message);
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert('사용자 삭제에 실패했습니다.');
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setCategoryForm({
      type: category.type,
      name: category.name,
      remark: category.remark
    });
    setIsCategoryModalOpen(true);
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setCategoryForm({
      type: '',
      name: '',
      remark: ''
    });
    setIsCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setSelectedCategory(null);
    setCategoryForm({
      type: '',
      name: '',
      remark: ''
    });
  };

  const handleCategoryFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategoryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveCategory = async () => {
    try {
      const url = selectedCategory 
        ? `http://localhost:8000/api/categories/${selectedCategory.id}/`
        : 'http://localhost:8000/api/categories/create/';
      
      const method = selectedCategory ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryForm),
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        closeCategoryModal();
        fetchCategories(); // 목록 새로고침
      } else {
        setError(data.message || '카테고리 저장에 실패했습니다.');
      }
    } catch (error) {
      setError('서버 연결에 실패했습니다.');
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    
    if (!window.confirm(`"${selectedCategory.name}" 카테고리를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/categories/${selectedCategory.id}/delete/`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        closeCategoryModal();
        fetchCategories(); // 목록 새로고침
      } else {
        setError(data.message || '카테고리 삭제에 실패했습니다.');
      }
    } catch (error) {
      setError('서버 연결에 실패했습니다.');
    }
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setTransactionForm({
      category_id: transaction.category.id.toString(),
      transaction_type: transaction.transaction_type,
      amount: transaction.amount,
      description: transaction.description,
      transaction_date: transaction.transaction_date,
      memo: transaction.memo
    });
    setIsTransactionModalOpen(true);
  };

  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    setTransactionForm({
      category_id: '',
      transaction_type: '',
      amount: '',
      description: '',
      transaction_date: new Date().toISOString().split('T')[0],
      memo: ''
    });
    setIsTransactionModalOpen(true);
  };

  const closeTransactionModal = () => {
    setIsTransactionModalOpen(false);
    setSelectedTransaction(null);
    setTransactionForm({
      category_id: '',
      transaction_type: '',
      amount: '',
      description: '',
      transaction_date: '',
      memo: ''
    });
  };

  const handleTransactionFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTransactionForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveTransaction = async () => {
    try {
      const url = selectedTransaction 
        ? `http://localhost:8000/api/auth/api/transactions/${selectedTransaction.id}/`
        : 'http://localhost:8000/api/auth/api/transactions/create/';
      
      const method = selectedTransaction ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionForm),
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        closeTransactionModal();
        fetchTransactions(); // 목록 새로고침
        alert(selectedTransaction ? '거래 내역이 수정되었습니다.' : '거래 내역이 추가되었습니다.');
      } else {
        setError(data.message || '거래 내역 저장에 실패했습니다.');
      }
    } catch (error) {
      setError('서버 연결에 실패했습니다.');
    }
  };

  const handleDeleteTransaction = async (transactionId: number) => {
    if (!confirm('정말로 이 거래 내역을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/auth/api/transactions/${transactionId}/delete/`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        fetchTransactions(); // 목록 새로고침
        alert('거래 내역이 삭제되었습니다.');
      } else {
        setError(data.message || '거래 내역 삭제에 실패했습니다.');
      }
    } catch (error) {
      setError('서버 연결에 실패했습니다.');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTransactions.length === 0) {
      alert('삭제할 거래 내역을 선택해주세요.');
      return;
    }

    if (!confirm(`선택한 ${selectedTransactions.length}개의 거래 내역을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/auth/api/transactions/bulk-delete/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transaction_ids: selectedTransactions }),
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setSelectedTransactions([]);
        fetchTransactions(); // 목록 새로고침
        alert(`${data.deleted_count}개의 거래 내역이 삭제되었습니다.`);
      } else {
        setError(data.message || '거래 내역 삭제에 실패했습니다.');
      }
    } catch (error) {
      setError('서버 연결에 실패했습니다.');
    }
  };

  const handleTransactionSelect = (transactionId: number) => {
    setSelectedTransactions(prev => {
      if (prev.includes(transactionId)) {
        return prev.filter(id => id !== transactionId);
      } else {
        return [...prev, transactionId];
      }
    });
  };

  const handleSelectAllTransactions = () => {
    if (selectedTransactions.length === transactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(transactions.map(t => t.id));
    }
  };

  const renderUserManagement = () => {
    return (
      <UserManagementContainer>
        <h2>👥 유저 관리</h2>
        <p>시스템에 등록된 모든 사용자를 관리할 수 있습니다. 사용자를 클릭하면 수정할 수 있습니다.</p>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {loading ? (
          <LoadingMessage>사용자 목록을 불러오는 중...</LoadingMessage>
        ) : (
          <UserTable>
            <thead>
              <tr>
                <TableHeader>ID</TableHeader>
                <TableHeader>사용자명</TableHeader>
                <TableHeader>이메일</TableHeader>
                <TableHeader>권한</TableHeader>
                <TableHeader>상태</TableHeader>
                <TableHeader>가입일</TableHeader>
                <TableHeader>최근 로그인</TableHeader>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <ClickableTableRow key={user.id} onClick={() => handleUserClick(user)}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <UserBadgeInTable isAdmin={user.is_admin}>
                      {user.is_admin ? '관리자' : '사용자'}
                    </UserBadgeInTable>
                  </TableCell>
                  <TableCell>
                    <StatusBadge isActive={user.is_active}>
                      {user.is_active ? '활성' : '비활성'}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{user.date_joined}</TableCell>
                  <TableCell>{user.last_login}</TableCell>
                </ClickableTableRow>
              ))}
            </tbody>
          </UserTable>
        )}
        
        {!loading && users.length === 0 && !error && (
          <LoadingMessage>등록된 사용자가 없습니다.</LoadingMessage>
        )}
      </UserManagementContainer>
    );
  };

  const renderUserEditModal = () => {
    if (!selectedUser) return null;

    return (
      <ModalOverlay isOpen={isModalOpen} onClick={handleCloseModal}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>👤 사용자 정보 수정</ModalTitle>
            <CloseButton onClick={handleCloseModal}>×</CloseButton>
          </ModalHeader>
          
          <FormGroup>
            <FormLabel>사용자명</FormLabel>
            <FormInput
              type="text"
              name="username"
              value={editForm.username}
              onChange={handleFormChange}
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>이메일</FormLabel>
            <FormInput
              type="email"
              name="email"
              value={editForm.email}
              onChange={handleFormChange}
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>새 비밀번호</FormLabel>
            <FormInput
              type="password"
              name="password"
              value={editForm.password}
              onChange={handleFormChange}
              placeholder="변경하지 않으려면 비워두세요"
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>상태</FormLabel>
            <FormSelect
              name="is_active"
              value={editForm.is_active.toString()}
              onChange={handleFormChange}
            >
              <option value="true">활성</option>
              <option value="false">비활성</option>
            </FormSelect>
          </FormGroup>
          
          <ButtonGroup>
            <CancelButton onClick={handleCloseModal}>
              취소
            </CancelButton>
            <DeleteButton 
              onClick={handleDeleteUser}
              disabled={modalLoading}
            >
              {modalLoading ? '삭제 중...' : '삭제'}
            </DeleteButton>
            <SaveButton 
              onClick={handleSaveUser}
              disabled={modalLoading}
            >
              {modalLoading ? '저장 중...' : '저장'}
            </SaveButton>
          </ButtonGroup>
        </ModalContent>
      </ModalOverlay>
    );
  };

  const renderTransactionManagement = () => {
    return (
      <ContentArea>
        <ContentHeader>
          <h2>💳 거래 내역 관리</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {selectedTransactions.length > 0 && (
              <DeleteButton onClick={handleBulkDelete}>
                선택 삭제 ({selectedTransactions.length})
              </DeleteButton>
            )}
            <AddButton onClick={handleAddTransaction}>
              + 거래 내역 추가
            </AddButton>
          </div>
        </ContentHeader>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {loading ? (
          <LoadingMessage>거래 내역을 불러오는 중...</LoadingMessage>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedTransactions.length === transactions.length && transactions.length > 0}
                    onChange={handleSelectAllTransactions}
                  />
                </th>
                <th>날짜</th>
                <th>구분</th>
                <th>카테고리</th>
                <th>내용</th>
                <th>금액</th>
                <th>메모</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <ClickableTableRow key={transaction.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedTransactions.includes(transaction.id)}
                      onChange={() => handleTransactionSelect(transaction.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td onClick={() => handleTransactionClick(transaction)}>
                    {transaction.transaction_date}
                  </td>
                  <td onClick={() => handleTransactionClick(transaction)}>
                    <span style={{ 
                      color: transaction.transaction_type === 'income' ? '#28a745' : '#dc3545',
                      fontWeight: 'bold'
                    }}>
                      {transaction.transaction_type_display}
                    </span>
                  </td>
                  <td onClick={() => handleTransactionClick(transaction)}>
                    {transaction.category.name}
                  </td>
                  <td onClick={() => handleTransactionClick(transaction)}>
                    {transaction.description}
                  </td>
                  <td onClick={() => handleTransactionClick(transaction)}>
                    <span style={{ 
                      color: transaction.transaction_type === 'income' ? '#28a745' : '#dc3545',
                      fontWeight: 'bold'
                    }}>
                      {transaction.transaction_type === 'income' ? '+' : '-'}
                      {Number(transaction.amount).toLocaleString()}원
                    </span>
                  </td>
                  <td onClick={() => handleTransactionClick(transaction)}>
                    {transaction.memo}
                  </td>
                  <td>
                    <DeleteButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTransaction(transaction.id);
                      }}
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                    >
                      삭제
                    </DeleteButton>
                  </td>
                </ClickableTableRow>
              ))}
            </tbody>
          </Table>
        )}
      </ContentArea>
    );
  };

  const renderTransactionModal = () => {
    if (!isTransactionModalOpen) return null;

    return (
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {selectedTransaction ? '거래 내역 수정' : '거래 내역 추가'}
            </ModalTitle>
            <CloseButton onClick={closeTransactionModal}>×</CloseButton>
          </ModalHeader>
          
          <FormGroup>
            <FormLabel>카테고리</FormLabel>
            <FormSelect
              name="category_id"
              value={transactionForm.category_id}
              onChange={handleTransactionFormChange}
              required
            >
              <option value="">카테고리를 선택하세요</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.type_display} - {category.name}
                </option>
              ))}
            </FormSelect>
          </FormGroup>

          <FormGroup>
            <FormLabel>거래 유형</FormLabel>
            <FormSelect
              name="transaction_type"
              value={transactionForm.transaction_type}
              onChange={handleTransactionFormChange}
              required
            >
              <option value="">거래 유형을 선택하세요</option>
              <option value="income">수입</option>
              <option value="expense">지출</option>
            </FormSelect>
          </FormGroup>

          <FormGroup>
            <FormLabel>금액</FormLabel>
            <FormInput
              type="number"
              name="amount"
              value={transactionForm.amount}
              onChange={handleTransactionFormChange}
              placeholder="금액을 입력하세요"
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>내용</FormLabel>
            <FormInput
              type="text"
              name="description"
              value={transactionForm.description}
              onChange={handleTransactionFormChange}
              placeholder="거래 내용을 입력하세요"
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>거래 날짜</FormLabel>
            <FormInput
              type="date"
              name="transaction_date"
              value={transactionForm.transaction_date}
              onChange={handleTransactionFormChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>메모</FormLabel>
            <FormInput
              type="text"
              name="memo"
              value={transactionForm.memo}
              onChange={handleTransactionFormChange}
              placeholder="메모 (선택사항)"
            />
          </FormGroup>

          <ButtonGroup>
            <CancelButton onClick={closeTransactionModal}>취소</CancelButton>
            <SaveButton onClick={handleSaveTransaction}>
              {selectedTransaction ? '수정' : '추가'}
            </SaveButton>
          </ButtonGroup>
        </ModalContent>
      </ModalOverlay>
    );
  };

  const renderServerManagement = () => {
    return (
      <ServerManagementContainer>
        <h2>🖥️ 서버 관리</h2>
        <p>서버 관리 기능은 현재 개발 중입니다.</p>
        <div style={{ marginTop: '2rem', color: '#6c757d' }}>
          <p>📊 서버 상태 모니터링</p>
          <p>🔧 시스템 설정</p>
          <p>📝 로그 관리</p>
          <p>🔄 백업 관리</p>
        </div>
      </ServerManagementContainer>
    );
  };

  const renderContent = () => {
    if (activeMenu === 'user-management') {
      return renderUserManagement();
    }

    if (activeMenu === 'category-management') {
      return (
        <ContentArea>
          <ContentHeader>
            <h2>카테고리 관리</h2>
            <AddButton onClick={handleAddCategory}>
              + 카테고리 추가
            </AddButton>
          </ContentHeader>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          {loading ? (
            <LoadingMessage>카테고리 목록을 불러오는 중...</LoadingMessage>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>구분</th>
                  <th>계정명</th>
                  <th>비고</th>
                  <th>생성자</th>
                  <th>생성일</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <ClickableTableRow 
                    key={category.id} 
                    onClick={() => handleCategoryClick(category)}
                  >
                    <td>{category.type_display}</td>
                    <td>{category.name}</td>
                    <td>{category.remark}</td>
                    <td>{category.created_by}</td>
                    <td>{new Date(category.created_at).toLocaleDateString()}</td>
                  </ClickableTableRow>
                ))}
              </tbody>
            </Table>
          )}
        </ContentArea>
      );
    }

    if (activeMenu === 'server-management') {
      return renderServerManagement();
    }

    if (activeMenu === 'transactions') {
      return <TransactionManagement />;
    }

    if (activeMenu === 'budget') {
      return (
        <ContentArea>
          <ContentHeader>
            <h2>📈 예산 관리</h2>
          </ContentHeader>
          <AdminMessage>
            <h3>예산 계획 및 관리</h3>
            <p>월별 예산을 설정하고 지출을 추적할 수 있습니다.</p>
            <p style={{ color: '#666', fontStyle: 'italic' }}>이 기능은 곧 추가될 예정입니다.</p>
          </AdminMessage>
        </ContentArea>
      );
    }

    if (activeMenu === 'reports') {
      return (
        <ContentArea>
          <ContentHeader>
            <h2>📋 보고서</h2>
          </ContentHeader>
          <AdminMessage>
            <h3>재정 보고서</h3>
            <p>다양한 통계와 보고서를 확인할 수 있습니다.</p>
            <p style={{ color: '#666', fontStyle: 'italic' }}>이 기능은 곧 추가될 예정입니다.</p>
          </AdminMessage>
        </ContentArea>
      );
    }

    // 기본 대시보드 화면
    if (isAdmin) {
      return (
        <ContentArea>
          <ContentHeader>
            <h2>관리자 대시보드</h2>
          </ContentHeader>
          <AdminMessage>
            <h3>🎉 관리자 대시보드에 오신 것을 환영합니다!</h3>
            <p>왼쪽 메뉴를 통해 다양한 관리 기능을 이용하실 수 있습니다.</p>
            <DashboardGrid>
              <Card>
                <CardTitle>🏷️ 카테고리 관리</CardTitle>
                <CardContent style={{ fontSize: '1rem', fontWeight: 'normal' }}>
                  회계 계정과 카테고리를 관리합니다
                </CardContent>
              </Card>
              <Card>
                <CardTitle>👥 사용자 관리</CardTitle>
                <CardContent style={{ fontSize: '1rem', fontWeight: 'normal' }}>
                  시스템 사용자를 관리합니다
                </CardContent>
              </Card>
              <Card>
                <CardTitle>🖥️ 서버 관리</CardTitle>
                <CardContent style={{ fontSize: '1rem', fontWeight: 'normal' }}>
                  서버 설정과 상태를 관리합니다
                </CardContent>
              </Card>
            </DashboardGrid>
          </AdminMessage>
        </ContentArea>
      );
    } else {
      return (
        <ContentArea>
          <ContentHeader>
            <h2>대시보드</h2>
          </ContentHeader>
          <AdminMessage>
            <h3>💰 Money Log에 오신 것을 환영합니다!</h3>
            <p>개인 재정 관리를 시작해보세요.</p>
            <DashboardGrid>
              <Card>
                <CardTitle>💳 거래 내역</CardTitle>
                <CardContent style={{ fontSize: '1rem', fontWeight: 'normal' }}>
                  수입과 지출을 기록하고 관리합니다
                </CardContent>
              </Card>
              <Card>
                <CardTitle>📈 예산 관리</CardTitle>
                <CardContent style={{ fontSize: '1rem', fontWeight: 'normal' }}>
                  월별 예산을 계획하고 추적합니다
                </CardContent>
              </Card>
              <Card>
                <CardTitle>📋 보고서</CardTitle>
                <CardContent style={{ fontSize: '1rem', fontWeight: 'normal' }}>
                  재정 상황을 분석하고 리포트를 확인합니다
                </CardContent>
              </Card>
            </DashboardGrid>
          </AdminMessage>
        </ContentArea>
      );
    }
  };

  const getPageTitle = () => {
    if (isAdmin) {
      return activeMenu;
    } else {
      return '대시보드';
    }
  };

  return (
    <DashboardContainer>
      <Header>
        <Title>💰 Money Log 💰</Title>
        <UserInfo>
          <UserBadge isAdmin={isAdmin}>
            {isAdmin ? '👑 관리자' : '👤 사용자'}
          </UserBadge>
          <span>{username}님 환영합니다!</span>
          <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
        </UserInfo>
      </Header>

      <MainContent>
        <Sidebar>
          <MenuList>
            {isAdmin ? (
              <>
                <MenuItem 
                  isActive={activeMenu === 'dashboard'} 
                  onClick={() => handleMenuClick('dashboard')}
                >
                  📊 대시보드
                </MenuItem>
                <MenuItem 
                  isActive={activeMenu === 'category-management'} 
                  onClick={() => handleMenuClick('category-management')}
                >
                  🏷️ 카테고리 관리
                </MenuItem>
                <SettingsMenuContainer
                  onMouseEnter={() => setIsSettingsHovered(true)}
                  onMouseLeave={() => setIsSettingsHovered(false)}
                >
                  <MenuItem 
                    isActive={activeMenu === 'settings' || activeMenu === 'user-management' || activeMenu === 'server-management'} 
                    onClick={() => handleMenuClick('settings')}
                  >
                    ⚙️ 설정 {isSettingsHovered ? '▼' : '▶'}
                  </MenuItem>
                  {isSettingsHovered && (
                    <SubMenuList>
                      <SubMenuItem 
                        isActive={activeMenu === 'user-management'}
                        onClick={() => handleMenuClick('user-management')}
                      >
                        👥 유저 관리
                      </SubMenuItem>
                      <SubMenuItem 
                        isActive={activeMenu === 'server-management'}
                        onClick={() => handleMenuClick('server-management')}
                      >
                        🖥️ 서버 관리
                      </SubMenuItem>
                    </SubMenuList>
                  )}
                </SettingsMenuContainer>
              </>
            ) : (
              <>
                <MenuItem 
                  isActive={activeMenu === 'dashboard'} 
                  onClick={() => handleMenuClick('dashboard')}
                >
                  📊 대시보드
                </MenuItem>
                <MenuItem 
                  isActive={activeMenu === 'transactions'} 
                  onClick={() => handleMenuClick('transactions')}
                >
                  💳 거래 내역
                </MenuItem>
                <MenuItem 
                  isActive={activeMenu === 'budget'} 
                  onClick={() => handleMenuClick('budget')}
                >
                  📈 예산 관리
                </MenuItem>
                <MenuItem 
                  isActive={activeMenu === 'reports'} 
                  onClick={() => handleMenuClick('reports')}
                >
                  📋 보고서
                </MenuItem>
              </>
            )}
          </MenuList>
        </Sidebar>

        <ContentArea>
          {renderContent()}
        </ContentArea>
      </MainContent>
      
      {/* 사용자 수정 모달 */}
      {isModalOpen && renderUserEditModal()}

      {/* 카테고리 수정/추가 모달 */}
      {isCategoryModalOpen && (
        <ModalOverlay isOpen={isCategoryModalOpen} onClick={closeCategoryModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {selectedCategory ? '카테고리 수정' : '카테고리 추가'}
              </ModalTitle>
              <CloseButton onClick={closeCategoryModal}>×</CloseButton>
            </ModalHeader>
            
            <FormGroup>
              <FormLabel>구분</FormLabel>
              <FormSelect
                name="type"
                value={categoryForm.type}
                onChange={handleCategoryFormChange}
                required
              >
                <option value="">구분을 선택하세요</option>
                <option value="asset">자산</option>
                <option value="liability">부채</option>
                <option value="equity">자본</option>
                <option value="revenue">수익</option>
                <option value="expense">비용</option>
              </FormSelect>
            </FormGroup>
            
            <FormGroup>
              <FormLabel>계정명</FormLabel>
              <FormInput
                type="text"
                name="name"
                value={categoryForm.name}
                onChange={handleCategoryFormChange}
                placeholder="계정명을 입력하세요"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel>비고</FormLabel>
              <FormTextArea
                name="remark"
                value={categoryForm.remark}
                onChange={handleCategoryFormChange}
                placeholder="비고를 입력하세요 (선택사항)"
                rows={3}
              />
            </FormGroup>
            
            <ButtonGroup>
              <SaveButton onClick={handleSaveCategory}>
                {selectedCategory ? '수정' : '추가'}
              </SaveButton>
              {selectedCategory && (
                <DeleteButton onClick={handleDeleteCategory}>삭제</DeleteButton>
              )}
              <CancelButton onClick={closeCategoryModal}>취소</CancelButton>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* 거래 내역 수정 모달 */}
      {isTransactionModalOpen && renderTransactionModal()}
    </DashboardContainer>
  );
};

export default Dashboard; 