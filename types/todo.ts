export type Priority = 'low' | 'medium' | 'high';

export type Category = 'work' | 'personal' | 'shopping' | 'health' | 'other';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  dueDate?: string; // ISO Date string (YYYY-MM-DD)
  createdAt: string; // ISO Timestamp string
}

export type TodoFilter = 'all' | 'active' | 'completed';

export type TodoSortBy = 'createdAt-desc' | 'createdAt-asc' | 'dueDate-asc' | 'priority-desc';
