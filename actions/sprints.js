'use server'
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createSprint(projectId, data) {
  const { userId, orgId } = await auth();
  //const projectId = formData.get('projectId');
 
  console.log("➡️ createSprint server got projectId:", projectId);

  if (!userId || !orgId) throw new Error("unauthorized");
  if (!projectId) throw new Error("Missing projectId");

  const project = await prisma.project.findUnique(
    { where: { id: projectId } });

  if (!project || project.organizationId !== orgId) {
    throw new Error("Project not found");
  }

  const sprint = await prisma.sprint.create({
   data: {
      name: data.name ,
      startDate: data.startDate ,
      endDate: data.endDate ,
      status: "PLANNED",
      projectId,
    },
  });

  return sprint; 
}
