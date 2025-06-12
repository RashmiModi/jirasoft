"use client";
import { useOrganization } from "@clerk/nextjs";
import { toast } from "sonner";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteProjects } from "@/actions/project";

export default function DeleteProject({ projectId, onDelete }) {
  const { membership } = useOrganization();
  const isAdmin = membership?.role === "org:admin";
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!isAdmin) return;
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    startTransition(async () => {
      try {
        await deleteProjects(projectId);
        toast.success("Project deleted!");

        if (onDelete) {
          onDelete(projectId);
        } else {
          // fallback if no callback provided
          window.location.reload();
        }
      } catch (error) {
        toast.error(error.message);
        window.location.reload();
      }
    });
  };

  if (!isAdmin) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
      className={isPending ? "opacity-50 cursor-not-allowed" : ""}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
