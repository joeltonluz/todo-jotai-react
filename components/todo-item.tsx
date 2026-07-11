'use client';

import React from 'react';
import { useSetAtom } from 'jotai';
import { todosAtom, editTodoIdAtom } from '@/atoms/todoAtoms';
import { Todo } from '@/types/todo';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Edit2, Trash2, Calendar, AlertCircle } from 'lucide-react';

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
      toast.success('Task marked as completed!');
    } else {
      toast.info('Task marked as active');
    }
  };

  const handleDelete = () => {
    setTodos((prev) => prev.filter((t) => t.id !== todo.id));
    toast.error('Task deleted successfully');
  };

  // Check if a task is overdue
  const isOverdue = React.useMemo(() => {
    if (!todo.dueDate || todo.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(todo.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  }, [todo.dueDate, todo.completed]);

  // Format date for display (e.g., Jun 5, 2026)
  const formattedDueDate = React.useMemo(() => {
    if (!todo.dueDate) return null;
    const date = new Date(todo.dueDate);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC', // Ensure consistent display for pure date inputs
    });
  }, [todo.dueDate]);

  // Helper colors for priorities
  const priorityColors = {
    high: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50',
    medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50',
    low: 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-400 dark:border-zinc-700/50',
  };

  return (
    <div
      className={cn(
        'group flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-xs transition-all duration-300 hover:shadow-md dark:border-zinc-800',
        todo.completed && 'bg-zinc-50/50 opacity-75 dark:bg-zinc-900/20',
        isOverdue && 'border-red-200 dark:border-red-950/50 bg-red-50/10'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className="pt-0.5">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={handleToggleComplete}
            className="h-5 w-5 rounded-md border-zinc-300 dark:border-zinc-700 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
          />
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 space-y-1">
          <h3
            className={cn(
              'text-sm font-semibold leading-none tracking-tight text-foreground transition-all',
              todo.completed && 'line-through text-muted-foreground'
            )}
          >
            {todo.title}
          </h3>
          {todo.description && (
            <p
              className={cn(
                'text-xs text-muted-foreground leading-relaxed',
                todo.completed && 'line-through opacity-60'
              )}
            >
              {todo.description}
            </p>
          )}
        </div>

        {/* Quick Action Buttons (hidden on hover on desktop, showing always on mobile) */}
        <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditTodoId(todo.id)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>

      {/* Metadata Badges row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-dashed dark:border-zinc-800/80">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Category Badge */}
          <Badge variant="outline" className="text-[10px] font-bold tracking-wider uppercase capitalize bg-secondary/35 text-secondary-foreground">
            {todo.category}
          </Badge>

          {/* Priority Badge */}
          <Badge variant="outline" className={cn('text-[10px] font-bold tracking-wider uppercase border', priorityColors[todo.priority])}>
            {todo.priority}
          </Badge>
        </div>

        {/* Date Section */}
        {formattedDueDate && (
          <div
            className={cn(
              'flex items-center gap-1 text-[11px] font-medium text-muted-foreground',
              isOverdue && 'text-red-500 dark:text-red-400 font-bold'
            )}
          >
            {isOverdue ? (
              <AlertCircle className="h-3.5 w-3.5" />
            ) : (
              <Calendar className="h-3.5 w-3.5" />
            )}
            <span>
              {isOverdue ? 'Overdue: ' : 'Due: '}
              {formattedDueDate}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
