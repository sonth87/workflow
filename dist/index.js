import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { Position, Handle, NodeToolbar, MarkerType, useReactFlow, getBezierPath, BaseEdge, EdgeLabelRenderer, useStore } from '@xyflow/react';
import React, { useMemo, useState, useCallback } from 'react';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var NodeBase = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    props.selected; var data = props.data;
    return (jsxs("div", { className: "node-base min-w-5 min-h-5 w-full h-full", children: [jsx("div", { className: "node-base__toolbar" }), children, jsx("div", { className: "node-base__label absolute top-full w-full mt-2 flex flex-col items-center", children: jsx("div", { className: "text-xs text-center line-clamp-3", children: String(data === null || data === void 0 ? void 0 : data.label) }) })] }));
};

function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f);}else for(f in e)e[f]&&(n&&(n+=" "),n+=f);return n}function clsx(){for(var e,t,f=0,n="",o=arguments.length;f<o;f++)(e=arguments[f])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}

var InPointX='w-1\x20h-1\x20rounded-md\x20!bg-teal-500';var InPointY='w-1\x20h-1\x20rounded-md\x20!bg-teal-500';var OutPointX='w-1\x20h-1\x20rounded-md\x20!bg-teal-500';var OutPointY='w-1\x20h-1\x20rounded-md\x20!bg-teal-500';

var DEFAULT_HANDLE_STYLE = {
    width: 10,
    height: 10,
};
// point output input
var POI = function (_a) {
    var type = _a.type, position = _a.position, className = _a.className, props = __rest(_a, ["type", "position", "className"]);
    var pos = useMemo(function () {
        switch (position) {
            case Position.Left:
            case Position.Right:
                return type === "source" ? OutPointX : InPointX;
            case Position.Top:
            case Position.Bottom:
                return type === "source" ? OutPointY : InPointY;
            default:
                return type === "source" ? OutPointX : InPointX;
        }
    }, [type, position]);
    return (jsx(Fragment, { children: jsx(Handle, { id: props === null || props === void 0 ? void 0 : props.id, type: type, position: position || (type === "source" ? Position.Left : Position.Right), className: clsx(pos, className), isConnectable: props === null || props === void 0 ? void 0 : props.isConnectable, isConnectableStart: props === null || props === void 0 ? void 0 : props.isConnectableStart, isConnectableEnd: props === null || props === void 0 ? void 0 : props.isConnectableEnd, isValidConnection: props === null || props === void 0 ? void 0 : props.isValidConnection, 
            // style={props?.style}
            style: __assign(__assign({}, DEFAULT_HANDLE_STYLE), props === null || props === void 0 ? void 0 : props.style) }) }));
};

var StartIcon = function (_a) {
    var className = _a.className;
    return (jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", className: className, children: [jsx("path", { d: "M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z", fill: "#EBFAF2" }), jsx("path", { d: "M21.25 12C21.25 6.89137 17.1086 2.75 12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12ZM22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12Z", fill: "#39CC7E" })] }));
};

var StartEvent = function (props) {
    var selected = props.selected, data = props.data, sourcePosition = props.sourcePosition;
    return (jsxs(NodeBase, __assign({}, props, { children: [jsxs(NodeToolbar, { isVisible: Boolean(data === null || data === void 0 ? void 0 : data.toolbarVisible) || selected, position: Position.Top, className: "bg-white flex px-2 py-1 border border-gray-300 rounded-md shadow-md gap-2", children: [jsx("button", { children: "delete" }), jsx("button", { children: "copy" }), jsx("button", { children: "expand" })] }), jsx("div", { className: "rounded-full border-2 flex justify-center items-center p-3 w-full h-full", children: jsx(StartIcon, {}) }), jsx(POI, __assign({}, props, { type: "source", position: sourcePosition || Position.Right }))] })));
};

var EndIcon = function (_a) {
    var className = _a.className;
    return (jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", className: className, children: [jsx("path", { d: "M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z", fill: "#FFEFEF" }), jsx("path", { d: "M19.5 12C19.5 7.85786 16.1421 4.5 12 4.5C7.85786 4.5 4.5 7.85786 4.5 12C4.5 16.1421 7.85786 19.5 12 19.5C16.1421 19.5 19.5 16.1421 19.5 12ZM22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C17.799 1.5 22.5 6.20101 22.5 12Z", fill: "#FF6262" })] }));
};

var EndEvent = function (props) {
    var selected = props.selected, data = props.data, targetPosition = props.targetPosition;
    return (jsxs(NodeBase, __assign({}, props, { children: [jsxs(NodeToolbar, { isVisible: Boolean(data === null || data === void 0 ? void 0 : data.toolbarVisible) || selected, position: Position.Top, className: "bg-white flex px-2 py-1 border border-gray-300 rounded-md shadow-md gap-2", children: [jsx("button", { children: "delete" }), jsx("button", { children: "copy" }), jsx("button", { children: "expand" })] }), jsx("div", { className: "rounded-full border-2 flex justify-center items-center p-3 w-full h-full", children: jsx(EndIcon, {}) }), jsx(POI, __assign({}, props, { type: "target", position: targetPosition || Position.Left }))] })));
};

// styles
// import "./task.css";
var Task = function (props) {
    var sourcePosition = props.sourcePosition, targetPosition = props.targetPosition;
    return (jsxs(NodeBase, __assign({}, props, { children: [jsx("div", { className: "min-w-12 min-h-12 w-full h-full rounded-lg border-2 px-2 py-1 bg-white" }), jsx(POI, __assign({}, props, { type: "target", position: targetPosition })), jsx(POI, __assign({}, props, { type: "source", position: sourcePosition, style: { stroke: "red" } }))] })));
};

var EGateway = function (_a) {
    var className = _a.className;
    return (jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", className: className, children: [jsx("path", { d: "M2 12L12 2L22 12L12 22L2 12Z", fill: "#FF9D57" }), jsx("path", { d: "M11.5264 1.41796C11.821 1.17765 12.2557 1.19512 12.5303 1.46972L22.5303 11.4697C22.8232 11.7626 22.8232 12.2374 22.5303 12.5303L12.5303 22.5303C12.2374 22.8232 11.7626 22.8232 11.4697 22.5303L1.46973 12.5303C1.17684 12.2374 1.17684 11.7626 1.46973 11.4697L11.4697 1.46972L11.5264 1.41796ZM3.06055 12L12 20.9394L20.9395 12L12 3.06054L3.06055 12Z", fill: "#FF9D57" }), jsx("path", { d: "M15.5303 8.46972C15.2557 8.19512 14.821 8.17765 14.5264 8.41796L14.4697 8.46972L8.46973 14.4697L8.41797 14.5264C8.17767 14.8209 8.19513 15.2557 8.46973 15.5303C8.74434 15.8049 9.17906 15.8223 9.47364 15.582L9.53028 15.5303L15.5303 9.53027L15.582 9.47363C15.8223 9.17905 15.8049 8.74433 15.5303 8.46972Z", fill: "white" }), jsx("path", { d: "M8.46972 8.46972C8.74433 8.19512 9.17905 8.17765 9.47363 8.41796L9.53027 8.46972L15.5303 14.4697L15.582 14.5264C15.8223 14.8209 15.8049 15.2557 15.5303 15.5303C15.2557 15.8049 14.8209 15.8223 14.5264 15.582L14.4697 15.5303L8.46972 9.53027L8.41796 9.47363C8.17765 9.17905 8.19512 8.74433 8.46972 8.46972Z", fill: "white" })] }));
};

var DiamonShape = function (_a) {
    var className = _a.className;
    return (jsx("svg", { width: "56", height: "56", viewBox: "0 0 56 56", fill: "none", xmlns: "http://www.w3.org/2000/svg", className: clsx(className), children: jsx("path", { d: "M2.82842 25.1716L25.1716 2.82843C26.7337 1.26633 29.2663 1.26633 30.8284 2.82842L53.1716 25.1716C54.7337 26.7337 54.7337 29.2663 53.1716 30.8284L30.8284 53.1716C29.2663 54.7337 26.7337 54.7337 25.1716 53.1716L2.82843 30.8284C1.26633 29.2663 1.26633 26.7337 2.82842 25.1716Z", fill: "fill-current", stroke: "stroke-current", "stroke-width": "2" }) }));
};

var ExclusiveGateway = function (props) {
    var sourcePosition = props.sourcePosition, targetPosition = props.targetPosition;
    return (jsxs(NodeBase, __assign({}, props, { children: [jsxs("div", { className: "relative w-full h-full rounded-lg flex justify-center items-center", children: [jsx(DiamonShape, { className: "bg-transparent text-xs stroke-gray-300 fill-white" }), jsx(EGateway, { className: "z-[1] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" })] }), jsx(POI, __assign({}, props, { type: "target", position: targetPosition })), jsx(POI, __assign({}, props, { type: "source", position: sourcePosition || Position.Right }))] })));
};

var BezierEdgeConnectionLine = function (_a) {
    var id = _a.id, sourceX = _a.sourceX, sourceY = _a.sourceY, targetX = _a.targetX, targetY = _a.targetY, sourcePosition = _a.sourcePosition, targetPosition = _a.targetPosition, _b = _a.style, style = _b === void 0 ? {} : _b, _c = _a.markerEnd, markerEnd = _c === void 0 ? MarkerType.ArrowClosed : _c, data = _a.data;
    var setEdges = useReactFlow().setEdges;
    var _d = getBezierPath({
        sourceX: sourceX,
        sourceY: sourceY,
        sourcePosition: sourcePosition,
        targetX: targetX,
        targetY: targetY,
        targetPosition: targetPosition,
    }), edgePath = _d[0], labelX = _d[1], labelY = _d[2];
    var _e = React.useState(data === null || data === void 0 ? void 0 : data.label), label = _e[0], setLabel = _e[1];
    var onEdgeClick = function () {
        setEdges(function (edges) { return edges.filter(function (edge) { return edge.id !== id; }); });
    };
    var onDoubleClick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var newLabel = prompt("Enter new label", label);
        if (newLabel) {
            setLabel(newLabel);
            setEdges(function (edges) {
                return edges.map(function (edge) {
                    return edge.id === id ? __assign(__assign({}, edge), { data: { label: newLabel } }) : edge;
                });
            });
        }
    };
    return (jsxs(Fragment, { children: [jsx(BaseEdge, { path: edgePath, markerEnd: markerEnd, style: style, onDoubleClick: onDoubleClick }), jsx(EdgeLabelRenderer, { children: jsxs("div", { className: "button-edge__label", style: {
                        transform: "translate(-50%, -50%) translate(".concat(labelX, "px,").concat(labelY, "px)"),
                    }, children: [jsx("div", { className: "text-xs text-gray-500 cursor-pointer", onDoubleClick: onDoubleClick, children: data === null || data === void 0 ? void 0 : data.label }), jsx("button", { className: "button-edge__button", onClick: onEdgeClick, children: "\u00D7" })] }) })] }));
};

var CustomEdge = function (props) {
    var _a = useState(false), isHovered = _a[0], setIsHovered = _a[1];
    var id = props.id, sourceX = props.sourceX, sourceY = props.sourceY, targetX = props.targetX, targetY = props.targetY, sourcePosition = props.sourcePosition, targetPosition = props.targetPosition, _b = props.style, style = _b === void 0 ? {} : _b, markerEnd = props.markerEnd, data = props.data;
    var _c = getBezierPath({
        sourceX: sourceX,
        sourceY: sourceY,
        sourcePosition: sourcePosition,
        targetX: targetX,
        targetY: targetY,
        targetPosition: targetPosition,
    }), edgePath = _c[0], labelX = _c[1], labelY = _c[2];
    return (jsxs(Fragment, { children: [jsx("path", { id: id, d: edgePath, fill: "none", stroke: "transparent", strokeWidth: 20, style: { pointerEvents: "all" }, className: "edge-path-hitbox", onMouseEnter: function () {
                    console.log("Edge hovered", id);
                    setIsHovered(true);
                }, onMouseLeave: function () {
                    console.log("Edge unhovered", id);
                    setIsHovered(false);
                } }), jsx(BaseEdge, { path: edgePath, markerEnd: markerEnd, style: style }), jsx(EdgeLabelRenderer, { children: jsxs("div", { style: {
                        position: 'absolute',
                        transform: "translate(-50%, -50%) translate(".concat(labelX, "px,").concat(labelY, "px)"),
                        pointerEvents: 'all',
                    }, children: [jsx("div", { children: data === null || data === void 0 ? void 0 : data.label }), jsx("button", { style: {
                                opacity: isHovered ? 1 : 0,
                                backgroundColor: '#fff',
                                border: '1px solid #ccc',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                transition: 'opacity 0.3s',
                            }, children: "\u00D7" })] }) })] }));
};

var NodeMenu = function (_a) {
    var nodeId = _a.nodeId;
    var _b = useReactFlow(), getNode = _b.getNode, setNodes = _b.setNodes, addNodes = _b.addNodes;
    var duplicateNode = useCallback(function () {
        var _a, _b;
        var node = getNode(nodeId);
        var position = {
            x: (((_a = node === null || node === void 0 ? void 0 : node.position) === null || _a === void 0 ? void 0 : _a.x) || 0) + 50,
            y: (((_b = node === null || node === void 0 ? void 0 : node.position) === null || _b === void 0 ? void 0 : _b.y) || 0) + 50,
        };
        if (!node)
            return;
        addNodes(__assign(__assign({}, node), { selected: false, dragging: false, id: "".concat(node.id, "-copy"), position: position }));
    }, [nodeId, getNode, addNodes]);
    var deleteNode = useCallback(function () {
        setNodes(function (nodes) { return nodes.filter(function (node) { return node.id !== nodeId; }); });
    }, [nodeId, setNodes]);
    return (jsxs("div", { children: [jsx("p", { style: { margin: "0.5em" }, children: jsxs("small", { children: ["node: ", nodeId] }) }), jsx("button", { onClick: duplicateNode, className: "hover:bg-slate-200 duration-300", children: "duplicate" }), jsx("button", { onClick: deleteNode, className: "hover:bg-slate-200 duration-300", children: "delete" })] }));
};

var _a$1;var NODES;(function(_0x405ac5){_0x405ac5['task']='task',_0x405ac5['start']='start',_0x405ac5['end']='end',_0x405ac5['e-gateway']='exclusive-gateway';}(NODES||(NODES={})));var nodeTypes=(_a$1={},_a$1[NODES['task']]=Task,_a$1[NODES['start']]=StartEvent,_a$1[NODES['end']]=EndEvent,_a$1[NODES['e-gateway']]=ExclusiveGateway,_a$1);

var _a;var connectionStyle={'straight':'straight','step':'step','smoothstep':'smoothstep','bezier':'bezier'};var EDGES;(function(_0x24faf0){_0x24faf0['bezier']='bezier',_0x24faf0['connection']='connection',_0x24faf0['straight']='straight';}(EDGES||(EDGES={})));var connnectionTypes=(_a={},_a[EDGES['bezier']]=BezierEdgeConnectionLine,_a[EDGES['connection']]=CustomEdge,_a);

var EdgeMenu = function (_a) {
    var edgeId = _a.edgeId;
    var _b = useReactFlow(), getEdge = _b.getEdge, setEdges = _b.setEdges;
    var anamationEdge = useCallback(function () {
        var edge = getEdge(edgeId);
        if (!edge)
            return;
        setEdges(function (edges) {
            return edges.map(function (edge) {
                return edge.id === edgeId ? __assign(__assign({}, edge), { animated: !edge.animated }) : edge;
            });
        });
    }, [edgeId, getEdge]);
    var changeType = useCallback(function (eType) {
        var edge = getEdge(edgeId);
        if (!edge)
            return;
        setEdges(function (edges) {
            return edges.map(function (edge) {
                return edge.id === edgeId ? __assign(__assign({}, edge), { type: eType }) : edge;
            });
        });
    }, [edgeId, getEdge]);
    var deleteEdge = useCallback(function () {
        setEdges(function (edges) { return edges.filter(function (edge) { return edge.id !== edgeId; }); });
    }, [edgeId, setEdges]);
    var onEditLabel = function () {
        var _a;
        var edge = getEdge(edgeId);
        var label = ((_a = edge === null || edge === void 0 ? void 0 : edge.data) === null || _a === void 0 ? void 0 : _a.label) || "";
        var newLabel = prompt("Enter new label", label);
        if (newLabel) {
            setEdges(function (edges) {
                return edges.map(function (edge) {
                    return edge.id === edgeId ? __assign(__assign({}, edge), { data: { label: newLabel } }) : edge;
                });
            });
        }
    };
    return (jsxs("div", { children: [jsx("p", { style: { margin: "0.5em" }, children: jsxs("small", { children: ["edge: ", edgeId] }) }), jsx("button", { onClick: anamationEdge, className: "hover:bg-slate-200 duration-300", children: "toggle animation" }), jsx("button", { onClick: onEditLabel, className: "hover:bg-slate-200 duration-300", children: "edit label" }), jsx("button", { onClick: deleteEdge, className: "hover:bg-slate-200 duration-300", children: "delete" }), jsxs("div", { className: "group relative", children: [jsx("div", { className: "p-2 hover:bg-slate-200 duration-300 cursor-pointer", children: "type" }), jsx("div", { className: "hidden group-hover:flex flex-col absolute bg-white top-0 left-full", children: Object.values(connectionStyle).map(function (eType) { return (jsx("button", { onClick: function () { return changeType(eType); }, className: "hover:bg-slate-200 duration-300", children: eType }, eType)); }) })] })] }));
};

var ContextMenu = function (_a) {
    var id = _a.id, top = _a.top, left = _a.left, right = _a.right, bottom = _a.bottom, props = __rest(_a, ["id", "top", "left", "right", "bottom"]);
    var _b = useReactFlow(), getNode = _b.getNode, getEdge = _b.getEdge;
    var node = getNode(id);
    var edge = getEdge(id);
    return (jsxs("div", __assign({ style: {
            top: !!top ? top : undefined,
            left: !!left ? left : undefined,
            right: !!right ? right : undefined,
            bottom: !!bottom ? bottom : undefined,
        }, className: "context-menu rounded-lg bg-white" }, props, { children: [(node === null || node === void 0 ? void 0 : node.type) && jsx(NodeMenu, { nodeId: id }), (edge === null || edge === void 0 ? void 0 : edge.type) && jsx(EdgeMenu, { edgeId: id })] })));
};

var HelperLines = function (_a) {
    var _b = _a.snapTolerance, snapTolerance = _b === void 0 ? 5 : _b;
    var _c = React.useState([]), horizontalLines = _c[0], setHorizontalLines = _c[1];
    var _d = React.useState([]), verticalLines = _d[0], setVerticalLines = _d[1];
    // Get nodes and transform from React Flow store
    var nodes = useStore(function (state) { return state.nodes; });
    var transform = useStore(function (state) { return state.transform; });
    // Check if any node is currently being dragged
    var isNodeDragging = React.useMemo(function () {
        return nodes.some(function (node) { return node.dragging; });
    }, [nodes]);
    React.useEffect(function () {
        if (!isNodeDragging) {
            setHorizontalLines([]);
            setVerticalLines([]);
            return;
        }
        var draggedNode = nodes.find(function (node) { return node.dragging; });
        if (!draggedNode) {
            return;
        }
        var otherNodes = nodes.filter(function (node) { return !node.dragging; });
        var horizontalLinesSet = new Set();
        var verticalLinesSet = new Set();
        // Middle points of the dragged node
        var draggedNodeCenterY = draggedNode.position.y + (draggedNode.height || 0) / 2;
        var draggedNodeCenterX = draggedNode.position.x + (draggedNode.width || 0) / 2;
        // Top, middle and bottom edges of dragged node
        var draggedNodeTop = draggedNode.position.y;
        var draggedNodeBottom = draggedNode.position.y + (draggedNode.height || 0);
        var draggedNodeLeft = draggedNode.position.x;
        var draggedNodeRight = draggedNode.position.x + (draggedNode.width || 0);
        otherNodes.forEach(function (node) {
            // Check for horizontal alignments
            var nodeCenterY = node.position.y + (node.height || 0) / 2;
            var nodeTop = node.position.y;
            var nodeBottom = node.position.y + (node.height || 0);
            // Check for vertical alignments
            var nodeCenterX = node.position.x + (node.width || 0) / 2;
            var nodeLeft = node.position.x;
            var nodeRight = node.position.x + (node.width || 0);
            // Check center to center alignment
            if (Math.abs(draggedNodeCenterY - nodeCenterY) < snapTolerance) {
                horizontalLinesSet.add(nodeCenterY);
            }
            // Check top edges alignment
            if (Math.abs(draggedNodeTop - nodeTop) < snapTolerance) {
                horizontalLinesSet.add(nodeTop);
            }
            // Check bottom edges alignment
            if (Math.abs(draggedNodeBottom - nodeBottom) < snapTolerance) {
                horizontalLinesSet.add(nodeBottom);
            }
            // Check dragged top with other bottom
            if (Math.abs(draggedNodeTop - nodeBottom) < snapTolerance) {
                horizontalLinesSet.add(nodeBottom);
            }
            // Check dragged bottom with other top
            if (Math.abs(draggedNodeBottom - nodeTop) < snapTolerance) {
                horizontalLinesSet.add(nodeTop);
            }
            // Similar checks for vertical lines
            if (Math.abs(draggedNodeCenterX - nodeCenterX) < snapTolerance) {
                verticalLinesSet.add(nodeCenterX);
            }
            if (Math.abs(draggedNodeLeft - nodeLeft) < snapTolerance) {
                verticalLinesSet.add(nodeLeft);
            }
            if (Math.abs(draggedNodeRight - nodeRight) < snapTolerance) {
                verticalLinesSet.add(nodeRight);
            }
            if (Math.abs(draggedNodeLeft - nodeRight) < snapTolerance) {
                verticalLinesSet.add(nodeRight);
            }
            if (Math.abs(draggedNodeRight - nodeLeft) < snapTolerance) {
                verticalLinesSet.add(nodeLeft);
            }
        });
        setHorizontalLines(Array.from(horizontalLinesSet));
        setVerticalLines(Array.from(verticalLinesSet));
    }, [nodes, isNodeDragging, snapTolerance]);
    if (!isNodeDragging) {
        return null;
    }
    // Calculate flow dimensions for helper lines
    var x = transform[0], y = transform[1], zoom = transform[2];
    return (jsxs("div", { className: "helper-lines", children: [horizontalLines.map(function (line, i) { return (jsx("div", { className: "helper-line horizontal", style: {
                    top: line * zoom + y,
                    left: 0,
                    width: "100%",
                    height: "1px",
                    background: "#ff0071",
                    position: "absolute",
                    pointerEvents: "none",
                    zIndex: 1000,
                } }, "h-".concat(i))); }), verticalLines.map(function (line, i) { return (jsx("div", { className: "helper-line vertical", style: {
                    left: line * zoom + x,
                    top: 0,
                    width: "1px",
                    height: "100%",
                    background: "#ff0071",
                    position: "absolute",
                    pointerEvents: "none",
                    zIndex: 1000,
                } }, "v-".concat(i))); })] }));
};

export { CustomEdge as ConnectionLine, BezierEdgeConnectionLine as ConnectionLineStyle, ContextMenu, EDGES, EndEvent, HelperLines, NODES, StartEvent, Task, connnectionTypes, nodeTypes };
turn (jsxRuntime.jsx("div", { className: "helper-line horizontal", style: {
                    top: line * zoom + y,
                    left: 0,
                    width: "100%",
                    height: "1px",
                    background: "#ff0071",
                    position: "absolute",
                    pointerEvents: "none",
                    zIndex: 1000,
                } }, "h-".concat(i))); }), verticalLines.map(function (line, i) { return (jsxRuntime.jsx("div", { className: "helper-line vertical", style: {
                    left: line * zoom + x,
                    top: 0,
                    width: "1px",
                    height: "100%",
                    background: "#ff0071",
                    position: "absolute",
                    pointerEvents: "none",
                    zIndex: 1000,
                } }, "v-".concat(i))); })] }));
};

exports.ConnectionLine = CustomEdge;
exports.ConnectionLineStyle = BezierEdgeConnectionLine;
exports.ContextMenu = ContextMenu;
exports.EndEvent = EndEvent;
exports.HelperLines = HelperLines;
exports.StartEvent = StartEvent;
exports.Task = Task;
exports.connnectionTypes = connnectionTypes;
exports.nodeTypes = nodeTypes;
