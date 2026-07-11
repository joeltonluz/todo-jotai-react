'use client';

import React from 'react';
import { useAtomValue } from 'jotai';
import { filteredTodosAtom } from '@/atoms/todoAtoms';
import TodoStats from '@/components/todo-stats';
import TodoFilters from '@/components/todo-filters';
import TodoForm from '@/components/todo-form';
import TodoItem from '@/components/todo-item';
import EditTodoModal from '@/components/edit-todo-modal';
import { Toaster } from '@/components/ui/sonner';
import { CheckSquare, Sparkles, PlusCircle } from 'lucide-react';

export default function Home() {
  const filteredTodos = useAtomValue(filteredTodosAtom);

  return (
    <div className="flex-1 w-full min-h-screen bg-zinc-50/40 py-12 px-4 dark:bg-zinc-950 font-sans transition-colors duration-300">
      <main className="mx-auto max-w-4xl space-y-8">
        {/* Header Section */}
        <header className="flex flex-col gap-2 text-center sm:text-left sm:flex-row sm:items-center sm:justify-between border-b pb-6 dark:border-zinc-800">
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/20">
                <CheckSquare className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Jotai TaskFlow
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              A premium, reactive Todo Planner with Jotai state management.
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 self-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Senior Codebase Setup</span>
          </div>
        </header>

        {/* Dashboard Metrics */}
        <section aria-label="Task metrics dashboard">
          <TodoStats />
        </section>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Side Panel: Create Task */}
          <section aria-label="Create task form" className="md:col-span-1">
            <TodoForm />
          </section>

          {/* Main Panel: Filter & List */}
          <section aria-label="Task list controls" className="md:col-span-2 space-y-6">
            {/* Filters Row */}
            <TodoFilters />

            {/* Todo List Rendering */}
            <div className="space-y-3">
              {filteredTodos.length > 0 ? (
                filteredTodos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed rounded-2xl bg-card dark:border-zinc-800">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/60 text-muted-foreground mb-4">
                    <PlusCircle className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">No tasks match the filters</h3>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Try clearing your search query, choosing a different status filter, or create a brand new task.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Popovers, Dialogs & Toast Notifications */}
      <EditTodoModal />
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}
