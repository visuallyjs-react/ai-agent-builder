import { useContext } from 'react';
import { Vertex, BrowserUIModel } from "@visuallyjs/browser-ui";
import DeleteNode from "./DeleteNode";
import { setTrigger } from "../model-operations";
import { PopupContext } from "../App";

interface NodeOptionsProps {
    vertex: Vertex;
    model: BrowserUIModel;
}

export default function NodeOptions({ vertex, model }: NodeOptionsProps) {
    const { openActionBrowser } = useContext(PopupContext);
    const isTrigger = vertex.type === 'trigger';

    const handleSelectAction = (item: any) => {
        if (isTrigger) {
            setTrigger(vertex as any, model, item);
        } else {
           model.updateNode(vertex, {
                provider: item.provider,
                name: item.name,
                summary: item.desc,
                type:item.id
            });
        }
    };

    const handleOpenBrowser = () => {
        openActionBrowser({
            action: isTrigger ? 'set-trigger' : 'change-action',
            excludedActions: [{ id: isTrigger ? vertex.data.trigger : vertex.type }]
        }, handleSelectAction);
    };

    return (
        <div className="vjs-ai-node-options" tabIndex={0} data-vjs-no-events={true}>
            <button className="vjs-ai-node-options-button">
                <img src="/icons/more-horizontal.svg" width="16" height="16" alt="Options" />
            </button>
            <div className="vjs-ai-node-options-menu">
                <DeleteNode vertex={vertex} model={model} label="Delete Node" />
                <button className="vjs-ai-node-options-menu-item" onClick={handleOpenBrowser}>
                    Change {isTrigger ? 'trigger' : 'action'}
                </button>
            </div>
        </div>
    );
}
