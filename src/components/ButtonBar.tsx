import { useSurface } from "@visuallyjs/browser-ui-react";
import React, { useRef } from "react";

export default function ButtonBar() {
    const surface  = useSurface();
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!surface) {
        return null;
    }

    const zoomToFit = () => {
        surface.zoomToFit();
    };

    const undo = () => {
        surface.model.undo();
    };

    const redo = () => {
        surface.model.redo();
    };

    const save = () => {
        const data = surface.model.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "workflow.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    const load = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                try {
                    const data = JSON.parse(content);
                    surface.model.clear();
                    surface.model.load({data});
                } catch (err) {
                    console.error("Failed to parse file", err);
                }
            };
            reader.readAsText(file);
        }
        // reset input
        event.target.value = "";
    };

    const newWorkflow = () => {
        surface.model.transaction(() => {
            surface.model.clear();
            surface.model.addNode({
                type: "trigger",
                name: "New Trigger",
                summary: "Configure this trigger"
            });
        });
        surface.zoomToFit();
    };

    return (
        <div className="vjs-button-bar">
            <button onClick={zoomToFit} title="Zoom To Fit">
                <img src="/icons/zoom-to-fit.svg" width="16" height="16" alt="Zoom To Fit" />
                <span>Zoom To Fit</span>
            </button>
            <div className="vjs-button-bar-separator" />
            <button onClick={undo} title="Undo">
                <img src="/icons/undo.svg" width="16" height="16" alt="Undo" />
                <span>Undo</span>
            </button>
            <button onClick={redo} title="Redo">
                <img src="/icons/redo.svg" width="16" height="16" alt="Redo" />
                <span>Redo</span>
            </button>
            <div className="vjs-button-bar-separator" />
            <button onClick={save} title="Save">
                <img src="/icons/save.svg" width="16" height="16" alt="Save" />
                <span>Save</span>
            </button>
            <button onClick={load} title="Load">
                <img src="/icons/load.svg" width="16" height="16" alt="Load" />
                <span>Load</span>
            </button>
            <button onClick={newWorkflow} title="New">
                <img src="/icons/plus.svg" width="16" height="16" alt="New" />
                <span>New</span>
            </button>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept=".json"
            />
        </div>
    );
}
