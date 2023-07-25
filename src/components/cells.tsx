import React, { Dispatch, SetStateAction } from "react";
import { DragDropContext, Draggable, DraggableLocation, DraggingStyle, Droppable, DropResult, NotDraggingStyle } from "react-beautiful-dnd";
import { Property } from "csstype";
import UserSelect = Property.UserSelect;  //imports all the fun stuff at the top of index.tsx

export type CellItem = { id: string; content: string }; //exports the result of the function

const reorder = (list: CellItem[], startIndex: number, endIndex: number) => {   //creates a function that takes in the list, and the first and last values
  const result = Array.from(list);  //creates an array from the list
  const [removed] = result.splice(startIndex, 1); //slices out the first item
  result.splice(endIndex, 0, removed);    //splices out the last item

  return result;    //returns the chopped list
};

/**
 * Moves an item from one list to another list.
 */
const move = (source: CellItem[], destination: CellItem[], droppableSource: DraggableLocation, droppableDestination: DraggableLocation) => {
  const sourceClone = Array.from(source);   //creates an array for the original cell
  const destClone = Array.from(destination);   //creates an array for the destination cell
  const [removed] = sourceClone.splice(droppableSource.index, 1); //removes the item from the original cell

  destClone.splice(droppableDestination.index, 0, removed);

  const result: Record<string, CellItem[]> = {};
  result[droppableSource.droppableId] = sourceClone; //removes the item from the original list
  result[droppableDestination.droppableId] = destClone; //adds it to the destination list

  return result; //returns the result
};

const getItemStyle = (isDragging: boolean, draggableStyle: DraggingStyle | NotDraggingStyle | undefined) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none" as UserSelect,
  // padding: grid * 2,
  // margin: `0 0 ${grid}px 0`,
  //
  // // change background colour if dragging
  // background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});
const getListStyle = (isDraggingOver: boolean | undefined) => ({
  // background: isDraggingOver ? "lightblue" : "lightgrey",
  // padding: grid,
  // width: 250
});

export function Cells(props: { cellsData: CellItem[][], setCellsData: Dispatch<SetStateAction<CellItem[][]>> }) {

  const { cellsData, setCellsData } = props;

  function onDragEnd(result: DropResult) {    //makes the function
    const { source, destination } = result; //makes the result the change in items from boxes

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;     //makes the variable which controls the source box
    const dInd = +destination.droppableId;//makes the variable which controls the destination box

    if (sInd === dInd) {   //if the user drops an item into its own box
      const items = reorder(cellsData[sInd], source.index, destination.index); //reorder the box according to where they drop the item
      const newState = [...cellsData];  //clones the cells data, so all the boxes
      newState[sInd] = items;   //changes the cloned day to match the new items list order
      setCellsData(newState);   //makes the "set_n" of the cells function the cloned cells data
    } else {
      const result = move(cellsData[sInd], cellsData[dInd], source, destination); //moves the item from the source box to the destination box
      const newState = [...cellsData]; //clones the data into newState
      newState[sInd] = result[sInd]; //changes the data from source box in the cloned version
      newState[dInd] = result[dInd]; //changes the data from the destination box in the cloned version

      setCellsData(newState); //sets the cells data to the cloned version and checks if the length is 0, if so it gets kicked out
    }
  }
  return (    //returns the below code
    <div className={`grid grid-rows-${cellsData.length}`}>
      <DragDropContext onDragEnd={onDragEnd}>
        {cellsData.map((el, ind) => (
          <Droppable key={ind} droppableId={`${ind}`}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                className={"mt-2 block max-w-sm p-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"}
                style={getListStyle(snapshot.isDraggingOver)}
                {...provided.droppableProps}
              >
                <p className = "mb-3 text-center text-gray-500 dark:text-gray-400"> Day {ind+1}</p>
                {el.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <div
                          className = "flex justify-between block max-w-sm p-1.5 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                        >
                          <div>
                            {item.content}
                          </div>
                          <button
                            type="button"
                            className = "text-red-600 font-extrabold"
                            onClick={() => {
                              const newState = [...cellsData];
                              newState[ind].splice(index, 1);
                              setCellsData(
                                newState
                              );
                            }}
                          >
                            X
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
}

