"use client";
import React, { useEffect, useState } from "react";
import SprintManager from "./sprint-manager";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import statuses from "@/data/status";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import IssueCreationDrawer from "./create-issue";
import useFetch from "@/hook/use-fetch";
import { getIssuesForSprint } from "@/actions/issues";
import { BarLoader } from "react-spinners";
import IssueCard from "@/components/issue-card";
import { toast } from "sonner";
import { updateIssueOrder } from "@/actions/issues";
import BoardFilters from "./board-filters";

function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

const SprintBoard = ({ sprints = [], projectId, orgId }) => {
  const [currentSprint, setCurrentSprint] = useState(
    sprints.find((spr) => spr.status === "ACTIVE") || sprints[0]
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const handleAddIssue = (status) => {
    setSelectedStatus(status);
    setIsDrawerOpen(true);
  };

  const {
    loading: issuesLoading,
    error: issuesError,
    fn: fetchIssues,
    data: issues,
    setData: setIssues,
  } = useFetch(getIssuesForSprint);

  useEffect(() => {
    if (currentSprint?.id) {
      fetchIssues(currentSprint.id);
    }
  }, [currentSprint.id]);

  const [filteredIssues,setFilteredIssues]=useState(issues)

  const handleFilterChange=(newFilteredIssues)=>{
    setFilteredIssues(newFilteredIssues)
  }
  const handleIssueCreated = () => {
    fetchIssues(currentSprint.id);
  };

const {
  fn:updateIssueOrderFn,
  loading:updateIssuesLoading,
  error:updateIssuesError,
}=useFetch(updateIssueOrder)

  const onDragEnd = async (result) => {
    if (currentSprint.status === "PLANNED") {
      toast.warning("Start the sprint to update board");
      return;
    }
    if (currentSprint.status === "COMPLETED") {
      toast.warning("Cannot update board after sprint end");
      return;
    }

    const { destination, source } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newOrderedData = [...issues];

    const sourceList = newOrderedData.filter(
      (item) => item.status === source.droppableId
    );
    const destinationList = newOrderedData.filter(
      (item) => item.status === destination.droppableId
    );

    // Prevent out-of-range error
    if (source.index < 0 || source.index >= sourceList.length) {
      console.error("Invalid drag source index");
      return;
    }

    const movedItem = sourceList[source.index];
    if (!movedItem) return;

    if (source.droppableId === destination.droppableId) {
      const columnIssues = newOrderedData
      .filter((item) => item.status === source.droppableId)
      .sort((a, b) => a.order - b.order);
      const reordered = reorder(sourceList, source.index, destination.index);
      reordered.forEach((item, idx) => {
        if (item) item.order = idx;
      });
    } else {
      // Move item to new column
      movedItem.status = destination.droppableId;
      sourceList.splice(source.index, 1);
      destinationList.splice(destination.index, 0, movedItem);

      // Reassign order in both lists
      sourceList.forEach((item, i)  => (item.order = i));
      destinationList.forEach((item, i)  => (item.order = i));
    }

    const sortedIssues=newOrderedData.sort((a,b)=>a.order-b.order)
    setIssues(newOrderedData,sortedIssues)
    setIssues([...newOrderedData]);


   updateIssueOrderFn(sortedIssues)
  };

  if (issuesError) return <div>Error loading issues</div>;

  return (
    <div>
      {/* Sprint Manager */}
      <SprintManager
        sprint={currentSprint}
        setSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
     />

     {issues && !issuesLoading&&(
      <BoardFilters issues={issues} onFilterChange={handleFilterChange}/>
     )}
        {updateIssuesError && (
          <p className="text-red-500 mt-2" >{updateIssuesError.message}</p>
        )}
        {(updateIssuesLoading || issuesLoading)&& (
          <BarLoader className="mt-4 w-full" width={"100%"} color="#36d7b7" />
        )}
      

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 bg-slate-900 p-4 rounded-lg">
          {statuses.map((column) => (
            <Droppable
              droppableId={column.key || column.name}
              key={column.key || column.name}
            >
              {(provided) => (
                <div
                  className="space-y-2"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h3 className="font-semibold mb-2 text-center">
                    {column.name}
                  </h3>

                  {filteredIssues
                    ?.filter((issue) => issue.status === column.key)
                    .map((issue, index) => (
                   
                   
                      <Draggable
                        key={issue.id}
                        draggableId={issue.id}
                        index={index}
                        isDragDisabled={updateIssuesLoading}

                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <IssueCard issue={issue}  
                            onDelete={()=>fetchIssues(currentSprint.id)}
                            onUpdate={(updated)=>setIssues((issues)=>
                              issues.map((issue)=>{
                                if(issue.id===updated.id)
                                  return updated;
                                return issue;
                              })
                            ) 
                          }/>
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}

                  {column.key === "TODO" &&
                    currentSprint.status !== "COMPLETED" && (
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => handleAddIssue(column.key)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Issue
                      </Button>
                    )}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <IssueCreationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sprintId={currentSprint.id}
        status={selectedStatus}
        projectId={projectId}
        onIssueCreated={handleIssueCreated}
        orgId={orgId}
      />
    </div>
  );
};

export default SprintBoard;
