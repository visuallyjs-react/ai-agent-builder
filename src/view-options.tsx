import {Edge, EVENT_TAP, VisuallyJsModel, Node} from "@visuallyjs/browser-ui"

import WorkflowNode from "./components/WorkflowNode";
import TriggerNode from "./components/TriggerNode";
import DecisionNode from "./components/DecisionNode";
import AgentNode from "./components/AgentNode";
import PlaceholderNode from "./components/PlaceholderNode";
import {JsxWrapperProps, ReactSurfaceViewOptions} from "@visuallyjs/browser-ui-react";
import {isCondition} from "./model-operations";

function EdgeOverlay(ctx:JsxWrapperProps<Edge>) {
    const label = ctx.obj.source.data.label
    const isDecision = isCondition(ctx.obj.source)
    return <>
        {isDecision && label && <div className="condition-label">
            <span onClick={() => ctx.model.setSelection(ctx.obj.source)}>{ctx.obj.source.data.label}</span>
        </div>}
        </>
}

export default function getViewOptions(selectTrigger:(obj:Node, model:VisuallyJsModel) => any, addSkill:(obj:Node, model:VisuallyJsModel) => any):ReactSurfaceViewOptions {
    return {
        nodes:{
            trigger: {
                jsx: (ctx:JsxWrapperProps<any>) => <TriggerNode {...ctx} selectTrigger={selectTrigger} />
            },
            decision: {
                jsx: (ctx:JsxWrapperProps<any>) => DecisionNode(ctx),
                parent:"default"
            },
            agent: {
                jsx: (ctx:JsxWrapperProps<any>) => <AgentNode {...ctx} addSkill={addSkill} />,
                parent:"default"
            },
            placeholder: {
                jsx: (_ctx:JsxWrapperProps<any>) => PlaceholderNode()
            },
            default:{
                jsx:(ctx:JsxWrapperProps<any>) => WorkflowNode(ctx),
                events:{
                    [EVENT_TAP]: (p:any) => {
                        p.model.setSelection(p.obj)
                    }
                }
            }
        },
        edges:{
            default:{
                overlays:[{
                        jsx:EdgeOverlay,
                        options:{
                            location:0.5
                        }
                    }
                ]
            },
            placeholder:{
                cssClass:"vjs-ai-placeholder-edge"
            }
        }
    }
}
