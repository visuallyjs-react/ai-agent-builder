
import {deleteVertex} from "../model-operations";
import {BrowserUIModel, Vertex, getDownstreamVertices} from "@visuallyjs/browser-ui";
import {useContext} from "react";
import {PopupContext} from "../App";

/**
 * Common delete node component
 * @param props
 * @constructor
 */
export default function DeleteNode({vertex, model, label}: { vertex:Vertex, model:BrowserUIModel, label?:string }) {
    const {confirm} = useContext(PopupContext);

    return <DeleteSomething label={label} handler={(e) => {
        e.stopPropagation();
        const ds = getDownstreamVertices(vertex, false);
        if (ds.length > 0) {
            confirm({
                title: "Delete Node?",
                message: "This node has downstream vertices which will also be deleted. Are you sure?",
                onConfirm: () => deleteVertex(vertex, model)
            });
        } else {
            deleteVertex(vertex, model);
        }
    }}/>

}

export function DeleteSomething({handler, label}:{handler:(e:any) => any, label?:string}) {
    return <button className="vjs-ai-delete-button" data-vjs-no-events={true} onClick={(e) => handler(e)}>
        {label ? <span>{label}</span> : <img src="/icons/trash.svg" alt="Delete" style={{ width: '100%', height: '100%' }} />}
    </button>
}
