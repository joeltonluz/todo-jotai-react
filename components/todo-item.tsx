'use client';

import React from 'react';
import { useSetAtom } from 'jotai';
import { todosAtom, editTodoIdAtom } from '@/atoms/todoAtoms';
import { Todo } from '@/types/todo';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Edit2, Trash2 } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  const setTodos = useSetAtom(todosAtom);
  const setEditTodoId = useSetAtom(editTodoIdAtom);

  const handleToggleComplete = () => {
    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, completed: !t.completed } : t))
    );
    if (!todo.completed) {
      toast.success('Task completed');
    } else {
      toast.info('Task reactivated');
    }
  };

  const handleDelete = () => {
    setTodos((prev) => prev.filter((t) => t.id !== todo.id));
    toast.error('Task deleted');
  };

  const isOverdue = React.useMemo(() => {
    if (!todo.dueDate || todo.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(todo.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  }, [todo.dueDate, todo.completed]);

  const formattedDueDate = React.useMemo(() => {
    if (!todo.dueDate) return null;
    const date = new Date(todo.dueDate);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    });
  }, [todo.dueDate]);

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 p-3 rounded-lg border bg-card dark:border-zinc-800 transition-colors',
        todo.completed && 'opacity-60 bg-zinc-50/20 dark:bg-zinc-900/10'
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleToggleComplete}
          className="h-4 w-4 rounded-md border-zinc-300 dark:border-zinc-700 data-[state=checked]:bg-zinc-900 data-[state=checked]:border-zinc-900 dark:data-[state=checked]:bg-zinc-100 dark:data-[state=checked]:border-zinc-100"
        />

        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5 min-w-0">
          <span
            className={cn(
              'text-sm font-medium text-foreground truncate max-w-[200px] sm:max-w-[300px]',
              todo.completed && 'line-through text-muted-foreground'
            )}
          >
            {todo.title}
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded capitalize">
              {todo.category}
            </span>
            <span
              className={cn(
                'text-[10px] px-1.5 py-0.5 rounded capitalize font-medium border dark:border-zinc-800',
                todo.priority === 'high' && 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/20',
                todo.priority === 'medium' && 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/20',
                todo.priority === 'low' && 'text-zinc-500 bg-zinc-100 dark:text-zinc-400 dark:bg-zinc-800'
              )}
            >
              {todo.priority}
            </span>
            {formattedDueDate && (
              <span
                className={cn(
                  'text-[10px] text-muted-foreground',
                  isOverdue && 'text-red-500 dark:text-red-400 font-semibold'
                )}
              >
                • {isOverdue ? 'Overdue: ' : 'Due: '}
                {formattedDueDate}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setEditTodoId(todo.id)}
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
        >
          <Edit2 className="h-3.5 w-3.5" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </div>
  );
}
