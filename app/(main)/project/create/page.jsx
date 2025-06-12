"use client";

import OrgSwitcher from '@/components/OrgSwitcher';
import { useOrganization, useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema } from '@/app/lib/validators';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { createProject } from '@/actions/project'; // server action
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function CreateProjectPage() {
  const { isLoaded: orgLoaded, membership } = useOrganization();
  const { isLoaded: userLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(projectSchema),
  });

  useEffect(() => {
    if (orgLoaded && userLoaded && membership) {
      setIsAdmin(membership.role === 'org:admin');
    }
  }, [orgLoaded, userLoaded, membership]);

  const onSubmit = async (data) => {
    try {
      const project = await createProject(data);
      toast.success('Project created successfully!');
      router.push(`/project/${project.id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to create project.');
    }
  };

  if (!orgLoaded || !userLoaded) return null;

  if (!isAdmin) {
    return (
      <div className="flex flex-col gap-2 items-center">
        <span className="text-2xl gradient-title">
          Oops! Only Admins can create Projects...
        </span>
        <OrgSwitcher />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-6xl text-center font-bold mb-8 gradient-title">
        Create New Project
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
        <div>
          <Input id="name" placeholder="Project Name" {...register('name')} />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <Input id="key" placeholder="Project Key (e.g., RCYT)" {...register('key')} />
          {errors.key && <p className="text-red-500 text-sm mt-1">{errors.key.message}</p>}
        </div>

        <div>
          <Textarea id="description" placeholder="Project Description" {...register('description')} />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <Button disabled={isSubmitting} type="submit" size="lg" className="bg-blue-500 text-white">
          {isSubmitting ? 'Creating...' : 'Create Project'}
        </Button>
      </form>
    </div>
  );
}
