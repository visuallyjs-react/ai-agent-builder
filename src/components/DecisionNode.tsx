
import DeleteNode from "./DeleteNode";
import {lookupIcon} from "../model-operations";
import {Vertex} from "@visuallyjs/browser-ui";
import {JsxWrapperProps} from "@visuallyjs/browser-ui-react";

export default function DecisionNode({vertex, data, model}: JsxWrapperProps<Vertex>) {

    return (
        <div className="decision-node vjs-ai-node">
            <div className="vjs-ai-node-header">
                <img className="vjs-ai-node-icon" src={lookupIcon(data)} alt={data.provider || ""}/>
                <div className="vjs-ai-node-name" title={data.name}>{data.name}</div>
                <DeleteNode vertex={vertex} model={model}/>
            </div>
            {data.conditions?.map((condition:any) => <div key={condition.id} data-vjs-port={condition.id} data-vjs-source={true}/>)}
        </div>
    );
}
