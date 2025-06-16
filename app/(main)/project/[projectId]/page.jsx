import { getProject } from '@/actions/project';
import { notFound } from 'next/navigation';
import React from 'react'
import SprintCreationForm from '../_components/create_sprint';
import SprintBoard from '../_components/sprint-board';
const ProjectPage = async({params}) => {

   const { projectId } = await params;
  
  const project=await getProject(projectId);
  console.log("project info:--->"+project.id,project.name)
  if(!project){
    notFound();
  }
  return (
    <div className='container mx-auto'>
   {/*sprint creation*/}
      <SprintCreationForm 
      projectTitle={project.name}
      projectId={project.id}
      projectKey={project.key}
      sprintKey={project.sprints?.length+1}      
      />
   {/*sprint board*/}
{project.sprints.length>0?(
<SprintBoard
sprints={project.sprints}
projectId={project.id}
orgId={project.organizationId}
/>
):(

  <div>Create a sprint from button above</div>
)}
    </div>

  )
}

export default ProjectPage