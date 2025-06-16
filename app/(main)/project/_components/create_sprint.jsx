'use client'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { addDays, format } from 'date-fns'
import { sprintSchema } from '@/app/lib/validators'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CalculatorIcon } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { createSprint } from '@/actions/sprints'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useActionState, startTransition } from 'react'
import useFetch from '@/hook/use-fetch'
import { CalendarIcon } from "lucide-react";


export default function SprintCreationForm({
  projectTitle,
  projectKey,
  projectId,
  sprintKey,
}) {
  const [showForm, setShowForm] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 14),
  });
  const router = useRouter();

  const { loading: createSprintLoading, fn: createSprintFn } =
    useFetch(createSprint);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      name: `${projectKey}-${sprintKey}`,
      startDate: dateRange.from,
      endDate: dateRange.to,
    },
  });

 const [recentSprint, setRecentSprint] = useState(null);

// Update recentSprint after creating a sprint
const onSubmit = async (data) => {
  const sprint = await createSprintFn(projectId, {
    ...data,
    startDate: dateRange.from,
    endDate: dateRange.to,
  });
  setRecentSprint({
    name: data.name,
    startDate: dateRange.from,
    endDate: dateRange.to,
  });
  setShowForm(false);
  toast.success('Sprint created successfully!');
  router.push(`/project/${projectId}`);
};
  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-5xl font-bold mb-8 gradient-title">
          {projectTitle}
        </h1>
        <Button
          className="mt-2"
          onClick={() => setShowForm(!showForm)}
          variant={!showForm ? "default" : "destructive"}
        >
          {!showForm ? "Create New Sprint" : "Cancel"}
        </Button>
      </div>
      {showForm && (
        <Card className="pt-4 mb-4">
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex gap-4 items-end"
            >
              <div className="flex-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Sprint Name
                </label>
                <Input
                  id="name"
                  {...register("name")}
                  readOnly
                  className="bg-slate-950"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Sprint Duration
                </label>
                <Controller
                  control={control}
                  name="dateRange"
                  render={({ field }) => (
                   <Popover>
  <PopoverTrigger asChild>
    <Button
      variant="outline"
      className={`w-full justify-start text-left font-normal bg-slate-950 ${
        !dateRange && "text-muted-foreground"
      }`}
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      {dateRange.from && dateRange.to ? (
        format(dateRange.from, "LLL dd, y") +
        " - " +
        format(dateRange.to, "LLL dd, y")
      ) : (
        <span>Pick a date</span>
      )}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto bg-slate-900" align="start">
    {recentSprint && (
      <div className="mb-2 text-xs text-blue-400">
        Recent Sprint: <b>{recentSprint.name}</b><br />
        {format(recentSprint.startDate, "LLL dd, y")} - {format(recentSprint.endDate, "LLL dd, y")}
      </div>
    )}
    <DayPicker
      classNames={{
        chevron: "fill-blue-500",
        range_start: "bg-blue-700",
        range_end: "bg-blue-700",
        range_middle: "bg-blue-400",
        day_button: "border-none",
        today: "border-2 border-blue-700",
      }}
      mode="range"
      disabled={[{ before: new Date() }]}
      selected={dateRange}
      onSelect={(range) => {
        if (range?.from && range?.to) {
          setDateRange(range);
          field.onChange(range);
        }
      }}
    />
  </PopoverContent>
</Popover>
                  )}
                />
              </div>
              <Button type="submit" disabled={createSprintLoading}>
                {createSprintLoading ? "Creating..." : "Create Sprint"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}

