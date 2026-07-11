import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Todo, TodoFilter, TodoSortBy, Priority, Category } from '@/types/todo';

// 1. Base Atoms
// Uses atomWithStorage to persist todos inside localStorage automatically
export const todosAtom = atomWithStorage<Todo[]>('todo-list-jotai-v1', []);

// 2. Query / Filters State Atoms
export const filterAtom = atom<TodoFilter>('all');
export const priorityFilterAtom = atom<Priority | 'all'>('all');
export const categoryFilterAtom = atom<Category | 'all'>('all');
export const searchQueryAtom = atom<string>('');
export const sortByAtom = atom<TodoSortBy>('createdAt-desc');

// 3. UI Atoms
export const editTodoIdAtom = atom<string | null>(null);

// 4. Derived Atoms (Selectors)

// A derived atom that handles filtering, search, and sorting.
// Components can subscribe to this atom to get the computed list reactively.
export const filteredTodosAtom = atom<Todo[]>((get) => {
  const todos = get(todosAtom);
  const filter = get(filterAtom);
  const priorityFilter = get(priorityFilterAtom);
  const categoryFilter = get(categoryFilterAtom);
  const searchQuery = get(searchQueryAtom).toLowerCase().trim();
  const sortBy = get(sortByAtom);

  let result = [...todos];

  // Apply Status Filter
  if (filter === 'active') {
    result = result.filter((todo) => !todo.completed);
  } else if (filter === 'completed') {
    result = result.filter((todo) => todo.completed);
  }

  // Apply Priority Filter
  if (priorityFilter !== 'all') {
    result = result.filter((todo) => todo.priority === priorityFilter);
  }

  // Apply Category Filter
  if (categoryFilter !== 'all') {
    result = result.filter((todo) => todo.category === categoryFilter);
  }

  // Apply Search Query Filter
  if (searchQuery !== '') {
    result = result.filter(
      (todo) =>
        todo.title.toLowerCase().includes(searchQuery) ||
        (todo.description && todo.description.toLowerCase().includes(searchQuery))
    );
  }

  // Apply Sorting
  result.sort((a, b) => {
    switch (sortBy) {
      case 'createdAt-desc':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'createdAt-asc':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'dueDate-asc': {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      case 'priority-desc': {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      default:
        return 0;
    }
  });

  return result;
});

// A derived atom that calculates statistical analytics for the dashboard.
export const todoStatsAtom = atom((get) => {
  const todos = get(todosAtom);
  const total = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;
  const pending = total - completed;
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    pending,
    completionPercentage,
  };
});
