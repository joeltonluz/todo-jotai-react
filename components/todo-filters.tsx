'use client';

import React from 'react';
import { useAtom } from 'jotai';
import {
  filterAtom,
  priorityFilterAtom,
  categoryFilterAtom,
  searchQueryAtom,
  sortByAtom,
} from '@/atoms/todoAtoms';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Priority, Category, TodoFilter, TodoSortBy } from '@/types/todo';

export default function TodoFilters() {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [filter, setFilter] = useAtom(filterAtom);
  const [priorityFilter, setPriorityFilter] = useAtom(priorityFilterAtom);
  const [categoryFilter, setCategoryFilter] = useAtom(categoryFilterAtom);
  const [sortBy, setSortBy] = useAtom(sortByAtom);

  const categories: (Category | 'all')[] = ['all', 'work', 'personal', 'shopping', 'health', 'other'];
  const priorities: (Priority | 'all')[] = ['all', 'high', 'medium', 'low'];

  return (
    <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm dark:border-zinc-800">
      {/* Search and Tabs row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 text-sm focus-visible:ring-1"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex rounded-lg bg-secondary/50 p-1">
          {(['all', 'active', 'completed'] as TodoFilter[]).map((tab) => {
            const isActive = filter === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`relative px-4 py-1.5 text-xs font-semibold rounded-md transition-all uppercase tracking-wider ${
                  isActive
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'all' && 'All'}
                {tab === 'active' && 'Active'}
                {tab === 'completed' && 'Completed'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Filters & Sorting row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-1 border-t dark:border-zinc-800/60">
        {/* Category Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Category</label>
          <Select
            value={categoryFilter}
            onValueChange={(val) => setCategoryFilter(val as Category | 'all')}
          >
            <SelectTrigger className="h-9 text-xs focus:ring-1">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat} className="text-xs capitalize">
                  {cat === 'all' ? 'All Categories' : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Priority Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Priority</label>
          <Select
            value={priorityFilter}
            onValueChange={(val) => setPriorityFilter(val as Priority | 'all')}
          >
            <SelectTrigger className="h-9 text-xs focus:ring-1">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((prio) => (
                <SelectItem key={prio} value={prio} className="text-xs capitalize">
                  {prio === 'all' ? 'All Priorities' : prio}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort By Select */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Sort By</label>
          <Select
            value={sortBy}
            onValueChange={(val) => setSortBy(val as TodoSortBy)}
          >
            <SelectTrigger className="h-9 text-xs focus:ring-1">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc" className="text-xs">Newest first</SelectItem>
              <SelectItem value="createdAt-asc" className="text-xs">Oldest first</SelectItem>
              <SelectItem value="dueDate-asc" className="text-xs">Due date (Earliest)</SelectItem>
              <SelectItem value="priority-desc" className="text-xs">Priority (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Filters Option Button */}
        <div className="flex items-end">
          <Button
            variant="ghost"
            onClick={() => {
              setSearchQuery('');
              setFilter('all');
              setPriorityFilter('all');
              setCategoryFilter('all');
              setSortBy('createdAt-desc');
            }}
            className="w-full h-9 justify-center gap-2 text-xs font-semibold text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
