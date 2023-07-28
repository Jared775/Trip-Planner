// <!-- drawer init and show -->
import React, {Dispatch, SetStateAction, useState} from "react";
import { DragDropContext, Draggable, DraggableLocation, DraggingStyle, Droppable, DropResult, NotDraggingStyle } from "react-beautiful-dnd";
import { Property } from "csstype";
import {SimpleMap} from "@/components/GoogleMapReact";
import UserSelect = Property.UserSelect;


export default function Sidebar(props : {drawerVisible:boolean, setDrawerVisible:Dispatch<SetStateAction<boolean>>, sidebarText: string, buttonLocationName:string, sidebarPhotoLink:string, sidebarMapLat:number, sidebarMapLng:number}) {
    const { drawerVisible, setDrawerVisible, sidebarText,buttonLocationName, sidebarPhotoLink, sidebarMapLat, sidebarMapLng} = props;
    return (
        <main className={"h-screen"}>

            {/*// <!-- drawer component -->*/}

            <div className={(drawerVisible ? "absolute inset-0" : "") + " overlay"} id="overlay"
                 onClick={()=>{setDrawerVisible(false)}}>

            </div>

            <div id="drawer-navigation"
                 className={(drawerVisible ? "" : "-translate-x-full") + " fixed top-0 left-0 z-40 sm:w-[45rem] w-screen h-screen p-4 overflow-y-auto transition-transform bg-white dark:bg-gray-800"}
                 aria-labelledby="drawer-navigation-label">
                <h5 id="drawer-navigation-label"
                    className="text-xl font-semibold text-gray-0 uppercase dark:text-gray-400">{buttonLocationName}</h5>
                {sidebarPhotoLink && <img className = "mt-4 rounded-2xl" src={sidebarPhotoLink} alt={'preview photo of place of interest'}/>}
                <button type="button" data-drawer-hide="drawer-navigation" aria-controls="drawer-navigation"
                        onClick={()=>{setDrawerVisible(false)}}
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                         xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"></path>
                    </svg>
                    <span className="sr-only">Close menu</span>
                </button>
                {/*this is where the overlay stuff will go*/}

                <div className="py-4 overflow-y-auto">
                    <ul className="space-y-2 font-medium">
                        <li
                            className="flex whitespace-pre-line items-center p-2 text-sm text-gray-900 rounded-lg dark:text-white group">
                            <span className="ml-3">{sidebarText}</span>
                        </li>
                    </ul>
                </div>
                <div className = "h-">
                    <SimpleMap buttonLng={sidebarMapLng} buttonLat={sidebarMapLat} button={buttonLocationName}></SimpleMap>
                </div>
            </div>
        </main>
    )
}
