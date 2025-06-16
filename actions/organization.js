"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function getOrganization(orgId) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const organization = await clerkClient.organizations.getOrganization({ organizationId: orgId });

    if (!organization) {
      return null;
    }

    const { data: membership } = await clerkClient.organizations.getOrganizationMembershipList({
      organizationId: organization.id,
    });

    const userMembership = membership.find(
      (member) => member.publicUserData.userId === userId
    );

    if (!userMembership) {
      return null;
    }

    return organization;
  } catch (error) {
    console.error("Error retrieving organization:", error);
    throw error;
  }
}


export async function getOrganizationUsers(orgId) {
   const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

 const organization = await clerkClient.organizations.getOrganization({ organizationId: orgId });

    if (!organization) {
      return null;
    }
    

    const organizationMemberships= await clerkClient.organizations.getOrganizationMembershipList({
      organizationId: organization.id,
    });
  
    const userIds=organizationMemberships.data.map(
      (membership)=>membership.publicUserData.userId
    )

    const users=await prisma.user.findMany({
      where:{
        clerkUserId:{
          in:userIds,
        }
      }
    })
    return users;
}