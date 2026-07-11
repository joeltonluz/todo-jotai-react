'use client';

import React, { useState } from 'react';
import { useSetAtom } from 'jotai';
import { todosAtom } from '@/atoms/todoAtoms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Priority, Category, Todo } from '@/types/todo';

export default function TodoForm() {
  const setTodos = useSetAtom(todosAtom);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('work');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Task title cannot be empty');
      return;
    }

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      priority,
      category,
      dueDate: dueDate || undefined,
      createdAt: new Date().toISOString(),
    };

    setTodos((prev) => [newTodo, ...prev]);

    // Reset Form
    setTitle('');
    setPriority('medium');
    setCategory('work');
    setDueDate('');

    toast.success('Task added');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 p-4 border rounded-xl bg-card dark:border-zinc-800">
      <div className="flex gap-2">
        <Input
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 text-sm focus-visible:ring-1"
          maxLength={100}
        />
        <Button type="submit" size="sm" className="font-semibold px-4 text-xs">
          Add
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Category Select */}
        <Select
          value={category}
          onValueChange={(val) => setCategory(val as Category)}
        >
          <SelectTrigger className="h-8 w-[100px] text-[11px] focus:ring-1">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="work" className="text-xs">Work</SelectItem>
            <SelectItem value="personal" className="text-xs">Personal</SelectItem>
            <SelectItem value="shopping" className="text-xs">Shopping</SelectItem>
            <SelectItem value="health" className="text-xs">Health</SelectItem>
            <SelectItem value="other" className="text-xs">Other</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority Select */}
        <Select
          value={priority}
          onValueChange={(val) => setPriority(val as Priority)}
        >
          <SelectTrigger className="h-8 w-[90px] text-[11px] focus:ring-1">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low" className="text-xs">Low</SelectItem>
            <SelectItem value="medium" className="text-xs">Medium</SelectItem>
            <SelectItem value="high" className="text-xs">High</SelectItem>
          </SelectContent>
        </Select>

        {/* Due Date Picker */}
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="h-8 rounded-md border border-input bg-transparent px-2.5 text-[11px] text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring dark:border-zinc-800"
        />
      </div>
    </form>
  );
}
