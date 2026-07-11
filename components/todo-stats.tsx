'use client';

import React from 'react';
import { useAtomValue } from 'jotai';
import { todoStatsAtom } from '@/atoms/todoAtoms';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListTodo, CheckCircle2, Clock } from 'lucide-react';

export default function TodoStats() {
  const { total, completed, pending, completionPercentage } = useAtomValue(todoStatsAtom);

  return (
    <div className="space-y-6">
      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Tasks Card */}
        <Card className="overflow-hidden border bg-card shadow-sm transition-all duration-300 hover:shadow-md dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <ListTodo className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{total}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Total registered items
            </p>
          </CardContent>
        </Card>

        {/* Completed Tasks Card */}
        <Card className="overflow-hidden border bg-card shadow-sm transition-all duration-300 hover:shadow-md dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{completed}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Completed items
            </p>
          </CardContent>
        </Card>

        {/* Pending Tasks Card */}
        <Card className="overflow-hidden border bg-card shadow-sm transition-all duration-300 hover:shadow-md dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{pending}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Tasks waiting action
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar Container */}
      <Card className="border bg-card shadow-sm dark:border-zinc-800">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Completion Rate</span>
            <span className="text-sm font-bold text-foreground">{completionPercentage}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
