import React, { Dispatch, SetStateAction } from "react";
import { DragDropContext, Draggable, DraggableLocation, DraggingStyle, Droppable, DropResult, NotDraggingStyle } from "react-beautiful-dnd";
import { Property } from "csstype";
import UserSelect = Property.UserSelect;

export type CellItem = { id: string; content: string };

const reorder = (list: CellItem[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source: CellItem[], destination: CellItem[], droppableSource: DraggableLocation, droppableDestination: DraggableLocation) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result: Record<string, CellItem[]> = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
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

  function onDragEnd(result: DropResult) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(cellsData[sInd], source.index, destination.index);
      const newState = [...cellsData];
      newState[sInd] = items;
      setCellsData(newState);
    } else {
      const result = move(cellsData[sInd], cellsData[dInd], source, destination);
      const newState = [...cellsData];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setCellsData(newState.filter(group => group.length));
    }
  }
  return (
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
                                newState.filter(group => group.length)
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

