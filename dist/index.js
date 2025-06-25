import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { Position, Handle, NodeToolbar } from '@xyflow/react';
import { useMemo } from 'react';

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

export { StartEvent };
