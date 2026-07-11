import { Category, Priority, Todo, TodoFilter, TodoSortBy } from "@/types/todo";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// 1. Base Atoms
// Uses atomWithStorage to persist todos inside localStorage automatically
export const todosAtom = atomWithStorage<Todo[]>("todo-list-jotai-v1", []);

// 2. Query / Filters State Atoms
export const filterAtom = atom<TodoFilter>("all");
export const priorityFilterAtom = atom<Priority | "all">("all");
export const categoryFilterAtom = atom<Category | "all">("all");
export const searchQueryAtom = atom<string>("");
export const sortByAtom = atom<TodoSortBy>("createdAt-desc");

// 3. Form State Atoms (Temporary states for creation and editing)
export const addTitleAtom = atom("");
export const addPriorityAtom = atom<Priority>("medium");
export const addCategoryAtom = atom<Category>("work");
export const addDueDateAtom = atom("");

export const editTitleAtom = atom("");
export const editDescriptionAtom = atom("");
export const editPriorityAtom = atom<Priority>("medium");
export const editCategoryAtom = atom<Category>("work");
export const editDueDateAtom = atom("");

const baseEditTodoIdAtom = atom<string | null>(null);

export const editTodoIdAtom = atom(
  (get) => get(baseEditTodoIdAtom),
  (get, set, nextValue: string | null) => {
    set(baseEditTodoIdAtom, nextValue);
    if (nextValue) {
      const todos = get(todosAtom);
      const todo = todos.find((t) => t.id === nextValue);
      if (todo) {
        set(editTitleAtom, todo.title);
        set(editDescriptionAtom, todo.description || "");
        set(editPriorityAtom, todo.priority);
        set(editCategoryAtom, todo.category);
        set(editDueDateAtom, todo.dueDate || "");
      }
    } else {
      set(editTitleAtom, "");
      set(editDescriptionAtom, "");
      set(editPriorityAtom, "medium");
      set(editCategoryAtom, "work");
      set(editDueDateAtom, "");
    }
  },
);

// export function useEditTodoForm(todos: Todo[]) {
//   // Estado que guarda o ID do Todo que está sendo editado
//   const [editTodoId, setEditTodoId] = useState<string | null>(null);

//   // Estados dos campos do formulário (o que eram os outros átomos)
//   const [editTitle, setEditTitle] = useState('');
//   const [editDescription, setEditDescription] = useState('');
//   const [editPriority, setEditPriority] = useState('medium');
//   const [editCategory, setEditCategory] = useState('work');
//   const [editDueDate, setEditDueDate] = useState('');

//   // O useEffect age exatamente como a função "set" do seu átomo do Jotai
//   useEffect(() => {
//     if (editTodoId) {
//       // Procura o todo na lista enviada por parâmetro
//       const todo = todos.find((t) => t.id === editTodoId);

//       if (todo) {
//         // Preenche o formulário com os dados do Todo encontrado
//         setEditTitle(todo.title);
//         setEditDescription(todo.description || '');
//         setEditPriority(todo.priority);
//         setEditCategory(todo.category);
//         setEditDueDate(todo.dueDate || '');
//       }
//     } else {
//       // Se o ID for null, limpa/reseta o formulário
//       setEditTitle('');
//       setEditDescription('');
//       setEditPriority('medium');
//       setEditCategory('work');
//       setEditDueDate('');
//     }
//   }, [editTodoId, todos]); // Executa sempre que o ID mudar ou a lista de todos atualizar

//   return {
//     editTodoId,
//     setEditTodoId,
//     formValues: {
//       title: editTitle,
//       description: editDescription,
//       priority: editPriority,
//       category: editCategory,
//       dueDate: editDueDate,
//     },
//     setters: {
//       setTitle: setEditTitle,
//       setDescription: setEditDescription,
//       setPriority: setEditPriority,
//       setCategory: setEditCategory,
//       setDueDate: setEditDueDate,
//     }
//   };
// }

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
  if (filter === "active") {
    result = result.filter((todo) => !todo.completed);
  } else if (filter === "completed") {
    result = result.filter((todo) => todo.completed);
  }

  // Apply Priority Filter
  if (priorityFilter !== "all") {
    result = result.filter((todo) => todo.priority === priorityFilter);
  }

  // Apply Category Filter
  if (categoryFilter !== "all") {
    result = result.filter((todo) => todo.category === categoryFilter);
  }

  // Apply Search Query Filter
  if (searchQuery !== "") {
    result = result.filter(
      (todo) =>
        todo.title.toLowerCase().includes(searchQuery) ||
        (todo.description &&
          todo.description.toLowerCase().includes(searchQuery)),
    );
  }

  // Apply Sorting
  result.sort((a, b) => {
    switch (sortBy) {
      case "createdAt-desc":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "createdAt-asc":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "dueDate-asc": {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      case "priority-desc": {
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
  const completionPercentage =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    pending,
    completionPercentage,
  };
});
