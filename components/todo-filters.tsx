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
import { Search } from 'lucide-react';
import { Priority, Category, TodoFilter, TodoSortBy } from '@/types/todo';

export default function TodoFilters() {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [filter, setFilter] = useAtom(filterAtom);
  const [priorityFilter, setPriorityFilter] = useAtom(priorityFilterAtom);
  const [categoryFilter, setCategoryFilter] = useAtom(categoryFilterAtom);
  const [sortBy, setSortBy] = useAtom(sortByAtom);

  const categories: (Category | 'all')[] = ['all', 'work', 'personal', 'shopping', 'health', 'other'];
  const priorities: (Priority | 'all')[] = ['all', 'high', 'medium', 'low'];

  const hasActiveFilters =
    searchQuery ||
    filter !== 'all' ||
    priorityFilter !== 'all' ||
    categoryFilter !== 'all' ||
    sortBy !== 'createdAt-desc';

  return (
    <div className="flex flex-col gap-3 p-3.5 border rounded-xl bg-card dark:border-zinc-800">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-xs focus-visible:ring-1"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex bg-secondary/50 rounded-lg p-0.5 self-start sm:self-auto">
          {(['all', 'active', 'completed'] as TodoFilter[]).map((tab) => {
            const isActive = filter === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 text-[11px] font-medium rounded-md transition-all capitalize ${
                  isActive
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-2 border-t dark:border-zinc-800/60">
        {/* Category */}
        <Select
          value={categoryFilter}
          onValueChange={(val) => setCategoryFilter(val as Category | 'all')}
        >
          <SelectTrigger className="h-7 w-[110px] text-[10px] focus:ring-1">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat} className="text-xs capitalize">
                {cat === 'all' ? 'All Categories' : cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority */}
        <Select
          value={priorityFilter}
          onValueChange={(val) => setPriorityFilter(val as Priority | 'all')}
        >
          <SelectTrigger className="h-7 w-[100px] text-[10px] focus:ring-1">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            {priorities.map((prio) => (
              <SelectItem key={prio} value={prio} className="text-xs capitalize">
                {prio === 'all' ? 'All Priorities' : prio}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={sortBy}
          onValueChange={(val) => setSortBy(val as TodoSortBy)}
        >
          <SelectTrigger className="h-7 w-[110px] text-[10px] focus:ring-1">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc" className="text-xs">Newest</SelectItem>
            <SelectItem value="createdAt-asc" className="text-xs">Oldest</SelectItem>
            <SelectItem value="dueDate-asc" className="text-xs">Due date</SelectItem>
            <SelectItem value="priority-desc" className="text-xs">Priority</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearchQuery('');
              setFilter('all');
              setPriorityFilter('all');
              setCategoryFilter('all');
              setSortBy('createdAt-desc');
            }}
            className="h-7 px-2 text-[10px] text-muted-foreground hover:text-foreground hover:bg-transparent"
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
