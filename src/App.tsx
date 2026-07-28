import { SurfaceComponent, SurfaceProvider, SurfacePopup, MiniviewComponent, BackgroundComponent} from "@visuallyjs/browser-ui-react"

import {VisuallyJsModel, Vertex, BrowserUIModel, Surface, Node} from "@visuallyjs/browser-ui"
import getViewOptions from "./view-options";
import renderOptions from "./render-options";
import modelOptions from "./model-options";
import {useRef, useState, createContext, useEffect} from "react";
import ActionBrowser from "./components/ActionBrowser";
import ButtonBar from "./components/ButtonBar";
import {addAgentSkill, addChildAction, replacePlaceholderWithAction, setTrigger} from "./model-operations";
import WorkflowInspector from "./Inspector";
import NextStepPicker from "./components/NextStepPopup.tsx";
import ConfirmModal from "./components/ConfirmModal";

export const PopupContext = createContext<{
    activePopupNodeId: string | null;
    setActivePopupNodeId: (id: string | null) => void;
    confirm: (options: { title: string; message: string; onConfirm: () => void }) => void;
    openActionBrowser: (context: any, onSelect: (item: any) => void) => void;
}>({
    activePopupNodeId: null,
    setActivePopupNodeId: () => {},
    confirm: () => {},
    openActionBrowser: () => {}
});

export default function App({url}: {url: string}) {

    const [actionBrowserContext, setActionBrowserContext] = useState<any>(null)
    const [showBrowser, setShowBrowser] = useState(false);
    const [activePopupNodeId, setActivePopupNodeId] = useState<string | null>(null);
    const activePopupNodeIdRef = useRef<string | null>(null);

    const [confirmOptions, setConfirmOptions] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {}
    });

    const confirm = (options: { title: string; message: string; onConfirm: () => void }) => {
        setConfirmOptions({
            isOpen: true,
            title: options.title,
            message: options.message,
            onConfirm: () => {
                options.onConfirm();
                setConfirmOptions(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const [externalOnSelect, setExternalOnSelect] = useState<((item: any) => void) | null>(null);

    const openActionBrowser = (context: any, onSelect: (item: any) => void) => {
        setActionBrowserContext(context);
        setExternalOnSelect(() => onSelect);
        setShowBrowser(true);
    };

    useEffect(() => {
        activePopupNodeIdRef.current = activePopupNodeId;
    }, [activePopupNodeId]);
    const s = useRef<any>(null)

    function addAction(obj: Vertex, model: VisuallyJsModel) {
        setActionBrowserContext({
            action:"add-action",
            obj,
            model
        })
        setShowBrowser(true)
    }

    function selectTrigger(obj:Node, model:VisuallyJsModel):void {
        setActionBrowserContext({
            action:"set-trigger",
            obj,
            model
        })
        setShowBrowser(true)
    }

    function addSkill(obj: Node, model: VisuallyJsModel):void {
        setActionBrowserContext({
            action: "add-skill",
            obj,
            model,
            title: "Select Skill",
            excludedActions: obj.data.skills || []
        })
        setShowBrowser(true)
    }

    return <PopupContext.Provider value={{ activePopupNodeId, setActivePopupNodeId, confirm, openActionBrowser }}>
        <div className="vjs-ai-agent-root">
            <SurfaceProvider>
                <SurfaceComponent url={url} viewOptions={getViewOptions(selectTrigger, addSkill)} renderOptions={renderOptions} modelOptions={modelOptions} ref={s}>
                    <ButtonBar/>
                    <SurfacePopup selector=".vjs-next-step-picker">
                        {(vertex:Vertex, model:BrowserUIModel, ui:Surface, hide) => <NextStepPicker vertex={vertex} model={model} hide={hide}  ui={ui} addAction={addAction}/>}
                    </SurfacePopup>
                    <MiniviewComponent/>
                    <BackgroundComponent type="grid"/>
                </SurfaceComponent>

                {showBrowser && (
                    <div className="modal-overlay" onClick={() => setShowBrowser(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <ActionBrowser
                                onClose={() => setShowBrowser(false)} context={actionBrowserContext}
                                onSelect={(item, context) => {
                                    setShowBrowser(false);
                                    if (externalOnSelect) {
                                        externalOnSelect(item);
                                        setExternalOnSelect(null);
                                        return;
                                    }
                                    switch (context.action) {
                                        case "add-action": {
                                            if (context.obj.type === "placeholder") {
                                                replacePlaceholderWithAction(item, context)
                                            } else {
                                                addChildAction(item, context)
                                            }
                                            break;
                                        }
                                        case "set-trigger": {
                                            setTrigger(context.obj, context.model, item)
                                            break;
                                        }
                                        case "add-skill": {
                                            addAgentSkill(context.obj, context.model, item)
                                            break;
                                        }
                                    }

                                }}
                            />
                        </div>
                    </div>
                )}

                <WorkflowInspector />
                <ConfirmModal 
                    isOpen={confirmOptions.isOpen} 
                    title={confirmOptions.title} 
                    message={confirmOptions.message} 
                    onConfirm={confirmOptions.onConfirm} 
                    onCancel={() => setConfirmOptions(prev => ({ ...prev, isOpen: false }))} 
                />
            </SurfaceProvider>
        </div>
    </PopupContext.Provider>
}
