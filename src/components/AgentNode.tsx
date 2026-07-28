import DeleteNode from "./DeleteNode";
import {lookupIcon} from "../model-operations";
import {BrowserUIModel, Node, ObjectData} from "@visuallyjs/browser-ui";
import {Action, VertexOperation} from "../definitions";
import {useContext} from "react";
import {PopupContext} from "../App";

export default function AgentNode({vertex, data, model, addSkill}: { vertex:Node, data:ObjectData, model:BrowserUIModel, addSkill:VertexOperation }) {
    const {confirm} = useContext(PopupContext);
    const skills = data.skills || [];

    const removeSkill = (skillId: string, skillName: string) => {
        confirm({
            title: "Remove Skill?",
            message: `Are you sure you want to remove the skill "${skillName}"?`,
            onConfirm: () => {
                model.updateNode(vertex, {
                    skills: skills.filter((s: Action) => s.id !== skillId)
                });
            }
        });
    };

    return (<div className="vjs-ai-node">
            <div className="vjs-ai-node-header">
                <div className="vjs-ai-node-name" title={data.name}>{data.name || "Agent"}</div>
                <button data-vjs-no-events={true} className="vjs-ai-button vjs-ai-agent-add-skill-button" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => addSkill(vertex, model)}>+ Skill</button>
                <DeleteNode vertex={vertex} model={model}/>
            </div>
            <div className="vjs-ai-node-body">
                <div className="agent-skills-list">
                    {skills.map((skill: Action) => (
                        <div key={skill.id} className="agent-skill-item">
                            <img src={lookupIcon(skill)} alt={skill.provider} className="agent-skill-icon" />
                            <span className="agent-skill-name">{skill.name}</span>
                            <button data-vjs-no-events={true} className="agent-skill-delete" onClick={() => removeSkill(skill.id, skill.name)}/>
                        </div>
                    ))}
                </div>
            </div>
            {data.conditions?.map((condition:any) => <div key={condition.id} data-vjs-port={condition.id} data-vjs-source={true}/>)}
        </div>);
}
