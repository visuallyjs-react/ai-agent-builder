import {lookupIcon} from "../model-operations";
import {JsxWrapperProps} from "@visuallyjs/browser-ui-react";
import LeafAction from "./LeafAction.tsx";
import {VertexOperation} from "../definitions.ts";
import NodeOptions from "./NodeOptions";

export default function TriggerNode(props:JsxWrapperProps<any>&{selectTrigger:VertexOperation}) {

    const { data, vertex, model, selectTrigger } = props
    const isLeaf = vertex.getAllSourceEdges().length === 0
    const isUnset = !data.provider || !data.trigger

    return (<div className={`vjs-ai-node vjs-ai-trigger-node`}>
        {!isUnset && <>
            <div className="vjs-ai-node-header">
                <img className="vjs-ai-node-icon" src={lookupIcon(data)} alt={data.provider || ""}/>
                <div className="vjs-ai-node-name" title={data.name}>{data.name}</div>
                <NodeOptions vertex={vertex} model={model}/>
            </div>
            <div className="vjs-ai-node-body">
                <div className="vjs-ai-node-summary">{data.summary}</div>
            </div>
        </>}
        {isUnset && <div style={{padding:"15px", margin:"0 auto", textAlign:"center"}} onClick={() => selectTrigger(vertex, model)}>Select Trigger</div>}
        {(isLeaf) && <LeafAction/>}
        <img src="/icons/trigger-top.svg" className="vjs-ai-trigger-top" alt="" style={{ backgroundColor: isUnset ? 'white' : '#f8f9fa' }} />
    </div>);
}
