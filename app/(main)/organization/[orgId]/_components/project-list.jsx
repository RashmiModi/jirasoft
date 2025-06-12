"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { getProjects } from '@/actions/project';
import DeleteProject from './delete-project';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ProjectList({ orgId }) {
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getProjects({ orgId })
      .then(data => { if (isMounted) setProjects(data); })
      .catch(() => { if (isMounted) setProjects([]); });
    return () => { isMounted = false; };
  }, [orgId]);

  const handleDelete = useCallback((deletedId) => {
    setProjects(prev => prev.filter(p => p.id !== deletedId));
  }, []);

  if (projects === null) return <p>Loading projects...</p>;
  if (projects.length === 0) {
    return (
      <p>
        No Projects Found.{" "}
        <Link href="/project/create" className="underline">Create New</Link>
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map(project => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle className="flex justify-between">
              {project.name}
              <DeleteProject projectId={project.id} onDelete={handleDelete} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">{project.description}</p>
            <Link href={`/project/${project.id}`} className="text-blue-500 hover:underline">
              View Project
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
