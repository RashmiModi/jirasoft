"use client"

import React, { useEffect } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { issueSchema } from '@/app/lib/validators'
import useFetch from '@/hook/use-fetch'
import { createIssue } from '@/actions/issues'
import { getOrganizationUsers } from '@/actions/organization'
import { BarLoader } from 'react-spinners'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import MDEditor from '@uiw/react-md-editor'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
const IssueCreationDrawer = ({
      isOpen,
    onClose,
    sprintId,
    status,
    projectId,
    onIssueCreated,
    orgId
}) => {
    
     const {control,register,handleSubmit,formState:{errors},reset}    =   
     useForm({resolver:zodResolver(issueSchema),
      defaultValues:{
        priority:"MEDIUM",
        description:"new issue",
        assigneeId:"",
      }
     })

const {
  loading:createIssueLoading,
  fn:createIssueFn,
  error,
  data:newIssue,

}=useFetch(createIssue)

useEffect(()=>{
if(newIssue){
  reset();
  onClose();
  onIssueCreated();
  toast.success("Issue created..!!")
}
},[newIssue,createIssueLoading])

const {
  loading:usersLoading,
  fn:fetchUsers,
  data:users,
}=useFetch(getOrganizationUsers);


useEffect(()=>{
  if(isOpen&&orgId){
    fetchUsers(orgId)
  }
},[isOpen,orgId]);
  

const onSubmit=async(data)=>{

  await createIssueFn(projectId,{
    ...data,
    status,
    sprintId
  })
};


  return (
   <Drawer open={isOpen} onClose={onClose}>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Create New Issue</DrawerTitle>
      
    </DrawerHeader>
    {usersLoading && <BarLoader width={"100%"}  color='#36d7b7'/>}
   <form className='p-4 space-y-4' onSubmit={handleSubmit(onSubmit)}>
<div>
  <label htmlFor='title' className='block text-sm font-medium mb-1'>Title</label>
<input id='title' className='border border-gray-300' {...register('title')}/>
{errors.title&&(
  <p className='text-red-500 text-sm mt-1'>

{errors.title.message}

  </p>
)}
</div>

<div>
  <label htmlFor='assigneeId' className='block text-sm font-medium mb-1'>
    Assignee</label>
<Controller name="assigneeId" control={control}
render={({field})=>(
<Select 
onValueChange={field.onChange}
defaultValue={field.value}
>
  <SelectTrigger className="w-[180px]">
  <SelectValue placeholder="Select assignee" />
</SelectTrigger>
<SelectContent>
  {(users || []).map((user) => (
    <SelectItem key={user.id} value={user.id}>
      {user?.name}
    </SelectItem>
  ))}
</SelectContent>
</Select>
)}
/>
{errors.assigneeId&&(
  <p className='text-red-500 text-sm mt-1'>

{errors.assigneeId.message}

  </p>
)}
</div>

<div>
  <label htmlFor='description' className='block text-sm font-medium mb-1'>
    Description</label>
<Controller name="description" control={control}
render={({field})=>(

  <MDEditor value={field.value} onChange={field.onChange}/>
)}
  />
{errors.description&&(
  <p className='text-red-500 text-sm mt-1'>
{errors.description.message}

  </p>
)}
</div>

<div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium mb-1"
            >
              Priority
            </label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.priority&&(
  <p className='text-red-500 text-sm mt-1'>
{errors.priority.message}

  </p>
)}
          </div>
{errors&&
  <p className='text-red-500 mt-2'>

{errors.message}

  </p>
}
<Button type="submit"
 disabled={createIssueLoading}
className="w-full ">

  {createIssueLoading?"Creating...":"Create Issue"}
</Button>
   </form>
  
  
  </DrawerContent>
</Drawer>
  )
}

export default IssueCreationDrawer