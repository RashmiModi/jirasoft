import { getOrganization } from '@/actions/organization';
import React from 'react'
import OrgSwitcher from '@/components/OrgSwitcher'
import ProjectList from './_components/project-list';
const Organization = async({params}) => {
  const {orgId} =await params;
console.log("org ID----->>>>",orgId);
  const organization = await getOrganization(orgId);
  console.log("org name----->>>",organization.name)
  if(!organization)    return <div>Organization not found</div>
  
    return (
    <div className='container mx-auto'>
        <div className='mb-4 flex flex-col sm:flex-row justify-between items-start'>

          <h1 className="inline-block text-5xl font-bold bg-gradient-to-r from-white to-blue-600 bg-clip-text text-transparent pb-2">
  {organization.name}'s Projects
</h1>
       
     <OrgSwitcher />  
       
        </div>

        <div className='mb-4'>
          <ProjectList orgId={organization.id}/>
        </div>
        <div className='mt-8'>Show user assigned and reported issues here</div>
    
    </div>
  )
}

export default Organization