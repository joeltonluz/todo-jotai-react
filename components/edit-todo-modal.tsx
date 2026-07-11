'use client';

import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { todosAtom, editTodoIdAtom } from '@/atoms/todoAtoms';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Edit3, Calendar, Tag, AlertCircle } from 'lucide-react';
import { Priority, Category, Todo } from '@/types/todo';

export default function EditTodoModal() {
  const [todos, setTodos] = useAtom(todosAtom);
  const [editTodoId, setEditTodoId] = useAtom(editTodoIdAtom);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('work');
  const [dueDate, setDueDate] = useState('');

  // Find the current todo being edited
  const currentTodo = todos.find((t) => t.id === editTodoId);

  // Sync state with current todo when modal opens
  useEffect(() => {
    if (currentTodo) {
      setTitle(currentTodo.title);
      setDescription(currentTodo.description || '');
      setPriority(currentTodo.priority);
      setCategory(currentTodo.category);
      setDueDate(currentTodo.dueDate || '');
    }
  }, [currentTodo]);

  const handleClose = () => {
    setEditTodoId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    setTodos((prev) =>
      prev.map((t) =>
        t.id === editTodoId
          ? {
              ...t,
              title: title.trim(),
              description: description.trim() || undefined,
              priority,
              category,
              dueDate: dueDate || undefined,
            }
          : t
      )
    );

    toast.success('Task updated successfully!');
    handleClose();
  };

  const isOpen = editTodoId !== null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px] border dark:border-zinc-800 bg-card">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Edit3 className="h-3.5 w-3.5" />
            </div>
            <DialogTitle className="text-base font-semibold text-foreground">Edit Task</DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Title Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Title</label>
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
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Description</label>
            <Input
              placeholder="Add description (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-xs text-muted-foreground focus-visible:ring-1"
              maxLength={250}
            />
          </div>

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

          <DialogFooter className="pt-4 flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              className="text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="text-xs font-semibold">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
