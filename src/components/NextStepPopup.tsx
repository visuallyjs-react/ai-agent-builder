import {BrowserUIModel, Vertex, Surface} from "@visuallyjs/browser-ui"
import {addChild, replacePlaceholder} from "../model-operations";

export default function NextStepPicker(props:{vertex:Vertex, model:BrowserUIModel, ui:Surface, hide:() => any, addAction:Function}){

    const {model, vertex, addAction, hide} = props

    function addConditionNode(e:any, type:string, name:string, payload:() => any) {
        e.stopPropagation()
        hide()
        const pl = Object.assign(payload() || {}, { name })
        if (vertex.type === "placeholder") {
            replacePlaceholder(vertex, type, pl, model)
        } else {
            addChild(vertex, type, pl, model)
        }
    }
    function doAddAction(e:any) {
        e.stopPropagation()
        hide()
        addAction(vertex, model)
    }

    return <>
        {vertex && <div className="vjs-next-step">
            <div onClick={doAddAction}><img src="/icons/action.svg" width="16" height="16" alt="Action" style={{marginRight: '10px'}} />Perform an action</div>
            <div onClick={(e:any) => addConditionNode(e, "decision", "Decision", () => {})}><img src="/icons/condition.svg" width="16" height="16" alt="Condition" style={{marginRight: '10px'}} />Decision</div>
            <div onClick={(e:any) => addConditionNode(e, "agent", "Agent", () => { return {skills:[] }})}><img src="/icons/ai.svg" width="16" height="16" alt="AI" style={{marginRight: '10px'}} />Enter AI agent</div>
        </div>}
    </>
}
