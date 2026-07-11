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
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Calendar, Tag, AlertCircle } from 'lucide-react';
import { Priority, Category, Todo } from '@/types/todo';

export default function TodoForm() {
  const setTodos = useSetAtom(todosAtom);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('work');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim() || undefined,
      completed: false,
      priority,
      category,
      dueDate: dueDate || undefined,
      createdAt: new Date().toISOString(),
    };

    setTodos((prev) => [newTodo, ...prev]);

    // Reset Form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('work');
    setDueDate('');

    toast.success('Task created successfully!');
  };

  return (
    <Card className="border bg-card shadow-sm dark:border-zinc-800">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Plus className="h-4 w-4" />
            </div>
            <h2 className="text-base font-semibold text-foreground">Create New Task</h2>
          </div>

          <div className="grid gap-4">
            {/* Title Input */}
            <div className="space-y-1">
              <Input
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-sm font-medium focus-visible:ring-1"
                maxLength={100}
              />
            </div>

            {/* Description Input */}
            <div className="space-y-1">
              <Input
                placeholder="Add description (optional)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs text-muted-foreground focus-visible:ring-1"
                maxLength={250}
              />
            </div>

            {/* Options Row */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* Category Select */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <Tag className="h-3 w-3" />
                  Category
                </div>
                <Select
                  value={category}
                  onValueChange={(val) => setCategory(val as Category)}
                >
                  <SelectTrigger className="h-9 text-xs focus:ring-1">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="work" className="text-xs">Work</SelectItem>
                    <SelectItem value="personal" className="text-xs">Personal</SelectItem>
                    <SelectItem value="shopping" className="text-xs">Shopping</SelectItem>
                    <SelectItem value="health" className="text-xs">Health</SelectItem>
                    <SelectItem value="other" className="text-xs">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Priority Select */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <AlertCircle className="h-3 w-3" />
                  Priority
                </div>
                <Select
                  value={priority}
                  onValueChange={(val) => setPriority(val as Priority)}
                >
                  <SelectTrigger className="h-9 text-xs focus:ring-1">
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low" className="text-xs">Low</SelectItem>
                    <SelectItem value="medium" className="text-xs">Medium</SelectItem>
                    <SelectItem value="high" className="text-xs">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Due Date Picker */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Due Date
                </div>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <Button type="submit" size="sm" className="gap-1.5 px-4 font-semibold text-xs">
              <Plus className="h-3.5 w-3.5" />
              Add Task
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
