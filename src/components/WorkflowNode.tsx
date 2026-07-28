import {lookupIcon} from "../model-operations";
import NodeOptions from "./NodeOptions";
import {JsxWrapperProps} from "@visuallyjs/browser-ui-react";
import LeafAction from "./LeafAction.tsx";

export default function WorkflowNode(props:JsxWrapperProps<any>) {

    const { data, vertex, model } = props
    const isLeaf = vertex.getAllSourceEdges().length === 0

    return (<div className="vjs-ai-node">
      <div className="vjs-ai-node-header">
          <img className="vjs-ai-node-icon" src={lookupIcon(data)} alt={data.provider || ""}/>
        <div className="vjs-ai-node-name" title={data.name}>{data.name}</div>
        <NodeOptions vertex={vertex} model={model}/>
      </div>
      <div className="vjs-ai-node-body">
        <div className="vjs-ai-node-summary">{data.summary}</div>
      </div>
      {isLeaf && <LeafAction/>}
    </div>);
}
