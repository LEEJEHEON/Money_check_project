import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: #333;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const AddButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const DeleteButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #c82333;
  }
`;

const Table = styled.table`
  width: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-collapse: collapse;
  overflow: hidden;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #dee2e6;
  }
  
  th {
    background-color: #f8f9fa;
    font-weight: bold;
    color: #495057;
  }
  
  tbody tr:hover {
    background-color: #f8f9fa;
    cursor: pointer;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
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
  font-weight: bold;
  color: #333;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
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
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const SaveButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-right: 1rem;
  
  &:hover {
    background-color: #218838;
  }
`;

const CancelButton = styled.button`
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background-color: #5a6268;
  }
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid #f5c6cb;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

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

interface Category {
  id: number;
  type: string;
  type_display: string;
  name: string;
  remark: string;
  created_by: string;
  created_at: string;
}

const TransactionManagement: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionForm, setTransactionForm] = useState({
    category_id: '',
    transaction_type: '',
    amount: '',
    description: '',
    transaction_date: '',
    memo: ''
  });

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

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

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/categories/', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('카테고리 로딩 실패:', error);
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
    setIsModalOpen(true);
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
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        closeModal();
        fetchTransactions();
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
        fetchTransactions();
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
        fetchTransactions();
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

  const handleSelectAll = () => {
    if (selectedTransactions.length === transactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(transactions.map(t => t.id));
    }
  };

  return (
    <Container>
      <Header>
        <Title>💳 거래 내역 관리</Title>
        <ButtonGroup>
          {selectedTransactions.length > 0 && (
            <DeleteButton onClick={handleBulkDelete}>
              선택 삭제 ({selectedTransactions.length})
            </DeleteButton>
          )}
          <AddButton onClick={handleAddTransaction}>
            + 거래 내역 추가
          </AddButton>
        </ButtonGroup>
      </Header>
      
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
                  onChange={handleSelectAll}
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
              <tr key={transaction.id}>
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
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* 거래 내역 추가/수정 모달 */}
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                {selectedTransaction ? '거래 내역 수정' : '거래 내역 추가'}
              </ModalTitle>
              <CloseButton onClick={closeModal}>×</CloseButton>
            </ModalHeader>
            
            <FormGroup>
              <FormLabel>카테고리</FormLabel>
              <FormSelect
                name="category_id"
                value={transactionForm.category_id}
                onChange={handleFormChange}
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
                onChange={handleFormChange}
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
                onChange={handleFormChange}
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
                onChange={handleFormChange}
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
                onChange={handleFormChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>메모</FormLabel>
              <FormInput
                type="text"
                name="memo"
                value={transactionForm.memo}
                onChange={handleFormChange}
                placeholder="메모 (선택사항)"
              />
            </FormGroup>

            <ButtonGroup>
              <CancelButton onClick={closeModal}>취소</CancelButton>
              <SaveButton onClick={handleSaveTransaction}>
                {selectedTransaction ? '수정' : '추가'}
              </SaveButton>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default TransactionManagement; 