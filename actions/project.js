"use server"
import prisma from "@/lib/prisma";
import {auth} from "@clerk/nextjs/server"
import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function createProject(data) {
    const {userId,orgId}=await auth();

    if(!userId){
        throw new Error("Unauthorized....")
    }

    if(!orgId){
        throw new Error("No organization Selected");
    }
    
     const { data: membership } = await clerkClient.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

    const userMembership = membership.find(
      (member) => member.publicUserData.userId === userId
    );

    if(!userMembership || userMembership.role!=="org:admin"){
        throw new Error ("only organization admins can create projects")
    }
    try{
        const project=await prisma.project.create({
            data:{
                name:data.name,
                key:data.key,
                description:data.description,
                organizationId:orgId,

            },
        });
        return project;
    }catch(error){
        throw new Error("Error creating project : "+error.message);
    }
}

export async function getProjects(data) {
console.log("org id in project.js --->",data.orgId)
    const {userId,orgId}=await auth();
    if(!userId) {
        throw new Error("Unauthorized")
    }

    const user=await prisma.user.findUnique({
        where:{clerkUserId:userId},
    });
    if(!user){
        throw new Error("User not found")
    }

    const projects=await prisma.project.findMany({
        where:{organizationId:orgId},
        orderBy:{createdAt:"desc"}
    });
    return projects;
}




export async function deleteProjects(projectId) {
  const { userId, orgId, orgRole } = await auth();
  if (!userId || !orgId) throw new Error("Unauthorized");
  if (orgRole !== "org:admin") throw new Error("Only admins can delete projects");

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.organizationId !== orgId) throw new Error("Not found or no permission");

  await prisma.project.delete({ where: { id: projectId } });
  
  return { success: true };
}

export async function getProject(projectId) {
const {userId,orgId}=await auth();
console.log("get project inside projid--->",projectId)
if(!userId|| !orgId){
    throw new Error("Unauthorized..")
}
const user=await prisma.user.findUnique({
        where:{clerkUserId:userId},
    });

if(!user){
    throw new Error("Use not found")
}

const project=await  prisma.project.findUnique({
where:{id:projectId},
include:{
    sprints:{
        orderBy:{createdAt:"desc"},
    },
},
})


if(!project){
    return null;
}

if(project.organizationId!==orgId){
    return null;
}
return project;
}