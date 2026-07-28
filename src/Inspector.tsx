import  {ReactNode, useEffect, useState, useContext} from 'react';
import {isNode, VisuallyJsModel, Vertex, Base, isPort, getDownstreamVertices} from "@visuallyjs/browser-ui";
import { InspectorComponent } from "@visuallyjs/browser-ui-react";
import {Action, ActionList, ActionConfigurationProperty, Decision, DecisionCondition} from "./definitions";
import {addCondition, deleteCondition} from "./model-operations";
import {DeleteSomething} from "./components/DeleteNode";
import {PopupContext} from "./App";

function renderProperty(prop: ActionConfigurationProperty) {
    const { id, name, datatype, desc } = prop;

    return (
        <div key={id} className="vjs-inspector-field">
            <label>{name}</label>
            {datatype === 'string' && (
                <textarea vjs-att={id} placeholder={desc} rows={3} />
            )}
            {datatype === 'number' && (
                <input type="number" vjs-att={id} placeholder={desc} />
            )}
            {/* @ts-ignore */}
            {datatype === 'boolean' && (
                <select vjs-att={id}>
                    <option value=""></option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>
            )}
            {/* @ts-ignore */}
            {datatype === 'array' && <textarea vjs-att={id} placeholder={`${desc} (comma separated)`} rows={2} />}
            {/* @ts-ignore */}
            {['string', 'number', 'boolean', 'array'].indexOf(datatype) === -1 && <input type="text" vjs-att={id} placeholder={desc} />}
            <div className="vjs-field-desc">{desc}</div>
        </div>
    );
}

function DecisionPortInspector({model}:{model:VisuallyJsModel}) {
    return <>
        <InspectorHeader model={model}>
            <h3>Prompt</h3>
        </InspectorHeader>
    <div className="vjs-inspector-properties">
        <div className="vjs-inspector-field">
            <label>Name</label>
            <input type="text" vjs-att="label" placeholder="Label" vjs-focus/>
        </div>
    </div></>
}

function InspectorHeader({children, model}:{children:ReactNode|Array<ReactNode>, model:VisuallyJsModel}) {
    return <div className="vjs-inspector-header">
        <div className="vjs-inspector-title">
            {children}
        </div>
        <button className="close-button" onClick={() => model.clearSelection()}>
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor"
                 strokeWidth="2" fill="none" strokeLinecap="round"
                 strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    </div>
}

function ActionInspector({action, model}:{action:Action|null, model: VisuallyJsModel}) {
    return <>
        <InspectorHeader model={model}>
            {action != null && <>
            <h3>{action.name}</h3>
            <p>{action.desc}</p>
            </>}
            {action == null && <h3>Action not found!</h3>}
        </InspectorHeader>
        <div className="vjs-inspector-properties">
            <div className="vjs-inspector-field">
                <label>Name</label>
                <input type="text" vjs-att="name" placeholder="Name"/>
            </div>
            <div className="vjs-inspector-field">
                <label>Summary</label>
                <textarea vjs-att="summary" placeholder="Summary" rows={3}/>
            </div>

            <div className="vjs-inspector-divider"
                 style={{margin: '15px 0', borderTop: '1px solid #eee'}}></div>

            {action != null && action.properties && action.properties.map(prop => renderProperty(prop))}
        </div>
    </>
}

function DecisionInspector({decision, model}:{decision:any, model: VisuallyJsModel}) {
    return <>
        <InspectorHeader model={model}>
            {decision != null && <>
                <h3>Decision</h3>
            </>}
        </InspectorHeader>
        <div className="vjs-inspector-properties">
            <div className="vjs-inspector-field">
                <label>Name</label>
                <input type="text" vjs-att="name" placeholder="Name"/>
            </div>
            <div className="vjs-inspector-field">
                <label>Summary</label>
                <textarea vjs-att="summary" placeholder="Summary" rows={3}/>
            </div>

            <div className="vjs-inspector-divider"
                 style={{margin: '15px 0', borderTop: '1px solid #eee'}}></div>

            <DecisionConditionsSection decision={decision} model={model} />
        </div>
    </>
}

function DecisionConditionsSection({decision, model}:{decision:any, model: VisuallyJsModel}) {
    const {confirm} = useContext(PopupContext);

    function doDeleteCondition(conditionId:string) {
        const port = decision.getPort(conditionId);
        const ds = getDownstreamVertices(port, false);
        if (ds.length > 0) {
            confirm({
                title: "Delete Condition?",
                message: "This condition has downstream vertices which will also be deleted. Are you sure?",
                onConfirm: () => deleteCondition(decision, conditionId, model)
            });
        } else {
            deleteCondition(decision, conditionId, model);
        }
    }

    return <>
        <div className="vjs-inspector-field-row" style={{justifyContent: 'space-between', alignItems: 'center', display:"flex"}}>
            <h4>Conditions</h4>
            <button className="vjs-ai-button" onClick={() => addCondition(decision, model)} title="Add Condition">
                Add Condition
            </button>
        </div>
        {(decision.data.conditions || []).map((condition:DecisionCondition) => <div key={condition.id} className="vjs-inspector-field vjs-inspector-field-row">
            <input type="text" placeholder="Label" vjs-att="label" vjs-port={condition.id}/>
            <DeleteSomething handler={() => doDeleteCondition(condition.id)}/>
        </div>)}
    </>
}

function AgentInspector({agent, model}:{agent:any, model: VisuallyJsModel}) {
    return <>
        <InspectorHeader model={model}>
            <h3>Agent</h3>
        </InspectorHeader>
        <div className="vjs-inspector-properties">
            <div className="vjs-inspector-field">
                <label>Name</label>
                <input type="text" vjs-att="name" placeholder="Name"/>
            </div>
            <div className="vjs-inspector-field">
                <label>Prompt</label>
                <textarea vjs-att="prompt" placeholder="Prompt" rows={5}/>
            </div>

            <div className="vjs-inspector-divider"
                 style={{margin: '15px 0', borderTop: '1px solid #eee'}}></div>

            <DecisionConditionsSection decision={agent} model={model} />
        </div>
    </>
}

function InspectorBody({children, model}:{children:ReactNode|Array<ReactNode>, model:VisuallyJsModel}) {
    return <div className="modal-overlay" onClick={() => model.clearSelection()}>
        <div className="modal-content inspector-modal" onClick={e => e.stopPropagation()}>
            <div className="vjs-ai-inspector">
                {children}
                <div className="vjs-inspector-footer">
                    <button className="vjs-ai-button" onClick={() => model.clearSelection()}>Done</button>
                </div>
            </div>
        </div>
    </div>
}

export default function AIAgentInspector() {
    const [providers, setProviders] = useState<ActionList[]>([]);

    useEffect(() => {
        fetch('/actions.json')
            .then(response => response.json())
            .then(data => setProviders(data))
            .catch(error => console.error('Error loading actions:', error));
    }, []);

    function getAction(obj: Vertex): Action | null {
        if (!obj || !isNode(obj) || !obj.data) return null;
        const { type, provider: providerId } = obj.data;

        if (!type || !providerId) return null;

        const provider = providers.find(p => p.provider.toLowerCase() === providerId.toLowerCase());
        if (!provider) return null;

        return provider.actions.find(a => a.id === type) || null;
    }

    return (
        <InspectorComponent>
            {(current: Base, model: VisuallyJsModel) => {
                if (isPort(current)) {
                    return (
                        <InspectorBody model={model}>
                            <DecisionPortInspector model={model}/>
                        </InspectorBody>
                    );
                } else {
                    if (current.type === "decision") {
                        return (<InspectorBody model={model}>
                            <DecisionInspector decision={current as unknown as Decision} model={model}/>
                        </InspectorBody>)
                    } else if (current.type === "agent") {
                        return (<InspectorBody model={model}>
                            <AgentInspector agent={current} model={model}/>
                        </InspectorBody>)
                    } else {
                        return (
                            <InspectorBody model={model}>
                                <ActionInspector action={getAction(current as Vertex)} model={model}/>
                            </InspectorBody>
                        );
                    }

                }
            }}
        </InspectorComponent>
    );
}
