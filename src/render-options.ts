import {PlainArrowOverlay, HierarchyLayout, AnchorSpec, AnchorLocations} from "@visuallyjs/browser-ui";

const renderOptions = {
    edges:{
        anchors:[AnchorLocations.ContinuousBottom, AnchorLocations.Top] as [AnchorSpec, AnchorSpec],
        detachable:false,
        targetMarker:{
            type:PlainArrowOverlay.type,
            options:{ width:12, length:12 }
        }
    },
    zoomToFit:true,
    elementsDraggable:false,
    layout:{
        type:HierarchyLayout.type,
        options:{ padding:{x:80, y:100 } }
    },
    dragOptions:{
        cssFilter:".vjs-ai-node-add-button, .vjs-ai-node-add-button *"
    },
    logicalPorts:true
};

export default renderOptions;
