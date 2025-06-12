import { format, formatDistanceToNow, isAfter, isBefore } from 'date-fns';
import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { Badge } from 'lucide-react';
const SprintManager = ({sprint,projectId,sprints,setSprint}) => {
  const [status,setStatus]=useState(sprint.status);
  const startDate=new Date(sprint.startDate);
  const endDate=new Date(sprint.endDate);
  const now=new Date();
  const canStart=isBefore(now,endDate)&& isAfter(now,startDate) && status==="PLANNED";
   
  const canEnd=status==="ACTIVE";

  const handleSprintChange=(value)=>{
    const selectedSprint=sprints.find((s)=>s.id===value);
    setSprint(selectedSprint);
    setStatus(selectedSprint.status)
  }

const getStatusText=()=>{
    if(status==="COMPLETED"){
        return 'Sprint Ended';
    }
    if(status==="ACTIVE" && isAfter(now, endDate)){
        return `Overdue by ${formatDistanceToNow(endDate)}`
    }
    if(status==="PLANNED" && isBefore(now,startDate)){
        return `Starts in ${formatDistanceToNow(startDate)}`
    }
    return null;
};
  return (
    <>
    
     <div className='flex justify-between items-center gap-4'>
      <Select
  value={sprint.id}
  onValueChange={handleSprintChange}
>
  <SelectTrigger className="bg-slate-950 self-start">
    <SelectValue placeholder="Select Sprint" />
  </SelectTrigger>
  <SelectContent>
   {sprints.map((sprint)=>{
    return(

<SelectItem key={sprint.id} value={sprint.id}>

    {sprint.name} ({format(sprint.startDate,"MMM d,yyyy")}) to {" "}
    {format(sprint.endDate,"MMM d,yyyy")}
</SelectItem>
    )
   })}
    
  </SelectContent>
</Select>


{
    canStart && (<Button className="bg-green-900 text-white" >Start Sprint</Button>
)}

{
    canEnd && (<Button className="bg-green-900 text-white" >End Sprint</Button>
)}
    </div>
{getStatusText() &&(
    <Badge className='mt-3 ml-1 self-start'> {getStatusText()}   </Badge>
)}
    </>
   

  )
}

export default SprintManager