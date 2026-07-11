'use client';

import React from 'react';
import { useAtomValue } from 'jotai';
import { filteredTodosAtom } from '@/atoms/todoAtoms';
import TodoFilters from '@/components/todo-filters';
import TodoForm from '@/components/todo-form';
import TodoItem from '@/components/todo-item';
import EditTodoModal from '@/components/edit-todo-modal';
import { Toaster } from '@/components/ui/sonner';
import ThemeToggle from '@/components/theme-toggle';
import { CheckSquare, PlusCircle } from 'lucide-react';

export default function Home() {
  const filteredTodos = useAtomValue(filteredTodosAtom);

  return (
    <div className="flex-1 w-full min-h-screen bg-zinc-50/40 py-12 px-4 dark:bg-zinc-950 font-sans transition-colors duration-300">
      <main className="mx-auto max-w-2xl space-y-6">
        {/* Header Section */}
        <header className="flex items-center justify-between border-b pb-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
              <CheckSquare className="h-4.5 w-4.5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Todo List
            </h1>
          </div>
          <ThemeToggle />
        </header>

        {/* Input Form */}
        <section aria-label="Add new task">
          <TodoForm />
        </section>

        {/* Filters and Checklist */}
        <section aria-label="Tasks checklist" className="space-y-4">
          <TodoFilters />

          <div className="space-y-2.5">
            {filteredTodos.length > 0 ? (
              filteredTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-xl bg-card dark:border-zinc-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-muted-foreground mb-3">
                  <PlusCircle className="h-5 w-5" />
                </div>
                <h3 className="text-xs font-semibold text-foreground mb-1">No tasks found</h3>
                <p className="text-[11px] text-muted-foreground max-w-xs">
                  Your checklist is clear. Add a new task above or change the filters.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Dialogs and Toasts */}
      <EditTodoModal />
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}
