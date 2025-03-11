
export interface RetroCard {
  id: string;
  content: string;
  category: 'good' | 'bad' | 'ideas' | 'actions';
  votes: number;
  authorId: string;
  authorName: string;
  voterIds: string[];
  createdAt: string;
}

export interface SprintBoard {
  id: string;
  name: string;
  date: string;
  team: string;
  description: string;
  createdBy: string;
  cards: RetroCard[];
}

// Mock data
const mockBoards: SprintBoard[] = [
  {
    id: 'board-1',
    name: 'Sprint 42 Retrospective',
    date: '2023-03-15',
    team: 'Frontend',
    description: 'Retro for our Q1 deliverables',
    createdBy: 'admin-1',
    cards: [
      {
        id: 'card-1',
        content: 'Successfully implemented the new UI components',
        category: 'good',
        votes: 3,
        authorId: 'user-1',
        authorName: 'Regular User',
        voterIds: ['user-1', 'admin-1', 'user-2'],
        createdAt: '2023-03-15T10:30:00Z'
      },
      {
        id: 'card-2',
        content: 'Code reviews taking too long',
        category: 'bad',
        votes: 2,
        authorId: 'admin-1',
        authorName: 'Admin User',
        voterIds: ['admin-1', 'user-2'],
        createdAt: '2023-03-15T11:15:00Z'
      },
      {
        id: 'card-3',
        content: 'Start using pair programming for complex features',
        category: 'ideas',
        votes: 4,
        authorId: 'user-1',
        authorName: 'Regular User',
        voterIds: ['user-1', 'admin-1', 'user-2', 'user-3'],
        createdAt: '2023-03-15T13:20:00Z'
      },
      {
        id: 'card-4',
        content: 'Create a shared document for code review best practices',
        category: 'actions',
        votes: 3,
        authorId: 'admin-1',
        authorName: 'Admin User',
        voterIds: ['admin-1', 'user-1', 'user-2'],
        createdAt: '2023-03-15T14:45:00Z'
      }
    ]
  },
  {
    id: 'board-2',
    name: 'Sprint 43 Retrospective',
    date: '2023-03-29',
    team: 'Frontend',
    description: 'Retro for our latest sprint',
    createdBy: 'admin-1',
    cards: []
  }
];

// In a real application, these functions would make API calls
export const boardService = {
  getBoards: async (): Promise<SprintBoard[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    return [...mockBoards];
  },
  
  getBoardById: async (id: string): Promise<SprintBoard | undefined> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockBoards.find(board => board.id === id);
  },
  
  createBoard: async (board: Omit<SprintBoard, 'id' | 'cards'>): Promise<SprintBoard> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newBoard: SprintBoard = {
      ...board,
      id: `board-${Date.now()}`,
      cards: []
    };
    
    mockBoards.push(newBoard);
    return newBoard;
  },
  
  addCard: async (boardId: string, card: Omit<RetroCard, 'id' | 'votes' | 'voterIds' | 'createdAt'>): Promise<RetroCard> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const board = mockBoards.find(b => b.id === boardId);
    if (!board) {
      throw new Error('Board not found');
    }
    
    const newCard: RetroCard = {
      ...card,
      id: `card-${Date.now()}`,
      votes: 0,
      voterIds: [],
      createdAt: new Date().toISOString()
    };
    
    board.cards.push(newCard);
    return newCard;
  },
  
  voteCard: async (boardId: string, cardId: string, userId: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const board = mockBoards.find(b => b.id === boardId);
    if (!board) {
      throw new Error('Board not found');
    }
    
    const card = board.cards.find(c => c.id === cardId);
    if (!card) {
      throw new Error('Card not found');
    }
    
    // Check if user already voted
    if (card.voterIds.includes(userId)) {
      // Remove vote
      card.voterIds = card.voterIds.filter(id => id !== userId);
      card.votes--;
    } else {
      // Add vote
      card.voterIds.push(userId);
      card.votes++;
    }
  }
};
