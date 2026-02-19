import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Layouts, Page } from "@strapi/strapi/admin";
import { Routes, Route } from "react-router-dom";
import { Typography, Box, TextInput, Button, Main } from "@strapi/design-system";
import { useState, useCallback, createContext, useContext, useRef, useEffect } from "react";
import { Sparkle } from "@strapi/icons";
import styled from "styled-components";
import { P as PLUGIN_ID } from "./index-qIoVb5WD.mjs";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
function ok$1() {
}
function unreachable() {
}
function stringify$1(values, options) {
  const settings = {};
  const input = values[values.length - 1] === "" ? [...values, ""] : values;
  return input.join(
    (settings.padRight ? " " : "") + "," + (settings.padLeft === false ? "" : " ")
  ).trim();
}
const nameRe = /^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u;
const nameReJsx = /^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u;
const emptyOptions$2 = {};
function name(name2, options) {
  const settings = emptyOptions$2;
  const re2 = settings.jsx ? nameReJsx : nameRe;
  return re2.test(name2);
}
const re = /[ \t\n\f\r]/g;
function whitespace(thing) {
  return typeof thing === "object" ? thing.type === "text" ? empty$1(thing.value) : false : empty$1(thing);
}
function empty$1(value) {
  return value.replace(re, "") === "";
}
class Schema {
  /**
   * @param {SchemaType['property']} property
   *   Property.
   * @param {SchemaType['normal']} normal
   *   Normal.
   * @param {Space | undefined} [space]
   *   Space.
   * @returns
   *   Schema.
   */
  constructor(property, normal, space2) {
    this.normal = normal;
    this.property = property;
    if (space2) {
      this.space = space2;
    }
  }
}
Schema.prototype.normal = {};
Schema.prototype.property = {};
Schema.prototype.space = void 0;
function merge(definitions, space2) {
  const property = {};
  const normal = {};
  for (const definition2 of definitions) {
    Object.assign(property, definition2.property);
    Object.assign(normal, definition2.normal);
  }
  return new Schema(property, normal, space2);
}
function normalize$1(value) {
  return value.toLowerCase();
}
class Info {
  /**
   * @param {string} property
   *   Property.
   * @param {string} attribute
   *   Attribute.
   * @returns
   *   Info.
   */
  constructor(property, attribute) {
    this.attribute = attribute;
    this.property = property;
  }
}
Info.prototype.attribute = "";
Info.prototype.booleanish = false;
Info.prototype.boolean = false;
Info.prototype.commaOrSpaceSeparated = false;
Info.prototype.commaSeparated = false;
Info.prototype.defined = false;
Info.prototype.mustUseProperty = false;
Info.prototype.number = false;
Info.prototype.overloadedBoolean = false;
Info.prototype.property = "";
Info.prototype.spaceSeparated = false;
Info.prototype.space = void 0;
let powers = 0;
const boolean = increment();
const booleanish = increment();
const overloadedBoolean = increment();
const number = increment();
const spaceSeparated = increment();
const commaSeparated = increment();
const commaOrSpaceSeparated = increment();
function increment() {
  return 2 ** ++powers;
}
const types = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  boolean,
  booleanish,
  commaOrSpaceSeparated,
  commaSeparated,
  number,
  overloadedBoolean,
  spaceSeparated
}, Symbol.toStringTag, { value: "Module" }));
const checks = (
  /** @type {ReadonlyArray<keyof typeof types>} */
  Object.keys(types)
);
class DefinedInfo extends Info {
  /**
   * @constructor
   * @param {string} property
   *   Property.
   * @param {string} attribute
   *   Attribute.
   * @param {number | null | undefined} [mask]
   *   Mask.
   * @param {Space | undefined} [space]
   *   Space.
   * @returns
   *   Info.
   */
  constructor(property, attribute, mask, space2) {
    let index2 = -1;
    super(property, attribute);
    mark(this, "space", space2);
    if (typeof mask === "number") {
      while (++index2 < checks.length) {
        const check = checks[index2];
        mark(this, checks[index2], (mask & types[check]) === types[check]);
      }
    }
  }
}
DefinedInfo.prototype.defined = true;
function mark(values, key, value) {
  if (value) {
    values[key] = value;
  }
}
function create(definition2) {
  const properties = {};
  const normals = {};
  for (const [property, value] of Object.entries(definition2.properties)) {
    const info = new DefinedInfo(
      property,
      definition2.transform(definition2.attributes || {}, property),
      value,
      definition2.space
    );
    if (definition2.mustUseProperty && definition2.mustUseProperty.includes(property)) {
      info.mustUseProperty = true;
    }
    properties[property] = info;
    normals[normalize$1(property)] = property;
    normals[normalize$1(info.attribute)] = property;
  }
  return new Schema(properties, normals, definition2.space);
}
const aria = create({
  properties: {
    ariaActiveDescendant: null,
    ariaAtomic: booleanish,
    ariaAutoComplete: null,
    ariaBusy: booleanish,
    ariaChecked: booleanish,
    ariaColCount: number,
    ariaColIndex: number,
    ariaColSpan: number,
    ariaControls: spaceSeparated,
    ariaCurrent: null,
    ariaDescribedBy: spaceSeparated,
    ariaDetails: null,
    ariaDisabled: booleanish,
    ariaDropEffect: spaceSeparated,
    ariaErrorMessage: null,
    ariaExpanded: booleanish,
    ariaFlowTo: spaceSeparated,
    ariaGrabbed: booleanish,
    ariaHasPopup: null,
    ariaHidden: booleanish,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLabelledBy: spaceSeparated,
    ariaLevel: number,
    ariaLive: null,
    ariaModal: booleanish,
    ariaMultiLine: booleanish,
    ariaMultiSelectable: booleanish,
    ariaOrientation: null,
    ariaOwns: spaceSeparated,
    ariaPlaceholder: null,
    ariaPosInSet: number,
    ariaPressed: booleanish,
    ariaReadOnly: booleanish,
    ariaRelevant: null,
    ariaRequired: booleanish,
    ariaRoleDescription: spaceSeparated,
    ariaRowCount: number,
    ariaRowIndex: number,
    ariaRowSpan: number,
    ariaSelected: booleanish,
    ariaSetSize: number,
    ariaSort: null,
    ariaValueMax: number,
    ariaValueMin: number,
    ariaValueNow: number,
    ariaValueText: null,
    role: null
  },
  transform(_, property) {
    return property === "role" ? property : "aria-" + property.slice(4).toLowerCase();
  }
});
function caseSensitiveTransform(attributes, attribute) {
  return attribute in attributes ? attributes[attribute] : attribute;
}
function caseInsensitiveTransform(attributes, property) {
  return caseSensitiveTransform(attributes, property.toLowerCase());
}
const html$2 = create({
  attributes: {
    acceptcharset: "accept-charset",
    classname: "class",
    htmlfor: "for",
    httpequiv: "http-equiv"
  },
  mustUseProperty: ["checked", "multiple", "muted", "selected"],
  properties: {
    // Standard Properties.
    abbr: null,
    accept: commaSeparated,
    acceptCharset: spaceSeparated,
    accessKey: spaceSeparated,
    action: null,
    allow: null,
    allowFullScreen: boolean,
    allowPaymentRequest: boolean,
    allowUserMedia: boolean,
    alt: null,
    as: null,
    async: boolean,
    autoCapitalize: null,
    autoComplete: spaceSeparated,
    autoFocus: boolean,
    autoPlay: boolean,
    blocking: spaceSeparated,
    capture: null,
    charSet: null,
    checked: boolean,
    cite: null,
    className: spaceSeparated,
    cols: number,
    colSpan: null,
    content: null,
    contentEditable: booleanish,
    controls: boolean,
    controlsList: spaceSeparated,
    coords: number | commaSeparated,
    crossOrigin: null,
    data: null,
    dateTime: null,
    decoding: null,
    default: boolean,
    defer: boolean,
    dir: null,
    dirName: null,
    disabled: boolean,
    download: overloadedBoolean,
    draggable: booleanish,
    encType: null,
    enterKeyHint: null,
    fetchPriority: null,
    form: null,
    formAction: null,
    formEncType: null,
    formMethod: null,
    formNoValidate: boolean,
    formTarget: null,
    headers: spaceSeparated,
    height: number,
    hidden: overloadedBoolean,
    high: number,
    href: null,
    hrefLang: null,
    htmlFor: spaceSeparated,
    httpEquiv: spaceSeparated,
    id: null,
    imageSizes: null,
    imageSrcSet: null,
    inert: boolean,
    inputMode: null,
    integrity: null,
    is: null,
    isMap: boolean,
    itemId: null,
    itemProp: spaceSeparated,
    itemRef: spaceSeparated,
    itemScope: boolean,
    itemType: spaceSeparated,
    kind: null,
    label: null,
    lang: null,
    language: null,
    list: null,
    loading: null,
    loop: boolean,
    low: number,
    manifest: null,
    max: null,
    maxLength: number,
    media: null,
    method: null,
    min: null,
    minLength: number,
    multiple: boolean,
    muted: boolean,
    name: null,
    nonce: null,
    noModule: boolean,
    noValidate: boolean,
    onAbort: null,
    onAfterPrint: null,
    onAuxClick: null,
    onBeforeMatch: null,
    onBeforePrint: null,
    onBeforeToggle: null,
    onBeforeUnload: null,
    onBlur: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onContextLost: null,
    onContextMenu: null,
    onContextRestored: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFormData: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLanguageChange: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadEnd: null,
    onLoadStart: null,
    onMessage: null,
    onMessageError: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRejectionHandled: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onScrollEnd: null,
    onSecurityPolicyViolation: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onSlotChange: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnhandledRejection: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onWheel: null,
    open: boolean,
    optimum: number,
    pattern: null,
    ping: spaceSeparated,
    placeholder: null,
    playsInline: boolean,
    popover: null,
    popoverTarget: null,
    popoverTargetAction: null,
    poster: null,
    preload: null,
    readOnly: boolean,
    referrerPolicy: null,
    rel: spaceSeparated,
    required: boolean,
    reversed: boolean,
    rows: number,
    rowSpan: number,
    sandbox: spaceSeparated,
    scope: null,
    scoped: boolean,
    seamless: boolean,
    selected: boolean,
    shadowRootClonable: boolean,
    shadowRootDelegatesFocus: boolean,
    shadowRootMode: null,
    shape: null,
    size: number,
    sizes: null,
    slot: null,
    span: number,
    spellCheck: booleanish,
    src: null,
    srcDoc: null,
    srcLang: null,
    srcSet: null,
    start: number,
    step: null,
    style: null,
    tabIndex: number,
    target: null,
    title: null,
    translate: null,
    type: null,
    typeMustMatch: boolean,
    useMap: null,
    value: booleanish,
    width: number,
    wrap: null,
    writingSuggestions: null,
    // Legacy.
    // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
    align: null,
    // Several. Use CSS `text-align` instead,
    aLink: null,
    // `<body>`. Use CSS `a:active {color}` instead
    archive: spaceSeparated,
    // `<object>`. List of URIs to archives
    axis: null,
    // `<td>` and `<th>`. Use `scope` on `<th>`
    background: null,
    // `<body>`. Use CSS `background-image` instead
    bgColor: null,
    // `<body>` and table elements. Use CSS `background-color` instead
    border: number,
    // `<table>`. Use CSS `border-width` instead,
    borderColor: null,
    // `<table>`. Use CSS `border-color` instead,
    bottomMargin: number,
    // `<body>`
    cellPadding: null,
    // `<table>`
    cellSpacing: null,
    // `<table>`
    char: null,
    // Several table elements. When `align=char`, sets the character to align on
    charOff: null,
    // Several table elements. When `char`, offsets the alignment
    classId: null,
    // `<object>`
    clear: null,
    // `<br>`. Use CSS `clear` instead
    code: null,
    // `<object>`
    codeBase: null,
    // `<object>`
    codeType: null,
    // `<object>`
    color: null,
    // `<font>` and `<hr>`. Use CSS instead
    compact: boolean,
    // Lists. Use CSS to reduce space between items instead
    declare: boolean,
    // `<object>`
    event: null,
    // `<script>`
    face: null,
    // `<font>`. Use CSS instead
    frame: null,
    // `<table>`
    frameBorder: null,
    // `<iframe>`. Use CSS `border` instead
    hSpace: number,
    // `<img>` and `<object>`
    leftMargin: number,
    // `<body>`
    link: null,
    // `<body>`. Use CSS `a:link {color: *}` instead
    longDesc: null,
    // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
    lowSrc: null,
    // `<img>`. Use a `<picture>`
    marginHeight: number,
    // `<body>`
    marginWidth: number,
    // `<body>`
    noResize: boolean,
    // `<frame>`
    noHref: boolean,
    // `<area>`. Use no href instead of an explicit `nohref`
    noShade: boolean,
    // `<hr>`. Use background-color and height instead of borders
    noWrap: boolean,
    // `<td>` and `<th>`
    object: null,
    // `<applet>`
    profile: null,
    // `<head>`
    prompt: null,
    // `<isindex>`
    rev: null,
    // `<link>`
    rightMargin: number,
    // `<body>`
    rules: null,
    // `<table>`
    scheme: null,
    // `<meta>`
    scrolling: booleanish,
    // `<frame>`. Use overflow in the child context
    standby: null,
    // `<object>`
    summary: null,
    // `<table>`
    text: null,
    // `<body>`. Use CSS `color` instead
    topMargin: number,
    // `<body>`
    valueType: null,
    // `<param>`
    version: null,
    // `<html>`. Use a doctype.
    vAlign: null,
    // Several. Use CSS `vertical-align` instead
    vLink: null,
    // `<body>`. Use CSS `a:visited {color}` instead
    vSpace: number,
    // `<img>` and `<object>`
    // Non-standard Properties.
    allowTransparency: null,
    autoCorrect: null,
    autoSave: null,
    disablePictureInPicture: boolean,
    disableRemotePlayback: boolean,
    prefix: null,
    property: null,
    results: number,
    security: null,
    unselectable: null
  },
  space: "html",
  transform: caseInsensitiveTransform
});
const svg$1 = create({
  attributes: {
    accentHeight: "accent-height",
    alignmentBaseline: "alignment-baseline",
    arabicForm: "arabic-form",
    baselineShift: "baseline-shift",
    capHeight: "cap-height",
    className: "class",
    clipPath: "clip-path",
    clipRule: "clip-rule",
    colorInterpolation: "color-interpolation",
    colorInterpolationFilters: "color-interpolation-filters",
    colorProfile: "color-profile",
    colorRendering: "color-rendering",
    crossOrigin: "crossorigin",
    dataType: "datatype",
    dominantBaseline: "dominant-baseline",
    enableBackground: "enable-background",
    fillOpacity: "fill-opacity",
    fillRule: "fill-rule",
    floodColor: "flood-color",
    floodOpacity: "flood-opacity",
    fontFamily: "font-family",
    fontSize: "font-size",
    fontSizeAdjust: "font-size-adjust",
    fontStretch: "font-stretch",
    fontStyle: "font-style",
    fontVariant: "font-variant",
    fontWeight: "font-weight",
    glyphName: "glyph-name",
    glyphOrientationHorizontal: "glyph-orientation-horizontal",
    glyphOrientationVertical: "glyph-orientation-vertical",
    hrefLang: "hreflang",
    horizAdvX: "horiz-adv-x",
    horizOriginX: "horiz-origin-x",
    horizOriginY: "horiz-origin-y",
    imageRendering: "image-rendering",
    letterSpacing: "letter-spacing",
    lightingColor: "lighting-color",
    markerEnd: "marker-end",
    markerMid: "marker-mid",
    markerStart: "marker-start",
    navDown: "nav-down",
    navDownLeft: "nav-down-left",
    navDownRight: "nav-down-right",
    navLeft: "nav-left",
    navNext: "nav-next",
    navPrev: "nav-prev",
    navRight: "nav-right",
    navUp: "nav-up",
    navUpLeft: "nav-up-left",
    navUpRight: "nav-up-right",
    onAbort: "onabort",
    onActivate: "onactivate",
    onAfterPrint: "onafterprint",
    onBeforePrint: "onbeforeprint",
    onBegin: "onbegin",
    onCancel: "oncancel",
    onCanPlay: "oncanplay",
    onCanPlayThrough: "oncanplaythrough",
    onChange: "onchange",
    onClick: "onclick",
    onClose: "onclose",
    onCopy: "oncopy",
    onCueChange: "oncuechange",
    onCut: "oncut",
    onDblClick: "ondblclick",
    onDrag: "ondrag",
    onDragEnd: "ondragend",
    onDragEnter: "ondragenter",
    onDragExit: "ondragexit",
    onDragLeave: "ondragleave",
    onDragOver: "ondragover",
    onDragStart: "ondragstart",
    onDrop: "ondrop",
    onDurationChange: "ondurationchange",
    onEmptied: "onemptied",
    onEnd: "onend",
    onEnded: "onended",
    onError: "onerror",
    onFocus: "onfocus",
    onFocusIn: "onfocusin",
    onFocusOut: "onfocusout",
    onHashChange: "onhashchange",
    onInput: "oninput",
    onInvalid: "oninvalid",
    onKeyDown: "onkeydown",
    onKeyPress: "onkeypress",
    onKeyUp: "onkeyup",
    onLoad: "onload",
    onLoadedData: "onloadeddata",
    onLoadedMetadata: "onloadedmetadata",
    onLoadStart: "onloadstart",
    onMessage: "onmessage",
    onMouseDown: "onmousedown",
    onMouseEnter: "onmouseenter",
    onMouseLeave: "onmouseleave",
    onMouseMove: "onmousemove",
    onMouseOut: "onmouseout",
    onMouseOver: "onmouseover",
    onMouseUp: "onmouseup",
    onMouseWheel: "onmousewheel",
    onOffline: "onoffline",
    onOnline: "ononline",
    onPageHide: "onpagehide",
    onPageShow: "onpageshow",
    onPaste: "onpaste",
    onPause: "onpause",
    onPlay: "onplay",
    onPlaying: "onplaying",
    onPopState: "onpopstate",
    onProgress: "onprogress",
    onRateChange: "onratechange",
    onRepeat: "onrepeat",
    onReset: "onreset",
    onResize: "onresize",
    onScroll: "onscroll",
    onSeeked: "onseeked",
    onSeeking: "onseeking",
    onSelect: "onselect",
    onShow: "onshow",
    onStalled: "onstalled",
    onStorage: "onstorage",
    onSubmit: "onsubmit",
    onSuspend: "onsuspend",
    onTimeUpdate: "ontimeupdate",
    onToggle: "ontoggle",
    onUnload: "onunload",
    onVolumeChange: "onvolumechange",
    onWaiting: "onwaiting",
    onZoom: "onzoom",
    overlinePosition: "overline-position",
    overlineThickness: "overline-thickness",
    paintOrder: "paint-order",
    panose1: "panose-1",
    pointerEvents: "pointer-events",
    referrerPolicy: "referrerpolicy",
    renderingIntent: "rendering-intent",
    shapeRendering: "shape-rendering",
    stopColor: "stop-color",
    stopOpacity: "stop-opacity",
    strikethroughPosition: "strikethrough-position",
    strikethroughThickness: "strikethrough-thickness",
    strokeDashArray: "stroke-dasharray",
    strokeDashOffset: "stroke-dashoffset",
    strokeLineCap: "stroke-linecap",
    strokeLineJoin: "stroke-linejoin",
    strokeMiterLimit: "stroke-miterlimit",
    strokeOpacity: "stroke-opacity",
    strokeWidth: "stroke-width",
    tabIndex: "tabindex",
    textAnchor: "text-anchor",
    textDecoration: "text-decoration",
    textRendering: "text-rendering",
    transformOrigin: "transform-origin",
    typeOf: "typeof",
    underlinePosition: "underline-position",
    underlineThickness: "underline-thickness",
    unicodeBidi: "unicode-bidi",
    unicodeRange: "unicode-range",
    unitsPerEm: "units-per-em",
    vAlphabetic: "v-alphabetic",
    vHanging: "v-hanging",
    vIdeographic: "v-ideographic",
    vMathematical: "v-mathematical",
    vectorEffect: "vector-effect",
    vertAdvY: "vert-adv-y",
    vertOriginX: "vert-origin-x",
    vertOriginY: "vert-origin-y",
    wordSpacing: "word-spacing",
    writingMode: "writing-mode",
    xHeight: "x-height",
    // These were camelcased in Tiny. Now lowercased in SVG 2
    playbackOrder: "playbackorder",
    timelineBegin: "timelinebegin"
  },
  properties: {
    about: commaOrSpaceSeparated,
    accentHeight: number,
    accumulate: null,
    additive: null,
    alignmentBaseline: null,
    alphabetic: number,
    amplitude: number,
    arabicForm: null,
    ascent: number,
    attributeName: null,
    attributeType: null,
    azimuth: number,
    bandwidth: null,
    baselineShift: null,
    baseFrequency: null,
    baseProfile: null,
    bbox: null,
    begin: null,
    bias: number,
    by: null,
    calcMode: null,
    capHeight: number,
    className: spaceSeparated,
    clip: null,
    clipPath: null,
    clipPathUnits: null,
    clipRule: null,
    color: null,
    colorInterpolation: null,
    colorInterpolationFilters: null,
    colorProfile: null,
    colorRendering: null,
    content: null,
    contentScriptType: null,
    contentStyleType: null,
    crossOrigin: null,
    cursor: null,
    cx: null,
    cy: null,
    d: null,
    dataType: null,
    defaultAction: null,
    descent: number,
    diffuseConstant: number,
    direction: null,
    display: null,
    dur: null,
    divisor: number,
    dominantBaseline: null,
    download: boolean,
    dx: null,
    dy: null,
    edgeMode: null,
    editable: null,
    elevation: number,
    enableBackground: null,
    end: null,
    event: null,
    exponent: number,
    externalResourcesRequired: null,
    fill: null,
    fillOpacity: number,
    fillRule: null,
    filter: null,
    filterRes: null,
    filterUnits: null,
    floodColor: null,
    floodOpacity: null,
    focusable: null,
    focusHighlight: null,
    fontFamily: null,
    fontSize: null,
    fontSizeAdjust: null,
    fontStretch: null,
    fontStyle: null,
    fontVariant: null,
    fontWeight: null,
    format: null,
    fr: null,
    from: null,
    fx: null,
    fy: null,
    g1: commaSeparated,
    g2: commaSeparated,
    glyphName: commaSeparated,
    glyphOrientationHorizontal: null,
    glyphOrientationVertical: null,
    glyphRef: null,
    gradientTransform: null,
    gradientUnits: null,
    handler: null,
    hanging: number,
    hatchContentUnits: null,
    hatchUnits: null,
    height: null,
    href: null,
    hrefLang: null,
    horizAdvX: number,
    horizOriginX: number,
    horizOriginY: number,
    id: null,
    ideographic: number,
    imageRendering: null,
    initialVisibility: null,
    in: null,
    in2: null,
    intercept: number,
    k: number,
    k1: number,
    k2: number,
    k3: number,
    k4: number,
    kernelMatrix: commaOrSpaceSeparated,
    kernelUnitLength: null,
    keyPoints: null,
    // SEMI_COLON_SEPARATED
    keySplines: null,
    // SEMI_COLON_SEPARATED
    keyTimes: null,
    // SEMI_COLON_SEPARATED
    kerning: null,
    lang: null,
    lengthAdjust: null,
    letterSpacing: null,
    lightingColor: null,
    limitingConeAngle: number,
    local: null,
    markerEnd: null,
    markerMid: null,
    markerStart: null,
    markerHeight: null,
    markerUnits: null,
    markerWidth: null,
    mask: null,
    maskContentUnits: null,
    maskUnits: null,
    mathematical: null,
    max: null,
    media: null,
    mediaCharacterEncoding: null,
    mediaContentEncodings: null,
    mediaSize: number,
    mediaTime: null,
    method: null,
    min: null,
    mode: null,
    name: null,
    navDown: null,
    navDownLeft: null,
    navDownRight: null,
    navLeft: null,
    navNext: null,
    navPrev: null,
    navRight: null,
    navUp: null,
    navUpLeft: null,
    navUpRight: null,
    numOctaves: null,
    observer: null,
    offset: null,
    onAbort: null,
    onActivate: null,
    onAfterPrint: null,
    onBeforePrint: null,
    onBegin: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnd: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFocusIn: null,
    onFocusOut: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadStart: null,
    onMessage: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onMouseWheel: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRepeat: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onShow: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onZoom: null,
    opacity: null,
    operator: null,
    order: null,
    orient: null,
    orientation: null,
    origin: null,
    overflow: null,
    overlay: null,
    overlinePosition: number,
    overlineThickness: number,
    paintOrder: null,
    panose1: null,
    path: null,
    pathLength: number,
    patternContentUnits: null,
    patternTransform: null,
    patternUnits: null,
    phase: null,
    ping: spaceSeparated,
    pitch: null,
    playbackOrder: null,
    pointerEvents: null,
    points: null,
    pointsAtX: number,
    pointsAtY: number,
    pointsAtZ: number,
    preserveAlpha: null,
    preserveAspectRatio: null,
    primitiveUnits: null,
    propagate: null,
    property: commaOrSpaceSeparated,
    r: null,
    radius: null,
    referrerPolicy: null,
    refX: null,
    refY: null,
    rel: commaOrSpaceSeparated,
    rev: commaOrSpaceSeparated,
    renderingIntent: null,
    repeatCount: null,
    repeatDur: null,
    requiredExtensions: commaOrSpaceSeparated,
    requiredFeatures: commaOrSpaceSeparated,
    requiredFonts: commaOrSpaceSeparated,
    requiredFormats: commaOrSpaceSeparated,
    resource: null,
    restart: null,
    result: null,
    rotate: null,
    rx: null,
    ry: null,
    scale: null,
    seed: null,
    shapeRendering: null,
    side: null,
    slope: null,
    snapshotTime: null,
    specularConstant: number,
    specularExponent: number,
    spreadMethod: null,
    spacing: null,
    startOffset: null,
    stdDeviation: null,
    stemh: null,
    stemv: null,
    stitchTiles: null,
    stopColor: null,
    stopOpacity: null,
    strikethroughPosition: number,
    strikethroughThickness: number,
    string: null,
    stroke: null,
    strokeDashArray: commaOrSpaceSeparated,
    strokeDashOffset: null,
    strokeLineCap: null,
    strokeLineJoin: null,
    strokeMiterLimit: number,
    strokeOpacity: number,
    strokeWidth: null,
    style: null,
    surfaceScale: number,
    syncBehavior: null,
    syncBehaviorDefault: null,
    syncMaster: null,
    syncTolerance: null,
    syncToleranceDefault: null,
    systemLanguage: commaOrSpaceSeparated,
    tabIndex: number,
    tableValues: null,
    target: null,
    targetX: number,
    targetY: number,
    textAnchor: null,
    textDecoration: null,
    textRendering: null,
    textLength: null,
    timelineBegin: null,
    title: null,
    transformBehavior: null,
    type: null,
    typeOf: commaOrSpaceSeparated,
    to: null,
    transform: null,
    transformOrigin: null,
    u1: null,
    u2: null,
    underlinePosition: number,
    underlineThickness: number,
    unicode: null,
    unicodeBidi: null,
    unicodeRange: null,
    unitsPerEm: number,
    values: null,
    vAlphabetic: number,
    vMathematical: number,
    vectorEffect: null,
    vHanging: number,
    vIdeographic: number,
    version: null,
    vertAdvY: number,
    vertOriginX: number,
    vertOriginY: number,
    viewBox: null,
    viewTarget: null,
    visibility: null,
    width: null,
    widths: null,
    wordSpacing: null,
    writingMode: null,
    x: null,
    x1: null,
    x2: null,
    xChannelSelector: null,
    xHeight: number,
    y: null,
    y1: null,
    y2: null,
    yChannelSelector: null,
    z: null,
    zoomAndPan: null
  },
  space: "svg",
  transform: caseSensitiveTransform
});
const xlink = create({
  properties: {
    xLinkActuate: null,
    xLinkArcRole: null,
    xLinkHref: null,
    xLinkRole: null,
    xLinkShow: null,
    xLinkTitle: null,
    xLinkType: null
  },
  space: "xlink",
  transform(_, property) {
    return "xlink:" + property.slice(5).toLowerCase();
  }
});
const xmlns = create({
  attributes: { xmlnsxlink: "xmlns:xlink" },
  properties: { xmlnsXLink: null, xmlns: null },
  space: "xmlns",
  transform: caseInsensitiveTransform
});
const xml = create({
  properties: { xmlBase: null, xmlLang: null, xmlSpace: null },
  space: "xml",
  transform(_, property) {
    return "xml:" + property.slice(3).toLowerCase();
  }
});
const hastToReact = {
  classId: "classID",
  dataType: "datatype",
  itemId: "itemID",
  strokeDashArray: "strokeDasharray",
  strokeDashOffset: "strokeDashoffset",
  strokeLineCap: "strokeLinecap",
  strokeLineJoin: "strokeLinejoin",
  strokeMiterLimit: "strokeMiterlimit",
  typeOf: "typeof",
  xLinkActuate: "xlinkActuate",
  xLinkArcRole: "xlinkArcrole",
  xLinkHref: "xlinkHref",
  xLinkRole: "xlinkRole",
  xLinkShow: "xlinkShow",
  xLinkTitle: "xlinkTitle",
  xLinkType: "xlinkType",
  xmlnsXLink: "xmlnsXlink"
};
const cap$1 = /[A-Z]/g;
const dash = /-[a-z]/g;
const valid = /^data[-\w.:]+$/i;
function find(schema, value) {
  const normal = normalize$1(value);
  let property = value;
  let Type = Info;
  if (normal in schema.normal) {
    return schema.property[schema.normal[normal]];
  }
  if (normal.length > 4 && normal.slice(0, 4) === "data" && valid.test(value)) {
    if (value.charAt(4) === "-") {
      const rest = value.slice(5).replace(dash, camelcase);
      property = "data" + rest.charAt(0).toUpperCase() + rest.slice(1);
    } else {
      const rest = value.slice(4);
      if (!dash.test(rest)) {
        let dashes = rest.replace(cap$1, kebab);
        if (dashes.charAt(0) !== "-") {
          dashes = "-" + dashes;
        }
        value = "data" + dashes;
      }
    }
    Type = DefinedInfo;
  }
  return new Type(property, value);
}
function kebab($0) {
  return "-" + $0.toLowerCase();
}
function camelcase($0) {
  return $0.charAt(1).toUpperCase();
}
const html$1 = merge([aria, html$2, xlink, xmlns, xml], "html");
const svg = merge([aria, svg$1, xlink, xmlns, xml], "svg");
function stringify(values) {
  return values.join(" ").trim();
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var cjs$2 = {};
var COMMENT_REGEX = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
var NEWLINE_REGEX = /\n/g;
var WHITESPACE_REGEX = /^\s*/;
var PROPERTY_REGEX = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/;
var COLON_REGEX = /^:\s*/;
var VALUE_REGEX = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/;
var SEMICOLON_REGEX = /^[;\s]*/;
var TRIM_REGEX = /^\s+|\s+$/g;
var NEWLINE = "\n";
var FORWARD_SLASH = "/";
var ASTERISK = "*";
var EMPTY_STRING = "";
var TYPE_COMMENT = "comment";
var TYPE_DECLARATION = "declaration";
function index$1(style, options) {
  if (typeof style !== "string") {
    throw new TypeError("First argument must be a string");
  }
  if (!style) return [];
  options = options || {};
  var lineno = 1;
  var column = 1;
  function updatePosition(str) {
    var lines = str.match(NEWLINE_REGEX);
    if (lines) lineno += lines.length;
    var i = str.lastIndexOf(NEWLINE);
    column = ~i ? str.length - i : column + str.length;
  }
  function position2() {
    var start = { line: lineno, column };
    return function(node2) {
      node2.position = new Position(start);
      whitespace2();
      return node2;
    };
  }
  function Position(start) {
    this.start = start;
    this.end = { line: lineno, column };
    this.source = options.source;
  }
  Position.prototype.content = style;
  function error(msg) {
    var err = new Error(
      options.source + ":" + lineno + ":" + column + ": " + msg
    );
    err.reason = msg;
    err.filename = options.source;
    err.line = lineno;
    err.column = column;
    err.source = style;
    if (options.silent) ;
    else {
      throw err;
    }
  }
  function match(re2) {
    var m = re2.exec(style);
    if (!m) return;
    var str = m[0];
    updatePosition(str);
    style = style.slice(str.length);
    return m;
  }
  function whitespace2() {
    match(WHITESPACE_REGEX);
  }
  function comments(rules) {
    var c;
    rules = rules || [];
    while (c = comment()) {
      if (c !== false) {
        rules.push(c);
      }
    }
    return rules;
  }
  function comment() {
    var pos = position2();
    if (FORWARD_SLASH != style.charAt(0) || ASTERISK != style.charAt(1)) return;
    var i = 2;
    while (EMPTY_STRING != style.charAt(i) && (ASTERISK != style.charAt(i) || FORWARD_SLASH != style.charAt(i + 1))) {
      ++i;
    }
    i += 2;
    if (EMPTY_STRING === style.charAt(i - 1)) {
      return error("End of comment missing");
    }
    var str = style.slice(2, i - 2);
    column += 2;
    updatePosition(str);
    style = style.slice(i);
    column += 2;
    return pos({
      type: TYPE_COMMENT,
      comment: str
    });
  }
  function declaration() {
    var pos = position2();
    var prop = match(PROPERTY_REGEX);
    if (!prop) return;
    comment();
    if (!match(COLON_REGEX)) return error("property missing ':'");
    var val = match(VALUE_REGEX);
    var ret = pos({
      type: TYPE_DECLARATION,
      property: trim(prop[0].replace(COMMENT_REGEX, EMPTY_STRING)),
      value: val ? trim(val[0].replace(COMMENT_REGEX, EMPTY_STRING)) : EMPTY_STRING
    });
    match(SEMICOLON_REGEX);
    return ret;
  }
  function declarations() {
    var decls = [];
    comments(decls);
    var decl;
    while (decl = declaration()) {
      if (decl !== false) {
        decls.push(decl);
        comments(decls);
      }
    }
    return decls;
  }
  whitespace2();
  return declarations();
}
function trim(str) {
  return str ? str.replace(TRIM_REGEX, EMPTY_STRING) : EMPTY_STRING;
}
var cjs$1 = index$1;
var __importDefault$1 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(cjs$2, "__esModule", { value: true });
cjs$2.default = StyleToObject;
const inline_style_parser_1 = __importDefault$1(cjs$1);
function StyleToObject(style, iterator) {
  let styleObject = null;
  if (!style || typeof style !== "string") {
    return styleObject;
  }
  const declarations = (0, inline_style_parser_1.default)(style);
  const hasIterator = typeof iterator === "function";
  declarations.forEach((declaration) => {
    if (declaration.type !== "declaration") {
      return;
    }
    const { property, value } = declaration;
    if (hasIterator) {
      iterator(property, value, declaration);
    } else if (value) {
      styleObject = styleObject || {};
      styleObject[property] = value;
    }
  });
  return styleObject;
}
var utilities = {};
Object.defineProperty(utilities, "__esModule", { value: true });
utilities.camelCase = void 0;
var CUSTOM_PROPERTY_REGEX = /^--[a-zA-Z0-9_-]+$/;
var HYPHEN_REGEX = /-([a-z])/g;
var NO_HYPHEN_REGEX = /^[^-]+$/;
var VENDOR_PREFIX_REGEX = /^-(webkit|moz|ms|o|khtml)-/;
var MS_VENDOR_PREFIX_REGEX = /^-(ms)-/;
var skipCamelCase = function(property) {
  return !property || NO_HYPHEN_REGEX.test(property) || CUSTOM_PROPERTY_REGEX.test(property);
};
var capitalize = function(match, character) {
  return character.toUpperCase();
};
var trimHyphen = function(match, prefix) {
  return "".concat(prefix, "-");
};
var camelCase = function(property, options) {
  if (options === void 0) {
    options = {};
  }
  if (skipCamelCase(property)) {
    return property;
  }
  property = property.toLowerCase();
  if (options.reactCompat) {
    property = property.replace(MS_VENDOR_PREFIX_REGEX, trimHyphen);
  } else {
    property = property.replace(VENDOR_PREFIX_REGEX, trimHyphen);
  }
  return property.replace(HYPHEN_REGEX, capitalize);
};
utilities.camelCase = camelCase;
var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
var style_to_object_1 = __importDefault(cjs$2);
var utilities_1 = utilities;
function StyleToJS(style, options) {
  var output = {};
  if (!style || typeof style !== "string") {
    return output;
  }
  (0, style_to_object_1.default)(style, function(property, value) {
    if (property && value) {
      output[(0, utilities_1.camelCase)(property, options)] = value;
    }
  });
  return output;
}
StyleToJS.default = StyleToJS;
var cjs = StyleToJS;
const styleToJs = /* @__PURE__ */ getDefaultExportFromCjs(cjs);
const pointEnd = point$2("end");
const pointStart = point$2("start");
function point$2(type) {
  return point2;
  function point2(node2) {
    const point3 = node2 && node2.position && node2.position[type] || {};
    if (typeof point3.line === "number" && point3.line > 0 && typeof point3.column === "number" && point3.column > 0) {
      return {
        line: point3.line,
        column: point3.column,
        offset: typeof point3.offset === "number" && point3.offset > -1 ? point3.offset : void 0
      };
    }
  }
}
function position$1(node2) {
  const start = pointStart(node2);
  const end = pointEnd(node2);
  if (start && end) {
    return { start, end };
  }
}
function stringifyPosition(value) {
  if (!value || typeof value !== "object") {
    return "";
  }
  if ("position" in value || "type" in value) {
    return position(value.position);
  }
  if ("start" in value || "end" in value) {
    return position(value);
  }
  if ("line" in value || "column" in value) {
    return point$1(value);
  }
  return "";
}
function point$1(point2) {
  return index(point2 && point2.line) + ":" + index(point2 && point2.column);
}
function position(pos) {
  return point$1(pos && pos.start) + "-" + point$1(pos && pos.end);
}
function index(value) {
  return value && typeof value === "number" ? value : 1;
}
class VFileMessage extends Error {
  /**
   * Create a message for `reason`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {Options | null | undefined} [options]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | Options | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns
   *   Instance of `VFileMessage`.
   */
  // eslint-disable-next-line complexity
  constructor(causeOrReason, optionsOrParentOrPlace, origin) {
    super();
    if (typeof optionsOrParentOrPlace === "string") {
      origin = optionsOrParentOrPlace;
      optionsOrParentOrPlace = void 0;
    }
    let reason = "";
    let options = {};
    let legacyCause = false;
    if (optionsOrParentOrPlace) {
      if ("line" in optionsOrParentOrPlace && "column" in optionsOrParentOrPlace) {
        options = { place: optionsOrParentOrPlace };
      } else if ("start" in optionsOrParentOrPlace && "end" in optionsOrParentOrPlace) {
        options = { place: optionsOrParentOrPlace };
      } else if ("type" in optionsOrParentOrPlace) {
        options = {
          ancestors: [optionsOrParentOrPlace],
          place: optionsOrParentOrPlace.position
        };
      } else {
        options = { ...optionsOrParentOrPlace };
      }
    }
    if (typeof causeOrReason === "string") {
      reason = causeOrReason;
    } else if (!options.cause && causeOrReason) {
      legacyCause = true;
      reason = causeOrReason.message;
      options.cause = causeOrReason;
    }
    if (!options.ruleId && !options.source && typeof origin === "string") {
      const index2 = origin.indexOf(":");
      if (index2 === -1) {
        options.ruleId = origin;
      } else {
        options.source = origin.slice(0, index2);
        options.ruleId = origin.slice(index2 + 1);
      }
    }
    if (!options.place && options.ancestors && options.ancestors) {
      const parent = options.ancestors[options.ancestors.length - 1];
      if (parent) {
        options.place = parent.position;
      }
    }
    const start = options.place && "start" in options.place ? options.place.start : options.place;
    this.ancestors = options.ancestors || void 0;
    this.cause = options.cause || void 0;
    this.column = start ? start.column : void 0;
    this.fatal = void 0;
    this.file = "";
    this.message = reason;
    this.line = start ? start.line : void 0;
    this.name = stringifyPosition(options.place) || "1:1";
    this.place = options.place || void 0;
    this.reason = this.message;
    this.ruleId = options.ruleId || void 0;
    this.source = options.source || void 0;
    this.stack = legacyCause && options.cause && typeof options.cause.stack === "string" ? options.cause.stack : "";
    this.actual = void 0;
    this.expected = void 0;
    this.note = void 0;
    this.url = void 0;
  }
}
VFileMessage.prototype.file = "";
VFileMessage.prototype.name = "";
VFileMessage.prototype.reason = "";
VFileMessage.prototype.message = "";
VFileMessage.prototype.stack = "";
VFileMessage.prototype.column = void 0;
VFileMessage.prototype.line = void 0;
VFileMessage.prototype.ancestors = void 0;
VFileMessage.prototype.cause = void 0;
VFileMessage.prototype.fatal = void 0;
VFileMessage.prototype.place = void 0;
VFileMessage.prototype.ruleId = void 0;
VFileMessage.prototype.source = void 0;
const own$3 = {}.hasOwnProperty;
const emptyMap = /* @__PURE__ */ new Map();
const cap = /[A-Z]/g;
const tableElements = /* @__PURE__ */ new Set(["table", "tbody", "thead", "tfoot", "tr"]);
const tableCellElement = /* @__PURE__ */ new Set(["td", "th"]);
const docs = "https://github.com/syntax-tree/hast-util-to-jsx-runtime";
function toJsxRuntime(tree, options) {
  if (!options || options.Fragment === void 0) {
    throw new TypeError("Expected `Fragment` in options");
  }
  const filePath = options.filePath || void 0;
  let create2;
  if (options.development) {
    if (typeof options.jsxDEV !== "function") {
      throw new TypeError(
        "Expected `jsxDEV` in options when `development: true`"
      );
    }
    create2 = developmentCreate(filePath, options.jsxDEV);
  } else {
    if (typeof options.jsx !== "function") {
      throw new TypeError("Expected `jsx` in production options");
    }
    if (typeof options.jsxs !== "function") {
      throw new TypeError("Expected `jsxs` in production options");
    }
    create2 = productionCreate(filePath, options.jsx, options.jsxs);
  }
  const state = {
    Fragment: options.Fragment,
    ancestors: [],
    components: options.components || {},
    create: create2,
    elementAttributeNameCase: options.elementAttributeNameCase || "react",
    evaluater: options.createEvaluater ? options.createEvaluater() : void 0,
    filePath,
    ignoreInvalidStyle: options.ignoreInvalidStyle || false,
    passKeys: options.passKeys !== false,
    passNode: options.passNode || false,
    schema: options.space === "svg" ? svg : html$1,
    stylePropertyNameCase: options.stylePropertyNameCase || "dom",
    tableCellAlignToStyle: options.tableCellAlignToStyle !== false
  };
  const result = one$1(state, tree, void 0);
  if (result && typeof result !== "string") {
    return result;
  }
  return state.create(
    tree,
    state.Fragment,
    { children: result || void 0 },
    void 0
  );
}
function one$1(state, node2, key) {
  if (node2.type === "element") {
    return element$1(state, node2, key);
  }
  if (node2.type === "mdxFlowExpression" || node2.type === "mdxTextExpression") {
    return mdxExpression(state, node2);
  }
  if (node2.type === "mdxJsxFlowElement" || node2.type === "mdxJsxTextElement") {
    return mdxJsxElement(state, node2, key);
  }
  if (node2.type === "mdxjsEsm") {
    return mdxEsm(state, node2);
  }
  if (node2.type === "root") {
    return root$1(state, node2, key);
  }
  if (node2.type === "text") {
    return text$3(state, node2);
  }
}
function element$1(state, node2, key) {
  const parentSchema = state.schema;
  let schema = parentSchema;
  if (node2.tagName.toLowerCase() === "svg" && parentSchema.space === "html") {
    schema = svg;
    state.schema = schema;
  }
  state.ancestors.push(node2);
  const type = findComponentFromName(state, node2.tagName, false);
  const props = createElementProps(state, node2);
  let children = createChildren(state, node2);
  if (tableElements.has(node2.tagName)) {
    children = children.filter(function(child) {
      return typeof child === "string" ? !whitespace(child) : true;
    });
  }
  addNode(state, props, type, node2);
  addChildren(props, children);
  state.ancestors.pop();
  state.schema = parentSchema;
  return state.create(node2, type, props, key);
}
function mdxExpression(state, node2) {
  if (node2.data && node2.data.estree && state.evaluater) {
    const program = node2.data.estree;
    const expression = program.body[0];
    ok$1(expression.type === "ExpressionStatement");
    return (
      /** @type {Child | undefined} */
      state.evaluater.evaluateExpression(expression.expression)
    );
  }
  crashEstree(state, node2.position);
}
function mdxEsm(state, node2) {
  if (node2.data && node2.data.estree && state.evaluater) {
    return (
      /** @type {Child | undefined} */
      state.evaluater.evaluateProgram(node2.data.estree)
    );
  }
  crashEstree(state, node2.position);
}
function mdxJsxElement(state, node2, key) {
  const parentSchema = state.schema;
  let schema = parentSchema;
  if (node2.name === "svg" && parentSchema.space === "html") {
    schema = svg;
    state.schema = schema;
  }
  state.ancestors.push(node2);
  const type = node2.name === null ? state.Fragment : findComponentFromName(state, node2.name, true);
  const props = createJsxElementProps(state, node2);
  const children = createChildren(state, node2);
  addNode(state, props, type, node2);
  addChildren(props, children);
  state.ancestors.pop();
  state.schema = parentSchema;
  return state.create(node2, type, props, key);
}
function root$1(state, node2, key) {
  const props = {};
  addChildren(props, createChildren(state, node2));
  return state.create(node2, state.Fragment, props, key);
}
function text$3(_, node2) {
  return node2.value;
}
function addNode(state, props, type, node2) {
  if (typeof type !== "string" && type !== state.Fragment && state.passNode) {
    props.node = node2;
  }
}
function addChildren(props, children) {
  if (children.length > 0) {
    const value = children.length > 1 ? children : children[0];
    if (value) {
      props.children = value;
    }
  }
}
function productionCreate(_, jsx2, jsxs2) {
  return create2;
  function create2(_2, type, props, key) {
    const isStaticChildren = Array.isArray(props.children);
    const fn = isStaticChildren ? jsxs2 : jsx2;
    return key ? fn(type, props, key) : fn(type, props);
  }
}
function developmentCreate(filePath, jsxDEV) {
  return create2;
  function create2(node2, type, props, key) {
    const isStaticChildren = Array.isArray(props.children);
    const point2 = pointStart(node2);
    return jsxDEV(
      type,
      props,
      key,
      isStaticChildren,
      {
        columnNumber: point2 ? point2.column - 1 : void 0,
        fileName: filePath,
        lineNumber: point2 ? point2.line : void 0
      },
      void 0
    );
  }
}
function createElementProps(state, node2) {
  const props = {};
  let alignValue;
  let prop;
  for (prop in node2.properties) {
    if (prop !== "children" && own$3.call(node2.properties, prop)) {
      const result = createProperty(state, prop, node2.properties[prop]);
      if (result) {
        const [key, value] = result;
        if (state.tableCellAlignToStyle && key === "align" && typeof value === "string" && tableCellElement.has(node2.tagName)) {
          alignValue = value;
        } else {
          props[key] = value;
        }
      }
    }
  }
  if (alignValue) {
    const style = (
      /** @type {Style} */
      props.style || (props.style = {})
    );
    style[state.stylePropertyNameCase === "css" ? "text-align" : "textAlign"] = alignValue;
  }
  return props;
}
function createJsxElementProps(state, node2) {
  const props = {};
  for (const attribute of node2.attributes) {
    if (attribute.type === "mdxJsxExpressionAttribute") {
      if (attribute.data && attribute.data.estree && state.evaluater) {
        const program = attribute.data.estree;
        const expression = program.body[0];
        ok$1(expression.type === "ExpressionStatement");
        const objectExpression = expression.expression;
        ok$1(objectExpression.type === "ObjectExpression");
        const property = objectExpression.properties[0];
        ok$1(property.type === "SpreadElement");
        Object.assign(
          props,
          state.evaluater.evaluateExpression(property.argument)
        );
      } else {
        crashEstree(state, node2.position);
      }
    } else {
      const name2 = attribute.name;
      let value;
      if (attribute.value && typeof attribute.value === "object") {
        if (attribute.value.data && attribute.value.data.estree && state.evaluater) {
          const program = attribute.value.data.estree;
          const expression = program.body[0];
          ok$1(expression.type === "ExpressionStatement");
          value = state.evaluater.evaluateExpression(expression.expression);
        } else {
          crashEstree(state, node2.position);
        }
      } else {
        value = attribute.value === null ? true : attribute.value;
      }
      props[name2] = /** @type {Props[keyof Props]} */
      value;
    }
  }
  return props;
}
function createChildren(state, node2) {
  const children = [];
  let index2 = -1;
  const countsByName = state.passKeys ? /* @__PURE__ */ new Map() : emptyMap;
  while (++index2 < node2.children.length) {
    const child = node2.children[index2];
    let key;
    if (state.passKeys) {
      const name2 = child.type === "element" ? child.tagName : child.type === "mdxJsxFlowElement" || child.type === "mdxJsxTextElement" ? child.name : void 0;
      if (name2) {
        const count = countsByName.get(name2) || 0;
        key = name2 + "-" + count;
        countsByName.set(name2, count + 1);
      }
    }
    const result = one$1(state, child, key);
    if (result !== void 0) children.push(result);
  }
  return children;
}
function createProperty(state, prop, value) {
  const info = find(state.schema, prop);
  if (value === null || value === void 0 || typeof value === "number" && Number.isNaN(value)) {
    return;
  }
  if (Array.isArray(value)) {
    value = info.commaSeparated ? stringify$1(value) : stringify(value);
  }
  if (info.property === "style") {
    let styleObject = typeof value === "object" ? value : parseStyle(state, String(value));
    if (state.stylePropertyNameCase === "css") {
      styleObject = transformStylesToCssCasing(styleObject);
    }
    return ["style", styleObject];
  }
  return [
    state.elementAttributeNameCase === "react" && info.space ? hastToReact[info.property] || info.property : info.attribute,
    value
  ];
}
function parseStyle(state, value) {
  try {
    return styleToJs(value, { reactCompat: true });
  } catch (error) {
    if (state.ignoreInvalidStyle) {
      return {};
    }
    const cause = (
      /** @type {Error} */
      error
    );
    const message = new VFileMessage("Cannot parse `style` attribute", {
      ancestors: state.ancestors,
      cause,
      ruleId: "style",
      source: "hast-util-to-jsx-runtime"
    });
    message.file = state.filePath || void 0;
    message.url = docs + "#cannot-parse-style-attribute";
    throw message;
  }
}
function findComponentFromName(state, name$1, allowExpression) {
  let result;
  if (!allowExpression) {
    result = { type: "Literal", value: name$1 };
  } else if (name$1.includes(".")) {
    const identifiers = name$1.split(".");
    let index2 = -1;
    let node2;
    while (++index2 < identifiers.length) {
      const prop = name(identifiers[index2]) ? { type: "Identifier", name: identifiers[index2] } : { type: "Literal", value: identifiers[index2] };
      node2 = node2 ? {
        type: "MemberExpression",
        object: node2,
        property: prop,
        computed: Boolean(index2 && prop.type === "Literal"),
        optional: false
      } : prop;
    }
    result = node2;
  } else {
    result = name(name$1) && !/^[a-z]/.test(name$1) ? { type: "Identifier", name: name$1 } : { type: "Literal", value: name$1 };
  }
  if (result.type === "Literal") {
    const name2 = (
      /** @type {string | number} */
      result.value
    );
    return own$3.call(state.components, name2) ? state.components[name2] : name2;
  }
  if (state.evaluater) {
    return state.evaluater.evaluateExpression(result);
  }
  crashEstree(state);
}
function crashEstree(state, place) {
  const message = new VFileMessage(
    "Cannot handle MDX estrees without `createEvaluater`",
    {
      ancestors: state.ancestors,
      place,
      ruleId: "mdx-estree",
      source: "hast-util-to-jsx-runtime"
    }
  );
  message.file = state.filePath || void 0;
  message.url = docs + "#cannot-handle-mdx-estrees-without-createevaluater";
  throw message;
}
function transformStylesToCssCasing(domCasing) {
  const cssCasing = {};
  let from;
  for (from in domCasing) {
    if (own$3.call(domCasing, from)) {
      cssCasing[transformStyleToCssCasing(from)] = domCasing[from];
    }
  }
  return cssCasing;
}
function transformStyleToCssCasing(from) {
  let to = from.replace(cap, toDash);
  if (to.slice(0, 3) === "ms-") to = "-" + to;
  return to;
}
function toDash($0) {
  return "-" + $0.toLowerCase();
}
const urlAttributes = {
  action: ["form"],
  cite: ["blockquote", "del", "ins", "q"],
  data: ["object"],
  formAction: ["button", "input"],
  href: ["a", "area", "base", "link"],
  icon: ["menuitem"],
  itemId: null,
  manifest: ["html"],
  ping: ["a", "area"],
  poster: ["video"],
  src: [
    "audio",
    "embed",
    "iframe",
    "img",
    "input",
    "script",
    "source",
    "track",
    "video"
  ]
};
const emptyOptions$1 = {};
function toString$1(value, options) {
  const settings = emptyOptions$1;
  const includeImageAlt = typeof settings.includeImageAlt === "boolean" ? settings.includeImageAlt : true;
  const includeHtml = typeof settings.includeHtml === "boolean" ? settings.includeHtml : true;
  return one(value, includeImageAlt, includeHtml);
}
function one(value, includeImageAlt, includeHtml) {
  if (node(value)) {
    if ("value" in value) {
      return value.type === "html" && !includeHtml ? "" : value.value;
    }
    if (includeImageAlt && "alt" in value && value.alt) {
      return value.alt;
    }
    if ("children" in value) {
      return all(value.children, includeImageAlt, includeHtml);
    }
  }
  if (Array.isArray(value)) {
    return all(value, includeImageAlt, includeHtml);
  }
  return "";
}
function all(values, includeImageAlt, includeHtml) {
  const result = [];
  let index2 = -1;
  while (++index2 < values.length) {
    result[index2] = one(values[index2], includeImageAlt, includeHtml);
  }
  return result.join("");
}
function node(value) {
  return Boolean(value && typeof value === "object");
}
const element = document.createElement("i");
function decodeNamedCharacterReference(value) {
  const characterReference2 = "&" + value + ";";
  element.innerHTML = characterReference2;
  const character = element.textContent;
  if (
    // @ts-expect-error: TypeScript is wrong that `textContent` on elements can
    // yield `null`.
    character.charCodeAt(character.length - 1) === 59 && value !== "semi"
  ) {
    return false;
  }
  return character === characterReference2 ? false : character;
}
function splice(list2, start, remove, items) {
  const end = list2.length;
  let chunkStart = 0;
  let parameters;
  if (start < 0) {
    start = -start > end ? 0 : end + start;
  } else {
    start = start > end ? end : start;
  }
  remove = remove > 0 ? remove : 0;
  if (items.length < 1e4) {
    parameters = Array.from(items);
    parameters.unshift(start, remove);
    list2.splice(...parameters);
  } else {
    if (remove) list2.splice(start, remove);
    while (chunkStart < items.length) {
      parameters = items.slice(chunkStart, chunkStart + 1e4);
      parameters.unshift(start, 0);
      list2.splice(...parameters);
      chunkStart += 1e4;
      start += 1e4;
    }
  }
}
function push(list2, items) {
  if (list2.length > 0) {
    splice(list2, list2.length, 0, items);
    return list2;
  }
  return items;
}
const hasOwnProperty = {}.hasOwnProperty;
function combineExtensions(extensions) {
  const all2 = {};
  let index2 = -1;
  while (++index2 < extensions.length) {
    syntaxExtension(all2, extensions[index2]);
  }
  return all2;
}
function syntaxExtension(all2, extension2) {
  let hook;
  for (hook in extension2) {
    const maybe = hasOwnProperty.call(all2, hook) ? all2[hook] : void 0;
    const left = maybe || (all2[hook] = {});
    const right = extension2[hook];
    let code2;
    if (right) {
      for (code2 in right) {
        if (!hasOwnProperty.call(left, code2)) left[code2] = [];
        const value = right[code2];
        constructs(
          // @ts-expect-error Looks like a list.
          left[code2],
          Array.isArray(value) ? value : value ? [value] : []
        );
      }
    }
  }
}
function constructs(existing, list2) {
  let index2 = -1;
  const before = [];
  while (++index2 < list2.length) {
    (list2[index2].add === "after" ? existing : before).push(list2[index2]);
  }
  splice(existing, 0, 0, before);
}
function decodeNumericCharacterReference(value, base) {
  const code2 = Number.parseInt(value, base);
  if (
    // C0 except for HT, LF, FF, CR, space.
    code2 < 9 || code2 === 11 || code2 > 13 && code2 < 32 || // Control character (DEL) of C0, and C1 controls.
    code2 > 126 && code2 < 160 || // Lone high surrogates and low surrogates.
    code2 > 55295 && code2 < 57344 || // Noncharacters.
    code2 > 64975 && code2 < 65008 || /* eslint-disable no-bitwise */
    (code2 & 65535) === 65535 || (code2 & 65535) === 65534 || /* eslint-enable no-bitwise */
    // Out of range
    code2 > 1114111
  ) {
    return "�";
  }
  return String.fromCodePoint(code2);
}
function normalizeIdentifier(value) {
  return value.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase();
}
const asciiAlpha = regexCheck(/[A-Za-z]/);
const asciiAlphanumeric = regexCheck(/[\dA-Za-z]/);
const asciiAtext = regexCheck(/[#-'*+\--9=?A-Z^-~]/);
function asciiControl(code2) {
  return (
    // Special whitespace codes (which have negative values), C0 and Control
    // character DEL
    code2 !== null && (code2 < 32 || code2 === 127)
  );
}
const asciiDigit = regexCheck(/\d/);
const asciiHexDigit = regexCheck(/[\dA-Fa-f]/);
const asciiPunctuation = regexCheck(/[!-/:-@[-`{-~]/);
function markdownLineEnding(code2) {
  return code2 !== null && code2 < -2;
}
function markdownLineEndingOrSpace(code2) {
  return code2 !== null && (code2 < 0 || code2 === 32);
}
function markdownSpace(code2) {
  return code2 === -2 || code2 === -1 || code2 === 32;
}
const unicodePunctuation = regexCheck(/\p{P}|\p{S}/u);
const unicodeWhitespace = regexCheck(/\s/);
function regexCheck(regex) {
  return check;
  function check(code2) {
    return code2 !== null && code2 > -1 && regex.test(String.fromCharCode(code2));
  }
}
function normalizeUri(value) {
  const result = [];
  let index2 = -1;
  let start = 0;
  let skip = 0;
  while (++index2 < value.length) {
    const code2 = value.charCodeAt(index2);
    let replace = "";
    if (code2 === 37 && asciiAlphanumeric(value.charCodeAt(index2 + 1)) && asciiAlphanumeric(value.charCodeAt(index2 + 2))) {
      skip = 2;
    } else if (code2 < 128) {
      if (!/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(code2))) {
        replace = String.fromCharCode(code2);
      }
    } else if (code2 > 55295 && code2 < 57344) {
      const next = value.charCodeAt(index2 + 1);
      if (code2 < 56320 && next > 56319 && next < 57344) {
        replace = String.fromCharCode(code2, next);
        skip = 1;
      } else {
        replace = "�";
      }
    } else {
      replace = String.fromCharCode(code2);
    }
    if (replace) {
      result.push(value.slice(start, index2), encodeURIComponent(replace));
      start = index2 + skip + 1;
      replace = "";
    }
    if (skip) {
      index2 += skip;
      skip = 0;
    }
  }
  return result.join("") + value.slice(start);
}
function factorySpace(effects, ok2, type, max) {
  const limit = max ? max - 1 : Number.POSITIVE_INFINITY;
  let size = 0;
  return start;
  function start(code2) {
    if (markdownSpace(code2)) {
      effects.enter(type);
      return prefix(code2);
    }
    return ok2(code2);
  }
  function prefix(code2) {
    if (markdownSpace(code2) && size++ < limit) {
      effects.consume(code2);
      return prefix;
    }
    effects.exit(type);
    return ok2(code2);
  }
}
const content$1 = {
  tokenize: initializeContent
};
function initializeContent(effects) {
  const contentStart = effects.attempt(this.parser.constructs.contentInitial, afterContentStartConstruct, paragraphInitial);
  let previous2;
  return contentStart;
  function afterContentStartConstruct(code2) {
    if (code2 === null) {
      effects.consume(code2);
      return;
    }
    effects.enter("lineEnding");
    effects.consume(code2);
    effects.exit("lineEnding");
    return factorySpace(effects, contentStart, "linePrefix");
  }
  function paragraphInitial(code2) {
    effects.enter("paragraph");
    return lineStart(code2);
  }
  function lineStart(code2) {
    const token = effects.enter("chunkText", {
      contentType: "text",
      previous: previous2
    });
    if (previous2) {
      previous2.next = token;
    }
    previous2 = token;
    return data(code2);
  }
  function data(code2) {
    if (code2 === null) {
      effects.exit("chunkText");
      effects.exit("paragraph");
      effects.consume(code2);
      return;
    }
    if (markdownLineEnding(code2)) {
      effects.consume(code2);
      effects.exit("chunkText");
      return lineStart;
    }
    effects.consume(code2);
    return data;
  }
}
const document$2 = {
  tokenize: initializeDocument
};
const containerConstruct = {
  tokenize: tokenizeContainer
};
function initializeDocument(effects) {
  const self2 = this;
  const stack = [];
  let continued = 0;
  let childFlow;
  let childToken;
  let lineStartOffset;
  return start;
  function start(code2) {
    if (continued < stack.length) {
      const item = stack[continued];
      self2.containerState = item[1];
      return effects.attempt(item[0].continuation, documentContinue, checkNewContainers)(code2);
    }
    return checkNewContainers(code2);
  }
  function documentContinue(code2) {
    continued++;
    if (self2.containerState._closeFlow) {
      self2.containerState._closeFlow = void 0;
      if (childFlow) {
        closeFlow();
      }
      const indexBeforeExits = self2.events.length;
      let indexBeforeFlow = indexBeforeExits;
      let point2;
      while (indexBeforeFlow--) {
        if (self2.events[indexBeforeFlow][0] === "exit" && self2.events[indexBeforeFlow][1].type === "chunkFlow") {
          point2 = self2.events[indexBeforeFlow][1].end;
          break;
        }
      }
      exitContainers(continued);
      let index2 = indexBeforeExits;
      while (index2 < self2.events.length) {
        self2.events[index2][1].end = {
          ...point2
        };
        index2++;
      }
      splice(self2.events, indexBeforeFlow + 1, 0, self2.events.slice(indexBeforeExits));
      self2.events.length = index2;
      return checkNewContainers(code2);
    }
    return start(code2);
  }
  function checkNewContainers(code2) {
    if (continued === stack.length) {
      if (!childFlow) {
        return documentContinued(code2);
      }
      if (childFlow.currentConstruct && childFlow.currentConstruct.concrete) {
        return flowStart(code2);
      }
      self2.interrupt = Boolean(childFlow.currentConstruct && !childFlow._gfmTableDynamicInterruptHack);
    }
    self2.containerState = {};
    return effects.check(containerConstruct, thereIsANewContainer, thereIsNoNewContainer)(code2);
  }
  function thereIsANewContainer(code2) {
    if (childFlow) closeFlow();
    exitContainers(continued);
    return documentContinued(code2);
  }
  function thereIsNoNewContainer(code2) {
    self2.parser.lazy[self2.now().line] = continued !== stack.length;
    lineStartOffset = self2.now().offset;
    return flowStart(code2);
  }
  function documentContinued(code2) {
    self2.containerState = {};
    return effects.attempt(containerConstruct, containerContinue, flowStart)(code2);
  }
  function containerContinue(code2) {
    continued++;
    stack.push([self2.currentConstruct, self2.containerState]);
    return documentContinued(code2);
  }
  function flowStart(code2) {
    if (code2 === null) {
      if (childFlow) closeFlow();
      exitContainers(0);
      effects.consume(code2);
      return;
    }
    childFlow = childFlow || self2.parser.flow(self2.now());
    effects.enter("chunkFlow", {
      _tokenizer: childFlow,
      contentType: "flow",
      previous: childToken
    });
    return flowContinue(code2);
  }
  function flowContinue(code2) {
    if (code2 === null) {
      writeToChild(effects.exit("chunkFlow"), true);
      exitContainers(0);
      effects.consume(code2);
      return;
    }
    if (markdownLineEnding(code2)) {
      effects.consume(code2);
      writeToChild(effects.exit("chunkFlow"));
      continued = 0;
      self2.interrupt = void 0;
      return start;
    }
    effects.consume(code2);
    return flowContinue;
  }
  function writeToChild(token, endOfFile) {
    const stream = self2.sliceStream(token);
    if (endOfFile) stream.push(null);
    token.previous = childToken;
    if (childToken) childToken.next = token;
    childToken = token;
    childFlow.defineSkip(token.start);
    childFlow.write(stream);
    if (self2.parser.lazy[token.start.line]) {
      let index2 = childFlow.events.length;
      while (index2--) {
        if (
          // The token starts before the line ending…
          childFlow.events[index2][1].start.offset < lineStartOffset && // …and either is not ended yet…
          (!childFlow.events[index2][1].end || // …or ends after it.
          childFlow.events[index2][1].end.offset > lineStartOffset)
        ) {
          return;
        }
      }
      const indexBeforeExits = self2.events.length;
      let indexBeforeFlow = indexBeforeExits;
      let seen;
      let point2;
      while (indexBeforeFlow--) {
        if (self2.events[indexBeforeFlow][0] === "exit" && self2.events[indexBeforeFlow][1].type === "chunkFlow") {
          if (seen) {
            point2 = self2.events[indexBeforeFlow][1].end;
            break;
          }
          seen = true;
        }
      }
      exitContainers(continued);
      index2 = indexBeforeExits;
      while (index2 < self2.events.length) {
        self2.events[index2][1].end = {
          ...point2
        };
        index2++;
      }
      splice(self2.events, indexBeforeFlow + 1, 0, self2.events.slice(indexBeforeExits));
      self2.events.length = index2;
    }
  }
  function exitContainers(size) {
    let index2 = stack.length;
    while (index2-- > size) {
      const entry = stack[index2];
      self2.containerState = entry[1];
      entry[0].exit.call(self2, effects);
    }
    stack.length = size;
  }
  function closeFlow() {
    childFlow.write([null]);
    childToken = void 0;
    childFlow = void 0;
    self2.containerState._closeFlow = void 0;
  }
}
function tokenizeContainer(effects, ok2, nok) {
  return factorySpace(effects, effects.attempt(this.parser.constructs.document, ok2, nok), "linePrefix", this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
}
function classifyCharacter(code2) {
  if (code2 === null || markdownLineEndingOrSpace(code2) || unicodeWhitespace(code2)) {
    return 1;
  }
  if (unicodePunctuation(code2)) {
    return 2;
  }
}
function resolveAll(constructs2, events, context) {
  const called = [];
  let index2 = -1;
  while (++index2 < constructs2.length) {
    const resolve = constructs2[index2].resolveAll;
    if (resolve && !called.includes(resolve)) {
      events = resolve(events, context);
      called.push(resolve);
    }
  }
  return events;
}
const attention = {
  name: "attention",
  resolveAll: resolveAllAttention,
  tokenize: tokenizeAttention
};
function resolveAllAttention(events, context) {
  let index2 = -1;
  let open;
  let group;
  let text2;
  let openingSequence;
  let closingSequence;
  let use;
  let nextEvents;
  let offset;
  while (++index2 < events.length) {
    if (events[index2][0] === "enter" && events[index2][1].type === "attentionSequence" && events[index2][1]._close) {
      open = index2;
      while (open--) {
        if (events[open][0] === "exit" && events[open][1].type === "attentionSequence" && events[open][1]._open && // If the markers are the same:
        context.sliceSerialize(events[open][1]).charCodeAt(0) === context.sliceSerialize(events[index2][1]).charCodeAt(0)) {
          if ((events[open][1]._close || events[index2][1]._open) && (events[index2][1].end.offset - events[index2][1].start.offset) % 3 && !((events[open][1].end.offset - events[open][1].start.offset + events[index2][1].end.offset - events[index2][1].start.offset) % 3)) {
            continue;
          }
          use = events[open][1].end.offset - events[open][1].start.offset > 1 && events[index2][1].end.offset - events[index2][1].start.offset > 1 ? 2 : 1;
          const start = {
            ...events[open][1].end
          };
          const end = {
            ...events[index2][1].start
          };
          movePoint(start, -use);
          movePoint(end, use);
          openingSequence = {
            type: use > 1 ? "strongSequence" : "emphasisSequence",
            start,
            end: {
              ...events[open][1].end
            }
          };
          closingSequence = {
            type: use > 1 ? "strongSequence" : "emphasisSequence",
            start: {
              ...events[index2][1].start
            },
            end
          };
          text2 = {
            type: use > 1 ? "strongText" : "emphasisText",
            start: {
              ...events[open][1].end
            },
            end: {
              ...events[index2][1].start
            }
          };
          group = {
            type: use > 1 ? "strong" : "emphasis",
            start: {
              ...openingSequence.start
            },
            end: {
              ...closingSequence.end
            }
          };
          events[open][1].end = {
            ...openingSequence.start
          };
          events[index2][1].start = {
            ...closingSequence.end
          };
          nextEvents = [];
          if (events[open][1].end.offset - events[open][1].start.offset) {
            nextEvents = push(nextEvents, [["enter", events[open][1], context], ["exit", events[open][1], context]]);
          }
          nextEvents = push(nextEvents, [["enter", group, context], ["enter", openingSequence, context], ["exit", openingSequence, context], ["enter", text2, context]]);
          nextEvents = push(nextEvents, resolveAll(context.parser.constructs.insideSpan.null, events.slice(open + 1, index2), context));
          nextEvents = push(nextEvents, [["exit", text2, context], ["enter", closingSequence, context], ["exit", closingSequence, context], ["exit", group, context]]);
          if (events[index2][1].end.offset - events[index2][1].start.offset) {
            offset = 2;
            nextEvents = push(nextEvents, [["enter", events[index2][1], context], ["exit", events[index2][1], context]]);
          } else {
            offset = 0;
          }
          splice(events, open - 1, index2 - open + 3, nextEvents);
          index2 = open + nextEvents.length - offset - 2;
          break;
        }
      }
    }
  }
  index2 = -1;
  while (++index2 < events.length) {
    if (events[index2][1].type === "attentionSequence") {
      events[index2][1].type = "data";
    }
  }
  return events;
}
function tokenizeAttention(effects, ok2) {
  const attentionMarkers2 = this.parser.constructs.attentionMarkers.null;
  const previous2 = this.previous;
  const before = classifyCharacter(previous2);
  let marker;
  return start;
  function start(code2) {
    marker = code2;
    effects.enter("attentionSequence");
    return inside(code2);
  }
  function inside(code2) {
    if (code2 === marker) {
      effects.consume(code2);
      return inside;
    }
    const token = effects.exit("attentionSequence");
    const after = classifyCharacter(code2);
    const open = !after || after === 2 && before || attentionMarkers2.includes(code2);
    const close = !before || before === 2 && after || attentionMarkers2.includes(previous2);
    token._open = Boolean(marker === 42 ? open : open && (before || !close));
    token._close = Boolean(marker === 42 ? close : close && (after || !open));
    return ok2(code2);
  }
}
function movePoint(point2, offset) {
  point2.column += offset;
  point2.offset += offset;
  point2._bufferIndex += offset;
}
const autolink = {
  name: "autolink",
  tokenize: tokenizeAutolink
};
function tokenizeAutolink(effects, ok2, nok) {
  let size = 0;
  return start;
  function start(code2) {
    effects.enter("autolink");
    effects.enter("autolinkMarker");
    effects.consume(code2);
    effects.exit("autolinkMarker");
    effects.enter("autolinkProtocol");
    return open;
  }
  function open(code2) {
    if (asciiAlpha(code2)) {
      effects.consume(code2);
      return schemeOrEmailAtext;
    }
    if (code2 === 64) {
      return nok(code2);
    }
    return emailAtext(code2);
  }
  function schemeOrEmailAtext(code2) {
    if (code2 === 43 || code2 === 45 || code2 === 46 || asciiAlphanumeric(code2)) {
      size = 1;
      return schemeInsideOrEmailAtext(code2);
    }
    return emailAtext(code2);
  }
  function schemeInsideOrEmailAtext(code2) {
    if (code2 === 58) {
      effects.consume(code2);
      size = 0;
      return urlInside;
    }
    if ((code2 === 43 || code2 === 45 || code2 === 46 || asciiAlphanumeric(code2)) && size++ < 32) {
      effects.consume(code2);
      return schemeInsideOrEmailAtext;
    }
    size = 0;
    return emailAtext(code2);
  }
  function urlInside(code2) {
    if (code2 === 62) {
      effects.exit("autolinkProtocol");
      effects.enter("autolinkMarker");
      effects.consume(code2);
      effects.exit("autolinkMarker");
      effects.exit("autolink");
      return ok2;
    }
    if (code2 === null || code2 === 32 || code2 === 60 || asciiControl(code2)) {
      return nok(code2);
    }
    effects.consume(code2);
    return urlInside;
  }
  function emailAtext(code2) {
    if (code2 === 64) {
      effects.consume(code2);
      return emailAtSignOrDot;
    }
    if (asciiAtext(code2)) {
      effects.consume(code2);
      return emailAtext;
    }
    return nok(code2);
  }
  function emailAtSignOrDot(code2) {
    return asciiAlphanumeric(code2) ? emailLabel(code2) : nok(code2);
  }
  function emailLabel(code2) {
    if (code2 === 46) {
      effects.consume(code2);
      size = 0;
      return emailAtSignOrDot;
    }
    if (code2 === 62) {
      effects.exit("autolinkProtocol").type = "autolinkEmail";
      effects.enter("autolinkMarker");
      effects.consume(code2);
      effects.exit("autolinkMarker");
      effects.exit("autolink");
      return ok2;
    }
    return emailValue(code2);
  }
  function emailValue(code2) {
    if ((code2 === 45 || asciiAlphanumeric(code2)) && size++ < 63) {
      const next = code2 === 45 ? emailValue : emailLabel;
      effects.consume(code2);
      return next;
    }
    return nok(code2);
  }
}
const blankLine = {
  partial: true,
  tokenize: tokenizeBlankLine
};
function tokenizeBlankLine(effects, ok2, nok) {
  return start;
  function start(code2) {
    return markdownSpace(code2) ? factorySpace(effects, after, "linePrefix")(code2) : after(code2);
  }
  function after(code2) {
    return code2 === null || markdownLineEnding(code2) ? ok2(code2) : nok(code2);
  }
}
const blockQuote = {
  continuation: {
    tokenize: tokenizeBlockQuoteContinuation
  },
  exit,
  name: "blockQuote",
  tokenize: tokenizeBlockQuoteStart
};
function tokenizeBlockQuoteStart(effects, ok2, nok) {
  const self2 = this;
  return start;
  function start(code2) {
    if (code2 === 62) {
      const state = self2.containerState;
      if (!state.open) {
        effects.enter("blockQuote", {
          _container: true
        });
        state.open = true;
      }
      effects.enter("blockQuotePrefix");
      effects.enter("blockQuoteMarker");
      effects.consume(code2);
      effects.exit("blockQuoteMarker");
      return after;
    }
    return nok(code2);
  }
  function after(code2) {
    if (markdownSpace(code2)) {
      effects.enter("blockQuotePrefixWhitespace");
      effects.consume(code2);
      effects.exit("blockQuotePrefixWhitespace");
      effects.exit("blockQuotePrefix");
      return ok2;
    }
    effects.exit("blockQuotePrefix");
    return ok2(code2);
  }
}
function tokenizeBlockQuoteContinuation(effects, ok2, nok) {
  const self2 = this;
  return contStart;
  function contStart(code2) {
    if (markdownSpace(code2)) {
      return factorySpace(effects, contBefore, "linePrefix", self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code2);
    }
    return contBefore(code2);
  }
  function contBefore(code2) {
    return effects.attempt(blockQuote, ok2, nok)(code2);
  }
}
function exit(effects) {
  effects.exit("blockQuote");
}
const characterEscape = {
  name: "characterEscape",
  tokenize: tokenizeCharacterEscape
};
function tokenizeCharacterEscape(effects, ok2, nok) {
  return start;
  function start(code2) {
    effects.enter("characterEscape");
    effects.enter("escapeMarker");
    effects.consume(code2);
    effects.exit("escapeMarker");
    return inside;
  }
  function inside(code2) {
    if (asciiPunctuation(code2)) {
      effects.enter("characterEscapeValue");
      effects.consume(code2);
      effects.exit("characterEscapeValue");
      effects.exit("characterEscape");
      return ok2;
    }
    return nok(code2);
  }
}
const characterReference = {
  name: "characterReference",
  tokenize: tokenizeCharacterReference
};
function tokenizeCharacterReference(effects, ok2, nok) {
  const self2 = this;
  let size = 0;
  let max;
  let test;
  return start;
  function start(code2) {
    effects.enter("characterReference");
    effects.enter("characterReferenceMarker");
    effects.consume(code2);
    effects.exit("characterReferenceMarker");
    return open;
  }
  function open(code2) {
    if (code2 === 35) {
      effects.enter("characterReferenceMarkerNumeric");
      effects.consume(code2);
      effects.exit("characterReferenceMarkerNumeric");
      return numeric;
    }
    effects.enter("characterReferenceValue");
    max = 31;
    test = asciiAlphanumeric;
    return value(code2);
  }
  function numeric(code2) {
    if (code2 === 88 || code2 === 120) {
      effects.enter("characterReferenceMarkerHexadecimal");
      effects.consume(code2);
      effects.exit("characterReferenceMarkerHexadecimal");
      effects.enter("characterReferenceValue");
      max = 6;
      test = asciiHexDigit;
      return value;
    }
    effects.enter("characterReferenceValue");
    max = 7;
    test = asciiDigit;
    return value(code2);
  }
  function value(code2) {
    if (code2 === 59 && size) {
      const token = effects.exit("characterReferenceValue");
      if (test === asciiAlphanumeric && !decodeNamedCharacterReference(self2.sliceSerialize(token))) {
        return nok(code2);
      }
      effects.enter("characterReferenceMarker");
      effects.consume(code2);
      effects.exit("characterReferenceMarker");
      effects.exit("characterReference");
      return ok2;
    }
    if (test(code2) && size++ < max) {
      effects.consume(code2);
      return value;
    }
    return nok(code2);
  }
}
const nonLazyContinuation = {
  partial: true,
  tokenize: tokenizeNonLazyContinuation
};
const codeFenced = {
  concrete: true,
  name: "codeFenced",
  tokenize: tokenizeCodeFenced
};
function tokenizeCodeFenced(effects, ok2, nok) {
  const self2 = this;
  const closeStart = {
    partial: true,
    tokenize: tokenizeCloseStart
  };
  let initialPrefix = 0;
  let sizeOpen = 0;
  let marker;
  return start;
  function start(code2) {
    return beforeSequenceOpen(code2);
  }
  function beforeSequenceOpen(code2) {
    const tail = self2.events[self2.events.length - 1];
    initialPrefix = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
    marker = code2;
    effects.enter("codeFenced");
    effects.enter("codeFencedFence");
    effects.enter("codeFencedFenceSequence");
    return sequenceOpen(code2);
  }
  function sequenceOpen(code2) {
    if (code2 === marker) {
      sizeOpen++;
      effects.consume(code2);
      return sequenceOpen;
    }
    if (sizeOpen < 3) {
      return nok(code2);
    }
    effects.exit("codeFencedFenceSequence");
    return markdownSpace(code2) ? factorySpace(effects, infoBefore, "whitespace")(code2) : infoBefore(code2);
  }
  function infoBefore(code2) {
    if (code2 === null || markdownLineEnding(code2)) {
      effects.exit("codeFencedFence");
      return self2.interrupt ? ok2(code2) : effects.check(nonLazyContinuation, atNonLazyBreak, after)(code2);
    }
    effects.enter("codeFencedFenceInfo");
    effects.enter("chunkString", {
      contentType: "string"
    });
    return info(code2);
  }
  function info(code2) {
    if (code2 === null || markdownLineEnding(code2)) {
      effects.exit("chunkString");
      effects.exit("codeFencedFenceInfo");
      return infoBefore(code2);
    }
    if (markdownSpace(code2)) {
      effects.exit("chunkString");
      effects.exit("codeFencedFenceInfo");
      return factorySpace(effects, metaBefore, "whitespace")(code2);
    }
    if (code2 === 96 && code2 === marker) {
      return nok(code2);
    }
    effects.consume(code2);
    return info;
  }
  function metaBefore(code2) {
    if (code2 === null || markdownLineEnding(code2)) {
      return infoBefore(code2);
    }
    effects.enter("codeFencedFenceMeta");
    effects.enter("chunkString", {
      contentType: "string"
    });
    return meta(code2);
  }
  function meta(code2) {
    if (code2 === null || markdownLineEnding(code2)) {
      effects.exit("chunkString");
      effects.exit("codeFencedFenceMeta");
      return infoBefore(code2);
    }
    if (code2 === 96 && code2 === marker) {
      return nok(code2);
    }
    effects.consume(code2);
    return meta;
  }
  function atNonLazyBreak(code2) {
    return effects.attempt(closeStart, after, contentBefore)(code2);
  }
  function contentBefore(code2) {
    effects.enter("lineEnding");
    effects.consume(code2);
    effects.exit("lineEnding");
    return contentStart;
  }
  function contentStart(code2) {
    return initialPrefix > 0 && markdownSpace(code2) ? factorySpace(effects, beforeContentChunk, "linePrefix", initialPrefix + 1)(code2) : beforeContentChunk(code2);
  }
  function beforeContentChunk(code2) {
    if (code2 === null || markdownLineEnding(code2)) {
      return effects.check(nonLazyContinuation, atNonLazyBreak, after)(code2);
    }
    effects.enter("codeFlowValue");
    return contentChunk(code2);
  }
  function contentChunk(code2) {
    if (code2 === null || markdownLineEnding(code2)) {
      effects.exit("codeFlowValue");
      return beforeContentChunk(code2);
    }
    effects.consume(code2);
    return contentChunk;
  }
  function after(code2) {
    effects.exit("codeFenced");
    return ok2(code2);
  }
  function tokenizeCloseStart(effects2, ok3, nok2) {
    let size = 0;
    return startBefore;
    function startBefore(code2) {
      effects2.enter("lineEnding");
      effects2.consume(code2);
      effects2.exit("lineEnding");
      return start2;
    }
    function start2(code2) {
      effects2.enter("codeFencedFence");
      return markdownSpace(code2) ? factorySpace(effects2, beforeSequenceClose, "linePrefix", self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code2) : beforeSequenceClose(code2);
    }
    function beforeSequenceClose(code2) {
      if (code2 === marker) {
        effects2.enter("codeFencedFenceSequence");
        return sequenceClose(code2);
      }
      return nok2(code2);
    }
    function sequenceClose(code2) {
      if (code2 === marker) {
        size++;
        effects2.consume(code2);
        return sequenceClose;
      }
      if (size >= sizeOpen) {
        effects2.exit("codeFencedFenceSequence");
        return markdownSpace(code2) ? factorySpace(effects2, sequenceCloseAfter, "whitespace")(code2) : sequenceCloseAfter(code2);
      }
      return nok2(code2);
    }
    function sequenceCloseAfter(code2) {
      if (code2 === null || markdownLineEnding(code2)) {
        effects2.exit("codeFencedFence");
        return ok3(code2);
      }
      return nok2(code2);
    }
  }
}
function tokenizeNonLazyContinuation(effects, ok2, nok) {
  const self2 = this;
  return start;
  function start(code2) {
    if (code2 === null) {
      return nok(code2);
    }
    effects.enter("lineEnding");
    effects.consume(code2);
    effects.exit("lineEnding");
    return lineStart;
  }
  function lineStart(code2) {
    return self2.parser.lazy[self2.now().line] ? nok(code2) : ok2(code2);
  }
}
const codeIndented = {
  name: "codeIndented",
  tokenize: tokenizeCodeIndented
};
const furtherStart = {
  partial: true,
  tokenize: tokenizeFurtherStart
};
function tokenizeCodeIndented(effects, ok2, nok) {
  const self2 = this;
  return start;
  function start(code2) {
    effects.enter("codeIndented");
    return factorySpace(effects, afterPrefix, "linePrefix", 4 + 1)(code2);
  }
  function afterPrefix(code2) {
    const tail = self2.events[self2.events.length - 1];
    return tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4 ? atBreak(code2) : nok(code2);
  }
  function atBreak(code2) {
    if (code2 === null) {
      return after(code2);
    }
    if (markdownLineEnding(code2)) {
      return effects.attempt(furtherStart, atBreak, after)(code2);
    }
    effects.enter("codeFlowValue");
    return inside(code2);
  }
  function inside(code2) {
    if (code2 === null || markdownLineEnding(code2)) {
      effects.exit("codeFlowValue");
      return atBreak(code2);
    }
    effects.consume(code2);
    return inside;
  }
  function after(code2) {
    effects.exit("codeIndented");
    return ok2(code2);
  }
}
function tokenizeFurtherStart(effects, ok2, nok) {
  const self2 = this;
  return furtherStart2;
  function furtherStart2(code2) {
    if (self2.parser.lazy[self2.now().line]) {
      return nok(code2);
    }
    if (markdownLineEnding(code2)) {
      effects.enter("lineEnding");
      effects.consume(code2);
      effects.exit("lineEnding");
      return furtherStart2;
    }
    return factorySpace(effects, afterPrefix, "linePrefix", 4 + 1)(code2);
  }
  function afterPrefix(code2) {
    const tail = self2.events[self2.events.length - 1];
    return tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4 ? ok2(code2) : markdownLineEnding(code2) ? furtherStart2(code2) : nok(code2);
  }
}
const codeText = {
  name: "codeText",
  previous,
  resolve: resolveCodeText,
  tokenize: tokenizeCodeText
};
function resolveCodeText(events) {
  let tailExitIndex = events.length - 4;
  let headEnterIndex = 3;
  let index2;
  let enter;
  if ((events[headEnterIndex][1].type === "lineEnding" || events[headEnterIndex][1].type === "space") && (events[tailExitIndex][1].type === "lineEnding" || events[tailExitIndex][1].type === "space")) {
    index2 = headEnterIndex;
    while (++index2 < tailExitIndex) {
      if (events[index2][1].type === "codeTextData") {
        events[headEnterIndex][1].type = "codeTextPadding";
        events[tailExitIndex][1].type = "codeTextPadding";
        headEnterIndex += 2;
        tailExitIndex -= 2;
        break;
      }
    }
  }
  index2 = headEnterIndex - 1;
  tailExitIndex++;
  while (++index2 <= tailExitIndex) {
    if (enter === void 0) {
      if (index2 !== tailExitIndex && events[index2][1].type !== "lineEnding") {
        enter = index2;
      }
    } else if (index2 === tailExitIndex || events[index2][1].type === "lineEnding") {
      events[enter][1].type = "codeTextData";
      if (index2 !== enter + 2) {
        events[enter][1].end = events[index2 - 1][1].end;
        events.splice(enter + 2, index2 - enter - 2);
        tailExitIndex -= index2 - enter - 2;
        index2 = enter + 2;
      }
      enter = void 0;
    }
  }
  return events;
}
function previous(code2) {
  return code2 !== 96 || this.events[this.events.length - 1][1].type === "characterEscape";
}
function tokenizeCodeText(effects, ok2, nok) {
  let sizeOpen = 0;
  let size;
  let token;
  return start;
  function start(code2) {
    effects.enter("codeText");
    effects.enter("codeTextSequence");
    return sequenceOpen(code2);
  }
  function sequenceOpen(code2) {
    if (code2 === 96) {
      effects.consume(code2);
      sizeOpen++;
      return sequenceOpen;
    }
    effects.exit("codeTextSequence");
    return between(code2);
  }
  function between(code2) {
    if (code2 === null) {
      return nok(code2);
    }
    if (code2 === 32) {
      effects.enter("space");
      effects.consume(code2);
      effects.exit("space");
      return between;
    }
    if (code2 === 96) {
      token = effects.enter("codeTextSequence");
      size = 0;
      return sequenceClose(code2);
    }
    if (markdownLineEnding(code2)) {
      effects.enter("lineEnding");
      effects.consume(code2);
      effects.exit("lineEnding");
      return between;
    }
    effects.enter("codeTextData");
    return data(code2);
  }
  function data(code2) {
    if (code2 === null || code2 === 32 || code2 === 96 || markdownLineEnding(code2)) {
      effects.exit("codeTextData");
      return between(code2);
    }
    effects.consume(code2);
    return data;
  }
  function sequenceClose(code2) {
    if (code2 === 96) {
      effects.consume(code2);
      size++;
      return sequenceClose;
    }
    if (size === sizeOpen) {
      effects.exit("codeTextSequence");
      effects.exit("codeText");
      return ok2(code2);
    }
    token.type = "codeTextData";
    return data(code2);
  }
}
class SpliceBuffer {
  /**
   * @param {ReadonlyArray<T> | null | undefined} [initial]
   *   Initial items (optional).
   * @returns
   *   Splice buffer.
   */
  constructor(initial) {
    this.left = initial ? [...initial] : [];
    this.right = [];
  }
  /**
   * Array access;
   * does not move the cursor.
   *
   * @param {number} index
   *   Index.
   * @return {T}
   *   Item.
   */
  get(index2) {
    if (index2 < 0 || index2 >= this.left.length + this.right.length) {
      throw new RangeError("Cannot access index `" + index2 + "` in a splice buffer of size `" + (this.left.length + this.right.length) + "`");
    }
    if (index2 < this.left.length) return this.left[index2];
    return this.right[this.right.length - index2 + this.left.length - 1];
  }
  /**
   * The length of the splice buffer, one greater than the largest index in the
   * array.
   */
  get length() {
    return this.left.length + this.right.length;
  }
  /**
   * Remove and return `list[0]`;
   * moves the cursor to `0`.
   *
   * @returns {T | undefined}
   *   Item, optional.
   */
  shift() {
    this.setCursor(0);
    return this.right.pop();
  }
  /**
   * Slice the buffer to get an array;
   * does not move the cursor.
   *
   * @param {number} start
   *   Start.
   * @param {number | null | undefined} [end]
   *   End (optional).
   * @returns {Array<T>}
   *   Array of items.
   */
  slice(start, end) {
    const stop = end === null || end === void 0 ? Number.POSITIVE_INFINITY : end;
    if (stop < this.left.length) {
      return this.left.slice(start, stop);
    }
    if (start > this.left.length) {
      return this.right.slice(this.right.length - stop + this.left.length, this.right.length - start + this.left.length).reverse();
    }
    return this.left.slice(start).concat(this.right.slice(this.right.length - stop + this.left.length).reverse());
  }
  /**
   * Mimics the behavior of Array.prototype.splice() except for the change of
   * interface necessary to avoid segfaults when patching in very large arrays.
   *
   * This operation moves cursor is moved to `start` and results in the cursor
   * placed after any inserted items.
   *
   * @param {number} start
   *   Start;
   *   zero-based index at which to start changing the array;
   *   negative numbers count backwards from the end of the array and values
   *   that are out-of bounds are clamped to the appropriate end of the array.
   * @param {number | null | undefined} [deleteCount=0]
   *   Delete count (default: `0`);
   *   maximum number of elements to delete, starting from start.
   * @param {Array<T> | null | undefined} [items=[]]
   *   Items to include in place of the deleted items (default: `[]`).
   * @return {Array<T>}
   *   Any removed items.
   */
  splice(start, deleteCount, items) {
    const count = deleteCount || 0;
    this.setCursor(Math.trunc(start));
    const removed = this.right.splice(this.right.length - count, Number.POSITIVE_INFINITY);
    if (items) chunkedPush(this.left, items);
    return removed.reverse();
  }
  /**
   * Remove and return the highest-numbered item in the array, so
   * `list[list.length - 1]`;
   * Moves the cursor to `length`.
   *
   * @returns {T | undefined}
   *   Item, optional.
   */
  pop() {
    this.setCursor(Number.POSITIVE_INFINITY);
    return this.left.pop();
  }
  /**
   * Inserts a single item to the high-numbered side of the array;
   * moves the cursor to `length`.
   *
   * @param {T} item
   *   Item.
   * @returns {undefined}
   *   Nothing.
   */
  push(item) {
    this.setCursor(Number.POSITIVE_INFINITY);
    this.left.push(item);
  }
  /**
   * Inserts many items to the high-numbered side of the array.
   * Moves the cursor to `length`.
   *
   * @param {Array<T>} items
   *   Items.
   * @returns {undefined}
   *   Nothing.
   */
  pushMany(items) {
    this.setCursor(Number.POSITIVE_INFINITY);
    chunkedPush(this.left, items);
  }
  /**
   * Inserts a single item to the low-numbered side of the array;
   * Moves the cursor to `0`.
   *
   * @param {T} item
   *   Item.
   * @returns {undefined}
   *   Nothing.
   */
  unshift(item) {
    this.setCursor(0);
    this.right.push(item);
  }
  /**
   * Inserts many items to the low-numbered side of the array;
   * moves the cursor to `0`.
   *
   * @param {Array<T>} items
   *   Items.
   * @returns {undefined}
   *   Nothing.
   */
  unshiftMany(items) {
    this.setCursor(0);
    chunkedPush(this.right, items.reverse());
  }
  /**
   * Move the cursor to a specific position in the array. Requires
   * time proportional to the distance moved.
   *
   * If `n < 0`, the cursor will end up at the beginning.
   * If `n > length`, the cursor will end up at the end.
   *
   * @param {number} n
   *   Position.
   * @return {undefined}
   *   Nothing.
   */
  setCursor(n) {
    if (n === this.left.length || n > this.left.length && this.right.length === 0 || n < 0 && this.left.length === 0) return;
    if (n < this.left.length) {
      const removed = this.left.splice(n, Number.POSITIVE_INFINITY);
      chunkedPush(this.right, removed.reverse());
    } else {
      const removed = this.right.splice(this.left.length + this.right.length - n, Number.POSITIVE_INFINITY);
      chunkedPush(this.left, removed.reverse());
    }
  }
}
function chunkedPush(list2, right) {
  let chunkStart = 0;
  if (right.length < 1e4) {
    list2.push(...right);
  } else {
    while (chunkStart < right.length) {
      list2.push(...right.slice(chunkStart, chunkStart + 1e4));
      chunkStart += 1e4;
    }
  }
}
function subtokenize(eventsArray) {
  const jumps = {};
  let index2 = -1;
  let event;
  let lineIndex;
  let otherIndex;
  let otherEvent;
  let parameters;
  let subevents;
  let more;
  const events = new SpliceBuffer(eventsArray);
  while (++index2 < events.length) {
    while (index2 in jumps) {
      index2 = jumps[index2];
    }
    event = events.get(index2);
    if (index2 && event[1].type === "chunkFlow" && events.get(index2 - 1)[1].type === "listItemPrefix") {
      subevents = event[1]._tokenizer.events;
      otherIndex = 0;
      if (otherIndex < subevents.length && subevents[otherIndex][1].type === "lineEndingBlank") {
        otherIndex += 2;
      }
      if (otherIndex < subevents.length && subevents[otherIndex][1].type === "content") {
        while (++otherIndex < subevents.length) {
          if (subevents[otherIndex][1].type === "content") {
            break;
          }
          if (subevents[otherIndex][1].type === "chunkText") {
            subevents[otherIndex][1]._isInFirstContentOfListItem = true;
            otherIndex++;
          }
        }
      }
    }
    if (event[0] === "enter") {
      if (event[1].contentType) {
        Object.assign(jumps, subcontent(events, index2));
        index2 = jumps[index2];
        more = true;
      }
    } else if (event[1]._container) {
      otherIndex = index2;
      lineIndex = void 0;
      while (otherIndex--) {
        otherEvent = events.get(otherIndex);
        if (otherEvent[1].type === "lineEnding" || otherEvent[1].type === "lineEndingBlank") {
          if (otherEvent[0] === "enter") {
            if (lineIndex) {
              events.get(lineIndex)[1].type = "lineEndingBlank";
            }
            otherEvent[1].type = "lineEnding";
            lineIndex = otherIndex;
          }
        } else if (otherEvent[1].type === "linePrefix" || otherEvent[1].type === "listItemIndent") ;
        else {
          break;
        }
      }
      if (lineIndex) {
        event[1].end = {
          ...events.get(lineIndex)[1].start
        };
        parameters = events.slice(lineIndex, index2);
        parameters.unshift(event);
        events.splice(lineIndex, index2 - lineIndex + 1, parameters);
      }
    }
  }
  splice(eventsArray, 0, Number.POSITIVE_INFINITY, events.slice(0));
  return !more;
}
function subcontent(events, eventIndex) {
  const token = events.get(eventIndex)[1];
  const context = events.get(eventIndex)[2];
  let startPosition = eventIndex - 1;
  const startPositions = [];
  let tokenizer = token._tokenizer;
  if (!tokenizer) {
    tokenizer = context.parser[token.contentType](token.start);
    if (token._contentTypeTextTrailing) {
      tokenizer._contentTypeTextTrailing = true;
    }
  }
  const childEvents = tokenizer.events;
  const jumps = [];
  const gaps = {};
  let stream;
  let previous2;
  let index2 = -1;
  let current = token;
  let adjust = 0;
  let start = 0;
  const breaks = [start];
  while (current) {
    while (events.get(++startPosition)[1] !== current) {
    }
    startPositions.push(startPosition);
    if (!current._tokenizer) {
      stream = context.sliceStream(current);
      if (!current.next) {
        stream.push(null);
      }
      if (previous2) {
        tokenizer.defineSkip(current.start);
      }
      if (current._isInFirstContentOfListItem) {
        tokenizer._gfmTasklistFirstContentOfListItem = true;
      }
      tokenizer.write(stream);
      if (current._isInFirstContentOfListItem) {
        tokenizer._gfmTasklistFirstContentOfListItem = void 0;
      }
    }
    previous2 = current;
    current = current.next;
  }
  current = token;
  while (++index2 < childEvents.length) {
    if (
      // Find a void token that includes a break.
      childEvents[index2][0] === "exit" && childEvents[index2 - 1][0] === "enter" && childEvents[index2][1].type === childEvents[index2 - 1][1].type && childEvents[index2][1].start.line !== childEvents[index2][1].end.line
    ) {
      start = index2 + 1;
      breaks.push(start);
      current._tokenizer = void 0;
      current.previous = void 0;
      current = current.next;
    }
  }
  tokenizer.events = [];
  if (current) {
    current._tokenizer = void 0;
    current.previous = void 0;
  } else {
    breaks.pop();
  }
  index2 = breaks.length;
  while (index2--) {
    const slice = childEvents.slice(breaks[index2], breaks[index2 + 1]);
    const start2 = startPositions.pop();
    jumps.push([start2, start2 + slice.length - 1]);
    events.splice(start2, 2, slice);
  }
  jumps.reverse();
  index2 = -1;
  while (++index2 < jumps.length) {
    gaps[adjust + jumps[index2][0]] = adjust + jumps[index2][1];
    adjust += jumps[index2][1] - jumps[index2][0] - 1;
  }
  return gaps;
}
const content = {
  resolve: resolveContent,
  tokenize: tokenizeContent
};
const continuationConstruct = {
  partial: true,
  tokenize: tokenizeContinuation
};
function resolveContent(events) {
  subtokenize(events);
  return events;
}
function tokenizeContent(effects, ok2) {
  let previous2;
  return chunkStart;
  function chunkStart(code2) {
    effects.enter("content");
    previous2 = effects.enter("chunkContent", {
      contentType: "content"
    });
    return chunkInside(code2);
  }
  function chunkInside(code2) {
    if (code2 === null) {
      return contentEnd(code2);
    }
    if (markdownLineEnding(code2)) {
      return effects.check(continuationConstruct, contentContinue, contentEnd)(code2);
    }
    effects.consume(code2);
    return chunkInside;
  }
  function contentEnd(code2) {
    effects.exit("chunkContent");
    effects.exit("content");
    return ok2(code2);
  }
  function contentContinue(code2) {
    effects.consume(code2);
    effects.exit("chunkContent");
    previous2.next = effects.enter("chunkContent", {
      contentType: "content",
      previous: previous2
    });
    previous2 = previous2.next;
    return chunkInside;
  }
}
function tokenizeContinuation(effects, ok2, nok) {
  const self2 = this;
  return startLookahead;
  function startLookahead(code2) {
    effects.exit("chunkContent");
    effects.enter("lineEnding");
    effects.consume(code2);
    effects.exit("lineEnding");
    return factorySpace(effects, prefixed, "linePrefix");
  }
  function prefixed(code2) {
    if (code2 === null || markdownLineEnding(code2)) {
      return nok(code2);
    }
    const tail = self2.events[self2.events.length - 1];
    if (!self2.parser.constructs.disable.null.includes("codeIndented") && tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4) {
      return ok2(code2);
    }
    return effects.interrupt(self2.parser.constructs.flow, nok, ok2)(code2);
  }
}
function factoryDestination(effects, ok2, nok, type, literalType, literalMarkerType, rawType, stringType, max) {
  const limit = max || Number.POSITIVE_INFINITY;
  let balance = 0;
  return start;
  function start(code2) {
    if (code2 === 60) {
      effects.enter(type);
      effects.enter(literalType);
      effects.enter(literalMarkerType);
      effects.consume(code2);
      effects.exit(literalMarkerType);
      return enclosedBefore;
    }
    if (code2 === null || code2 === 32 || code2 === 41 || asciiControl(code2)) {
      return nok(code2);
    }
    effects.enter(type);
    effects.enter(rawType);
    effects.enter(stringType);
    effects.enter("chunkString", {
      contentType: "string"
    });
    return raw(code2);
  }
  function enclosedBefore(code2) {
    if (code2 === 62) {
      effects.enter(literalMarkerType);
      effects.consume(code2);
      effects.exit(literalMarkerType);
      effects.exit(literalType);
      effects.exit(type);
      return ok2;
    }
    effects.enter(stringType);
    effects.enter("chunkString", {
      contentType: "string"
    });
    return enclosed(code2);
  }
  function enclosed(code2) {
    if (code2 === 62) {
      effects.exit("chunkString");
      effects.exit(stringType);
      return enclosedBefore(code2);
    }
    if (code2 === null || code2 === 60 || markdownLineEnding(code2)) {
      return nok(code2);
    }
    effects.consume(code2);
    return code2 === 92 ? enclosedEscape : enclosed;
  }
  function enclosedEscape(code2) {
    if (code2 === 60 || code2 === 62 || code2 === 92) {
      effects.consume(code2);
      return enclosed;
    }
    return enclosed(code2);
  }
  function raw(code2) {
    if (!balance && (code2 === null || code2 === 41 || markdownLineEndingOrSpace(code2))) {
      effects.exit("chunkString");
      effects.exit(stringType);
      effects.exit(rawType);
      effects.exit(type);
      return ok2(code2);
    }
    if (balance < limit && code2 === 40) {
      effects.consume(code2);
      balance++;
      return raw;
    }
    if (code2 === 41) {
      effects.consume(code2);
      balance--;
      return raw;
    }
    if (code2 === null || code2 === 32 || code2 === 40 || asciiControl(code2)) {
      return nok(code2);
    }
    effects.consume(code2);
    return code2 === 92 ? rawEscape : raw;
  }
  function rawEscape(code2) {
    if (code2 === 40 || code2 === 41 || code2 === 92) {
      effects.consume(code2);
      return raw;
    }
    return raw(code2);
  }
}
function factoryLabel(effects, ok2, nok, type, markerType, stringType) {
  const self2 = this;
  let size = 0;
  let seen;
  return start;
  function start(code2) {
    effects.enter(type);
    effects.enter(markerType);
    effects.consume(code2);
    effects.exit(markerType);
    effects.enter(stringType);
    return atBreak;
  }
  function atBreak(code2) {
    if (size > 999 || code2 === null || code2 === 91 || code2 === 93 && !seen || // To do: remove in the future once we’ve switched from
    // `micromark-extension-footnote` to `micromark-extension-gfm-footnote`,
    // which doesn’t need this.
    // Hidden footnotes hook.
    /* c8 ignore next 3 */
    code2 === 94 && !size && "_hiddenFootnoteSupport" in self2.parser.constructs) {
      return nok(code2);
    }
    if (code2 === 93) {
      effects.exit(stringType);
      effects.enter(markerType);
      effects.consume(code2);
      effects.exit(markerType);
      effects.exit(type);
      return ok2;
    }
    if (markdownLineEnding(code2)) {
      effects.enter("lineEnding");
      effects.consume(code2);
      effects.exit("lineEnding");
      return atBreak;
    }
    effects.enter("chunkString", {
      contentType: "string"
    });
    return labelInside(code2);
  }
  function labelInside(code2) {
    if (code2 === null || code2 === 91 || code2 === 93 || markdownLineEnding(code2) || size++ > 999) {
      effects.exit("chunkString");
      return atBreak(code2);
    }
    effects.consume(code2);
    if (!seen) seen = !markdownSpace(code2);
    return code2 === 92 ? labelEscape : labelInside;
  }
  function labelEscape(code2) {
    if (code2 === 91 || code2 === 92 || code2 === 93) {
      effects.consume(code2);
      size++;
      return labelInside;
    }
    return labelInside(code2);
  }
}
function factoryTitle(effects, ok2, nok, type, markerType, stringType) {
  let marker;
  return start;
  function start(code2) {
    if (code2 === 34 || code2 === 39 || code2 === 40) {
      effects.enter(type);
      effects.enter(markerType);
      effects.consume(code2);
      effects.exit(markerType);
      marker = code2 === 40 ? 41 : code2;
      return begin;
    }
    return nok(code2);
  }
  function begin(code2) {
    if (code2 === marker) {
      effects.enter(markerType);
      effects.consume(code2);
      effects.exit(markerType);
      effects.exit(type);
      return ok2;
    }
    effects.enter(stringType);
    return atBreak(code2);
  }
  function atBreak(code2) {
    if (code2 === marker) {
      effects.exit(stringType);
      return begin(marker);
    }
    if (code2 === null) {
      return nok(code2);
    }
    if (markdownLineEnding(code2)) {
      effects.enter("lineEnding");
      effects.consume(code2);
      effects.exit("lineEnding");
      return factorySpace(effects, atBreak, "linePrefix");
    }
    effects.enter("chunkString", {
      contentType: "string"
    });
    return inside(code2);
  }
  function inside(code2) {
    if (code2 === marker || code2 === null || markdownLineEnding(code2)) {
      effects.exit("chunkString");
      return atBreak(code2);
    }
    effects.consume(code2);
    return code2 === 92 ? escape : inside;
  }
  function escape(code2) {
    if (code2 === marker || code2 === 92) {
      effects.consume(code2);
      return inside;
    }
    return inside(code2);
  }
}
function factoryWhitespace(effects, ok2) {
  let seen;
  return start;
  function start(code2) {
    if (markdownLineEnding(code2)) {
      effects.enter("lineEnding");
      effects.consume(code2);
      effects.exit("lineEnding");
      seen = true;
      return start;
    }
    if (markdownSpace(code2)) {
      return factorySpace(effects, start, seen ? "linePrefix" : "lineSuffix")(code2);
    }
    return ok2(code2);
  }
}
const definition = {
  name: "definition",
  tokenize: tokenizeDefinition
};
const titleBefore = {
  partial: true,
  tokenize: tokenizeTitleBefore
};
function tokenizeDefinition(effects, ok2, nok) {
  const self2 = this;
  let identifier;
  return start;
  function start(code2) {
    effects.enter("definition");
    return before(code2);
  }
  function before(code2) {
    return factoryLabel.call(
      self2,
      effects,
      labelAfter,
      // Note: we don’t need to reset the way `markdown-rs` does.
      nok,
      "definitionLabel",
      "definitionLabelMarker",
      "definitionLabelString"
    )(code2);
  }
  function labelAfter(code2) {
    identifier = normalizeIdentifier(self2.sliceSerialize(self2.events[self2.events.length - 1][1]).slice(1, -1));
    if (code2 === 58) {
      effects.enter("definitionMarker");
      effects.consume(code2);
      effects.exit("definitionMarker");
      return markerAfter;
    }
    return nok(code2);
  }
  function markerAfter(code2) {
    return markdownLineEndingOrSpace(code2) ? factoryWhitespace(effects, destinationBefore)(code2) : destinationBefore(code2);
  }
  function destinationBefore(code2) {
    return factoryDestination(
      effects,
      destinationAfter,
      // Note: we don’t need to reset the way `markdown-rs` does.
      nok,
      "definitionDestination",
      "definitionDestinationLiteral",
      "definitionDestinationLiteralMarker",
      "definitionDestinationRaw",
      "definitionDestinationString"
    )(code2);
  }
  function destinationAfter(code2) {
    return effects.attempt(titleBefore, after, after)(code2);
  }
  function after(code2) {
    return markdownSpace(code2) ? factorySpace(effects, afterWhitespace, "whitespace")(code2) : afterWhitespace(code2);
  }
  function afterWhitespace(code2) {
    if (code2 === null || markdownLineEnding(code2)) {
      effects.exit("definition");
      self2.parser.defined.push(identifier);
      return ok2(code2);
    }
    return nok(code2);
  }
}
function tokenizeTitleBefore(effects, ok2, nok) {
  return titleBefore2;
  function titleBefore2(code2) {
    return markdownLineEndingOrSpace(code2) ? factoryWhitespace(effects, beforeMarker)(code2) : nok(code2);
  }
  function beforeMarker(code2) {
    return factoryTitle(effects, titleAfter, nok, "definitionTitle", "definitionTitleMarker", "definitionTitleString")(code2);
  }
  function titleAfter(code2) {
    return markdownSpace(code2) ? factorySpace(effects, titleAfterOptionalWhitespace, "whitespace")(code2) : titleAfterOptionalWhitespace(code2);
  }
  function titleAfterOptionalWhitespace(code2) {
    return code2 === null || markdownLineEnding(code2) ? ok2(code2) : nok(code2);
  }
}
const hardBreakEscape = {
  name: "hardBreakEscape",
  tokenize: tokenizeHardBreakEscape
};
function tokenizeHardBreakEscape(effects, ok2, nok) {
  return start;
  function start(code2) {
    effects.enter("hardBreakEscape");
    effects.consume(code2);
    return after;
  }
  function after(code2) {
    if (markdownLineEnding(code2)) {
      effects.exit("hardBreakEscape");
      return ok2(code2);
    }
    return nok(code2);
  }
}
const headingAtx = {
  name: "headingAtx",
  resolve: resolveHeadingAtx,
  tokenize: tokenizeHeadingAtx
};
function resolveHeadingAtx(events, context) {
  let contentEnd = events.length - 2;
  let contentStart = 3;
  let content2;
  let text2;
  if (events[contentStart][1].type === "whitespace") {
    contentStart += 2;
  }
  if (contentEnd - 2 > contentStart && events[contentEnd][1].type === "whitespace") {
    contentEnd -= 2;
  }
  if (events[contentEnd][1].type === "atxHeadingSequence" && (contentStart === contentEnd - 1 || contentEnd - 4 > contentStart && events[contentEnd - 2][1].type === "whitespace")) {
    contentEnd -= contentStart + 1 === contentEnd ? 2 : 4;
  }
  if (contentEnd > contentStart) {
    content2 = {
      type: "atxHeadingText",
      start: events[contentStart][1].start,
      end: events[contentEnd][1].end
    };
    text2 = {
      type: "chunkText",
      start: events[contentStart][1].start,
      end: events[contentEnd][1].end,
      contentType: "text"
    };
    splice(events, contentStart, contentEnd - contentStart + 1, [["enter", content2, context], ["enter", text2, context], ["exit", text2, context], ["exit", content2, context]]);
  }
  return events;
}
function tokenizeHeadingAtx(effects, ok2, nok) {
  let size = 0;
  return start;
  function start(code2) {
    effects.enter("atxHeading");
    return before(code2);
  }
  function before(code2) {
    effects.enter("atxHeadingSequence");
    return sequenceOpen(code2);
  }
  function sequenceOpen(code2) {
    if (code2 === 35 && size++ < 6) {
      effects.consume(code2);
      return sequenceOpen;
    }
    if (code2 === null || markdownLineEndingOrSpace(code2)) {
      effects.exit("atxHeadingSequence");
      return atBreak(code2);
    }
    return nok(code2);
  }
  function atBreak(code2) {
    if (code2 === 35) {
      effects.enter("atxHeadingSequence");
      return sequenceFurther(code2);
    }
    if (code2 === null || markdownLineEnding(code2)) {
      effects.exit("atxHeading");
      return ok2(code2);
    }
    if (markdownSpace(code2)) {
      return factorySpace(effects, atBreak, "whitespace")(code2);
    }
    effects.enter("atxHeadingText");
    return data(code2);
  }
  function sequenceFurther(code2) {
    if (code2 === 35) {
      effects.consume(code2);
      return sequenceFurther;
    }
    effects.exit("atxHeadingSequence");
    return atBreak(code2);
  }
  function data(code2) {
    if (code2 === null || code2 === 35 || markdownLineEndingOrSpace(code2)) {
      effects.exit("atxHeadingText");
      return atBreak(code2);
    }
    effects.consume(code2);
    return data;
  }
}
const htmlBlockNames = [
  "address",
  "article",
  "aside",
  "base",
  "basefont",
  "blockquote",
  "body",
  "caption",
  "center",
  "col",
  "colgroup",
  "dd",
  "details",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hr",
  "html",
  "iframe",
  "legend",
  "li",
  "link",
  "main",
  "menu",
  "menuitem",
  "nav",
  "noframes",
  "ol",
  "optgroup",
  "option",
  "p",
  "param",
  "search",
  "section",
  "summary",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "title",
  "tr",
  "track",
  "ul"
];
const htmlRawNames = ["pre", "script", "style", "textarea"];
const htmlFlow = {
  concrete: true,
  name: "htmlFlow",
  resolveTo: resolveToHtmlFlow,
  tokenize: tokenizeHtmlFlow
};
const blankLineBefore = {
  partial: true,
  tokenize: tokenizeBlankLineBefore
};
const nonLazyContinuationStart = {
  partial: true,
  tokenize: tokenizeNonLazyContinuationStart
};
function resolveToHtmlFlow(events) {
  let index2 = events.length;
  while (index2--) {
    if (events[index2][0] === "enter" && events[index2][1].type === "htmlFlow") {
      break;
    }
  }
  if (index2 > 1 && events[index2 - 2][1].type === "linePrefix") {
    events[index2][1].start = events[index2 - 2][1].start;
    events[index2 + 1][1].start = events[index2 - 2][1].start;
    events.splice(index2 - 2, 2);
  }
  return events;
}
function tokenizeHtmlFlow(effects, ok2, nok) {
  const self2 = this;
  let marker;
  let closingTag;
  let buffer;
  let index2;
  let markerB;
  return start;
  function start(code2) {
    return before(code2);
  }
  function before(code2) {
    effects.enter("htmlFlow");
    effects.enter("htmlFlowData");
    effects.consume(code2);
    return open;
  }
  function open(code2) {
    if (code2 === 33) {
      effects.consume(code2);
      return declarationOpen;
    }
    if (code2 === 47) {
      effects.consume(code2);
      closingTag = true;
      return tagCloseStart;
    }
    if (code2 === 63) {
      effects.consume(code2);
      marker = 3;
      return self2.interrupt ? ok2 : continuationDeclarationInside;
    }
    if (asciiAlpha(code2)) {
      effects.consume(code2);
      buffer = String.fromCharCode(code2);
      return tagName;
    }
    return nok(code2);
  }
  function declarationOpen(code2) {
    if (code2 === 45) {
      effects.consume(code2);
      marker = 2;
      return commentOpenInside;
    }
    if (code2 === 91) {
      effects.consume(code2);
      marker = 5;
      index2 = 0;
      return cdataOpenInside;
    }
    if (asciiAlpha(code2)) {
      effects.consume(code2);
      marker = 4;
      return self2.interrupt ? ok2 : continuationDeclarationInside;
    }
    return nok(code2);
  }
  function commentOpenInside(code2) {
    if (code2 === 45) {
      effects.consume(code2);
      return self2.interrupt ? ok2 : continuationDeclarationInside;
    }
    return nok(code2);
  }
  function cdataOpenInside(code2) {
    const value = "CDATA[";
    if (code2 === value.charCodeAt(index2++)) {
      effects.consume(code2);
      if (index2 === value.length) {
        return self2.interrupt ? ok2 : continuation;
      }
      return cdataOpenInside;
    }
    return nok(code2);
  }
  function tagCloseStart(code2) {
    if (asciiAlpha(code2)) {
      effects.consume(code2);
      buffer = String.fromCharCode(code2);
      return tagName;
    }
    return nok(code2);
  }
  function tagName(code2) {
    if (code2 === null || code2 === 47 || code2 === 62 || markdownLineEndingOrSpace(code2)) {
      const slash = code2 === 47;
      const name2 = buffer.toLowerCase();
      if (!slash && !closingTag && htmlRawNames.includes(name2)) {
        marker = 1;
        return self2.interrupt ? ok2(code2) : continuation(code2);
      }
      if (htmlBlockNames.includes(buffer.toLowerCase())) {
        marker = 6;
        if (slash) {
          effects.consume(code2);
          return basicSelfClosing;
        }
        return self2.interrupt ? ok2(code2) : continuation(code2);
      }
      marker = 7;
      return self2.interrupt && !self2.parser.lazy[self2.now().line] ? nok(code2) : closingTag ? completeClosingTagAfter(code2) : completeAttributeNameBefore(code2);
    }
    if (code2 === 45 || asciiAlphanumeric(code2)) {
      effects.consume(code2);
      buffer += String.fromCharCode(code2);
      return tagName;
    }
    return nok(code2);
  }
  function basicSelfClosing(code2) {
    if (code2 === 62) {
      effects.consume(code2);
      return self2.interrupt ? ok2 : continuation;
    }
    return nok(code2);
  }
  function completeClosingTagAfter(code2) {
    if (markdownSpace(code2)) {
      effects.consume(code2);
      return completeClosingTagAfter;
    }
    return completeEnd(code2);
  }
  function completeAttributeNameBefore(code2) {
    if (code2 === 47) {
      effects.consume(code2);
      return completeEnd;
    }
    if (code2 === 58 || code2 === 95 || asciiAlpha(code2)) {
      effects.consume(code2);
      return completeAttributeName;
    }
    if (markdownSpace(code2)) {
      effects.consume(code2);
      return completeAttributeNameBefore;
    }
    return completeEnd(code2);
  }
  function completeAttributeName(code2) {
    if (code2 === 45 || code2 === 46 || code2 === 58 || code2 === 95 || asciiAlphanumeric(code2)) {
      effects.consume(code2);
      return completeAttributeName;
    }
    return completeAttributeNameAfter(code2);
  }
  function completeAttributeNameAfter(code2) {
    if (code2 === 61) {
      effects.consume(code2);
      return completeAttributeValueBefore;
    }
    if (markdownSpace(code2)) {
      effects.consume(code2);
      return completeAttributeNameAfter;
    }
    return completeAttributeNameBefore(code2);
  }
  function completeAttributeValueBefore(code2) {
    if (code2 === null || code2 === 60 || code2 === 61 || code2 === 62 || code2 === 96) {
      return nok(code2);
    }
    if (code2 === 34 || code2 === 39) {
      effects.consume(code2);
      markerB = code2;
      return completeAttributeValueQuoted;
    }
    if (markdownSpace(code2)) {
      effects.consume(code2);
      return completeAttributeValueBefore;
    }
    return completeAttributeValueUnquoted(code2);
  }
  function completeAttributeValueQuoted(code2) {
    if (code2 === markerB) {
      effects.consume(code2);
      markerB = null;
      return completeAttributeValueQuotedAfter;
    }
    if (code2 === null || markdownLineEnding(code2)) {
      return nok(code2);
    }
    effects.consume(code2);
    return completeAttributeValueQuoted;
  }
  function completeAttributeValueUnquoted(code2) {
    if (code2 === null || code2 === 34 || code2 === 39 || code2 === 47 || code2 === 60 || code2 === 61 || code2 === 62 || code2 === 96 || markdownLineEndingOrSpace(code2)) {
      return completeAttributeNameAfter(code2);
    }
    effects.consume(code2);
    return completeAttributeValueUnquoted;
  }
  function completeAttributeValueQuotedAfter(code2) {
    if (code2 === 47 || code2 === 62 || markdownSpace(code2)) {
      return completeAttributeNameBefore(code2);
    }
    return nok(code2);
  }
  function completeEnd(code2) {
    if (code2 === 62) {
      effects.consume(code2);
      return completeAfter;
    }
    return nok(code2);
  }
  function completeAfter(code2) {
    if (code2 === null || markdownLineEnding(code2)) {
      return continuation(code2);
    }
    if (markdownSpace(code2)) {
      effects.consume(code2);
      return completeAfter;
    }
    return nok(code2);
  }
  function continuation(code2) {
    if (code2 === 45 && marker === 2) {
      effects.consume(code2);
      return continuationCommentInside;
    }
    if (code2 === 60 && marker === 1) {
      effects.consume(code2);
      return continuationRawTagOpen;
    }
    if (code2 === 62 && marker === 4) {
      effects.consume(code2);
      return continuationClose;
    }
    if (code2 === 63 && marker === 3) {
      effects.consume(code2);
      return continuationDeclarationInside;
    }
    if (code2 === 93 && marker === 5) {
      effects.consume(code2);
      return continuationCdataInside;
    }
    if (markdownLineEnding(code2) && (marker === 6 || marker === 7)) {
      effects.exit("htmlFlowData");
      return effects.check(blankLineBefore, continuationAfter, continuationStart)(code2);
    }
    if (code2 === null || markdownLineEnding(code2)) {
      effects.exit("htmlFlowData");
      return continuationStart(code2);
    }
    effects.consume(code2);
    return continuation;
  }
  function continuationStart(code2) {
    return effects.check(nonLazyContinuationStart, continuationStartNonLazy, continuationAfter)(code2);
  }
  function continuationStartNonLazy(code2) {
    effects.enter("lineEnding");
    effects.consume(code2);
    effects.exit("lineEnding");
    return continuationBefore;
  }
  function continuationBefore(code2) {
    if (code2 === null || markdownLineEnding(code2)) {
      return continuationStart(code2);
    }
    effects.enter("htmlFlowData");
    return continuation(code2);
  }
  function continuationCommentInside(code2) {
    if (code2 === 45) {
      effects.consume(code2);
      return continuationDeclarationInside;
    }
    return continuation(code2);
  }
  function continuationRawTagOpen(code2) {
    if (code2 === 47) {
      effects.consume(code2);
      buffer = "";
      return continuationRawEndTag;
    }
    return continuation(code2);
  }
  function continuationRawEndTag(code2) {
    if (code2 === 62) {
      const name2 = buffer.toLowerCase();
      if (htmlRawNames.includes(name2)) {
        effects.consume(code2);
        return continuationClose;
      }
      return continuation(code2);
    }
    if (asciiAlpha(code2) && buffer.length < 8) {
      effects.consume(code2);
      buffer += String.fromCharCode(code2);
      return continuationRawEndTag;
    }
    return continuation(code2);
  }
  function continuationCdataInside(code2) {
    if (code2 === 93) {
      effects.consume(code2);
      return continuationDeclarationInside;
    }
    return continuation(code2);
  }
  function continuationDeclarationInside(code2) {
    if (code2 === 62) {
      effects.consume(code2);
      return continuationClose;
    }
    if (code2 === 45 && marker === 2) {
      effects.consume(code2);
      return continuationDeclarationInside;
    }
    return continuation(code2);
  }
  function continuationClose(code2) {
    if (code2 === null || markdownLineEnding(code2)) {
      effects.exit("htmlFlowData");
      return continuationAfter(code2);
    }
    effects.consume(code2);
    return continuationClose;
  }
  function continuationAfter(code2) {
    effects.exit("htmlFlow");
    return ok2(code2);
  }
}
function tokenizeNonLazyContinuationStart(effects, ok2, nok) {
  const self2 = this;
  return start;
  function start(code2) {
    if (markdownLineEnding(code2)) {
      effects.enter("lineEnding");
      effects.consume(code2);
      effects.exit("lineEnding");
      return after;
    }
    return nok(code2);
  }
  function after(code2) {
    return self2.parser.lazy[self2.now().line] ? nok(code2) : ok2(code2);
  }
}
function tokenizeBlankLineBefore(effects, ok2, nok) {
  return start;
  function start(code2) {
    effects.enter("lineEnding");
    effects.consume(code2);
    effects.exit("lineEnding");
    return effects.attempt(blankLine, ok2, nok);
  }
}
const htmlText = {
  name: "htmlText",
  tokenize: tokenizeHtmlText
};
function tokenizeHtmlText(effects, ok2, nok) {
  const self2 = this;
  let marker;
  let index2;
  let returnState;
  return start;
  function start(code2) {
    effects.enter("htmlText");
    effects.enter("htmlTextData");
    effects.consume(code2);
    return open;
  }
  function open(code2) {
    if (code2 === 33) {
      effects.consume(code2);
      return declarationOpen;
    }
    if (code2 === 47) {
      effects.consume(code2);
      return tagCloseStart;
    }
    if (code2 === 63) {
      effects.consume(code2);
      return instruction;
    }
    if (asciiAlpha(code2)) {
      effects.consume(code2);
      return tagOpen;
    }
    return nok(code2);
  }
  function declarationOpen(code2) {
    if (code2 === 45) {
      effects.consume(code2);
      return commentOpenInside;
    }
    if (code2 === 91) {
      effects.consume(code2);
      index2 = 0;
      return cdataOpenInside;
    }
    if (asciiAlpha(code2)) {
      effects.consume(code2);
      return declaration;
    }
    return nok(code2);
  }
  function commentOpenInside(code2) {
    if (code2 === 45) {
      effects.consume(code2);
      return commentEnd;
    }
    return nok(code2);
  }
  function comment(code2) {
    if (code2 === null) {
      return nok(code2);
    }
    if (code2 === 45) {
      effects.consume(code2);
      return commentClose;
    }
    if (markdownLineEnding(code2)) {
      returnState = comment;
      return lineEndingBefore(code2);
    }
    effects.consume(code2);
    return comment;
  }
  function commentClose(code2) {
    if (code2 === 45) {
      effects.consume(code2);
      return commentEnd;
    }
    return comment(code2);
  }
  function commentEnd(code2) {
    return code2 === 62 ? end(code2) : code2 === 45 ? commentClose(code2) : comment(code2);
  }
  function cdataOpenInside(code2) {
    const value = "CDATA[";
    if (code2 === value.charCodeAt(index2++)) {
      effects.consume(code2);
      return index2 === value.length ? cdata : cdataOpenInside;
    }
    return nok(code2);
  }
  function cdata(code2) {
    if (code2 === null) {
      return nok(code2);
    }
    if (code2 === 93) {
      effects.consume(code2);
      return cdataClose;
    }
    if (markdownLineEnding(code2)) {
      returnState = cdata;
      return lineEndingBefore(code2);
    }
    effects.consume(code2);
    return cdata;
  }
  function cdataClose(code2) {
    if (code2 === 93) {
      effects.consume(code2);
      return cdataEnd;
    }
    return cdata(code2);
  }
  function cdataEnd(code2) {
    if (code2 === 62) {
      return end(code2);
    }
    if (code2 === 93) {
      effects.consume(code2);
      return cdataEnd;
    }
    return cdata(code2);
  }
  function declaration(code2) {
    if (code2 === null || code2 === 62) {
      return end(code2);
    }
    if (markdownLineEnding(code2)) {
      returnState = declaration;
      return lineEndingBefore(code2);
    }
    effects.consume(code2);
    return declaration;
  }
  function instruction(code2) {
    if (code2 === null) {
      return nok(code2);
    }
    if (code2 === 63) {
      effects.consume(code2);
      return instructionClose;
    }
    if (markdownLineEnding(code2)) {
      returnState = instruction;
      return lineEndingBefore(code2);
    }
    effects.consume(code2);
    return instruction;
  }
  function instructionClose(code2) {
    return code2 === 62 ? end(code2) : instruction(code2);
  }
  function tagCloseStart(code2) {
    if (asciiAlpha(code2)) {
      effects.consume(code2);
      return tagClose;
    }
    return nok(code2);
  }
  function tagClose(code2) {
    if (code2 === 45 || asciiAlphanumeric(code2)) {
      effects.consume(code2);
      return tagClose;
    }
    return tagCloseBetween(code2);
  }
  function tagCloseBetween(code2) {
    if (markdownLineEnding(code2)) {
      returnState = tagCloseBetween;
      return lineEndingBefore(code2);
    }
    if (markdownSpace(code2)) {
      effects.consume(code2);
      return tagCloseBetween;
    }
    return end(code2);
  }
  function tagOpen(code2) {
    if (code2 === 45 || asciiAlphanumeric(code2)) {
      effects.consume(code2);
      return tagOpen;
    }
    if (code2 === 47 || code2 === 62 || markdownLineEndingOrSpace(code2)) {
      return tagOpenBetween(code2);
    }
    return nok(code2);
  }
  function tagOpenBetween(code2) {
    if (code2 === 47) {
      effects.consume(code2);
      return end;
    }
    if (code2 === 58 || code2 === 95 || asciiAlpha(code2)) {
      effects.consume(code2);
      return tagOpenAttributeName;
    }
    if (markdownLineEnding(code2)) {
      returnState = tagOpenBetween;
      return lineEndingBefore(code2);
    }
    if (markdownSpace(code2)) {
      effects.consume(code2);
      return tagOpenBetween;
    }
    return end(code2);
  }
  function tagOpenAttributeName(code2) {
    if (code2 === 45 || code2 === 46 || code2 === 58 || code2 === 95 || asciiAlphanumeric(code2)) {
      effects.consume(code2);
      return tagOpenAttributeName;
    }
    return tagOpenAttributeNameAfter(code2);
  }
  function tagOpenAttributeNameAfter(code2) {
    if (code2 === 61) {
      effects.consume(code2);
      return tagOpenAttributeValueBefore;
    }
    if (markdownLineEnding(code2)) {
      returnState = tagOpenAttributeNameAfter;
      return lineEndingBefore(code2);
    }
    if (markdownSpace(code2)) {
      effects.consume(code2);
      return tagOpenAttributeNameAfter;
    }
    return tagOpenBetween(code2);
  }
  function tagOpenAttributeValueBefore(code2) {
    if (code2 === null || code2 === 60 || code2 === 61 || code2 === 62 || code2 === 96) {
      return nok(code2);
    }
    if (code2 === 34 || code2 === 39) {
      effects.consume(code2);
      marker = code2;
      return tagOpenAttributeValueQuoted;
    }
    if (markdownLineEnding(code2)) {
      returnState = tagOpenAttributeValueBefore;
      return lineEndingBefore(code2);
    }
    if (markdownSpace(code2)) {
      effects.consume(code2);
      return tagOpenAttributeValueBefore;
    }
    effects.consume(code2);
    return tagOpenAttributeValueUnquoted;
  }
  function tagOpenAttributeValueQuoted(code2) {
    if (code2 === marker) {
      effects.consume(code2);
      marker = void 0;
      return tagOpenAttributeValueQuotedAfter;
    }
    if (code2 === null) {
      return nok(code2);
    }
    if (markdownLineEnding(code2)) {
      returnState = tagOpenAttributeValueQuoted;
      return lineEndingBefore(code2);
    }
    effects.consume(code2);
    return tagOpenAttributeValueQuoted;
  }
  function tagOpenAttributeValueUnquoted(code2) {
    if (code2 === null || code2 === 34 || code2 === 39 || code2 === 60 || code2 === 61 || code2 === 96) {
      return nok(code2);
    }
    if (code2 === 47 || code2 === 62 || markdownLineEndingOrSpace(code2)) {
      return tagOpenBetween(code2);
    }
    effects.consume(code2);
    return tagOpenAttributeValueUnquoted;
  }
  function tagOpenAttributeValueQuotedAfter(code2) {
    if (code2 === 47 || code2 === 62 || markdownLineEndingOrSpace(code2)) {
      return tagOpenBetween(code2);
    }
    return nok(code2);
  }
  function end(code2) {
    if (code2 === 62) {
      effects.consume(code2);
      effects.exit("htmlTextData");
      effects.exit("htmlText");
      return ok2;
    }
    return nok(code2);
  }
  function lineEndingBefore(code2) {
    effects.exit("htmlTextData");
    effects.enter("lineEnding");
    effects.consume(code2);
    effects.exit("lineEnding");
    return lineEndingAfter;
  }
  function lineEndingAfter(code2) {
    return markdownSpace(code2) ? factorySpace(effects, lineEndingAfterPrefix, "linePrefix", self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code2) : lineEndingAfterPrefix(code2);
  }
  function lineEndingAfterPrefix(code2) {
    effects.enter("htmlTextData");
    return returnState(code2);
  }
}
const labelEnd = {
  name: "labelEnd",
  resolveAll: resolveAllLabelEnd,
  resolveTo: resolveToLabelEnd,
  tokenize: tokenizeLabelEnd
};
const resourceConstruct = {
  tokenize: tokenizeResource
};
const referenceFullConstruct = {
  tokenize: tokenizeReferenceFull
};
const referenceCollapsedConstruct = {
  tokenize: tokenizeReferenceCollapsed
};
function resolveAllLabelEnd(events) {
  let index2 = -1;
  const newEvents = [];
  while (++index2 < events.length) {
    const token = events[index2][1];
    newEvents.push(events[index2]);
    if (token.type === "labelImage" || token.type === "labelLink" || token.type === "labelEnd") {
      const offset = token.type === "labelImage" ? 4 : 2;
      token.type = "data";
      index2 += offset;
    }
  }
  if (events.length !== newEvents.length) {
    splice(events, 0, events.length, newEvents);
  }
  return events;
}
function resolveToLabelEnd(events, context) {
  let index2 = events.length;
  let offset = 0;
  let token;
  let open;
  let close;
  let media;
  while (index2--) {
    token = events[index2][1];
    if (open) {
      if (token.type === "link" || token.type === "labelLink" && token._inactive) {
        break;
      }
      if (events[index2][0] === "enter" && token.type === "labelLink") {
        token._inactive = true;
      }
    } else if (close) {
      if (events[index2][0] === "enter" && (token.type === "labelImage" || token.type === "labelLink") && !token._balanced) {
        open = index2;
        if (token.type !== "labelLink") {
          offset = 2;
          break;
        }
      }
    } else if (token.type === "labelEnd") {
      close = index2;
    }
  }
  const group = {
    type: events[open][1].type === "labelLink" ? "link" : "image",
    start: {
      ...events[open][1].start
    },
    end: {
      ...events[events.length - 1][1].end
    }
  };
  const label = {
    type: "label",
    start: {
      ...events[open][1].start
    },
    end: {
      ...events[close][1].end
    }
  };
  const text2 = {
    type: "labelText",
    start: {
      ...events[open + offset + 2][1].end
    },
    end: {
      ...events[close - 2][1].start
    }
  };
  media = [["enter", group, context], ["enter", label, context]];
  media = push(media, events.slice(open + 1, open + offset + 3));
  media = push(media, [["enter", text2, context]]);
  media = push(media, resolveAll(context.parser.constructs.insideSpan.null, events.slice(open + offset + 4, close - 3), context));
  media = push(media, [["exit", text2, context], events[close - 2], events[close - 1], ["exit", label, context]]);
  media = push(media, events.slice(close + 1));
  media = push(media, [["exit", group, context]]);
  splice(events, open, events.length, media);
  return events;
}
function tokenizeLabelEnd(effects, ok2, nok) {
  const self2 = this;
  let index2 = self2.events.length;
  let labelStart;
  let defined;
  while (index2--) {
    if ((self2.events[index2][1].type === "labelImage" || self2.events[index2][1].type === "labelLink") && !self2.events[index2][1]._balanced) {
      labelStart = self2.events[index2][1];
      break;
    }
  }
  return start;
  function start(code2) {
    if (!labelStart) {
      return nok(code2);
    }
    if (labelStart._inactive) {
      return labelEndNok(code2);
    }
    defined = self2.parser.defined.includes(normalizeIdentifier(self2.sliceSerialize({
      start: labelStart.end,
      end: self2.now()
    })));
    effects.enter("labelEnd");
    effects.enter("labelMarker");
    effects.consume(code2);
    effects.exit("labelMarker");
    effects.exit("labelEnd");
    return after;
  }
  function after(code2) {
    if (code2 === 40) {
      return effects.attempt(resourceConstruct, labelEndOk, defined ? labelEndOk : labelEndNok)(code2);
    }
    if (code2 === 91) {
      return effects.attempt(referenceFullConstruct, labelEndOk, defined ? referenceNotFull : labelEndNok)(code2);
    }
    return defined ? labelEndOk(code2) : labelEndNok(code2);
  }
  function referenceNotFull(code2) {
    return effects.attempt(referenceCollapsedConstruct, labelEndOk, labelEndNok)(code2);
  }
  function labelEndOk(code2) {
    return ok2(code2);
  }
  function labelEndNok(code2) {
    labelStart._balanced = true;
    return nok(code2);
  }
}
function tokenizeResource(effects, ok2, nok) {
  return resourceStart;
  function resourceStart(code2) {
    effects.enter("resource");
    effects.enter("resourceMarker");
    effects.consume(code2);
    effects.exit("resourceMarker");
    return resourceBefore;
  }
  function resourceBefore(code2) {
    return markdownLineEndingOrSpace(code2) ? factoryWhitespace(effects, resourceOpen)(code2) : resourceOpen(code2);
  }
  function resourceOpen(code2) {
    if (code2 === 41) {
      return resourceEnd(code2);
    }
    return factoryDestination(effects, resourceDestinationAfter, resourceDestinationMissing, "resourceDestination", "resourceDestinationLiteral", "resourceDestinationLiteralMarker", "resourceDestinationRaw", "resourceDestinationString", 32)(code2);
  }
  function resourceDestinationAfter(code2) {
    return markdownLineEndingOrSpace(code2) ? factoryWhitespace(effects, resourceBetween)(code2) : resourceEnd(code2);
  }
  function resourceDestinationMissing(code2) {
    return nok(code2);
  }
  function resourceBetween(code2) {
    if (code2 === 34 || code2 === 39 || code2 === 40) {
      return factoryTitle(effects, resourceTitleAfter, nok, "resourceTitle", "resourceTitleMarker", "resourceTitleString")(code2);
    }
    return resourceEnd(code2);
  }
  function resourceTitleAfter(code2) {
    return markdownLineEndingOrSpace(code2) ? factoryWhitespace(effects, resourceEnd)(code2) : resourceEnd(code2);
  }
  function resourceEnd(code2) {
    if (code2 === 41) {
      effects.enter("resourceMarker");
      effects.consume(code2);
      effects.exit("resourceMarker");
      effects.exit("resource");
      return ok2;
    }
    return nok(code2);
  }
}
function tokenizeReferenceFull(effects, ok2, nok) {
  const self2 = this;
  return referenceFull;
  function referenceFull(code2) {
    return factoryLabel.call(self2, effects, referenceFullAfter, referenceFullMissing, "reference", "referenceMarker", "referenceString")(code2);
  }
  function referenceFullAfter(code2) {
    return self2.parser.defined.includes(normalizeIdentifier(self2.sliceSerialize(self2.events[self2.events.length - 1][1]).slice(1, -1))) ? ok2(code2) : nok(code2);
  }
  function referenceFullMissing(code2) {
    return nok(code2);
  }
}
function tokenizeReferenceCollapsed(effects, ok2, nok) {
  return referenceCollapsedStart;
  function referenceCollapsedStart(code2) {
    effects.enter("reference");
    effects.enter("referenceMarker");
    effects.consume(code2);
    effects.exit("referenceMarker");
    return referenceCollapsedOpen;
  }
  function referenceCollapsedOpen(code2) {
    if (code2 === 93) {
      effects.enter("referenceMarker");
      effects.consume(code2);
      effects.exit("referenceMarker");
      effects.exit("reference");
      return ok2;
    }
    return nok(code2);
  }
}
const labelStartImage = {
  name: "labelStartImage",
  resolveAll: labelEnd.resolveAll,
  tokenize: tokenizeLabelStartImage
};
function tokenizeLabelStartImage(effects, ok2, nok) {
  const self2 = this;
  return start;
  function start(code2) {
    effects.enter("labelImage");
    effects.enter("labelImageMarker");
    effects.consume(code2);
    effects.exit("labelImageMarker");
    return open;
  }
  function open(code2) {
    if (code2 === 91) {
      effects.enter("labelMarker");
      effects.consume(code2);
      effects.exit("labelMarker");
      effects.exit("labelImage");
      return after;
    }
    return nok(code2);
  }
  function after(code2) {
    return code2 === 94 && "_hiddenFootnoteSupport" in self2.parser.constructs ? nok(code2) : ok2(code2);
  }
}
const labelStartLink = {
  name: "labelStartLink",
  resolveAll: labelEnd.resolveAll,
  tokenize: tokenizeLabelStartLink
};
function tokenizeLabelStartLink(effects, ok2, nok) {
  const self2 = this;
  return start;
  function start(code2) {
    effects.enter("labelLink");
    effects.enter("labelMarker");
    effects.consume(code2);
    effects.exit("labelMarker");
    effects.exit("labelLink");
    return after;
  }
  function after(code2) {
    return code2 === 94 && "_hiddenFootnoteSupport" in self2.parser.constructs ? nok(code2) : ok2(code2);
  }
}
const lineEnding = {
  name: "lineEnding",
  tokenize: tokenizeLineEnding
};
function tokenizeLineEnding(effects, ok2) {
  return start;
  function start(code2) {
    effects.enter("lineEnding");
    effects.consume(code2);
    effects.exit("lineEnding");
    return factorySpace(effects, ok2, "linePrefix");
  }
}
const thematicBreak$1 = {
  name: "thematicBreak",
  tokenize: tokenizeThematicBreak
};
function tokenizeThematicBreak(effects, ok2, nok) {
  let size = 0;
  let marker;
  return start;
  function start(code2) {
    effects.enter("thematicBreak");
    return before(code2);
  }
  function before(code2) {
    marker = code2;
    return atBreak(code2);
  }
  function atBreak(code2) {
    if (code2 === marker) {
      effects.enter("thematicBreakSequence");
      return sequence(code2);
    }
    if (size >= 3 && (code2 === null || markdownLineEnding(code2))) {
      effects.exit("thematicBreak");
      return ok2(code2);
    }
    return nok(code2);
  }
  function sequence(code2) {
    if (code2 === marker) {
      effects.consume(code2);
      size++;
      return sequence;
    }
    effects.exit("thematicBreakSequence");
    return markdownSpace(code2) ? factorySpace(effects, atBreak, "whitespace")(code2) : atBreak(code2);
  }
}
const list$1 = {
  continuation: {
    tokenize: tokenizeListContinuation
  },
  exit: tokenizeListEnd,
  name: "list",
  tokenize: tokenizeListStart
};
const listItemPrefixWhitespaceConstruct = {
  partial: true,
  tokenize: tokenizeListItemPrefixWhitespace
};
const indentConstruct = {
  partial: true,
  tokenize: tokenizeIndent
};
function tokenizeListStart(effects, ok2, nok) {
  const self2 = this;
  const tail = self2.events[self2.events.length - 1];
  let initialSize = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
  let size = 0;
  return start;
  function start(code2) {
    const kind = self2.containerState.type || (code2 === 42 || code2 === 43 || code2 === 45 ? "listUnordered" : "listOrdered");
    if (kind === "listUnordered" ? !self2.containerState.marker || code2 === self2.containerState.marker : asciiDigit(code2)) {
      if (!self2.containerState.type) {
        self2.containerState.type = kind;
        effects.enter(kind, {
          _container: true
        });
      }
      if (kind === "listUnordered") {
        effects.enter("listItemPrefix");
        return code2 === 42 || code2 === 45 ? effects.check(thematicBreak$1, nok, atMarker)(code2) : atMarker(code2);
      }
      if (!self2.interrupt || code2 === 49) {
        effects.enter("listItemPrefix");
        effects.enter("listItemValue");
        return inside(code2);
      }
    }
    return nok(code2);
  }
  function inside(code2) {
    if (asciiDigit(code2) && ++size < 10) {
      effects.consume(code2);
      return inside;
    }
    if ((!self2.interrupt || size < 2) && (self2.containerState.marker ? code2 === self2.containerState.marker : code2 === 41 || code2 === 46)) {
      effects.exit("listItemValue");
      return atMarker(code2);
    }
    return nok(code2);
  }
  function atMarker(code2) {
    effects.enter("listItemMarker");
    effects.consume(code2);
    effects.exit("listItemMarker");
    self2.containerState.marker = self2.containerState.marker || code2;
    return effects.check(
      blankLine,
      // Can’t be empty when interrupting.
      self2.interrupt ? nok : onBlank,
      effects.attempt(listItemPrefixWhitespaceConstruct, endOfPrefix, otherPrefix)
    );
  }
  function onBlank(code2) {
    self2.containerState.initialBlankLine = true;
    initialSize++;
    return endOfPrefix(code2);
  }
  function otherPrefix(code2) {
    if (markdownSpace(code2)) {
      effects.enter("listItemPrefixWhitespace");
      effects.consume(code2);
      effects.exit("listItemPrefixWhitespace");
      return endOfPrefix;
    }
    return nok(code2);
  }
  function endOfPrefix(code2) {
    self2.containerState.size = initialSize + self2.sliceSerialize(effects.exit("listItemPrefix"), true).length;
    return ok2(code2);
  }
}
function tokenizeListContinuation(effects, ok2, nok) {
  const self2 = this;
  self2.containerState._closeFlow = void 0;
  return effects.check(blankLine, onBlank, notBlank);
  function onBlank(code2) {
    self2.containerState.furtherBlankLines = self2.containerState.furtherBlankLines || self2.containerState.initialBlankLine;
    return factorySpace(effects, ok2, "listItemIndent", self2.containerState.size + 1)(code2);
  }
  function notBlank(code2) {
    if (self2.containerState.furtherBlankLines || !markdownSpace(code2)) {
      self2.containerState.furtherBlankLines = void 0;
      self2.containerState.initialBlankLine = void 0;
      return notInCurrentItem(code2);
    }
    self2.containerState.furtherBlankLines = void 0;
    self2.containerState.initialBlankLine = void 0;
    return effects.attempt(indentConstruct, ok2, notInCurrentItem)(code2);
  }
  function notInCurrentItem(code2) {
    self2.containerState._closeFlow = true;
    self2.interrupt = void 0;
    return factorySpace(effects, effects.attempt(list$1, ok2, nok), "linePrefix", self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code2);
  }
}
function tokenizeIndent(effects, ok2, nok) {
  const self2 = this;
  return factorySpace(effects, afterPrefix, "listItemIndent", self2.containerState.size + 1);
  function afterPrefix(code2) {
    const tail = self2.events[self2.events.length - 1];
    return tail && tail[1].type === "listItemIndent" && tail[2].sliceSerialize(tail[1], true).length === self2.containerState.size ? ok2(code2) : nok(code2);
  }
}
function tokenizeListEnd(effects) {
  effects.exit(this.containerState.type);
}
function tokenizeListItemPrefixWhitespace(effects, ok2, nok) {
  const self2 = this;
  return factorySpace(effects, afterPrefix, "listItemPrefixWhitespace", self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4 + 1);
  function afterPrefix(code2) {
    const tail = self2.events[self2.events.length - 1];
    return !markdownSpace(code2) && tail && tail[1].type === "listItemPrefixWhitespace" ? ok2(code2) : nok(code2);
  }
}
const setextUnderline = {
  name: "setextUnderline",
  resolveTo: resolveToSetextUnderline,
  tokenize: tokenizeSetextUnderline
};
function resolveToSetextUnderline(events, context) {
  let index2 = events.length;
  let content2;
  let text2;
  let definition2;
  while (index2--) {
    if (events[index2][0] === "enter") {
      if (events[index2][1].type === "content") {
        content2 = index2;
        break;
      }
      if (events[index2][1].type === "paragraph") {
        text2 = index2;
      }
    } else {
      if (events[index2][1].type === "content") {
        events.splice(index2, 1);
      }
      if (!definition2 && events[index2][1].type === "definition") {
        definition2 = index2;
      }
    }
  }
  const heading2 = {
    type: "setextHeading",
    start: {
      ...events[content2][1].start
    },
    end: {
      ...events[events.length - 1][1].end
    }
  };
  events[text2][1].type = "setextHeadingText";
  if (definition2) {
    events.splice(text2, 0, ["enter", heading2, context]);
    events.splice(definition2 + 1, 0, ["exit", events[content2][1], context]);
    events[content2][1].end = {
      ...events[definition2][1].end
    };
  } else {
    events[content2][1] = heading2;
  }
  events.push(["exit", heading2, context]);
  return events;
}
function tokenizeSetextUnderline(effects, ok2, nok) {
  const self2 = this;
  let marker;
  return start;
  function start(code2) {
    let index2 = self2.events.length;
    let paragraph2;
    while (index2--) {
      if (self2.events[index2][1].type !== "lineEnding" && self2.events[index2][1].type !== "linePrefix" && self2.events[index2][1].type !== "content") {
        paragraph2 = self2.events[index2][1].type === "paragraph";
        break;
      }
    }
    if (!self2.parser.lazy[self2.now().line] && (self2.interrupt || paragraph2)) {
      effects.enter("setextHeadingLine");
      marker = code2;
      return before(code2);
    }
    return nok(code2);
  }
  function before(code2) {
    effects.enter("setextHeadingLineSequence");
    return inside(code2);
  }
  function inside(code2) {
    if (code2 === marker) {
      effects.consume(code2);
      return inside;
    }
    effects.exit("setextHeadingLineSequence");
    return markdownSpace(code2) ? factorySpace(effects, after, "lineSuffix")(code2) : after(code2);
  }
  function after(code2) {
    if (code2 === null || markdownLineEnding(code2)) {
      effects.exit("setextHeadingLine");
      return ok2(code2);
    }
    return nok(code2);
  }
}
const flow$1 = {
  tokenize: initializeFlow
};
function initializeFlow(effects) {
  const self2 = this;
  const initial = effects.attempt(
    // Try to parse a blank line.
    blankLine,
    atBlankEnding,
    // Try to parse initial flow (essentially, only code).
    effects.attempt(this.parser.constructs.flowInitial, afterConstruct, factorySpace(effects, effects.attempt(this.parser.constructs.flow, afterConstruct, effects.attempt(content, afterConstruct)), "linePrefix"))
  );
  return initial;
  function atBlankEnding(code2) {
    if (code2 === null) {
      effects.consume(code2);
      return;
    }
    effects.enter("lineEndingBlank");
    effects.consume(code2);
    effects.exit("lineEndingBlank");
    self2.currentConstruct = void 0;
    return initial;
  }
  function afterConstruct(code2) {
    if (code2 === null) {
      effects.consume(code2);
      return;
    }
    effects.enter("lineEnding");
    effects.consume(code2);
    effects.exit("lineEnding");
    self2.currentConstruct = void 0;
    return initial;
  }
}
const resolver = {
  resolveAll: createResolver()
};
const string$1 = initializeFactory("string");
const text$2 = initializeFactory("text");
function initializeFactory(field) {
  return {
    resolveAll: createResolver(field === "text" ? resolveAllLineSuffixes : void 0),
    tokenize: initializeText
  };
  function initializeText(effects) {
    const self2 = this;
    const constructs2 = this.parser.constructs[field];
    const text2 = effects.attempt(constructs2, start, notText);
    return start;
    function start(code2) {
      return atBreak(code2) ? text2(code2) : notText(code2);
    }
    function notText(code2) {
      if (code2 === null) {
        effects.consume(code2);
        return;
      }
      effects.enter("data");
      effects.consume(code2);
      return data;
    }
    function data(code2) {
      if (atBreak(code2)) {
        effects.exit("data");
        return text2(code2);
      }
      effects.consume(code2);
      return data;
    }
    function atBreak(code2) {
      if (code2 === null) {
        return true;
      }
      const list2 = constructs2[code2];
      let index2 = -1;
      if (list2) {
        while (++index2 < list2.length) {
          const item = list2[index2];
          if (!item.previous || item.previous.call(self2, self2.previous)) {
            return true;
          }
        }
      }
      return false;
    }
  }
}
function createResolver(extraResolver) {
  return resolveAllText;
  function resolveAllText(events, context) {
    let index2 = -1;
    let enter;
    while (++index2 <= events.length) {
      if (enter === void 0) {
        if (events[index2] && events[index2][1].type === "data") {
          enter = index2;
          index2++;
        }
      } else if (!events[index2] || events[index2][1].type !== "data") {
        if (index2 !== enter + 2) {
          events[enter][1].end = events[index2 - 1][1].end;
          events.splice(enter + 2, index2 - enter - 2);
          index2 = enter + 2;
        }
        enter = void 0;
      }
    }
    return extraResolver ? extraResolver(events, context) : events;
  }
}
function resolveAllLineSuffixes(events, context) {
  let eventIndex = 0;
  while (++eventIndex <= events.length) {
    if ((eventIndex === events.length || events[eventIndex][1].type === "lineEnding") && events[eventIndex - 1][1].type === "data") {
      const data = events[eventIndex - 1][1];
      const chunks = context.sliceStream(data);
      let index2 = chunks.length;
      let bufferIndex = -1;
      let size = 0;
      let tabs;
      while (index2--) {
        const chunk = chunks[index2];
        if (typeof chunk === "string") {
          bufferIndex = chunk.length;
          while (chunk.charCodeAt(bufferIndex - 1) === 32) {
            size++;
            bufferIndex--;
          }
          if (bufferIndex) break;
          bufferIndex = -1;
        } else if (chunk === -2) {
          tabs = true;
          size++;
        } else if (chunk === -1) ;
        else {
          index2++;
          break;
        }
      }
      if (context._contentTypeTextTrailing && eventIndex === events.length) {
        size = 0;
      }
      if (size) {
        const token = {
          type: eventIndex === events.length || tabs || size < 2 ? "lineSuffix" : "hardBreakTrailing",
          start: {
            _bufferIndex: index2 ? bufferIndex : data.start._bufferIndex + bufferIndex,
            _index: data.start._index + index2,
            line: data.end.line,
            column: data.end.column - size,
            offset: data.end.offset - size
          },
          end: {
            ...data.end
          }
        };
        data.end = {
          ...token.start
        };
        if (data.start.offset === data.end.offset) {
          Object.assign(data, token);
        } else {
          events.splice(eventIndex, 0, ["enter", token, context], ["exit", token, context]);
          eventIndex += 2;
        }
      }
      eventIndex++;
    }
  }
  return events;
}
const document$1 = {
  [42]: list$1,
  [43]: list$1,
  [45]: list$1,
  [48]: list$1,
  [49]: list$1,
  [50]: list$1,
  [51]: list$1,
  [52]: list$1,
  [53]: list$1,
  [54]: list$1,
  [55]: list$1,
  [56]: list$1,
  [57]: list$1,
  [62]: blockQuote
};
const contentInitial = {
  [91]: definition
};
const flowInitial = {
  [-2]: codeIndented,
  [-1]: codeIndented,
  [32]: codeIndented
};
const flow = {
  [35]: headingAtx,
  [42]: thematicBreak$1,
  [45]: [setextUnderline, thematicBreak$1],
  [60]: htmlFlow,
  [61]: setextUnderline,
  [95]: thematicBreak$1,
  [96]: codeFenced,
  [126]: codeFenced
};
const string = {
  [38]: characterReference,
  [92]: characterEscape
};
const text$1 = {
  [-5]: lineEnding,
  [-4]: lineEnding,
  [-3]: lineEnding,
  [33]: labelStartImage,
  [38]: characterReference,
  [42]: attention,
  [60]: [autolink, htmlText],
  [91]: labelStartLink,
  [92]: [hardBreakEscape, characterEscape],
  [93]: labelEnd,
  [95]: attention,
  [96]: codeText
};
const insideSpan = {
  null: [attention, resolver]
};
const attentionMarkers = {
  null: [42, 95]
};
const disable = {
  null: []
};
const defaultConstructs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  attentionMarkers,
  contentInitial,
  disable,
  document: document$1,
  flow,
  flowInitial,
  insideSpan,
  string,
  text: text$1
}, Symbol.toStringTag, { value: "Module" }));
function createTokenizer(parser, initialize, from) {
  let point2 = {
    _bufferIndex: -1,
    _index: 0,
    line: from && from.line || 1,
    column: from && from.column || 1,
    offset: from && from.offset || 0
  };
  const columnStart = {};
  const resolveAllConstructs = [];
  let chunks = [];
  let stack = [];
  const effects = {
    attempt: constructFactory(onsuccessfulconstruct),
    check: constructFactory(onsuccessfulcheck),
    consume,
    enter,
    exit: exit2,
    interrupt: constructFactory(onsuccessfulcheck, {
      interrupt: true
    })
  };
  const context = {
    code: null,
    containerState: {},
    defineSkip,
    events: [],
    now,
    parser,
    previous: null,
    sliceSerialize,
    sliceStream,
    write
  };
  let state = initialize.tokenize.call(context, effects);
  if (initialize.resolveAll) {
    resolveAllConstructs.push(initialize);
  }
  return context;
  function write(slice) {
    chunks = push(chunks, slice);
    main();
    if (chunks[chunks.length - 1] !== null) {
      return [];
    }
    addResult(initialize, 0);
    context.events = resolveAll(resolveAllConstructs, context.events, context);
    return context.events;
  }
  function sliceSerialize(token, expandTabs) {
    return serializeChunks(sliceStream(token), expandTabs);
  }
  function sliceStream(token) {
    return sliceChunks(chunks, token);
  }
  function now() {
    const {
      _bufferIndex,
      _index,
      line,
      column,
      offset
    } = point2;
    return {
      _bufferIndex,
      _index,
      line,
      column,
      offset
    };
  }
  function defineSkip(value) {
    columnStart[value.line] = value.column;
    accountForPotentialSkip();
  }
  function main() {
    let chunkIndex;
    while (point2._index < chunks.length) {
      const chunk = chunks[point2._index];
      if (typeof chunk === "string") {
        chunkIndex = point2._index;
        if (point2._bufferIndex < 0) {
          point2._bufferIndex = 0;
        }
        while (point2._index === chunkIndex && point2._bufferIndex < chunk.length) {
          go(chunk.charCodeAt(point2._bufferIndex));
        }
      } else {
        go(chunk);
      }
    }
  }
  function go(code2) {
    state = state(code2);
  }
  function consume(code2) {
    if (markdownLineEnding(code2)) {
      point2.line++;
      point2.column = 1;
      point2.offset += code2 === -3 ? 2 : 1;
      accountForPotentialSkip();
    } else if (code2 !== -1) {
      point2.column++;
      point2.offset++;
    }
    if (point2._bufferIndex < 0) {
      point2._index++;
    } else {
      point2._bufferIndex++;
      if (point2._bufferIndex === // Points w/ non-negative `_bufferIndex` reference
      // strings.
      /** @type {string} */
      chunks[point2._index].length) {
        point2._bufferIndex = -1;
        point2._index++;
      }
    }
    context.previous = code2;
  }
  function enter(type, fields) {
    const token = fields || {};
    token.type = type;
    token.start = now();
    context.events.push(["enter", token, context]);
    stack.push(token);
    return token;
  }
  function exit2(type) {
    const token = stack.pop();
    token.end = now();
    context.events.push(["exit", token, context]);
    return token;
  }
  function onsuccessfulconstruct(construct, info) {
    addResult(construct, info.from);
  }
  function onsuccessfulcheck(_, info) {
    info.restore();
  }
  function constructFactory(onreturn, fields) {
    return hook;
    function hook(constructs2, returnState, bogusState) {
      let listOfConstructs;
      let constructIndex;
      let currentConstruct;
      let info;
      return Array.isArray(constructs2) ? (
        /* c8 ignore next 1 */
        handleListOfConstructs(constructs2)
      ) : "tokenize" in constructs2 ? (
        // Looks like a construct.
        handleListOfConstructs([
          /** @type {Construct} */
          constructs2
        ])
      ) : handleMapOfConstructs(constructs2);
      function handleMapOfConstructs(map) {
        return start;
        function start(code2) {
          const left = code2 !== null && map[code2];
          const all2 = code2 !== null && map.null;
          const list2 = [
            // To do: add more extension tests.
            /* c8 ignore next 2 */
            ...Array.isArray(left) ? left : left ? [left] : [],
            ...Array.isArray(all2) ? all2 : all2 ? [all2] : []
          ];
          return handleListOfConstructs(list2)(code2);
        }
      }
      function handleListOfConstructs(list2) {
        listOfConstructs = list2;
        constructIndex = 0;
        if (list2.length === 0) {
          return bogusState;
        }
        return handleConstruct(list2[constructIndex]);
      }
      function handleConstruct(construct) {
        return start;
        function start(code2) {
          info = store();
          currentConstruct = construct;
          if (!construct.partial) {
            context.currentConstruct = construct;
          }
          if (construct.name && context.parser.constructs.disable.null.includes(construct.name)) {
            return nok();
          }
          return construct.tokenize.call(
            // If we do have fields, create an object w/ `context` as its
            // prototype.
            // This allows a “live binding”, which is needed for `interrupt`.
            fields ? Object.assign(Object.create(context), fields) : context,
            effects,
            ok2,
            nok
          )(code2);
        }
      }
      function ok2(code2) {
        onreturn(currentConstruct, info);
        return returnState;
      }
      function nok(code2) {
        info.restore();
        if (++constructIndex < listOfConstructs.length) {
          return handleConstruct(listOfConstructs[constructIndex]);
        }
        return bogusState;
      }
    }
  }
  function addResult(construct, from2) {
    if (construct.resolveAll && !resolveAllConstructs.includes(construct)) {
      resolveAllConstructs.push(construct);
    }
    if (construct.resolve) {
      splice(context.events, from2, context.events.length - from2, construct.resolve(context.events.slice(from2), context));
    }
    if (construct.resolveTo) {
      context.events = construct.resolveTo(context.events, context);
    }
  }
  function store() {
    const startPoint = now();
    const startPrevious = context.previous;
    const startCurrentConstruct = context.currentConstruct;
    const startEventsIndex = context.events.length;
    const startStack = Array.from(stack);
    return {
      from: startEventsIndex,
      restore
    };
    function restore() {
      point2 = startPoint;
      context.previous = startPrevious;
      context.currentConstruct = startCurrentConstruct;
      context.events.length = startEventsIndex;
      stack = startStack;
      accountForPotentialSkip();
    }
  }
  function accountForPotentialSkip() {
    if (point2.line in columnStart && point2.column < 2) {
      point2.column = columnStart[point2.line];
      point2.offset += columnStart[point2.line] - 1;
    }
  }
}
function sliceChunks(chunks, token) {
  const startIndex = token.start._index;
  const startBufferIndex = token.start._bufferIndex;
  const endIndex = token.end._index;
  const endBufferIndex = token.end._bufferIndex;
  let view;
  if (startIndex === endIndex) {
    view = [chunks[startIndex].slice(startBufferIndex, endBufferIndex)];
  } else {
    view = chunks.slice(startIndex, endIndex);
    if (startBufferIndex > -1) {
      const head = view[0];
      if (typeof head === "string") {
        view[0] = head.slice(startBufferIndex);
      } else {
        view.shift();
      }
    }
    if (endBufferIndex > 0) {
      view.push(chunks[endIndex].slice(0, endBufferIndex));
    }
  }
  return view;
}
function serializeChunks(chunks, expandTabs) {
  let index2 = -1;
  const result = [];
  let atTab;
  while (++index2 < chunks.length) {
    const chunk = chunks[index2];
    let value;
    if (typeof chunk === "string") {
      value = chunk;
    } else switch (chunk) {
      case -5: {
        value = "\r";
        break;
      }
      case -4: {
        value = "\n";
        break;
      }
      case -3: {
        value = "\r\n";
        break;
      }
      case -2: {
        value = expandTabs ? " " : "	";
        break;
      }
      case -1: {
        if (!expandTabs && atTab) continue;
        value = " ";
        break;
      }
      default: {
        value = String.fromCharCode(chunk);
      }
    }
    atTab = chunk === -2;
    result.push(value);
  }
  return result.join("");
}
function parse(options) {
  const settings = options || {};
  const constructs2 = (
    /** @type {FullNormalizedExtension} */
    combineExtensions([defaultConstructs, ...settings.extensions || []])
  );
  const parser = {
    constructs: constructs2,
    content: create2(content$1),
    defined: [],
    document: create2(document$2),
    flow: create2(flow$1),
    lazy: {},
    string: create2(string$1),
    text: create2(text$2)
  };
  return parser;
  function create2(initial) {
    return creator;
    function creator(from) {
      return createTokenizer(parser, initial, from);
    }
  }
}
function postprocess(events) {
  while (!subtokenize(events)) {
  }
  return events;
}
const search = /[\0\t\n\r]/g;
function preprocess() {
  let column = 1;
  let buffer = "";
  let start = true;
  let atCarriageReturn;
  return preprocessor;
  function preprocessor(value, encoding, end) {
    const chunks = [];
    let match;
    let next;
    let startPosition;
    let endPosition;
    let code2;
    value = buffer + (typeof value === "string" ? value.toString() : new TextDecoder(encoding || void 0).decode(value));
    startPosition = 0;
    buffer = "";
    if (start) {
      if (value.charCodeAt(0) === 65279) {
        startPosition++;
      }
      start = void 0;
    }
    while (startPosition < value.length) {
      search.lastIndex = startPosition;
      match = search.exec(value);
      endPosition = match && match.index !== void 0 ? match.index : value.length;
      code2 = value.charCodeAt(endPosition);
      if (!match) {
        buffer = value.slice(startPosition);
        break;
      }
      if (code2 === 10 && startPosition === endPosition && atCarriageReturn) {
        chunks.push(-3);
        atCarriageReturn = void 0;
      } else {
        if (atCarriageReturn) {
          chunks.push(-5);
          atCarriageReturn = void 0;
        }
        if (startPosition < endPosition) {
          chunks.push(value.slice(startPosition, endPosition));
          column += endPosition - startPosition;
        }
        switch (code2) {
          case 0: {
            chunks.push(65533);
            column++;
            break;
          }
          case 9: {
            next = Math.ceil(column / 4) * 4;
            chunks.push(-2);
            while (column++ < next) chunks.push(-1);
            break;
          }
          case 10: {
            chunks.push(-4);
            column = 1;
            break;
          }
          default: {
            atCarriageReturn = true;
            column = 1;
          }
        }
      }
      startPosition = endPosition + 1;
    }
    if (end) {
      if (atCarriageReturn) chunks.push(-5);
      if (buffer) chunks.push(buffer);
      chunks.push(null);
    }
    return chunks;
  }
}
const characterEscapeOrReference = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
function decodeString(value) {
  return value.replace(characterEscapeOrReference, decode);
}
function decode($0, $1, $2) {
  if ($1) {
    return $1;
  }
  const head = $2.charCodeAt(0);
  if (head === 35) {
    const head2 = $2.charCodeAt(1);
    const hex = head2 === 120 || head2 === 88;
    return decodeNumericCharacterReference($2.slice(hex ? 2 : 1), hex ? 16 : 10);
  }
  return decodeNamedCharacterReference($2) || $0;
}
const own$2 = {}.hasOwnProperty;
function fromMarkdown(value, encoding, options) {
  if (typeof encoding !== "string") {
    options = encoding;
    encoding = void 0;
  }
  return compiler(options)(postprocess(parse(options).document().write(preprocess()(value, encoding, true))));
}
function compiler(options) {
  const config = {
    transforms: [],
    canContainEols: ["emphasis", "fragment", "heading", "paragraph", "strong"],
    enter: {
      autolink: opener(link2),
      autolinkProtocol: onenterdata,
      autolinkEmail: onenterdata,
      atxHeading: opener(heading2),
      blockQuote: opener(blockQuote2),
      characterEscape: onenterdata,
      characterReference: onenterdata,
      codeFenced: opener(codeFlow),
      codeFencedFenceInfo: buffer,
      codeFencedFenceMeta: buffer,
      codeIndented: opener(codeFlow, buffer),
      codeText: opener(codeText2, buffer),
      codeTextData: onenterdata,
      data: onenterdata,
      codeFlowValue: onenterdata,
      definition: opener(definition2),
      definitionDestinationString: buffer,
      definitionLabelString: buffer,
      definitionTitleString: buffer,
      emphasis: opener(emphasis2),
      hardBreakEscape: opener(hardBreak2),
      hardBreakTrailing: opener(hardBreak2),
      htmlFlow: opener(html2, buffer),
      htmlFlowData: onenterdata,
      htmlText: opener(html2, buffer),
      htmlTextData: onenterdata,
      image: opener(image2),
      label: buffer,
      link: opener(link2),
      listItem: opener(listItem2),
      listItemValue: onenterlistitemvalue,
      listOrdered: opener(list2, onenterlistordered),
      listUnordered: opener(list2),
      paragraph: opener(paragraph2),
      reference: onenterreference,
      referenceString: buffer,
      resourceDestinationString: buffer,
      resourceTitleString: buffer,
      setextHeading: opener(heading2),
      strong: opener(strong2),
      thematicBreak: opener(thematicBreak2)
    },
    exit: {
      atxHeading: closer(),
      atxHeadingSequence: onexitatxheadingsequence,
      autolink: closer(),
      autolinkEmail: onexitautolinkemail,
      autolinkProtocol: onexitautolinkprotocol,
      blockQuote: closer(),
      characterEscapeValue: onexitdata,
      characterReferenceMarkerHexadecimal: onexitcharacterreferencemarker,
      characterReferenceMarkerNumeric: onexitcharacterreferencemarker,
      characterReferenceValue: onexitcharacterreferencevalue,
      characterReference: onexitcharacterreference,
      codeFenced: closer(onexitcodefenced),
      codeFencedFence: onexitcodefencedfence,
      codeFencedFenceInfo: onexitcodefencedfenceinfo,
      codeFencedFenceMeta: onexitcodefencedfencemeta,
      codeFlowValue: onexitdata,
      codeIndented: closer(onexitcodeindented),
      codeText: closer(onexitcodetext),
      codeTextData: onexitdata,
      data: onexitdata,
      definition: closer(),
      definitionDestinationString: onexitdefinitiondestinationstring,
      definitionLabelString: onexitdefinitionlabelstring,
      definitionTitleString: onexitdefinitiontitlestring,
      emphasis: closer(),
      hardBreakEscape: closer(onexithardbreak),
      hardBreakTrailing: closer(onexithardbreak),
      htmlFlow: closer(onexithtmlflow),
      htmlFlowData: onexitdata,
      htmlText: closer(onexithtmltext),
      htmlTextData: onexitdata,
      image: closer(onexitimage),
      label: onexitlabel,
      labelText: onexitlabeltext,
      lineEnding: onexitlineending,
      link: closer(onexitlink),
      listItem: closer(),
      listOrdered: closer(),
      listUnordered: closer(),
      paragraph: closer(),
      referenceString: onexitreferencestring,
      resourceDestinationString: onexitresourcedestinationstring,
      resourceTitleString: onexitresourcetitlestring,
      resource: onexitresource,
      setextHeading: closer(onexitsetextheading),
      setextHeadingLineSequence: onexitsetextheadinglinesequence,
      setextHeadingText: onexitsetextheadingtext,
      strong: closer(),
      thematicBreak: closer()
    }
  };
  configure(config, (options || {}).mdastExtensions || []);
  const data = {};
  return compile;
  function compile(events) {
    let tree = {
      type: "root",
      children: []
    };
    const context = {
      stack: [tree],
      tokenStack: [],
      config,
      enter,
      exit: exit2,
      buffer,
      resume,
      data
    };
    const listStack = [];
    let index2 = -1;
    while (++index2 < events.length) {
      if (events[index2][1].type === "listOrdered" || events[index2][1].type === "listUnordered") {
        if (events[index2][0] === "enter") {
          listStack.push(index2);
        } else {
          const tail = listStack.pop();
          index2 = prepareList(events, tail, index2);
        }
      }
    }
    index2 = -1;
    while (++index2 < events.length) {
      const handler = config[events[index2][0]];
      if (own$2.call(handler, events[index2][1].type)) {
        handler[events[index2][1].type].call(Object.assign({
          sliceSerialize: events[index2][2].sliceSerialize
        }, context), events[index2][1]);
      }
    }
    if (context.tokenStack.length > 0) {
      const tail = context.tokenStack[context.tokenStack.length - 1];
      const handler = tail[1] || defaultOnError;
      handler.call(context, void 0, tail[0]);
    }
    tree.position = {
      start: point(events.length > 0 ? events[0][1].start : {
        line: 1,
        column: 1,
        offset: 0
      }),
      end: point(events.length > 0 ? events[events.length - 2][1].end : {
        line: 1,
        column: 1,
        offset: 0
      })
    };
    index2 = -1;
    while (++index2 < config.transforms.length) {
      tree = config.transforms[index2](tree) || tree;
    }
    return tree;
  }
  function prepareList(events, start, length) {
    let index2 = start - 1;
    let containerBalance = -1;
    let listSpread = false;
    let listItem3;
    let lineIndex;
    let firstBlankLineIndex;
    let atMarker;
    while (++index2 <= length) {
      const event = events[index2];
      switch (event[1].type) {
        case "listUnordered":
        case "listOrdered":
        case "blockQuote": {
          if (event[0] === "enter") {
            containerBalance++;
          } else {
            containerBalance--;
          }
          atMarker = void 0;
          break;
        }
        case "lineEndingBlank": {
          if (event[0] === "enter") {
            if (listItem3 && !atMarker && !containerBalance && !firstBlankLineIndex) {
              firstBlankLineIndex = index2;
            }
            atMarker = void 0;
          }
          break;
        }
        case "linePrefix":
        case "listItemValue":
        case "listItemMarker":
        case "listItemPrefix":
        case "listItemPrefixWhitespace": {
          break;
        }
        default: {
          atMarker = void 0;
        }
      }
      if (!containerBalance && event[0] === "enter" && event[1].type === "listItemPrefix" || containerBalance === -1 && event[0] === "exit" && (event[1].type === "listUnordered" || event[1].type === "listOrdered")) {
        if (listItem3) {
          let tailIndex = index2;
          lineIndex = void 0;
          while (tailIndex--) {
            const tailEvent = events[tailIndex];
            if (tailEvent[1].type === "lineEnding" || tailEvent[1].type === "lineEndingBlank") {
              if (tailEvent[0] === "exit") continue;
              if (lineIndex) {
                events[lineIndex][1].type = "lineEndingBlank";
                listSpread = true;
              }
              tailEvent[1].type = "lineEnding";
              lineIndex = tailIndex;
            } else if (tailEvent[1].type === "linePrefix" || tailEvent[1].type === "blockQuotePrefix" || tailEvent[1].type === "blockQuotePrefixWhitespace" || tailEvent[1].type === "blockQuoteMarker" || tailEvent[1].type === "listItemIndent") ;
            else {
              break;
            }
          }
          if (firstBlankLineIndex && (!lineIndex || firstBlankLineIndex < lineIndex)) {
            listItem3._spread = true;
          }
          listItem3.end = Object.assign({}, lineIndex ? events[lineIndex][1].start : event[1].end);
          events.splice(lineIndex || index2, 0, ["exit", listItem3, event[2]]);
          index2++;
          length++;
        }
        if (event[1].type === "listItemPrefix") {
          const item = {
            type: "listItem",
            _spread: false,
            start: Object.assign({}, event[1].start),
            // @ts-expect-error: we’ll add `end` in a second.
            end: void 0
          };
          listItem3 = item;
          events.splice(index2, 0, ["enter", item, event[2]]);
          index2++;
          length++;
          firstBlankLineIndex = void 0;
          atMarker = true;
        }
      }
    }
    events[start][1]._spread = listSpread;
    return length;
  }
  function opener(create2, and) {
    return open;
    function open(token) {
      enter.call(this, create2(token), token);
      if (and) and.call(this, token);
    }
  }
  function buffer() {
    this.stack.push({
      type: "fragment",
      children: []
    });
  }
  function enter(node2, token, errorHandler) {
    const parent = this.stack[this.stack.length - 1];
    const siblings = parent.children;
    siblings.push(node2);
    this.stack.push(node2);
    this.tokenStack.push([token, errorHandler || void 0]);
    node2.position = {
      start: point(token.start),
      // @ts-expect-error: `end` will be patched later.
      end: void 0
    };
  }
  function closer(and) {
    return close;
    function close(token) {
      if (and) and.call(this, token);
      exit2.call(this, token);
    }
  }
  function exit2(token, onExitError) {
    const node2 = this.stack.pop();
    const open = this.tokenStack.pop();
    if (!open) {
      throw new Error("Cannot close `" + token.type + "` (" + stringifyPosition({
        start: token.start,
        end: token.end
      }) + "): it’s not open");
    } else if (open[0].type !== token.type) {
      if (onExitError) {
        onExitError.call(this, token, open[0]);
      } else {
        const handler = open[1] || defaultOnError;
        handler.call(this, token, open[0]);
      }
    }
    node2.position.end = point(token.end);
  }
  function resume() {
    return toString$1(this.stack.pop());
  }
  function onenterlistordered() {
    this.data.expectingFirstListItemValue = true;
  }
  function onenterlistitemvalue(token) {
    if (this.data.expectingFirstListItemValue) {
      const ancestor = this.stack[this.stack.length - 2];
      ancestor.start = Number.parseInt(this.sliceSerialize(token), 10);
      this.data.expectingFirstListItemValue = void 0;
    }
  }
  function onexitcodefencedfenceinfo() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.lang = data2;
  }
  function onexitcodefencedfencemeta() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.meta = data2;
  }
  function onexitcodefencedfence() {
    if (this.data.flowCodeInside) return;
    this.buffer();
    this.data.flowCodeInside = true;
  }
  function onexitcodefenced() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.value = data2.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, "");
    this.data.flowCodeInside = void 0;
  }
  function onexitcodeindented() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.value = data2.replace(/(\r?\n|\r)$/g, "");
  }
  function onexitdefinitionlabelstring(token) {
    const label = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.label = label;
    node2.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
  }
  function onexitdefinitiontitlestring() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.title = data2;
  }
  function onexitdefinitiondestinationstring() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.url = data2;
  }
  function onexitatxheadingsequence(token) {
    const node2 = this.stack[this.stack.length - 1];
    if (!node2.depth) {
      const depth = this.sliceSerialize(token).length;
      node2.depth = depth;
    }
  }
  function onexitsetextheadingtext() {
    this.data.setextHeadingSlurpLineEnding = true;
  }
  function onexitsetextheadinglinesequence(token) {
    const node2 = this.stack[this.stack.length - 1];
    node2.depth = this.sliceSerialize(token).codePointAt(0) === 61 ? 1 : 2;
  }
  function onexitsetextheading() {
    this.data.setextHeadingSlurpLineEnding = void 0;
  }
  function onenterdata(token) {
    const node2 = this.stack[this.stack.length - 1];
    const siblings = node2.children;
    let tail = siblings[siblings.length - 1];
    if (!tail || tail.type !== "text") {
      tail = text2();
      tail.position = {
        start: point(token.start),
        // @ts-expect-error: we’ll add `end` later.
        end: void 0
      };
      siblings.push(tail);
    }
    this.stack.push(tail);
  }
  function onexitdata(token) {
    const tail = this.stack.pop();
    tail.value += this.sliceSerialize(token);
    tail.position.end = point(token.end);
  }
  function onexitlineending(token) {
    const context = this.stack[this.stack.length - 1];
    if (this.data.atHardBreak) {
      const tail = context.children[context.children.length - 1];
      tail.position.end = point(token.end);
      this.data.atHardBreak = void 0;
      return;
    }
    if (!this.data.setextHeadingSlurpLineEnding && config.canContainEols.includes(context.type)) {
      onenterdata.call(this, token);
      onexitdata.call(this, token);
    }
  }
  function onexithardbreak() {
    this.data.atHardBreak = true;
  }
  function onexithtmlflow() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.value = data2;
  }
  function onexithtmltext() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.value = data2;
  }
  function onexitcodetext() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.value = data2;
  }
  function onexitlink() {
    const node2 = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      const referenceType = this.data.referenceType || "shortcut";
      node2.type += "Reference";
      node2.referenceType = referenceType;
      delete node2.url;
      delete node2.title;
    } else {
      delete node2.identifier;
      delete node2.label;
    }
    this.data.referenceType = void 0;
  }
  function onexitimage() {
    const node2 = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      const referenceType = this.data.referenceType || "shortcut";
      node2.type += "Reference";
      node2.referenceType = referenceType;
      delete node2.url;
      delete node2.title;
    } else {
      delete node2.identifier;
      delete node2.label;
    }
    this.data.referenceType = void 0;
  }
  function onexitlabeltext(token) {
    const string2 = this.sliceSerialize(token);
    const ancestor = this.stack[this.stack.length - 2];
    ancestor.label = decodeString(string2);
    ancestor.identifier = normalizeIdentifier(string2).toLowerCase();
  }
  function onexitlabel() {
    const fragment = this.stack[this.stack.length - 1];
    const value = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    this.data.inReference = true;
    if (node2.type === "link") {
      const children = fragment.children;
      node2.children = children;
    } else {
      node2.alt = value;
    }
  }
  function onexitresourcedestinationstring() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.url = data2;
  }
  function onexitresourcetitlestring() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.title = data2;
  }
  function onexitresource() {
    this.data.inReference = void 0;
  }
  function onenterreference() {
    this.data.referenceType = "collapsed";
  }
  function onexitreferencestring(token) {
    const label = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.label = label;
    node2.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
    this.data.referenceType = "full";
  }
  function onexitcharacterreferencemarker(token) {
    this.data.characterReferenceType = token.type;
  }
  function onexitcharacterreferencevalue(token) {
    const data2 = this.sliceSerialize(token);
    const type = this.data.characterReferenceType;
    let value;
    if (type) {
      value = decodeNumericCharacterReference(data2, type === "characterReferenceMarkerNumeric" ? 10 : 16);
      this.data.characterReferenceType = void 0;
    } else {
      const result = decodeNamedCharacterReference(data2);
      value = result;
    }
    const tail = this.stack[this.stack.length - 1];
    tail.value += value;
  }
  function onexitcharacterreference(token) {
    const tail = this.stack.pop();
    tail.position.end = point(token.end);
  }
  function onexitautolinkprotocol(token) {
    onexitdata.call(this, token);
    const node2 = this.stack[this.stack.length - 1];
    node2.url = this.sliceSerialize(token);
  }
  function onexitautolinkemail(token) {
    onexitdata.call(this, token);
    const node2 = this.stack[this.stack.length - 1];
    node2.url = "mailto:" + this.sliceSerialize(token);
  }
  function blockQuote2() {
    return {
      type: "blockquote",
      children: []
    };
  }
  function codeFlow() {
    return {
      type: "code",
      lang: null,
      meta: null,
      value: ""
    };
  }
  function codeText2() {
    return {
      type: "inlineCode",
      value: ""
    };
  }
  function definition2() {
    return {
      type: "definition",
      identifier: "",
      label: null,
      title: null,
      url: ""
    };
  }
  function emphasis2() {
    return {
      type: "emphasis",
      children: []
    };
  }
  function heading2() {
    return {
      type: "heading",
      // @ts-expect-error `depth` will be set later.
      depth: 0,
      children: []
    };
  }
  function hardBreak2() {
    return {
      type: "break"
    };
  }
  function html2() {
    return {
      type: "html",
      value: ""
    };
  }
  function image2() {
    return {
      type: "image",
      title: null,
      url: "",
      alt: null
    };
  }
  function link2() {
    return {
      type: "link",
      title: null,
      url: "",
      children: []
    };
  }
  function list2(token) {
    return {
      type: "list",
      ordered: token.type === "listOrdered",
      start: null,
      spread: token._spread,
      children: []
    };
  }
  function listItem2(token) {
    return {
      type: "listItem",
      spread: token._spread,
      checked: null,
      children: []
    };
  }
  function paragraph2() {
    return {
      type: "paragraph",
      children: []
    };
  }
  function strong2() {
    return {
      type: "strong",
      children: []
    };
  }
  function text2() {
    return {
      type: "text",
      value: ""
    };
  }
  function thematicBreak2() {
    return {
      type: "thematicBreak"
    };
  }
}
function point(d) {
  return {
    line: d.line,
    column: d.column,
    offset: d.offset
  };
}
function configure(combined, extensions) {
  let index2 = -1;
  while (++index2 < extensions.length) {
    const value = extensions[index2];
    if (Array.isArray(value)) {
      configure(combined, value);
    } else {
      extension(combined, value);
    }
  }
}
function extension(combined, extension2) {
  let key;
  for (key in extension2) {
    if (own$2.call(extension2, key)) {
      switch (key) {
        case "canContainEols": {
          const right = extension2[key];
          if (right) {
            combined[key].push(...right);
          }
          break;
        }
        case "transforms": {
          const right = extension2[key];
          if (right) {
            combined[key].push(...right);
          }
          break;
        }
        case "enter":
        case "exit": {
          const right = extension2[key];
          if (right) {
            Object.assign(combined[key], right);
          }
          break;
        }
      }
    }
  }
}
function defaultOnError(left, right) {
  if (left) {
    throw new Error("Cannot close `" + left.type + "` (" + stringifyPosition({
      start: left.start,
      end: left.end
    }) + "): a different token (`" + right.type + "`, " + stringifyPosition({
      start: right.start,
      end: right.end
    }) + ") is open");
  } else {
    throw new Error("Cannot close document, a token (`" + right.type + "`, " + stringifyPosition({
      start: right.start,
      end: right.end
    }) + ") is still open");
  }
}
function remarkParse(options) {
  const self2 = this;
  self2.parser = parser;
  function parser(doc) {
    return fromMarkdown(doc, {
      ...self2.data("settings"),
      ...options,
      // Note: these options are not in the readme.
      // The goal is for them to be set by plugins on `data` instead of being
      // passed by users.
      extensions: self2.data("micromarkExtensions") || [],
      mdastExtensions: self2.data("fromMarkdownExtensions") || []
    });
  }
}
function blockquote(state, node2) {
  const result = {
    type: "element",
    tagName: "blockquote",
    properties: {},
    children: state.wrap(state.all(node2), true)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
function hardBreak(state, node2) {
  const result = { type: "element", tagName: "br", properties: {}, children: [] };
  state.patch(node2, result);
  return [state.applyData(node2, result), { type: "text", value: "\n" }];
}
function code(state, node2) {
  const value = node2.value ? node2.value + "\n" : "";
  const properties = {};
  const language = node2.lang ? node2.lang.split(/\s+/) : [];
  if (language.length > 0) {
    properties.className = ["language-" + language[0]];
  }
  let result = {
    type: "element",
    tagName: "code",
    properties,
    children: [{ type: "text", value }]
  };
  if (node2.meta) {
    result.data = { meta: node2.meta };
  }
  state.patch(node2, result);
  result = state.applyData(node2, result);
  result = { type: "element", tagName: "pre", properties: {}, children: [result] };
  state.patch(node2, result);
  return result;
}
function strikethrough(state, node2) {
  const result = {
    type: "element",
    tagName: "del",
    properties: {},
    children: state.all(node2)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
function emphasis(state, node2) {
  const result = {
    type: "element",
    tagName: "em",
    properties: {},
    children: state.all(node2)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
function footnoteReference(state, node2) {
  const clobberPrefix = typeof state.options.clobberPrefix === "string" ? state.options.clobberPrefix : "user-content-";
  const id = String(node2.identifier).toUpperCase();
  const safeId = normalizeUri(id.toLowerCase());
  const index2 = state.footnoteOrder.indexOf(id);
  let counter;
  let reuseCounter = state.footnoteCounts.get(id);
  if (reuseCounter === void 0) {
    reuseCounter = 0;
    state.footnoteOrder.push(id);
    counter = state.footnoteOrder.length;
  } else {
    counter = index2 + 1;
  }
  reuseCounter += 1;
  state.footnoteCounts.set(id, reuseCounter);
  const link2 = {
    type: "element",
    tagName: "a",
    properties: {
      href: "#" + clobberPrefix + "fn-" + safeId,
      id: clobberPrefix + "fnref-" + safeId + (reuseCounter > 1 ? "-" + reuseCounter : ""),
      dataFootnoteRef: true,
      ariaDescribedBy: ["footnote-label"]
    },
    children: [{ type: "text", value: String(counter) }]
  };
  state.patch(node2, link2);
  const sup = {
    type: "element",
    tagName: "sup",
    properties: {},
    children: [link2]
  };
  state.patch(node2, sup);
  return state.applyData(node2, sup);
}
function heading(state, node2) {
  const result = {
    type: "element",
    tagName: "h" + node2.depth,
    properties: {},
    children: state.all(node2)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
function html(state, node2) {
  if (state.options.allowDangerousHtml) {
    const result = { type: "raw", value: node2.value };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  return void 0;
}
function revert(state, node2) {
  const subtype = node2.referenceType;
  let suffix = "]";
  if (subtype === "collapsed") {
    suffix += "[]";
  } else if (subtype === "full") {
    suffix += "[" + (node2.label || node2.identifier) + "]";
  }
  if (node2.type === "imageReference") {
    return [{ type: "text", value: "![" + node2.alt + suffix }];
  }
  const contents = state.all(node2);
  const head = contents[0];
  if (head && head.type === "text") {
    head.value = "[" + head.value;
  } else {
    contents.unshift({ type: "text", value: "[" });
  }
  const tail = contents[contents.length - 1];
  if (tail && tail.type === "text") {
    tail.value += suffix;
  } else {
    contents.push({ type: "text", value: suffix });
  }
  return contents;
}
function imageReference(state, node2) {
  const id = String(node2.identifier).toUpperCase();
  const definition2 = state.definitionById.get(id);
  if (!definition2) {
    return revert(state, node2);
  }
  const properties = { src: normalizeUri(definition2.url || ""), alt: node2.alt };
  if (definition2.title !== null && definition2.title !== void 0) {
    properties.title = definition2.title;
  }
  const result = { type: "element", tagName: "img", properties, children: [] };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
function image(state, node2) {
  const properties = { src: normalizeUri(node2.url) };
  if (node2.alt !== null && node2.alt !== void 0) {
    properties.alt = node2.alt;
  }
  if (node2.title !== null && node2.title !== void 0) {
    properties.title = node2.title;
  }
  const result = { type: "element", tagName: "img", properties, children: [] };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
function inlineCode(state, node2) {
  const text2 = { type: "text", value: node2.value.replace(/\r?\n|\r/g, " ") };
  state.patch(node2, text2);
  const result = {
    type: "element",
    tagName: "code",
    properties: {},
    children: [text2]
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
function linkReference(state, node2) {
  const id = String(node2.identifier).toUpperCase();
  const definition2 = state.definitionById.get(id);
  if (!definition2) {
    return revert(state, node2);
  }
  const properties = { href: normalizeUri(definition2.url || "") };
  if (definition2.title !== null && definition2.title !== void 0) {
    properties.title = definition2.title;
  }
  const result = {
    type: "element",
    tagName: "a",
    properties,
    children: state.all(node2)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
function link(state, node2) {
  const properties = { href: normalizeUri(node2.url) };
  if (node2.title !== null && node2.title !== void 0) {
    properties.title = node2.title;
  }
  const result = {
    type: "element",
    tagName: "a",
    properties,
    children: state.all(node2)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
function listItem(state, node2, parent) {
  const results = state.all(node2);
  const loose = parent ? listLoose(parent) : listItemLoose(node2);
  const properties = {};
  const children = [];
  if (typeof node2.checked === "boolean") {
    const head = results[0];
    let paragraph2;
    if (head && head.type === "element" && head.tagName === "p") {
      paragraph2 = head;
    } else {
      paragraph2 = { type: "element", tagName: "p", properties: {}, children: [] };
      results.unshift(paragraph2);
    }
    if (paragraph2.children.length > 0) {
      paragraph2.children.unshift({ type: "text", value: " " });
    }
    paragraph2.children.unshift({
      type: "element",
      tagName: "input",
      properties: { type: "checkbox", checked: node2.checked, disabled: true },
      children: []
    });
    properties.className = ["task-list-item"];
  }
  let index2 = -1;
  while (++index2 < results.length) {
    const child = results[index2];
    if (loose || index2 !== 0 || child.type !== "element" || child.tagName !== "p") {
      children.push({ type: "text", value: "\n" });
    }
    if (child.type === "element" && child.tagName === "p" && !loose) {
      children.push(...child.children);
    } else {
      children.push(child);
    }
  }
  const tail = results[results.length - 1];
  if (tail && (loose || tail.type !== "element" || tail.tagName !== "p")) {
    children.push({ type: "text", value: "\n" });
  }
  const result = { type: "element", tagName: "li", properties, children };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
function listLoose(node2) {
  let loose = false;
  if (node2.type === "list") {
    loose = node2.spread || false;
    const children = node2.children;
    let index2 = -1;
    while (!loose && ++index2 < children.length) {
      loose = listItemLoose(children[index2]);
    }
  }
  return loose;
}
function listItemLoose(node2) {
  const spread = node2.spread;
  return spread === null || spread === void 0 ? node2.children.length > 1 : spread;
}
function list(state, node2) {
  const properties = {};
  const results = state.all(node2);
  let index2 = -1;
  if (typeof node2.start === "number" && node2.start !== 1) {
    properties.start = node2.start;
  }
  while (++index2 < results.length) {
    const child = results[index2];
    if (child.type === "element" && child.tagName === "li" && child.properties && Array.isArray(child.properties.className) && child.properties.className.includes("task-list-item")) {
      properties.className = ["contains-task-list"];
      break;
    }
  }
  const result = {
    type: "element",
    tagName: node2.ordered ? "ol" : "ul",
    properties,
    children: state.wrap(results, true)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
function paragraph(state, node2) {
  const result = {
    type: "element",
    tagName: "p",
    properties: {},
    children: state.all(node2)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
function root(state, node2) {
  const result = { type: "root", children: state.wrap(state.all(node2)) };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
function strong(state, node2) {
  const result = {
    type: "element",
    tagName: "strong",
    properties: {},
    children: state.all(node2)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
function table(state, node2) {
  const rows = state.all(node2);
  const firstRow = rows.shift();
  const tableContent = [];
  if (firstRow) {
    const head = {
      type: "element",
      tagName: "thead",
      properties: {},
      children: state.wrap([firstRow], true)
    };
    state.patch(node2.children[0], head);
    tableContent.push(head);
  }
  if (rows.length > 0) {
    const body = {
      type: "element",
      tagName: "tbody",
      properties: {},
      children: state.wrap(rows, true)
    };
    const start = pointStart(node2.children[1]);
    const end = pointEnd(node2.children[node2.children.length - 1]);
    if (start && end) body.position = { start, end };
    tableContent.push(body);
  }
  const result = {
    type: "element",
    tagName: "table",
    properties: {},
    children: state.wrap(tableContent, true)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
function tableRow(state, node2, parent) {
  const siblings = parent ? parent.children : void 0;
  const rowIndex = siblings ? siblings.indexOf(node2) : 1;
  const tagName = rowIndex === 0 ? "th" : "td";
  const align = parent && parent.type === "table" ? parent.align : void 0;
  const length = align ? align.length : node2.children.length;
  let cellIndex = -1;
  const cells = [];
  while (++cellIndex < length) {
    const cell = node2.children[cellIndex];
    const properties = {};
    const alignValue = align ? align[cellIndex] : void 0;
    if (alignValue) {
      properties.align = alignValue;
    }
    let result2 = { type: "element", tagName, properties, children: [] };
    if (cell) {
      result2.children = state.all(cell);
      state.patch(cell, result2);
      result2 = state.applyData(cell, result2);
    }
    cells.push(result2);
  }
  const result = {
    type: "element",
    tagName: "tr",
    properties: {},
    children: state.wrap(cells, true)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
function tableCell(state, node2) {
  const result = {
    type: "element",
    tagName: "td",
    // Assume body cell.
    properties: {},
    children: state.all(node2)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
const tab = 9;
const space = 32;
function trimLines(value) {
  const source = String(value);
  const search2 = /\r?\n|\r/g;
  let match = search2.exec(source);
  let last = 0;
  const lines = [];
  while (match) {
    lines.push(
      trimLine(source.slice(last, match.index), last > 0, true),
      match[0]
    );
    last = match.index + match[0].length;
    match = search2.exec(source);
  }
  lines.push(trimLine(source.slice(last), last > 0, false));
  return lines.join("");
}
function trimLine(value, start, end) {
  let startIndex = 0;
  let endIndex = value.length;
  if (start) {
    let code2 = value.codePointAt(startIndex);
    while (code2 === tab || code2 === space) {
      startIndex++;
      code2 = value.codePointAt(startIndex);
    }
  }
  if (end) {
    let code2 = value.codePointAt(endIndex - 1);
    while (code2 === tab || code2 === space) {
      endIndex--;
      code2 = value.codePointAt(endIndex - 1);
    }
  }
  return endIndex > startIndex ? value.slice(startIndex, endIndex) : "";
}
function text(state, node2) {
  const result = { type: "text", value: trimLines(String(node2.value)) };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
function thematicBreak(state, node2) {
  const result = {
    type: "element",
    tagName: "hr",
    properties: {},
    children: []
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
const handlers = {
  blockquote,
  break: hardBreak,
  code,
  delete: strikethrough,
  emphasis,
  footnoteReference,
  heading,
  html,
  imageReference,
  image,
  inlineCode,
  linkReference,
  link,
  listItem,
  list,
  paragraph,
  // @ts-expect-error: root is different, but hard to type.
  root,
  strong,
  table,
  tableCell,
  tableRow,
  text,
  thematicBreak,
  toml: ignore,
  yaml: ignore,
  definition: ignore,
  footnoteDefinition: ignore
};
function ignore() {
  return void 0;
}
const VOID = -1;
const PRIMITIVE = 0;
const ARRAY = 1;
const OBJECT = 2;
const DATE = 3;
const REGEXP = 4;
const MAP = 5;
const SET = 6;
const ERROR = 7;
const BIGINT = 8;
const env = typeof self === "object" ? self : globalThis;
const deserializer = ($, _) => {
  const as = (out, index2) => {
    $.set(index2, out);
    return out;
  };
  const unpair = (index2) => {
    if ($.has(index2))
      return $.get(index2);
    const [type, value] = _[index2];
    switch (type) {
      case PRIMITIVE:
      case VOID:
        return as(value, index2);
      case ARRAY: {
        const arr = as([], index2);
        for (const index3 of value)
          arr.push(unpair(index3));
        return arr;
      }
      case OBJECT: {
        const object = as({}, index2);
        for (const [key, index3] of value)
          object[unpair(key)] = unpair(index3);
        return object;
      }
      case DATE:
        return as(new Date(value), index2);
      case REGEXP: {
        const { source, flags } = value;
        return as(new RegExp(source, flags), index2);
      }
      case MAP: {
        const map = as(/* @__PURE__ */ new Map(), index2);
        for (const [key, index3] of value)
          map.set(unpair(key), unpair(index3));
        return map;
      }
      case SET: {
        const set = as(/* @__PURE__ */ new Set(), index2);
        for (const index3 of value)
          set.add(unpair(index3));
        return set;
      }
      case ERROR: {
        const { name: name2, message } = value;
        return as(new env[name2](message), index2);
      }
      case BIGINT:
        return as(BigInt(value), index2);
      case "BigInt":
        return as(Object(BigInt(value)), index2);
      case "ArrayBuffer":
        return as(new Uint8Array(value).buffer, value);
      case "DataView": {
        const { buffer } = new Uint8Array(value);
        return as(new DataView(buffer), value);
      }
    }
    return as(new env[type](value), index2);
  };
  return unpair;
};
const deserialize = (serialized) => deserializer(/* @__PURE__ */ new Map(), serialized)(0);
const EMPTY = "";
const { toString } = {};
const { keys } = Object;
const typeOf = (value) => {
  const type = typeof value;
  if (type !== "object" || !value)
    return [PRIMITIVE, type];
  const asString = toString.call(value).slice(8, -1);
  switch (asString) {
    case "Array":
      return [ARRAY, EMPTY];
    case "Object":
      return [OBJECT, EMPTY];
    case "Date":
      return [DATE, EMPTY];
    case "RegExp":
      return [REGEXP, EMPTY];
    case "Map":
      return [MAP, EMPTY];
    case "Set":
      return [SET, EMPTY];
    case "DataView":
      return [ARRAY, asString];
  }
  if (asString.includes("Array"))
    return [ARRAY, asString];
  if (asString.includes("Error"))
    return [ERROR, asString];
  return [OBJECT, asString];
};
const shouldSkip = ([TYPE, type]) => TYPE === PRIMITIVE && (type === "function" || type === "symbol");
const serializer = (strict, json, $, _) => {
  const as = (out, value) => {
    const index2 = _.push(out) - 1;
    $.set(value, index2);
    return index2;
  };
  const pair = (value) => {
    if ($.has(value))
      return $.get(value);
    let [TYPE, type] = typeOf(value);
    switch (TYPE) {
      case PRIMITIVE: {
        let entry = value;
        switch (type) {
          case "bigint":
            TYPE = BIGINT;
            entry = value.toString();
            break;
          case "function":
          case "symbol":
            if (strict)
              throw new TypeError("unable to serialize " + type);
            entry = null;
            break;
          case "undefined":
            return as([VOID], value);
        }
        return as([TYPE, entry], value);
      }
      case ARRAY: {
        if (type) {
          let spread = value;
          if (type === "DataView") {
            spread = new Uint8Array(value.buffer);
          } else if (type === "ArrayBuffer") {
            spread = new Uint8Array(value);
          }
          return as([type, [...spread]], value);
        }
        const arr = [];
        const index2 = as([TYPE, arr], value);
        for (const entry of value)
          arr.push(pair(entry));
        return index2;
      }
      case OBJECT: {
        if (type) {
          switch (type) {
            case "BigInt":
              return as([type, value.toString()], value);
            case "Boolean":
            case "Number":
            case "String":
              return as([type, value.valueOf()], value);
          }
        }
        if (json && "toJSON" in value)
          return pair(value.toJSON());
        const entries = [];
        const index2 = as([TYPE, entries], value);
        for (const key of keys(value)) {
          if (strict || !shouldSkip(typeOf(value[key])))
            entries.push([pair(key), pair(value[key])]);
        }
        return index2;
      }
      case DATE:
        return as([TYPE, value.toISOString()], value);
      case REGEXP: {
        const { source, flags } = value;
        return as([TYPE, { source, flags }], value);
      }
      case MAP: {
        const entries = [];
        const index2 = as([TYPE, entries], value);
        for (const [key, entry] of value) {
          if (strict || !(shouldSkip(typeOf(key)) || shouldSkip(typeOf(entry))))
            entries.push([pair(key), pair(entry)]);
        }
        return index2;
      }
      case SET: {
        const entries = [];
        const index2 = as([TYPE, entries], value);
        for (const entry of value) {
          if (strict || !shouldSkip(typeOf(entry)))
            entries.push(pair(entry));
        }
        return index2;
      }
    }
    const { message } = value;
    return as([TYPE, { name: type, message }], value);
  };
  return pair;
};
const serialize = (value, { json, lossy } = {}) => {
  const _ = [];
  return serializer(!(json || lossy), !!json, /* @__PURE__ */ new Map(), _)(value), _;
};
const structuredClone$1 = typeof structuredClone === "function" ? (
  /* c8 ignore start */
  (any, options) => options && ("json" in options || "lossy" in options) ? deserialize(serialize(any, options)) : structuredClone(any)
) : (any, options) => deserialize(serialize(any, options));
function defaultFootnoteBackContent(_, rereferenceIndex) {
  const result = [{ type: "text", value: "↩" }];
  if (rereferenceIndex > 1) {
    result.push({
      type: "element",
      tagName: "sup",
      properties: {},
      children: [{ type: "text", value: String(rereferenceIndex) }]
    });
  }
  return result;
}
function defaultFootnoteBackLabel(referenceIndex, rereferenceIndex) {
  return "Back to reference " + (referenceIndex + 1) + (rereferenceIndex > 1 ? "-" + rereferenceIndex : "");
}
function footer(state) {
  const clobberPrefix = typeof state.options.clobberPrefix === "string" ? state.options.clobberPrefix : "user-content-";
  const footnoteBackContent = state.options.footnoteBackContent || defaultFootnoteBackContent;
  const footnoteBackLabel = state.options.footnoteBackLabel || defaultFootnoteBackLabel;
  const footnoteLabel = state.options.footnoteLabel || "Footnotes";
  const footnoteLabelTagName = state.options.footnoteLabelTagName || "h2";
  const footnoteLabelProperties = state.options.footnoteLabelProperties || {
    className: ["sr-only"]
  };
  const listItems = [];
  let referenceIndex = -1;
  while (++referenceIndex < state.footnoteOrder.length) {
    const definition2 = state.footnoteById.get(
      state.footnoteOrder[referenceIndex]
    );
    if (!definition2) {
      continue;
    }
    const content2 = state.all(definition2);
    const id = String(definition2.identifier).toUpperCase();
    const safeId = normalizeUri(id.toLowerCase());
    let rereferenceIndex = 0;
    const backReferences = [];
    const counts = state.footnoteCounts.get(id);
    while (counts !== void 0 && ++rereferenceIndex <= counts) {
      if (backReferences.length > 0) {
        backReferences.push({ type: "text", value: " " });
      }
      let children = typeof footnoteBackContent === "string" ? footnoteBackContent : footnoteBackContent(referenceIndex, rereferenceIndex);
      if (typeof children === "string") {
        children = { type: "text", value: children };
      }
      backReferences.push({
        type: "element",
        tagName: "a",
        properties: {
          href: "#" + clobberPrefix + "fnref-" + safeId + (rereferenceIndex > 1 ? "-" + rereferenceIndex : ""),
          dataFootnoteBackref: "",
          ariaLabel: typeof footnoteBackLabel === "string" ? footnoteBackLabel : footnoteBackLabel(referenceIndex, rereferenceIndex),
          className: ["data-footnote-backref"]
        },
        children: Array.isArray(children) ? children : [children]
      });
    }
    const tail = content2[content2.length - 1];
    if (tail && tail.type === "element" && tail.tagName === "p") {
      const tailTail = tail.children[tail.children.length - 1];
      if (tailTail && tailTail.type === "text") {
        tailTail.value += " ";
      } else {
        tail.children.push({ type: "text", value: " " });
      }
      tail.children.push(...backReferences);
    } else {
      content2.push(...backReferences);
    }
    const listItem2 = {
      type: "element",
      tagName: "li",
      properties: { id: clobberPrefix + "fn-" + safeId },
      children: state.wrap(content2, true)
    };
    state.patch(definition2, listItem2);
    listItems.push(listItem2);
  }
  if (listItems.length === 0) {
    return;
  }
  return {
    type: "element",
    tagName: "section",
    properties: { dataFootnotes: true, className: ["footnotes"] },
    children: [
      {
        type: "element",
        tagName: footnoteLabelTagName,
        properties: {
          ...structuredClone$1(footnoteLabelProperties),
          id: "footnote-label"
        },
        children: [{ type: "text", value: footnoteLabel }]
      },
      { type: "text", value: "\n" },
      {
        type: "element",
        tagName: "ol",
        properties: {},
        children: state.wrap(listItems, true)
      },
      { type: "text", value: "\n" }
    ]
  };
}
const convert = (
  // Note: overloads in JSDoc can’t yet use different `@template`s.
  /**
   * @type {(
   *   (<Condition extends string>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & {type: Condition}) &
   *   (<Condition extends Props>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Condition) &
   *   (<Condition extends TestFunction>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Predicate<Condition, Node>) &
   *   ((test?: null | undefined) => (node?: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node) &
   *   ((test?: Test) => Check)
   * )}
   */
  /**
   * @param {Test} [test]
   * @returns {Check}
   */
  function(test) {
    if (test === null || test === void 0) {
      return ok;
    }
    if (typeof test === "function") {
      return castFactory(test);
    }
    if (typeof test === "object") {
      return Array.isArray(test) ? anyFactory(test) : (
        // Cast because `ReadonlyArray` goes into the above but `isArray`
        // narrows to `Array`.
        propertiesFactory(
          /** @type {Props} */
          test
        )
      );
    }
    if (typeof test === "string") {
      return typeFactory(test);
    }
    throw new Error("Expected function, string, or object as test");
  }
);
function anyFactory(tests) {
  const checks2 = [];
  let index2 = -1;
  while (++index2 < tests.length) {
    checks2[index2] = convert(tests[index2]);
  }
  return castFactory(any);
  function any(...parameters) {
    let index3 = -1;
    while (++index3 < checks2.length) {
      if (checks2[index3].apply(this, parameters)) return true;
    }
    return false;
  }
}
function propertiesFactory(check) {
  const checkAsRecord = (
    /** @type {Record<string, unknown>} */
    check
  );
  return castFactory(all2);
  function all2(node2) {
    const nodeAsRecord = (
      /** @type {Record<string, unknown>} */
      /** @type {unknown} */
      node2
    );
    let key;
    for (key in check) {
      if (nodeAsRecord[key] !== checkAsRecord[key]) return false;
    }
    return true;
  }
}
function typeFactory(check) {
  return castFactory(type);
  function type(node2) {
    return node2 && node2.type === check;
  }
}
function castFactory(testFunction) {
  return check;
  function check(value, index2, parent) {
    return Boolean(
      looksLikeANode(value) && testFunction.call(
        this,
        value,
        typeof index2 === "number" ? index2 : void 0,
        parent || void 0
      )
    );
  }
}
function ok() {
  return true;
}
function looksLikeANode(value) {
  return value !== null && typeof value === "object" && "type" in value;
}
function color(d) {
  return d;
}
const empty = [];
const CONTINUE = true;
const EXIT = false;
const SKIP = "skip";
function visitParents(tree, test, visitor, reverse) {
  let check;
  if (typeof test === "function" && typeof visitor !== "function") {
    reverse = visitor;
    visitor = test;
  } else {
    check = test;
  }
  const is = convert(check);
  const step = reverse ? -1 : 1;
  factory(tree, void 0, [])();
  function factory(node2, index2, parents) {
    const value = (
      /** @type {Record<string, unknown>} */
      node2 && typeof node2 === "object" ? node2 : {}
    );
    if (typeof value.type === "string") {
      const name2 = (
        // `hast`
        typeof value.tagName === "string" ? value.tagName : (
          // `xast`
          typeof value.name === "string" ? value.name : void 0
        )
      );
      Object.defineProperty(visit2, "name", {
        value: "node (" + color(node2.type + (name2 ? "<" + name2 + ">" : "")) + ")"
      });
    }
    return visit2;
    function visit2() {
      let result = empty;
      let subresult;
      let offset;
      let grandparents;
      if (!test || is(node2, index2, parents[parents.length - 1] || void 0)) {
        result = toResult(visitor(node2, parents));
        if (result[0] === EXIT) {
          return result;
        }
      }
      if ("children" in node2 && node2.children) {
        const nodeAsParent = (
          /** @type {UnistParent} */
          node2
        );
        if (nodeAsParent.children && result[0] !== SKIP) {
          offset = (reverse ? nodeAsParent.children.length : -1) + step;
          grandparents = parents.concat(nodeAsParent);
          while (offset > -1 && offset < nodeAsParent.children.length) {
            const child = nodeAsParent.children[offset];
            subresult = factory(child, offset, grandparents)();
            if (subresult[0] === EXIT) {
              return subresult;
            }
            offset = typeof subresult[1] === "number" ? subresult[1] : offset + step;
          }
        }
      }
      return result;
    }
  }
}
function toResult(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "number") {
    return [CONTINUE, value];
  }
  return value === null || value === void 0 ? empty : [value];
}
function visit(tree, testOrVisitor, visitorOrReverse, maybeReverse) {
  let reverse;
  let test;
  let visitor;
  if (typeof testOrVisitor === "function" && typeof visitorOrReverse !== "function") {
    test = void 0;
    visitor = testOrVisitor;
    reverse = visitorOrReverse;
  } else {
    test = testOrVisitor;
    visitor = visitorOrReverse;
    reverse = maybeReverse;
  }
  visitParents(tree, test, overload, reverse);
  function overload(node2, parents) {
    const parent = parents[parents.length - 1];
    const index2 = parent ? parent.children.indexOf(node2) : void 0;
    return visitor(node2, index2, parent);
  }
}
const own$1 = {}.hasOwnProperty;
const emptyOptions = {};
function createState(tree, options) {
  const settings = options || emptyOptions;
  const definitionById = /* @__PURE__ */ new Map();
  const footnoteById = /* @__PURE__ */ new Map();
  const footnoteCounts = /* @__PURE__ */ new Map();
  const handlers$1 = { ...handlers, ...settings.handlers };
  const state = {
    all: all2,
    applyData,
    definitionById,
    footnoteById,
    footnoteCounts,
    footnoteOrder: [],
    handlers: handlers$1,
    one: one2,
    options: settings,
    patch,
    wrap: wrap$1
  };
  visit(tree, function(node2) {
    if (node2.type === "definition" || node2.type === "footnoteDefinition") {
      const map = node2.type === "definition" ? definitionById : footnoteById;
      const id = String(node2.identifier).toUpperCase();
      if (!map.has(id)) {
        map.set(id, node2);
      }
    }
  });
  return state;
  function one2(node2, parent) {
    const type = node2.type;
    const handle = state.handlers[type];
    if (own$1.call(state.handlers, type) && handle) {
      return handle(state, node2, parent);
    }
    if (state.options.passThrough && state.options.passThrough.includes(type)) {
      if ("children" in node2) {
        const { children, ...shallow } = node2;
        const result = structuredClone$1(shallow);
        result.children = state.all(node2);
        return result;
      }
      return structuredClone$1(node2);
    }
    const unknown = state.options.unknownHandler || defaultUnknownHandler;
    return unknown(state, node2, parent);
  }
  function all2(parent) {
    const values = [];
    if ("children" in parent) {
      const nodes = parent.children;
      let index2 = -1;
      while (++index2 < nodes.length) {
        const result = state.one(nodes[index2], parent);
        if (result) {
          if (index2 && nodes[index2 - 1].type === "break") {
            if (!Array.isArray(result) && result.type === "text") {
              result.value = trimMarkdownSpaceStart(result.value);
            }
            if (!Array.isArray(result) && result.type === "element") {
              const head = result.children[0];
              if (head && head.type === "text") {
                head.value = trimMarkdownSpaceStart(head.value);
              }
            }
          }
          if (Array.isArray(result)) {
            values.push(...result);
          } else {
            values.push(result);
          }
        }
      }
    }
    return values;
  }
}
function patch(from, to) {
  if (from.position) to.position = position$1(from);
}
function applyData(from, to) {
  let result = to;
  if (from && from.data) {
    const hName = from.data.hName;
    const hChildren = from.data.hChildren;
    const hProperties = from.data.hProperties;
    if (typeof hName === "string") {
      if (result.type === "element") {
        result.tagName = hName;
      } else {
        const children = "children" in result ? result.children : [result];
        result = { type: "element", tagName: hName, properties: {}, children };
      }
    }
    if (result.type === "element" && hProperties) {
      Object.assign(result.properties, structuredClone$1(hProperties));
    }
    if ("children" in result && result.children && hChildren !== null && hChildren !== void 0) {
      result.children = hChildren;
    }
  }
  return result;
}
function defaultUnknownHandler(state, node2) {
  const data = node2.data || {};
  const result = "value" in node2 && !(own$1.call(data, "hProperties") || own$1.call(data, "hChildren")) ? { type: "text", value: node2.value } : {
    type: "element",
    tagName: "div",
    properties: {},
    children: state.all(node2)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
function wrap$1(nodes, loose) {
  const result = [];
  let index2 = -1;
  if (loose) {
    result.push({ type: "text", value: "\n" });
  }
  while (++index2 < nodes.length) {
    if (index2) result.push({ type: "text", value: "\n" });
    result.push(nodes[index2]);
  }
  if (loose && nodes.length > 0) {
    result.push({ type: "text", value: "\n" });
  }
  return result;
}
function trimMarkdownSpaceStart(value) {
  let index2 = 0;
  let code2 = value.charCodeAt(index2);
  while (code2 === 9 || code2 === 32) {
    index2++;
    code2 = value.charCodeAt(index2);
  }
  return value.slice(index2);
}
function toHast(tree, options) {
  const state = createState(tree, options);
  const node2 = state.one(tree, void 0);
  const foot = footer(state);
  const result = Array.isArray(node2) ? { type: "root", children: node2 } : node2 || { type: "root", children: [] };
  if (foot) {
    result.children.push({ type: "text", value: "\n" }, foot);
  }
  return result;
}
function remarkRehype(destination, options) {
  if (destination && "run" in destination) {
    return async function(tree, file) {
      const hastTree = (
        /** @type {HastRoot} */
        toHast(tree, { file, ...options })
      );
      await destination.run(hastTree, file);
    };
  }
  return function(tree, file) {
    return (
      /** @type {HastRoot} */
      toHast(tree, { file, ...destination || options })
    );
  };
}
function bail(error) {
  if (error) {
    throw error;
  }
}
var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var defineProperty = Object.defineProperty;
var gOPD = Object.getOwnPropertyDescriptor;
var isArray = function isArray2(arr) {
  if (typeof Array.isArray === "function") {
    return Array.isArray(arr);
  }
  return toStr.call(arr) === "[object Array]";
};
var isPlainObject$1 = function isPlainObject(obj) {
  if (!obj || toStr.call(obj) !== "[object Object]") {
    return false;
  }
  var hasOwnConstructor = hasOwn.call(obj, "constructor");
  var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, "isPrototypeOf");
  if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
    return false;
  }
  var key;
  for (key in obj) {
  }
  return typeof key === "undefined" || hasOwn.call(obj, key);
};
var setProperty = function setProperty2(target, options) {
  if (defineProperty && options.name === "__proto__") {
    defineProperty(target, options.name, {
      enumerable: true,
      configurable: true,
      value: options.newValue,
      writable: true
    });
  } else {
    target[options.name] = options.newValue;
  }
};
var getProperty = function getProperty2(obj, name2) {
  if (name2 === "__proto__") {
    if (!hasOwn.call(obj, name2)) {
      return void 0;
    } else if (gOPD) {
      return gOPD(obj, name2).value;
    }
  }
  return obj[name2];
};
var extend = function extend2() {
  var options, name2, src, copy, copyIsArray, clone;
  var target = arguments[0];
  var i = 1;
  var length = arguments.length;
  var deep = false;
  if (typeof target === "boolean") {
    deep = target;
    target = arguments[1] || {};
    i = 2;
  }
  if (target == null || typeof target !== "object" && typeof target !== "function") {
    target = {};
  }
  for (; i < length; ++i) {
    options = arguments[i];
    if (options != null) {
      for (name2 in options) {
        src = getProperty(target, name2);
        copy = getProperty(options, name2);
        if (target !== copy) {
          if (deep && copy && (isPlainObject$1(copy) || (copyIsArray = isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && isArray(src) ? src : [];
            } else {
              clone = src && isPlainObject$1(src) ? src : {};
            }
            setProperty(target, { name: name2, newValue: extend2(deep, clone, copy) });
          } else if (typeof copy !== "undefined") {
            setProperty(target, { name: name2, newValue: copy });
          }
        }
      }
    }
  }
  return target;
};
const extend$1 = /* @__PURE__ */ getDefaultExportFromCjs(extend);
function isPlainObject2(value) {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
}
function trough() {
  const fns = [];
  const pipeline = { run, use };
  return pipeline;
  function run(...values) {
    let middlewareIndex = -1;
    const callback = values.pop();
    if (typeof callback !== "function") {
      throw new TypeError("Expected function as last argument, not " + callback);
    }
    next(null, ...values);
    function next(error, ...output) {
      const fn = fns[++middlewareIndex];
      let index2 = -1;
      if (error) {
        callback(error);
        return;
      }
      while (++index2 < values.length) {
        if (output[index2] === null || output[index2] === void 0) {
          output[index2] = values[index2];
        }
      }
      values = output;
      if (fn) {
        wrap(fn, next)(...output);
      } else {
        callback(null, ...output);
      }
    }
  }
  function use(middelware) {
    if (typeof middelware !== "function") {
      throw new TypeError(
        "Expected `middelware` to be a function, not " + middelware
      );
    }
    fns.push(middelware);
    return pipeline;
  }
}
function wrap(middleware, callback) {
  let called;
  return wrapped;
  function wrapped(...parameters) {
    const fnExpectsCallback = middleware.length > parameters.length;
    let result;
    if (fnExpectsCallback) {
      parameters.push(done);
    }
    try {
      result = middleware.apply(this, parameters);
    } catch (error) {
      const exception = (
        /** @type {Error} */
        error
      );
      if (fnExpectsCallback && called) {
        throw exception;
      }
      return done(exception);
    }
    if (!fnExpectsCallback) {
      if (result && result.then && typeof result.then === "function") {
        result.then(then, done);
      } else if (result instanceof Error) {
        done(result);
      } else {
        then(result);
      }
    }
  }
  function done(error, ...output) {
    if (!called) {
      called = true;
      callback(error, ...output);
    }
  }
  function then(value) {
    done(null, value);
  }
}
const minpath = { basename, dirname, extname, join, sep: "/" };
function basename(path, extname2) {
  if (extname2 !== void 0 && typeof extname2 !== "string") {
    throw new TypeError('"ext" argument must be a string');
  }
  assertPath$1(path);
  let start = 0;
  let end = -1;
  let index2 = path.length;
  let seenNonSlash;
  if (extname2 === void 0 || extname2.length === 0 || extname2.length > path.length) {
    while (index2--) {
      if (path.codePointAt(index2) === 47) {
        if (seenNonSlash) {
          start = index2 + 1;
          break;
        }
      } else if (end < 0) {
        seenNonSlash = true;
        end = index2 + 1;
      }
    }
    return end < 0 ? "" : path.slice(start, end);
  }
  if (extname2 === path) {
    return "";
  }
  let firstNonSlashEnd = -1;
  let extnameIndex = extname2.length - 1;
  while (index2--) {
    if (path.codePointAt(index2) === 47) {
      if (seenNonSlash) {
        start = index2 + 1;
        break;
      }
    } else {
      if (firstNonSlashEnd < 0) {
        seenNonSlash = true;
        firstNonSlashEnd = index2 + 1;
      }
      if (extnameIndex > -1) {
        if (path.codePointAt(index2) === extname2.codePointAt(extnameIndex--)) {
          if (extnameIndex < 0) {
            end = index2;
          }
        } else {
          extnameIndex = -1;
          end = firstNonSlashEnd;
        }
      }
    }
  }
  if (start === end) {
    end = firstNonSlashEnd;
  } else if (end < 0) {
    end = path.length;
  }
  return path.slice(start, end);
}
function dirname(path) {
  assertPath$1(path);
  if (path.length === 0) {
    return ".";
  }
  let end = -1;
  let index2 = path.length;
  let unmatchedSlash;
  while (--index2) {
    if (path.codePointAt(index2) === 47) {
      if (unmatchedSlash) {
        end = index2;
        break;
      }
    } else if (!unmatchedSlash) {
      unmatchedSlash = true;
    }
  }
  return end < 0 ? path.codePointAt(0) === 47 ? "/" : "." : end === 1 && path.codePointAt(0) === 47 ? "//" : path.slice(0, end);
}
function extname(path) {
  assertPath$1(path);
  let index2 = path.length;
  let end = -1;
  let startPart = 0;
  let startDot = -1;
  let preDotState = 0;
  let unmatchedSlash;
  while (index2--) {
    const code2 = path.codePointAt(index2);
    if (code2 === 47) {
      if (unmatchedSlash) {
        startPart = index2 + 1;
        break;
      }
      continue;
    }
    if (end < 0) {
      unmatchedSlash = true;
      end = index2 + 1;
    }
    if (code2 === 46) {
      if (startDot < 0) {
        startDot = index2;
      } else if (preDotState !== 1) {
        preDotState = 1;
      }
    } else if (startDot > -1) {
      preDotState = -1;
    }
  }
  if (startDot < 0 || end < 0 || // We saw a non-dot character immediately before the dot.
  preDotState === 0 || // The (right-most) trimmed path component is exactly `..`.
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path.slice(startDot, end);
}
function join(...segments) {
  let index2 = -1;
  let joined;
  while (++index2 < segments.length) {
    assertPath$1(segments[index2]);
    if (segments[index2]) {
      joined = joined === void 0 ? segments[index2] : joined + "/" + segments[index2];
    }
  }
  return joined === void 0 ? "." : normalize(joined);
}
function normalize(path) {
  assertPath$1(path);
  const absolute = path.codePointAt(0) === 47;
  let value = normalizeString(path, !absolute);
  if (value.length === 0 && !absolute) {
    value = ".";
  }
  if (value.length > 0 && path.codePointAt(path.length - 1) === 47) {
    value += "/";
  }
  return absolute ? "/" + value : value;
}
function normalizeString(path, allowAboveRoot) {
  let result = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let index2 = -1;
  let code2;
  let lastSlashIndex;
  while (++index2 <= path.length) {
    if (index2 < path.length) {
      code2 = path.codePointAt(index2);
    } else if (code2 === 47) {
      break;
    } else {
      code2 = 47;
    }
    if (code2 === 47) {
      if (lastSlash === index2 - 1 || dots === 1) ;
      else if (lastSlash !== index2 - 1 && dots === 2) {
        if (result.length < 2 || lastSegmentLength !== 2 || result.codePointAt(result.length - 1) !== 46 || result.codePointAt(result.length - 2) !== 46) {
          if (result.length > 2) {
            lastSlashIndex = result.lastIndexOf("/");
            if (lastSlashIndex !== result.length - 1) {
              if (lastSlashIndex < 0) {
                result = "";
                lastSegmentLength = 0;
              } else {
                result = result.slice(0, lastSlashIndex);
                lastSegmentLength = result.length - 1 - result.lastIndexOf("/");
              }
              lastSlash = index2;
              dots = 0;
              continue;
            }
          } else if (result.length > 0) {
            result = "";
            lastSegmentLength = 0;
            lastSlash = index2;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          result = result.length > 0 ? result + "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (result.length > 0) {
          result += "/" + path.slice(lastSlash + 1, index2);
        } else {
          result = path.slice(lastSlash + 1, index2);
        }
        lastSegmentLength = index2 - lastSlash - 1;
      }
      lastSlash = index2;
      dots = 0;
    } else if (code2 === 46 && dots > -1) {
      dots++;
    } else {
      dots = -1;
    }
  }
  return result;
}
function assertPath$1(path) {
  if (typeof path !== "string") {
    throw new TypeError(
      "Path must be a string. Received " + JSON.stringify(path)
    );
  }
}
const minproc = { cwd };
function cwd() {
  return "/";
}
function isUrl(fileUrlOrPath) {
  return Boolean(
    fileUrlOrPath !== null && typeof fileUrlOrPath === "object" && "href" in fileUrlOrPath && fileUrlOrPath.href && "protocol" in fileUrlOrPath && fileUrlOrPath.protocol && // @ts-expect-error: indexing is fine.
    fileUrlOrPath.auth === void 0
  );
}
function urlToPath(path) {
  if (typeof path === "string") {
    path = new URL(path);
  } else if (!isUrl(path)) {
    const error = new TypeError(
      'The "path" argument must be of type string or an instance of URL. Received `' + path + "`"
    );
    error.code = "ERR_INVALID_ARG_TYPE";
    throw error;
  }
  if (path.protocol !== "file:") {
    const error = new TypeError("The URL must be of scheme file");
    error.code = "ERR_INVALID_URL_SCHEME";
    throw error;
  }
  return getPathFromURLPosix(path);
}
function getPathFromURLPosix(url) {
  if (url.hostname !== "") {
    const error = new TypeError(
      'File URL host must be "localhost" or empty on darwin'
    );
    error.code = "ERR_INVALID_FILE_URL_HOST";
    throw error;
  }
  const pathname = url.pathname;
  let index2 = -1;
  while (++index2 < pathname.length) {
    if (pathname.codePointAt(index2) === 37 && pathname.codePointAt(index2 + 1) === 50) {
      const third = pathname.codePointAt(index2 + 2);
      if (third === 70 || third === 102) {
        const error = new TypeError(
          "File URL path must not include encoded / characters"
        );
        error.code = "ERR_INVALID_FILE_URL_PATH";
        throw error;
      }
    }
  }
  return decodeURIComponent(pathname);
}
const order = (
  /** @type {const} */
  [
    "history",
    "path",
    "basename",
    "stem",
    "extname",
    "dirname"
  ]
);
class VFile {
  /**
   * Create a new virtual file.
   *
   * `options` is treated as:
   *
   * *   `string` or `Uint8Array` — `{value: options}`
   * *   `URL` — `{path: options}`
   * *   `VFile` — shallow copies its data over to the new file
   * *   `object` — all fields are shallow copied over to the new file
   *
   * Path related fields are set in the following order (least specific to
   * most specific): `history`, `path`, `basename`, `stem`, `extname`,
   * `dirname`.
   *
   * You cannot set `dirname` or `extname` without setting either `history`,
   * `path`, `basename`, or `stem` too.
   *
   * @param {Compatible | null | undefined} [value]
   *   File value.
   * @returns
   *   New instance.
   */
  constructor(value) {
    let options;
    if (!value) {
      options = {};
    } else if (isUrl(value)) {
      options = { path: value };
    } else if (typeof value === "string" || isUint8Array$1(value)) {
      options = { value };
    } else {
      options = value;
    }
    this.cwd = "cwd" in options ? "" : minproc.cwd();
    this.data = {};
    this.history = [];
    this.messages = [];
    this.value;
    this.map;
    this.result;
    this.stored;
    let index2 = -1;
    while (++index2 < order.length) {
      const field2 = order[index2];
      if (field2 in options && options[field2] !== void 0 && options[field2] !== null) {
        this[field2] = field2 === "history" ? [...options[field2]] : options[field2];
      }
    }
    let field;
    for (field in options) {
      if (!order.includes(field)) {
        this[field] = options[field];
      }
    }
  }
  /**
   * Get the basename (including extname) (example: `'index.min.js'`).
   *
   * @returns {string | undefined}
   *   Basename.
   */
  get basename() {
    return typeof this.path === "string" ? minpath.basename(this.path) : void 0;
  }
  /**
   * Set basename (including extname) (`'index.min.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   *
   * @param {string} basename
   *   Basename.
   * @returns {undefined}
   *   Nothing.
   */
  set basename(basename2) {
    assertNonEmpty(basename2, "basename");
    assertPart(basename2, "basename");
    this.path = minpath.join(this.dirname || "", basename2);
  }
  /**
   * Get the parent path (example: `'~'`).
   *
   * @returns {string | undefined}
   *   Dirname.
   */
  get dirname() {
    return typeof this.path === "string" ? minpath.dirname(this.path) : void 0;
  }
  /**
   * Set the parent path (example: `'~'`).
   *
   * Cannot be set if there’s no `path` yet.
   *
   * @param {string | undefined} dirname
   *   Dirname.
   * @returns {undefined}
   *   Nothing.
   */
  set dirname(dirname2) {
    assertPath(this.basename, "dirname");
    this.path = minpath.join(dirname2 || "", this.basename);
  }
  /**
   * Get the extname (including dot) (example: `'.js'`).
   *
   * @returns {string | undefined}
   *   Extname.
   */
  get extname() {
    return typeof this.path === "string" ? minpath.extname(this.path) : void 0;
  }
  /**
   * Set the extname (including dot) (example: `'.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be set if there’s no `path` yet.
   *
   * @param {string | undefined} extname
   *   Extname.
   * @returns {undefined}
   *   Nothing.
   */
  set extname(extname2) {
    assertPart(extname2, "extname");
    assertPath(this.dirname, "extname");
    if (extname2) {
      if (extname2.codePointAt(0) !== 46) {
        throw new Error("`extname` must start with `.`");
      }
      if (extname2.includes(".", 1)) {
        throw new Error("`extname` cannot contain multiple dots");
      }
    }
    this.path = minpath.join(this.dirname, this.stem + (extname2 || ""));
  }
  /**
   * Get the full path (example: `'~/index.min.js'`).
   *
   * @returns {string}
   *   Path.
   */
  get path() {
    return this.history[this.history.length - 1];
  }
  /**
   * Set the full path (example: `'~/index.min.js'`).
   *
   * Cannot be nullified.
   * You can set a file URL (a `URL` object with a `file:` protocol) which will
   * be turned into a path with `url.fileURLToPath`.
   *
   * @param {URL | string} path
   *   Path.
   * @returns {undefined}
   *   Nothing.
   */
  set path(path) {
    if (isUrl(path)) {
      path = urlToPath(path);
    }
    assertNonEmpty(path, "path");
    if (this.path !== path) {
      this.history.push(path);
    }
  }
  /**
   * Get the stem (basename w/o extname) (example: `'index.min'`).
   *
   * @returns {string | undefined}
   *   Stem.
   */
  get stem() {
    return typeof this.path === "string" ? minpath.basename(this.path, this.extname) : void 0;
  }
  /**
   * Set the stem (basename w/o extname) (example: `'index.min'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   *
   * @param {string} stem
   *   Stem.
   * @returns {undefined}
   *   Nothing.
   */
  set stem(stem) {
    assertNonEmpty(stem, "stem");
    assertPart(stem, "stem");
    this.path = minpath.join(this.dirname || "", stem + (this.extname || ""));
  }
  // Normal prototypal methods.
  /**
   * Create a fatal message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `true` (error; file not usable)
   * and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {never}
   *   Never.
   * @throws {VFileMessage}
   *   Message.
   */
  fail(causeOrReason, optionsOrParentOrPlace, origin) {
    const message = this.message(causeOrReason, optionsOrParentOrPlace, origin);
    message.fatal = true;
    throw message;
  }
  /**
   * Create an info message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `undefined` (info; change
   * likely not needed) and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */
  info(causeOrReason, optionsOrParentOrPlace, origin) {
    const message = this.message(causeOrReason, optionsOrParentOrPlace, origin);
    message.fatal = void 0;
    return message;
  }
  /**
   * Create a message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `false` (warning; change may be
   * needed) and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */
  message(causeOrReason, optionsOrParentOrPlace, origin) {
    const message = new VFileMessage(
      // @ts-expect-error: the overloads are fine.
      causeOrReason,
      optionsOrParentOrPlace,
      origin
    );
    if (this.path) {
      message.name = this.path + ":" + message.name;
      message.file = this.path;
    }
    message.fatal = false;
    this.messages.push(message);
    return message;
  }
  /**
   * Serialize the file.
   *
   * > **Note**: which encodings are supported depends on the engine.
   * > For info on Node.js, see:
   * > <https://nodejs.org/api/util.html#whatwg-supported-encodings>.
   *
   * @param {string | null | undefined} [encoding='utf8']
   *   Character encoding to understand `value` as when it’s a `Uint8Array`
   *   (default: `'utf-8'`).
   * @returns {string}
   *   Serialized file.
   */
  toString(encoding) {
    if (this.value === void 0) {
      return "";
    }
    if (typeof this.value === "string") {
      return this.value;
    }
    const decoder = new TextDecoder(encoding || void 0);
    return decoder.decode(this.value);
  }
}
function assertPart(part, name2) {
  if (part && part.includes(minpath.sep)) {
    throw new Error(
      "`" + name2 + "` cannot be a path: did not expect `" + minpath.sep + "`"
    );
  }
}
function assertNonEmpty(part, name2) {
  if (!part) {
    throw new Error("`" + name2 + "` cannot be empty");
  }
}
function assertPath(path, name2) {
  if (!path) {
    throw new Error("Setting `" + name2 + "` requires `path` to be set too");
  }
}
function isUint8Array$1(value) {
  return Boolean(
    value && typeof value === "object" && "byteLength" in value && "byteOffset" in value
  );
}
const CallableInstance = (
  /**
   * @type {new <Parameters extends Array<unknown>, Result>(property: string | symbol) => (...parameters: Parameters) => Result}
   */
  /** @type {unknown} */
  /**
   * @this {Function}
   * @param {string | symbol} property
   * @returns {(...parameters: Array<unknown>) => unknown}
   */
  function(property) {
    const self2 = this;
    const constr = self2.constructor;
    const proto = (
      /** @type {Record<string | symbol, Function>} */
      // Prototypes do exist.
      // type-coverage:ignore-next-line
      constr.prototype
    );
    const value = proto[property];
    const apply = function() {
      return value.apply(apply, arguments);
    };
    Object.setPrototypeOf(apply, proto);
    return apply;
  }
);
const own = {}.hasOwnProperty;
class Processor extends CallableInstance {
  /**
   * Create a processor.
   */
  constructor() {
    super("copy");
    this.Compiler = void 0;
    this.Parser = void 0;
    this.attachers = [];
    this.compiler = void 0;
    this.freezeIndex = -1;
    this.frozen = void 0;
    this.namespace = {};
    this.parser = void 0;
    this.transformers = trough();
  }
  /**
   * Copy a processor.
   *
   * @deprecated
   *   This is a private internal method and should not be used.
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   New *unfrozen* processor ({@linkcode Processor}) that is
   *   configured to work the same as its ancestor.
   *   When the descendant processor is configured in the future it does not
   *   affect the ancestral processor.
   */
  copy() {
    const destination = (
      /** @type {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>} */
      new Processor()
    );
    let index2 = -1;
    while (++index2 < this.attachers.length) {
      const attacher = this.attachers[index2];
      destination.use(...attacher);
    }
    destination.data(extend$1(true, {}, this.namespace));
    return destination;
  }
  /**
   * Configure the processor with info available to all plugins.
   * Information is stored in an object.
   *
   * Typically, options can be given to a specific plugin, but sometimes it
   * makes sense to have information shared with several plugins.
   * For example, a list of HTML elements that are self-closing, which is
   * needed during all phases.
   *
   * > **Note**: setting information cannot occur on *frozen* processors.
   * > Call the processor first to create a new unfrozen processor.
   *
   * > **Note**: to register custom data in TypeScript, augment the
   * > {@linkcode Data} interface.
   *
   * @example
   *   This example show how to get and set info:
   *
   *   ```js
   *   import {unified} from 'unified'
   *
   *   const processor = unified().data('alpha', 'bravo')
   *
   *   processor.data('alpha') // => 'bravo'
   *
   *   processor.data() // => {alpha: 'bravo'}
   *
   *   processor.data({charlie: 'delta'})
   *
   *   processor.data() // => {charlie: 'delta'}
   *   ```
   *
   * @template {keyof Data} Key
   *
   * @overload
   * @returns {Data}
   *
   * @overload
   * @param {Data} dataset
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {Key} key
   * @returns {Data[Key]}
   *
   * @overload
   * @param {Key} key
   * @param {Data[Key]} value
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @param {Data | Key} [key]
   *   Key to get or set, or entire dataset to set, or nothing to get the
   *   entire dataset (optional).
   * @param {Data[Key]} [value]
   *   Value to set (optional).
   * @returns {unknown}
   *   The current processor when setting, the value at `key` when getting, or
   *   the entire dataset when getting without key.
   */
  data(key, value) {
    if (typeof key === "string") {
      if (arguments.length === 2) {
        assertUnfrozen("data", this.frozen);
        this.namespace[key] = value;
        return this;
      }
      return own.call(this.namespace, key) && this.namespace[key] || void 0;
    }
    if (key) {
      assertUnfrozen("data", this.frozen);
      this.namespace = key;
      return this;
    }
    return this.namespace;
  }
  /**
   * Freeze a processor.
   *
   * Frozen processors are meant to be extended and not to be configured
   * directly.
   *
   * When a processor is frozen it cannot be unfrozen.
   * New processors working the same way can be created by calling the
   * processor.
   *
   * It’s possible to freeze processors explicitly by calling `.freeze()`.
   * Processors freeze automatically when `.parse()`, `.run()`, `.runSync()`,
   * `.stringify()`, `.process()`, or `.processSync()` are called.
   *
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   The current processor.
   */
  freeze() {
    if (this.frozen) {
      return this;
    }
    const self2 = (
      /** @type {Processor} */
      /** @type {unknown} */
      this
    );
    while (++this.freezeIndex < this.attachers.length) {
      const [attacher, ...options] = this.attachers[this.freezeIndex];
      if (options[0] === false) {
        continue;
      }
      if (options[0] === true) {
        options[0] = void 0;
      }
      const transformer = attacher.call(self2, ...options);
      if (typeof transformer === "function") {
        this.transformers.use(transformer);
      }
    }
    this.frozen = true;
    this.freezeIndex = Number.POSITIVE_INFINITY;
    return this;
  }
  /**
   * Parse text to a syntax tree.
   *
   * > **Note**: `parse` freezes the processor if not already *frozen*.
   *
   * > **Note**: `parse` performs the parse phase, not the run phase or other
   * > phases.
   *
   * @param {Compatible | undefined} [file]
   *   file to parse (optional); typically `string` or `VFile`; any value
   *   accepted as `x` in `new VFile(x)`.
   * @returns {ParseTree extends undefined ? Node : ParseTree}
   *   Syntax tree representing `file`.
   */
  parse(file) {
    this.freeze();
    const realFile = vfile(file);
    const parser = this.parser || this.Parser;
    assertParser("parse", parser);
    return parser(String(realFile), realFile);
  }
  /**
   * Process the given file as configured on the processor.
   *
   * > **Note**: `process` freezes the processor if not already *frozen*.
   *
   * > **Note**: `process` performs the parse, run, and stringify phases.
   *
   * @overload
   * @param {Compatible | undefined} file
   * @param {ProcessCallback<VFileWithOutput<CompileResult>>} done
   * @returns {undefined}
   *
   * @overload
   * @param {Compatible | undefined} [file]
   * @returns {Promise<VFileWithOutput<CompileResult>>}
   *
   * @param {Compatible | undefined} [file]
   *   File (optional); typically `string` or `VFile`]; any value accepted as
   *   `x` in `new VFile(x)`.
   * @param {ProcessCallback<VFileWithOutput<CompileResult>> | undefined} [done]
   *   Callback (optional).
   * @returns {Promise<VFile> | undefined}
   *   Nothing if `done` is given.
   *   Otherwise a promise, rejected with a fatal error or resolved with the
   *   processed file.
   *
   *   The parsed, transformed, and compiled value is available at
   *   `file.value` (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most
   *   > compilers return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  process(file, done) {
    const self2 = this;
    this.freeze();
    assertParser("process", this.parser || this.Parser);
    assertCompiler("process", this.compiler || this.Compiler);
    return done ? executor(void 0, done) : new Promise(executor);
    function executor(resolve, reject) {
      const realFile = vfile(file);
      const parseTree = (
        /** @type {HeadTree extends undefined ? Node : HeadTree} */
        /** @type {unknown} */
        self2.parse(realFile)
      );
      self2.run(parseTree, realFile, function(error, tree, file2) {
        if (error || !tree || !file2) {
          return realDone(error);
        }
        const compileTree = (
          /** @type {CompileTree extends undefined ? Node : CompileTree} */
          /** @type {unknown} */
          tree
        );
        const compileResult = self2.stringify(compileTree, file2);
        if (looksLikeAValue(compileResult)) {
          file2.value = compileResult;
        } else {
          file2.result = compileResult;
        }
        realDone(
          error,
          /** @type {VFileWithOutput<CompileResult>} */
          file2
        );
      });
      function realDone(error, file2) {
        if (error || !file2) {
          reject(error);
        } else if (resolve) {
          resolve(file2);
        } else {
          done(void 0, file2);
        }
      }
    }
  }
  /**
   * Process the given file as configured on the processor.
   *
   * An error is thrown if asynchronous transforms are configured.
   *
   * > **Note**: `processSync` freezes the processor if not already *frozen*.
   *
   * > **Note**: `processSync` performs the parse, run, and stringify phases.
   *
   * @param {Compatible | undefined} [file]
   *   File (optional); typically `string` or `VFile`; any value accepted as
   *   `x` in `new VFile(x)`.
   * @returns {VFileWithOutput<CompileResult>}
   *   The processed file.
   *
   *   The parsed, transformed, and compiled value is available at
   *   `file.value` (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most
   *   > compilers return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  processSync(file) {
    let complete = false;
    let result;
    this.freeze();
    assertParser("processSync", this.parser || this.Parser);
    assertCompiler("processSync", this.compiler || this.Compiler);
    this.process(file, realDone);
    assertDone("processSync", "process", complete);
    return result;
    function realDone(error, file2) {
      complete = true;
      bail(error);
      result = file2;
    }
  }
  /**
   * Run *transformers* on a syntax tree.
   *
   * > **Note**: `run` freezes the processor if not already *frozen*.
   *
   * > **Note**: `run` performs the run phase, not other phases.
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
   * @returns {undefined}
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {Compatible | undefined} file
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
   * @returns {undefined}
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {Compatible | undefined} [file]
   * @returns {Promise<TailTree extends undefined ? Node : TailTree>}
   *
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   *   Tree to transform and inspect.
   * @param {(
   *   RunCallback<TailTree extends undefined ? Node : TailTree> |
   *   Compatible
   * )} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} [done]
   *   Callback (optional).
   * @returns {Promise<TailTree extends undefined ? Node : TailTree> | undefined}
   *   Nothing if `done` is given.
   *   Otherwise, a promise rejected with a fatal error or resolved with the
   *   transformed tree.
   */
  run(tree, file, done) {
    assertNode(tree);
    this.freeze();
    const transformers = this.transformers;
    if (!done && typeof file === "function") {
      done = file;
      file = void 0;
    }
    return done ? executor(void 0, done) : new Promise(executor);
    function executor(resolve, reject) {
      const realFile = vfile(file);
      transformers.run(tree, realFile, realDone);
      function realDone(error, outputTree, file2) {
        const resultingTree = (
          /** @type {TailTree extends undefined ? Node : TailTree} */
          outputTree || tree
        );
        if (error) {
          reject(error);
        } else if (resolve) {
          resolve(resultingTree);
        } else {
          done(void 0, resultingTree, file2);
        }
      }
    }
  }
  /**
   * Run *transformers* on a syntax tree.
   *
   * An error is thrown if asynchronous transforms are configured.
   *
   * > **Note**: `runSync` freezes the processor if not already *frozen*.
   *
   * > **Note**: `runSync` performs the run phase, not other phases.
   *
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   *   Tree to transform and inspect.
   * @param {Compatible | undefined} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @returns {TailTree extends undefined ? Node : TailTree}
   *   Transformed tree.
   */
  runSync(tree, file) {
    let complete = false;
    let result;
    this.run(tree, file, realDone);
    assertDone("runSync", "run", complete);
    return result;
    function realDone(error, tree2) {
      bail(error);
      result = tree2;
      complete = true;
    }
  }
  /**
   * Compile a syntax tree.
   *
   * > **Note**: `stringify` freezes the processor if not already *frozen*.
   *
   * > **Note**: `stringify` performs the stringify phase, not the run phase
   * > or other phases.
   *
   * @param {CompileTree extends undefined ? Node : CompileTree} tree
   *   Tree to compile.
   * @param {Compatible | undefined} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @returns {CompileResult extends undefined ? Value : CompileResult}
   *   Textual representation of the tree (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most compilers
   *   > return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  stringify(tree, file) {
    this.freeze();
    const realFile = vfile(file);
    const compiler2 = this.compiler || this.Compiler;
    assertCompiler("stringify", compiler2);
    assertNode(tree);
    return compiler2(tree, realFile);
  }
  /**
   * Configure the processor to use a plugin, a list of usable values, or a
   * preset.
   *
   * If the processor is already using a plugin, the previous plugin
   * configuration is changed based on the options that are passed in.
   * In other words, the plugin is not added a second time.
   *
   * > **Note**: `use` cannot be called on *frozen* processors.
   * > Call the processor first to create a new unfrozen processor.
   *
   * @example
   *   There are many ways to pass plugins to `.use()`.
   *   This example gives an overview:
   *
   *   ```js
   *   import {unified} from 'unified'
   *
   *   unified()
   *     // Plugin with options:
   *     .use(pluginA, {x: true, y: true})
   *     // Passing the same plugin again merges configuration (to `{x: true, y: false, z: true}`):
   *     .use(pluginA, {y: false, z: true})
   *     // Plugins:
   *     .use([pluginB, pluginC])
   *     // Two plugins, the second with options:
   *     .use([pluginD, [pluginE, {}]])
   *     // Preset with plugins and settings:
   *     .use({plugins: [pluginF, [pluginG, {}]], settings: {position: false}})
   *     // Settings only:
   *     .use({settings: {position: false}})
   *   ```
   *
   * @template {Array<unknown>} [Parameters=[]]
   * @template {Node | string | undefined} [Input=undefined]
   * @template [Output=Input]
   *
   * @overload
   * @param {Preset | null | undefined} [preset]
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {PluggableList} list
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {Plugin<Parameters, Input, Output>} plugin
   * @param {...(Parameters | [boolean])} parameters
   * @returns {UsePlugin<ParseTree, HeadTree, TailTree, CompileTree, CompileResult, Input, Output>}
   *
   * @param {PluggableList | Plugin | Preset | null | undefined} value
   *   Usable value.
   * @param {...unknown} parameters
   *   Parameters, when a plugin is given as a usable value.
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   Current processor.
   */
  use(value, ...parameters) {
    const attachers = this.attachers;
    const namespace = this.namespace;
    assertUnfrozen("use", this.frozen);
    if (value === null || value === void 0) ;
    else if (typeof value === "function") {
      addPlugin(value, parameters);
    } else if (typeof value === "object") {
      if (Array.isArray(value)) {
        addList(value);
      } else {
        addPreset(value);
      }
    } else {
      throw new TypeError("Expected usable value, not `" + value + "`");
    }
    return this;
    function add2(value2) {
      if (typeof value2 === "function") {
        addPlugin(value2, []);
      } else if (typeof value2 === "object") {
        if (Array.isArray(value2)) {
          const [plugin, ...parameters2] = (
            /** @type {PluginTuple<Array<unknown>>} */
            value2
          );
          addPlugin(plugin, parameters2);
        } else {
          addPreset(value2);
        }
      } else {
        throw new TypeError("Expected usable value, not `" + value2 + "`");
      }
    }
    function addPreset(result) {
      if (!("plugins" in result) && !("settings" in result)) {
        throw new Error(
          "Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither"
        );
      }
      addList(result.plugins);
      if (result.settings) {
        namespace.settings = extend$1(true, namespace.settings, result.settings);
      }
    }
    function addList(plugins) {
      let index2 = -1;
      if (plugins === null || plugins === void 0) ;
      else if (Array.isArray(plugins)) {
        while (++index2 < plugins.length) {
          const thing = plugins[index2];
          add2(thing);
        }
      } else {
        throw new TypeError("Expected a list of plugins, not `" + plugins + "`");
      }
    }
    function addPlugin(plugin, parameters2) {
      let index2 = -1;
      let entryIndex = -1;
      while (++index2 < attachers.length) {
        if (attachers[index2][0] === plugin) {
          entryIndex = index2;
          break;
        }
      }
      if (entryIndex === -1) {
        attachers.push([plugin, ...parameters2]);
      } else if (parameters2.length > 0) {
        let [primary, ...rest] = parameters2;
        const currentPrimary = attachers[entryIndex][1];
        if (isPlainObject2(currentPrimary) && isPlainObject2(primary)) {
          primary = extend$1(true, currentPrimary, primary);
        }
        attachers[entryIndex] = [plugin, primary, ...rest];
      }
    }
  }
}
const unified = new Processor().freeze();
function assertParser(name2, value) {
  if (typeof value !== "function") {
    throw new TypeError("Cannot `" + name2 + "` without `parser`");
  }
}
function assertCompiler(name2, value) {
  if (typeof value !== "function") {
    throw new TypeError("Cannot `" + name2 + "` without `compiler`");
  }
}
function assertUnfrozen(name2, frozen) {
  if (frozen) {
    throw new Error(
      "Cannot call `" + name2 + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`."
    );
  }
}
function assertNode(node2) {
  if (!isPlainObject2(node2) || typeof node2.type !== "string") {
    throw new TypeError("Expected node, got `" + node2 + "`");
  }
}
function assertDone(name2, asyncName, complete) {
  if (!complete) {
    throw new Error(
      "`" + name2 + "` finished async. Use `" + asyncName + "` instead"
    );
  }
}
function vfile(value) {
  return looksLikeAVFile(value) ? value : new VFile(value);
}
function looksLikeAVFile(value) {
  return Boolean(
    value && typeof value === "object" && "message" in value && "messages" in value
  );
}
function looksLikeAValue(value) {
  return typeof value === "string" || isUint8Array(value);
}
function isUint8Array(value) {
  return Boolean(
    value && typeof value === "object" && "byteLength" in value && "byteOffset" in value
  );
}
const changelog = "https://github.com/remarkjs/react-markdown/blob/main/changelog.md";
const emptyPlugins = [];
const emptyRemarkRehypeOptions = { allowDangerousHtml: true };
const safeProtocol = /^(https?|ircs?|mailto|xmpp)$/i;
const deprecations = [
  { from: "astPlugins", id: "remove-buggy-html-in-markdown-parser" },
  { from: "allowDangerousHtml", id: "remove-buggy-html-in-markdown-parser" },
  {
    from: "allowNode",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "allowElement"
  },
  {
    from: "allowedTypes",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "allowedElements"
  },
  {
    from: "disallowedTypes",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "disallowedElements"
  },
  { from: "escapeHtml", id: "remove-buggy-html-in-markdown-parser" },
  { from: "includeElementIndex", id: "#remove-includeelementindex" },
  {
    from: "includeNodeIndex",
    id: "change-includenodeindex-to-includeelementindex"
  },
  { from: "linkTarget", id: "remove-linktarget" },
  { from: "plugins", id: "change-plugins-to-remarkplugins", to: "remarkPlugins" },
  { from: "rawSourcePos", id: "#remove-rawsourcepos" },
  { from: "renderers", id: "change-renderers-to-components", to: "components" },
  { from: "source", id: "change-source-to-children", to: "children" },
  { from: "sourcePos", id: "#remove-sourcepos" },
  { from: "transformImageUri", id: "#add-urltransform", to: "urlTransform" },
  { from: "transformLinkUri", id: "#add-urltransform", to: "urlTransform" }
];
function Markdown(options) {
  const processor = createProcessor(options);
  const file = createFile(options);
  return post(processor.runSync(processor.parse(file), file), options);
}
function createProcessor(options) {
  const rehypePlugins = options.rehypePlugins || emptyPlugins;
  const remarkPlugins = options.remarkPlugins || emptyPlugins;
  const remarkRehypeOptions = options.remarkRehypeOptions ? { ...options.remarkRehypeOptions, ...emptyRemarkRehypeOptions } : emptyRemarkRehypeOptions;
  const processor = unified().use(remarkParse).use(remarkPlugins).use(remarkRehype, remarkRehypeOptions).use(rehypePlugins);
  return processor;
}
function createFile(options) {
  const children = options.children || "";
  const file = new VFile();
  if (typeof children === "string") {
    file.value = children;
  }
  return file;
}
function post(tree, options) {
  const allowedElements = options.allowedElements;
  const allowElement = options.allowElement;
  const components = options.components;
  const disallowedElements = options.disallowedElements;
  const skipHtml = options.skipHtml;
  const unwrapDisallowed = options.unwrapDisallowed;
  const urlTransform = options.urlTransform || defaultUrlTransform;
  for (const deprecation of deprecations) {
    if (Object.hasOwn(options, deprecation.from)) {
      unreachable(
        "Unexpected `" + deprecation.from + "` prop, " + (deprecation.to ? "use `" + deprecation.to + "` instead" : "remove it") + " (see <" + changelog + "#" + deprecation.id + "> for more info)"
      );
    }
  }
  if (options.className) {
    tree = {
      type: "element",
      tagName: "div",
      properties: { className: options.className },
      // Assume no doctypes.
      children: (
        /** @type {Array<ElementContent>} */
        tree.type === "root" ? tree.children : [tree]
      )
    };
  }
  visit(tree, transform);
  return toJsxRuntime(tree, {
    Fragment,
    // @ts-expect-error
    // React components are allowed to return numbers,
    // but not according to the types in hast-util-to-jsx-runtime
    components,
    ignoreInvalidStyle: true,
    jsx,
    jsxs,
    passKeys: true,
    passNode: true
  });
  function transform(node2, index2, parent) {
    if (node2.type === "raw" && parent && typeof index2 === "number") {
      if (skipHtml) {
        parent.children.splice(index2, 1);
      } else {
        parent.children[index2] = { type: "text", value: node2.value };
      }
      return index2;
    }
    if (node2.type === "element") {
      let key;
      for (key in urlAttributes) {
        if (Object.hasOwn(urlAttributes, key) && Object.hasOwn(node2.properties, key)) {
          const value = node2.properties[key];
          const test = urlAttributes[key];
          if (test === null || test.includes(node2.tagName)) {
            node2.properties[key] = urlTransform(String(value || ""), key, node2);
          }
        }
      }
    }
    if (node2.type === "element") {
      let remove = allowedElements ? !allowedElements.includes(node2.tagName) : disallowedElements ? disallowedElements.includes(node2.tagName) : false;
      if (!remove && allowElement && typeof index2 === "number") {
        remove = !allowElement(node2, index2, parent);
      }
      if (remove && parent && typeof index2 === "number") {
        if (unwrapDisallowed && node2.children) {
          parent.children.splice(index2, 1, ...node2.children);
        } else {
          parent.children.splice(index2, 1);
        }
        return index2;
      }
    }
  }
}
function defaultUrlTransform(value) {
  const colon = value.indexOf(":");
  const questionMark = value.indexOf("?");
  const numberSign = value.indexOf("#");
  const slash = value.indexOf("/");
  if (
    // If there is no protocol, it’s relative.
    colon === -1 || // If the first colon is after a `?`, `#`, or `/`, it’s not a protocol.
    slash !== -1 && colon > slash || questionMark !== -1 && colon > questionMark || numberSign !== -1 && colon > numberSign || // It is a protocol, it should be allowed.
    safeProtocol.test(value.slice(0, colon))
  ) {
    return value;
  }
  return "";
}
const COOKIE_REGEX = /(?:^|;\s*)jwtToken=([^;]*)/;
function getCookieValue() {
  const match = COOKIE_REGEX.exec(document.cookie);
  return match ? decodeURIComponent(match[1]) : void 0;
}
function getToken() {
  const raw = localStorage.getItem("jwtToken");
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }
  return getCookieValue() ?? null;
}
function getBackendURL() {
  return globalThis.strapi?.backendURL ?? "";
}
function parseSSELine(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("data:")) return null;
  const payload = trimmed.slice(5).trim();
  if (payload === "[DONE]") return null;
  try {
    const parsed = JSON.parse(payload);
    switch (parsed.type) {
      case "text-delta":
        return { type: "text-delta", delta: parsed.delta };
      case "tool-input-available":
        return {
          type: "tool-input-available",
          toolCallId: parsed.toolCallId,
          toolName: parsed.toolName,
          input: parsed.input
        };
      case "tool-output-available":
        return {
          type: "tool-output-available",
          toolCallId: parsed.toolCallId,
          output: parsed.output
        };
      default:
        return null;
    }
  } catch {
  }
  return null;
}
async function readSSEStream(reader, callbacksOrOnDelta) {
  const callbacks = typeof callbacksOrOnDelta === "function" ? { onTextDelta: callbacksOrOnDelta } : callbacksOrOnDelta;
  const decoder = new TextDecoder();
  let buffer = "";
  let accumulated = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const event = parseSSELine(line);
      if (!event) continue;
      switch (event.type) {
        case "text-delta":
          accumulated += event.delta;
          callbacks.onTextDelta(accumulated);
          break;
        case "tool-input-available":
          callbacks.onToolInput?.(event.toolCallId, event.toolName, event.input);
          break;
        case "tool-output-available":
          callbacks.onToolOutput?.(event.toolCallId, event.output);
          break;
      }
    }
  }
  return accumulated;
}
function toUIMessages(messages) {
  return messages.map((message) => ({
    id: message.id,
    role: message.role,
    parts: [{ type: "text", text: message.content }]
  }));
}
async function fetchChatStream(messages) {
  const token = getToken();
  const response = await fetch(`${getBackendURL()}/${PLUGIN_ID}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...token ? { Authorization: `Bearer ${token}` } : {}
    },
    body: JSON.stringify({ messages: toUIMessages(messages) })
  });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response stream");
  return reader;
}
function updateMessage(setMessages, id, updater) {
  setMessages((prev) => prev.map((message) => message.id === id ? updater(message) : message));
}
function removeMessage(setMessages, id) {
  setMessages((prev) => prev.filter((message) => message.id !== id));
}
function useChat(options) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const sendMessage = useCallback(
    async (text2) => {
      const trimmed = text2.trim();
      if (!trimmed || isLoading) return;
      const userMessage = { id: crypto.randomUUID(), role: "user", content: trimmed };
      const assistantId = crypto.randomUUID();
      setMessages((prev) => [...prev, userMessage, { id: assistantId, role: "assistant", content: "" }]);
      setIsLoading(true);
      setError(null);
      try {
        const reader = await fetchChatStream([...messages, userMessage]);
        let streamStarted = false;
        const result = await readSSEStream(reader, {
          onTextDelta: (content2) => {
            if (!streamStarted) {
              streamStarted = true;
              options?.onStreamStart?.();
            }
            updateMessage(setMessages, assistantId, (message) => ({ ...message, content: content2 }));
          },
          onToolInput: (toolCallId, toolName, input) => {
            if (toolName === "triggerAnimation" && input && typeof input === "object" && "animation" in input) {
              options?.onAnimationTrigger?.(String(input.animation));
            }
            updateMessage(setMessages, assistantId, (message) => ({
              ...message,
              toolCalls: [
                ...message.toolCalls ?? [],
                { toolCallId, toolName, input }
              ]
            }));
          },
          onToolOutput: (toolCallId, output) => {
            updateMessage(setMessages, assistantId, (message) => ({
              ...message,
              toolCalls: message.toolCalls?.map(
                (toolCall) => toolCall.toolCallId === toolCallId ? { ...toolCall, output } : toolCall
              )
            }));
          }
        });
        if (!result && !messages.length) {
          updateMessage(setMessages, assistantId, (message) => ({ ...message, content: message.content || "No response received." }));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        removeMessage(setMessages, assistantId);
      } finally {
        setIsLoading(false);
        options?.onStreamEnd?.();
      }
    },
    [isLoading, messages]
  );
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);
  return { messages, sendMessage, clearMessages, isLoading, error };
}
const AvatarAnimationContext = createContext(null);
function AvatarAnimationProvider({ children }) {
  const [currentAnimation, setCurrentAnimation] = useState("idle");
  const [requestId, setRequestId] = useState(0);
  const trigger = useCallback((animation) => {
    setCurrentAnimation(animation);
    setRequestId((prev) => prev + 1);
  }, []);
  const clearAnimation = useCallback(() => {
    setCurrentAnimation("idle");
    setRequestId((prev) => prev + 1);
  }, []);
  return /* @__PURE__ */ jsx(AvatarAnimationContext.Provider, { value: { currentAnimation, requestId, trigger, clearAnimation }, children });
}
function useAvatarAnimation() {
  const ctx = useContext(AvatarAnimationContext);
  if (!ctx) throw new Error("useAvatarAnimation must be used within AvatarAnimationProvider");
  return ctx;
}
function captureRestPose(refs) {
  return {
    rootY: refs.root.position.y,
    hips: refs.hips.quaternion.clone(),
    head: refs.head.quaternion.clone(),
    leftArm: refs.leftArm.quaternion.clone(),
    rightArm: refs.rightArm.quaternion.clone()
  };
}
const _euler = new THREE.Euler();
const _quat = new THREE.Quaternion();
function applyAdditiveRotation(target, restQ, x, y, z) {
  _euler.set(x, y, z);
  _quat.setFromEuler(_euler);
  target.quaternion.copy(restQ).multiply(_quat);
}
const idle = (refs, rest) => {
  let elapsed = 0;
  return {
    update(delta) {
      elapsed += delta;
      refs.root.position.y = rest.rootY + Math.sin(elapsed * 1.2) * 0.012;
      applyAdditiveRotation(
        refs.head,
        rest.head,
        Math.sin(elapsed * 0.5) * 0.06,
        Math.sin(elapsed * 0.3) * 0.05,
        Math.sin(elapsed * 0.7) * 0.05
      );
      applyAdditiveRotation(
        refs.leftArm,
        rest.leftArm,
        Math.sin(elapsed * 0.3) * 0.015,
        0,
        Math.sin(elapsed * 0.4) * 0.01
      );
      applyAdditiveRotation(
        refs.rightArm,
        rest.rightArm,
        Math.sin(elapsed * 0.35) * 0.015,
        0,
        Math.sin(elapsed * 0.35) * -0.01
      );
      return false;
    },
    reset() {
      elapsed = 0;
      refs.root.position.y = rest.rootY;
      refs.head.quaternion.copy(rest.head);
      refs.leftArm.quaternion.copy(rest.leftArm);
      refs.rightArm.quaternion.copy(rest.rightArm);
    }
  };
};
const speak = (refs, rest) => {
  let elapsed = 0;
  return {
    update(delta) {
      elapsed += delta;
      const env2 = Math.min(elapsed / 0.5, 1);
      const nod2 = Math.sin(elapsed * 3.5) * 0.12 * env2;
      const turn = Math.sin(elapsed * 1.8) * 0.1 * env2;
      const tilt = Math.sin(elapsed * 2.3) * 0.06 * env2;
      applyAdditiveRotation(refs.head, rest.head, nod2, turn, tilt);
      const rz = Math.sin(elapsed * 0.8) * 0.06 * env2;
      const rx = Math.sin(elapsed * 0.6) * 0.04 * env2;
      applyAdditiveRotation(refs.rightArm, rest.rightArm, rx, 0, rz);
      const lz = Math.sin(elapsed * 0.7 + 1) * 0.04 * env2;
      const lx = Math.sin(elapsed * 0.5 + 0.5) * 0.03 * env2;
      applyAdditiveRotation(refs.leftArm, rest.leftArm, lx, 0, -lz);
      refs.root.position.y = rest.rootY + Math.sin(elapsed * 2.5) * 8e-3 * env2;
      return false;
    },
    reset() {
      elapsed = 0;
      refs.root.position.y = rest.rootY;
      refs.head.quaternion.copy(rest.head);
      refs.leftArm.quaternion.copy(rest.leftArm);
      refs.rightArm.quaternion.copy(rest.rightArm);
    }
  };
};
const wave = (refs, rest) => {
  let elapsed = 0;
  const duration = 2.5;
  return {
    update(delta) {
      elapsed += delta;
      const t = Math.min(elapsed / duration, 1);
      let rx = 0;
      let ry = 0;
      let rz = 0;
      if (t < 0.2) {
        const f = t / 0.2;
        rx = -f * 1.4;
        rz = f * 1.3;
      } else if (t < 0.8) {
        const w = (t - 0.2) / 0.6;
        rx = -1.4;
        rz = 1.3;
        ry = Math.sin(w * Math.PI * 6) * 0.5;
      } else {
        const f = 1 - (t - 0.8) / 0.2;
        rx = -1.4 * f;
        rz = 1.3 * f;
      }
      applyAdditiveRotation(refs.rightArm, rest.rightArm, rx, ry, rz);
      const headTilt = t < 0.8 ? Math.sin(t * Math.PI * 4) * 0.08 : 0;
      applyAdditiveRotation(refs.head, rest.head, 0, 0, headTilt);
      return elapsed >= duration;
    },
    reset() {
      elapsed = 0;
      refs.rightArm.quaternion.copy(rest.rightArm);
      refs.head.quaternion.copy(rest.head);
    }
  };
};
const nod = (refs, rest) => {
  let elapsed = 0;
  const duration = 2;
  return {
    update(delta) {
      elapsed += delta;
      const t = Math.min(elapsed / duration, 1);
      const env2 = t > 0.85 ? (1 - t) / 0.15 : 1;
      applyAdditiveRotation(
        refs.head,
        rest.head,
        Math.sin(t * Math.PI * 6) * 0.18 * env2,
        0,
        0
      );
      return elapsed >= duration;
    },
    reset() {
      elapsed = 0;
      refs.head.quaternion.copy(rest.head);
    }
  };
};
const think = (refs, rest) => {
  let elapsed = 0;
  const duration = 3.5;
  return {
    update(delta) {
      elapsed += delta;
      const t = Math.min(elapsed / duration, 1);
      let hx = 0, hz = 0, ax = 0, az = 0;
      if (t < 0.2) {
        const f = t / 0.2;
        hz = f * 0.2;
        hx = f * 0.12;
      } else if (t > 0.8) {
        const f = 1 - (t - 0.8) / 0.2;
        hz = 0.2 * f;
        hx = 0.12 * f;
      } else {
        hz = 0.2 + Math.sin(elapsed * 0.8) * 0.03;
        hx = 0.12;
      }
      if (t < 0.2) {
        const f = t / 0.2;
        az = -f * 0.6;
        ax = f * 0.35;
      } else if (t < 0.8) {
        const hold = (t - 0.2) / 0.6;
        az = -0.6 + Math.sin(hold * Math.PI * 2) * 0.06;
        ax = 0.35;
      } else {
        const f = 1 - (t - 0.8) / 0.2;
        az = -0.6 * f;
        ax = 0.35 * f;
      }
      applyAdditiveRotation(refs.head, rest.head, hx, 0, hz);
      applyAdditiveRotation(refs.rightArm, rest.rightArm, ax, 0, az);
      return elapsed >= duration;
    },
    reset() {
      elapsed = 0;
      refs.head.quaternion.copy(rest.head);
      refs.rightArm.quaternion.copy(rest.rightArm);
    }
  };
};
const celebrate = (refs, rest) => {
  let elapsed = 0;
  const duration = 3;
  return {
    update(delta) {
      elapsed += delta;
      const t = Math.min(elapsed / duration, 1);
      const env2 = t > 0.8 ? (1 - t) / 0.2 : 1;
      const bounce = Math.abs(Math.sin(t * Math.PI * 6)) * 0.05 * env2;
      refs.root.position.y = rest.rootY + bounce;
      let lz = 0, rz = 0;
      if (t < 0.15) {
        const f = t / 0.15;
        lz = f * 1.2;
        rz = -f * 1.2;
      } else if (t < 0.8) {
        const w = (t - 0.15) / 0.65;
        lz = 1.2 + Math.sin(w * Math.PI * 8) * 0.25;
        rz = -1.2 - Math.sin(w * Math.PI * 8) * 0.25;
      } else {
        const f = 1 - (t - 0.8) / 0.2;
        lz = 1.2 * f;
        rz = -1.2 * f;
      }
      applyAdditiveRotation(refs.leftArm, rest.leftArm, 0, 0, lz);
      applyAdditiveRotation(refs.rightArm, rest.rightArm, 0, 0, rz);
      applyAdditiveRotation(
        refs.head,
        rest.head,
        Math.sin(elapsed * 4) * 0.1 * env2,
        0,
        Math.sin(elapsed * 3) * 0.06 * env2
      );
      return elapsed >= duration;
    },
    reset() {
      elapsed = 0;
      refs.root.position.y = rest.rootY;
      refs.leftArm.quaternion.copy(rest.leftArm);
      refs.rightArm.quaternion.copy(rest.rightArm);
      refs.head.quaternion.copy(rest.head);
    }
  };
};
const shake = (refs, rest) => {
  let elapsed = 0;
  const duration = 1.5;
  return {
    update(delta) {
      elapsed += delta;
      const t = Math.min(elapsed / duration, 1);
      const env2 = t > 0.8 ? (1 - t) / 0.2 : 1;
      applyAdditiveRotation(
        refs.head,
        rest.head,
        0,
        Math.sin(t * Math.PI * 6) * 0.3 * env2,
        0
      );
      return elapsed >= duration;
    },
    reset() {
      elapsed = 0;
      refs.head.quaternion.copy(rest.head);
    }
  };
};
const spin = (refs, rest) => {
  let elapsed = 0;
  const duration = 2;
  return {
    update(delta) {
      elapsed += delta;
      const t = Math.min(elapsed / duration, 1);
      const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      _euler.set(0, ease * Math.PI * 2, 0);
      _quat.setFromEuler(_euler);
      refs.hips.quaternion.copy(rest.hips).multiply(_quat);
      refs.root.position.y = rest.rootY + Math.sin(t * Math.PI) * 0.03;
      return elapsed >= duration;
    },
    reset() {
      elapsed = 0;
      refs.hips.quaternion.copy(rest.hips);
      refs.root.position.y = rest.rootY;
    }
  };
};
const animationRegistry = {
  idle,
  speak,
  wave,
  nod,
  think,
  celebrate,
  shake,
  spin
};
const SKIN = 16769228;
const SKIN_SHADOW = 15780016;
const HAIR_MAIN = 5978764;
const HAIR_HIGHLIGHT = 8278709;
const SHIRT = 4802047;
const SHIRT_ACCENT = 7105023;
const EYE_IRIS = 4491519;
const EYE_IRIS_INNER = 6728447;
const EYE_PUPIL = 1710638;
const EYE_WHITE = 16777215;
const EYE_HIGHLIGHT = 16777215;
const CHEEK = 16751001;
const MOUTH = 14708848;
const EYEBROW = 3809894;
function toon(color2) {
  const gradientMap = new THREE.DataTexture(
    new Uint8Array([80, 160, 255]),
    3,
    1,
    THREE.RedFormat
  );
  gradientMap.needsUpdate = true;
  return new THREE.MeshToonMaterial({ color: color2, gradientMap });
}
function basic(color2, opts) {
  return new THREE.MeshBasicMaterial({ color: color2, ...opts });
}
function phong(color2, opts) {
  return new THREE.MeshPhongMaterial({ color: color2, shininess: 20, ...opts });
}
function sphere(r, w = 16, h = 16) {
  return new THREE.SphereGeometry(r, w, h);
}
function add(parent, geo, mat, pos, scale, rot) {
  const m = new THREE.Mesh(geo, mat);
  if (pos) m.position.set(...pos);
  if (scale) m.scale.set(...scale);
  if (rot) m.rotation.set(...rot);
  parent.add(m);
  return m;
}
function buildEye(parent, x) {
  const eyeGroup = new THREE.Group();
  eyeGroup.position.set(x, 0.04, 0.26);
  parent.add(eyeGroup);
  add(eyeGroup, sphere(0.065, 16, 16), basic(EYE_WHITE), void 0, [0.8, 1, 0.5]);
  add(eyeGroup, sphere(0.048, 16, 16), phong(EYE_IRIS, { shininess: 60 }), [0, -5e-3, 0.025], [0.85, 1, 0.6]);
  add(eyeGroup, sphere(0.032, 12, 12), phong(EYE_IRIS_INNER, { shininess: 80 }), [0, 5e-3, 0.035], [0.85, 0.9, 0.5]);
  add(eyeGroup, sphere(0.02, 10, 10), basic(EYE_PUPIL), [0, -5e-3, 0.04], [0.8, 1, 0.5]);
  add(eyeGroup, sphere(0.015, 8, 8), basic(EYE_HIGHLIGHT), [0.015, 0.02, 0.05]);
  add(eyeGroup, sphere(8e-3, 6, 6), basic(EYE_HIGHLIGHT), [-0.01, -0.015, 0.05]);
  add(
    eyeGroup,
    new THREE.TorusGeometry(0.055, 8e-3, 8, 16, Math.PI),
    basic(EYEBROW),
    [0, 0.04, 0.02],
    void 0,
    [Math.PI, 0, 0]
  );
  return eyeGroup;
}
function buildPlaceholderModel() {
  const root2 = new THREE.Group();
  add(root2, new THREE.CylinderGeometry(0.28, 0.24, 0.5, 16), toon(SHIRT), [0, -0.5, 0]);
  add(root2, new THREE.CylinderGeometry(0.14, 0.28, 0.12, 16), toon(SHIRT_ACCENT), [0, -0.22, 0]);
  add(root2, sphere(0.1, 12, 12), toon(SHIRT), [-0.28, -0.28, 0]);
  add(root2, sphere(0.1, 12, 12), toon(SHIRT), [0.28, -0.28, 0]);
  add(root2, new THREE.CylinderGeometry(0.07, 0.09, 0.12, 8), toon(SKIN), [0, -0.1, 0]);
  const head = new THREE.Group();
  head.position.set(0, 0.28, 0);
  root2.add(head);
  add(head, sphere(0.34, 32, 32), toon(SKIN), void 0, [1, 1.05, 0.95]);
  add(
    head,
    sphere(0.2, 16, 16),
    phong(SKIN_SHADOW, { transparent: true, opacity: 0.3 }),
    [0, -0.18, 0.12],
    [1.4, 0.5, 1]
  );
  buildEye(head, -0.11);
  buildEye(head, 0.11);
  add(
    head,
    new THREE.CapsuleGeometry(0.012, 0.06, 4, 8),
    basic(EYEBROW),
    [-0.11, 0.12, 0.28],
    void 0,
    [0, 0, 0.15]
  );
  add(
    head,
    new THREE.CapsuleGeometry(0.012, 0.06, 4, 8),
    basic(EYEBROW),
    [0.11, 0.12, 0.28],
    void 0,
    [0, 0, -0.15]
  );
  add(head, sphere(0.012, 6, 6), phong(SKIN_SHADOW), [0, -0.04, 0.32]);
  add(
    head,
    new THREE.TorusGeometry(0.025, 6e-3, 8, 12, Math.PI),
    basic(MOUTH),
    [0, -0.1, 0.3],
    void 0,
    [0.15, 0, 0]
  );
  add(
    head,
    sphere(0.04, 8, 8),
    basic(CHEEK, { transparent: true, opacity: 0.35 }),
    [-0.19, -0.04, 0.22],
    [1.3, 0.7, 0.5]
  );
  add(
    head,
    sphere(0.04, 8, 8),
    basic(CHEEK, { transparent: true, opacity: 0.35 }),
    [0.19, -0.04, 0.22],
    [1.3, 0.7, 0.5]
  );
  const hairMat = toon(HAIR_MAIN);
  const hairHiMat = toon(HAIR_HIGHLIGHT);
  add(head, sphere(0.36, 24, 24), hairMat, [0, 0.08, -0.06], [1.05, 1, 1]);
  add(head, sphere(0.28, 20, 20), hairHiMat, [0, 0.22, 0], [1.1, 0.7, 0.95]);
  add(head, sphere(0.1, 12, 12), hairMat, [-0.18, 0.2, 0.2], [0.9, 0.7, 0.7]);
  add(head, sphere(0.12, 12, 12), hairHiMat, [-0.06, 0.22, 0.22], [0.8, 0.65, 0.7]);
  add(head, sphere(0.11, 12, 12), hairMat, [0.08, 0.23, 0.2], [0.85, 0.6, 0.7]);
  add(head, sphere(0.09, 12, 12), hairHiMat, [0.19, 0.19, 0.18], [0.8, 0.65, 0.65]);
  add(head, sphere(0.09, 12, 12), hairMat, [-0.3, 0, 0.05], [0.5, 1.4, 0.6]);
  add(head, sphere(0.08, 12, 12), hairHiMat, [-0.28, -0.15, 0.08], [0.45, 1, 0.55]);
  add(head, sphere(0.09, 12, 12), hairMat, [0.3, 0, 0.05], [0.5, 1.4, 0.6]);
  add(head, sphere(0.08, 12, 12), hairHiMat, [0.28, -0.15, 0.08], [0.45, 1, 0.55]);
  const ahoge = new THREE.Group();
  ahoge.position.set(0.02, 0.38, 0.1);
  ahoge.rotation.set(-0.3, 0, 0.2);
  head.add(ahoge);
  add(ahoge, new THREE.ConeGeometry(0.02, 0.15, 6), hairHiMat, [0, 0.07, 0]);
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.35, -0.3, 0);
  root2.add(leftArm);
  add(leftArm, new THREE.CapsuleGeometry(0.06, 0.18, 8, 8), toon(SHIRT), [0, -0.12, 0]);
  add(leftArm, sphere(0.055, 10, 10), toon(SKIN), [0, -0.28, 0]);
  const rightArm = new THREE.Group();
  rightArm.position.set(0.35, -0.3, 0);
  root2.add(rightArm);
  add(rightArm, new THREE.CapsuleGeometry(0.06, 0.18, 8, 8), toon(SHIRT), [0, -0.12, 0]);
  add(rightArm, sphere(0.055, 10, 10), toon(SKIN), [0, -0.28, 0]);
  return { scene: root2, refs: { root: root2, hips: root2, head, leftArm, rightArm } };
}
const MODEL_PATH = "/models/avatar.glb";
function collectSkeletonBones(root2) {
  const bones = [];
  const seen = /* @__PURE__ */ new Set();
  root2.traverse((child) => {
    if (child.isSkinnedMesh) {
      const skeleton = child.skeleton;
      if (skeleton) {
        for (const bone of skeleton.bones) {
          if (!seen.has(bone.id)) {
            seen.add(bone.id);
            bones.push(bone);
          }
        }
      }
    }
  });
  return bones;
}
function findBone(bones, names) {
  for (const bone of bones) {
    if (names.includes(bone.name)) return bone;
  }
  for (const bone of bones) {
    for (const name2 of names) {
      if (bone.name.startsWith(name2)) return bone;
    }
  }
  const lower = names.map((n) => n.toLowerCase());
  for (const bone of bones) {
    const boneLower = bone.name.toLowerCase();
    for (const name2 of lower) {
      if (boneLower.startsWith(name2)) return bone;
    }
  }
  return null;
}
function extractRefsFromGLTF(model) {
  const bones = collectSkeletonBones(model);
  console.log(
    "[Avatar3D] Found",
    bones.length,
    "skeleton bones:",
    bones.map((b) => b.name)
  );
  const hips = findBone(bones, [
    "Hips",
    "hips",
    "J_Bip_C_Hips",
    "mixamorigHips",
    "Pelvis",
    "pelvis",
    "Root",
    "root"
  ]);
  const head = findBone(bones, [
    "Head",
    "head",
    "J_Bip_C_Head",
    "mixamorigHead"
  ]);
  const leftArm = findBone(bones, [
    "Left arm",
    "Left_arm",
    "LeftArm",
    "leftArm",
    "J_Bip_L_UpperArm",
    "mixamorigLeftArm",
    "arm_L",
    "Arm.L",
    "Left shoulder",
    "Left_shoulder"
  ]);
  const rightArm = findBone(bones, [
    "Right arm",
    "Right_arm",
    "RightArm",
    "rightArm",
    "J_Bip_R_UpperArm",
    "mixamorigRightArm",
    "arm_R",
    "Arm.R",
    "Right shoulder",
    "Right_shoulder"
  ]);
  console.log("[Avatar3D] Bone mapping:", {
    hips: hips?.name ?? "NOT FOUND (using root)",
    head: head?.name ?? "NOT FOUND (using root)",
    leftArm: leftArm?.name ?? "NOT FOUND (using root)",
    rightArm: rightArm?.name ?? "NOT FOUND (using root)"
  });
  return {
    root: model,
    hips: hips ?? model,
    head: head ?? model,
    leftArm: leftArm ?? model,
    rightArm: rightArm ?? model
  };
}
function Avatar3D() {
  const containerRef = useRef(null);
  const { currentAnimation, requestId, clearAnimation } = useAvatarAnimation();
  const stateRef = useRef(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const width = el.clientWidth;
    const height = el.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(15263472);
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
    camera.position.set(0, 0.85, -1.8);
    scene.add(new THREE.AmbientLight(16777215, 0.7));
    const keyLight = new THREE.DirectionalLight(16777215, 0.9);
    keyLight.position.set(1, 2, 3);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(14544639, 0.3);
    fillLight.position.set(-2, 1, -1);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(11193599, 0.4);
    rimLight.position.set(0, 1, -3);
    scene.add(rimLight);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.8, 0);
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 1;
    controls.maxDistance = 3.5;
    controls.minPolarAngle = Math.PI / 3;
    controls.maxPolarAngle = Math.PI / 1.8;
    controls.minAzimuthAngle = -Math.PI / 6;
    controls.maxAzimuthAngle = Math.PI / 6;
    const clock = new THREE.Clock();
    function setupAnimations(refs) {
      const rest = captureRestPose(refs);
      const idleClip = animationRegistry.idle(refs, rest);
      const state = {
        renderer,
        scene,
        camera,
        controls,
        refs,
        rest,
        idleClip,
        activeClip: null,
        lastRequestId: -1,
        animationFrameId: 0,
        clock
      };
      stateRef.current = state;
      function animate() {
        state.animationFrameId = requestAnimationFrame(animate);
        const delta = Math.min(state.clock.getDelta(), 0.1);
        state.idleClip.update(delta);
        if (state.activeClip) {
          const done = state.activeClip.update(delta);
          if (done) {
            state.activeClip.reset();
            state.activeClip = null;
          }
        }
        state.controls.update();
        renderer.render(scene, camera);
      }
      animate();
    }
    {
      const savedCreateImageBitmap = window.createImageBitmap;
      window.createImageBitmap = void 0;
      const loader = new GLTFLoader();
      loader.load(
        MODEL_PATH,
        (gltf) => {
          const model = gltf.scene;
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 1.2 / maxDim;
          model.scale.setScalar(scale);
          model.rotation.y = 0.45;
          const scaledBox = new THREE.Box3().setFromObject(model);
          const center = scaledBox.getCenter(new THREE.Vector3());
          model.position.x -= center.x;
          model.position.z -= center.z;
          window.createImageBitmap = savedCreateImageBitmap;
          model.traverse((child) => {
            if (child.isMesh) {
              const mesh = child;
              const mat = mesh.material;
              console.log(`[Avatar3D] Mesh "${mesh.name}":`, {
                type: mat.type,
                hasMap: !!mat.map,
                hasImage: !!mat.map?.image
              });
            }
          });
          const wrapper = new THREE.Group();
          wrapper.add(model);
          scene.add(wrapper);
          const finalBox = new THREE.Box3().setFromObject(wrapper);
          const min = finalBox.min;
          const max = finalBox.max;
          const modelHeight = max.y - min.y;
          const faceY = min.y + modelHeight * 0.78;
          camera.position.set(0, faceY, -modelHeight * 0.9);
          controls.target.set(0, faceY, 0);
          controls.update();
          console.log("[Avatar3D] Model bounds:", {
            height: modelHeight.toFixed(2),
            cameraY: faceY.toFixed(2)
          });
          const refs = extractRefsFromGLTF(model);
          refs.root = wrapper;
          refs.hips = wrapper;
          setupAnimations(refs);
        },
        void 0,
        () => {
          window.createImageBitmap = savedCreateImageBitmap;
          const { scene: model, refs } = buildPlaceholderModel();
          scene.add(model);
          setupAnimations(refs);
        }
      );
    }
    const observer = new ResizeObserver(() => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      const s = stateRef.current;
      if (s) cancelAnimationFrame(s.animationFrameId);
      controls.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      stateRef.current = null;
    };
  }, []);
  useEffect(() => {
    const state = stateRef.current;
    if (!state || requestId === state.lastRequestId) return;
    state.lastRequestId = requestId;
    if (state.activeClip) {
      state.activeClip.reset();
      state.activeClip = null;
    }
    if (currentAnimation !== "idle") {
      const factory = animationRegistry[currentAnimation];
      if (factory) {
        state.activeClip = factory(state.refs, state.rest);
      }
    }
  }, [currentAnimation, requestId]);
  useEffect(() => {
    if (currentAnimation === "idle") return;
    const interval = setInterval(() => {
      const state = stateRef.current;
      if (state && state.activeClip === null) clearAnimation();
    }, 100);
    return () => clearInterval(interval);
  }, [currentAnimation, clearAnimation]);
  return /* @__PURE__ */ jsx("div", { ref: containerRef, style: { width: "100%", height: "100%" } });
}
const Panel = styled.div`
  width: 280px;
  min-width: 280px;
  border-right: 1px solid #eaeaef;
  background: linear-gradient(180deg, #f0f0ff 0%, #f6f6f9 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 24px;
  gap: 12px;
`;
const AvatarContainer = styled.div`
  width: 250px;
  height: 300px;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(180deg, #e8e8ff 0%, #f0f0f8 100%);
  box-shadow: 0 2px 8px rgba(73, 69, 255, 0.1);
`;
const Label = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #666687;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;
function AvatarPanel() {
  return /* @__PURE__ */ jsxs(Panel, { children: [
    /* @__PURE__ */ jsx(AvatarContainer, { children: /* @__PURE__ */ jsx(Avatar3D, {}) }),
    /* @__PURE__ */ jsx(Label, { children: "AI Assistant" })
  ] });
}
const waifuAvatar = "data:image/png;base64,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";
const ChatLayout = styled.div`
  display: flex;
  flex-direction: row;
  height: calc(100vh - 200px);
  min-height: 400px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(33, 33, 52, 0.1);
  background: #ffffff;
`;
const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;
const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const MessageRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  align-self: ${({ $isUser }) => $isUser ? "flex-end" : "flex-start"};
  max-width: 80%;
`;
const Avatar = styled.img`
  width: 104px;
  height: 104px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;
const MessageBubble = styled.div`
  min-width: 0;
  background-color: ${({ $isUser }) => $isUser ? "#4945ff" : "#f6f6f9"};
  color: ${({ $isUser }) => $isUser ? "#ffffff" : "#32324d"};
  border-radius: ${({ $isUser }) => $isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px"};
  padding: 12px 16px;
  font-size: 15px;
  word-break: break-word;
  line-height: 1.6;
`;
const MarkdownBody = styled.div`
  p { margin: 0 0 8px; &:last-child { margin-bottom: 0; } }
  ul, ol { margin: 4px 0; padding-left: 20px; }
  li { margin: 2px 0; }
  code {
    font-size: 0.85em;
    padding: 1px 4px;
    border-radius: 3px;
    background: ${({ $isUser }) => $isUser ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.06)"};
  }
  pre {
    margin: 8px 0;
    padding: 8px 10px;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 0.85em;
    background: ${({ $isUser }) => $isUser ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.04)"};
    code { padding: 0; background: none; }
  }
  h1, h2, h3, h4 { margin: 12px 0 4px; &:first-child { margin-top: 0; } }
  h1 { font-size: 1.3em; } h2 { font-size: 1.15em; } h3 { font-size: 1.05em; }
  blockquote {
    margin: 8px 0;
    padding-left: 12px;
    border-left: 3px solid ${({ $isUser }) => $isUser ? "rgba(255,255,255,0.3)" : "#dcdce4"};
    opacity: 0.85;
  }
  a { color: ${({ $isUser }) => $isUser ? "#c0cfff" : "#4945ff"}; }
  table { border-collapse: collapse; margin: 8px 0; font-size: 0.9em; }
  th, td { border: 1px solid ${({ $isUser }) => $isUser ? "rgba(255,255,255,0.2)" : "#dcdce4"}; padding: 4px 8px; }
`;
const MessageRole = styled.div`
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 4px;
  opacity: 0.7;
  color: ${({ $isUser }) => $isUser ? "#ffffff" : "#666687"};
`;
const InputArea = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
  padding: 16px;
  border-top: 1px solid #eaeaef;
`;
const TypingDots = styled.span`
  display: inline-flex;
  gap: 4px;

  span {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #a5a5ba;
    animation: bounce 1.4s infinite ease-in-out both;
  }
  span:nth-child(1) { animation-delay: 0s; }
  span:nth-child(2) { animation-delay: 0.2s; }
  span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0.4); opacity: 0.4; }
    40% { transform: scale(1); opacity: 1; }
  }
`;
const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: #a5a5ba;
`;
const ToolCallBox = styled.div`
  margin-top: 8px;
  border: 1px solid #dcdce4;
  border-radius: 8px;
  overflow: hidden;
  font-size: 13px;
`;
const ToolCallHeader = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 8px 12px;
  background: #eaeaef;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: #32324d;
  text-align: left;

  &:hover {
    background: #dcdce4;
  }
`;
const ToolCallContent = styled.pre`
  margin: 0;
  padding: 8px 12px;
  background: #fafafa;
  font-size: 11px;
  line-height: 1.4;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-word;
`;
const HIDDEN_TOOLS = /* @__PURE__ */ new Set(["triggerAnimation"]);
function ToolCallDisplay({ toolCall }) {
  const [expanded, setExpanded] = useState(false);
  return /* @__PURE__ */ jsxs(ToolCallBox, { children: [
    /* @__PURE__ */ jsxs(ToolCallHeader, { onClick: () => setExpanded(!expanded), children: [
      /* @__PURE__ */ jsx("span", { children: expanded ? "▼" : "▶" }),
      /* @__PURE__ */ jsxs("span", { children: [
        "Tool: ",
        toolCall.toolName
      ] }),
      toolCall.output !== void 0 && /* @__PURE__ */ jsx("span", { style: { marginLeft: "auto", fontWeight: 400, opacity: 0.6 }, children: "completed" })
    ] }),
    expanded && /* @__PURE__ */ jsx(ToolCallContent, { children: toolCall.output !== void 0 ? JSON.stringify(toolCall.output, null, 2) : "Waiting for result..." })
  ] });
}
function Chat() {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const { trigger, clearAnimation } = useAvatarAnimation();
  const { messages, sendMessage, isLoading, error } = useChat({
    onAnimationTrigger: trigger,
    onStreamStart: () => trigger("speak"),
    onStreamEnd: () => clearAnimation()
  });
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
  };
  return /* @__PURE__ */ jsxs(ChatLayout, { children: [
    /* @__PURE__ */ jsx(AvatarPanel, {}),
    /* @__PURE__ */ jsxs(ChatWrapper, { children: [
      /* @__PURE__ */ jsxs(MessagesArea, { children: [
        messages.length === 0 && /* @__PURE__ */ jsxs(EmptyState, { children: [
          /* @__PURE__ */ jsx(Typography, { variant: "beta", textColor: "neutral400", children: "AI Chat" }),
          /* @__PURE__ */ jsx(Box, { paddingTop: 2, children: /* @__PURE__ */ jsx(Typography, { variant: "omega", textColor: "neutral500", children: "Send a message to start the conversation" }) })
        ] }),
        messages.map((message) => /* @__PURE__ */ jsxs(MessageRow, { $isUser: message.role === "user", children: [
          message.role === "assistant" && /* @__PURE__ */ jsx(Avatar, { src: waifuAvatar, alt: "Assistant" }),
          /* @__PURE__ */ jsxs(MessageBubble, { $isUser: message.role === "user", children: [
            /* @__PURE__ */ jsx(MessageRole, { $isUser: message.role === "user", children: message.role === "user" ? "You" : "Assistant" }),
            message.role === "assistant" ? message.content ? /* @__PURE__ */ jsx(MarkdownBody, { $isUser: false, children: /* @__PURE__ */ jsx(Markdown, { children: message.content }) }) : isLoading ? /* @__PURE__ */ jsxs(TypingDots, { children: [
              /* @__PURE__ */ jsx("span", {}),
              /* @__PURE__ */ jsx("span", {}),
              /* @__PURE__ */ jsx("span", {})
            ] }) : null : message.content,
            message.toolCalls?.filter((tc) => !HIDDEN_TOOLS.has(tc.toolName)).map((tc) => /* @__PURE__ */ jsx(ToolCallDisplay, { toolCall: tc }, tc.toolCallId))
          ] })
        ] }, message.id)),
        /* @__PURE__ */ jsx("div", { ref: messagesEndRef })
      ] }),
      error && /* @__PURE__ */ jsx(Box, { padding: 3, background: "danger100", marginLeft: 4, marginRight: 4, children: /* @__PURE__ */ jsxs(Typography, { textColor: "danger600", children: [
        "Error: ",
        error
      ] }) }),
      /* @__PURE__ */ jsx(
        "form",
        {
          onSubmit: (e) => {
            e.preventDefault();
            handleSend();
          },
          children: /* @__PURE__ */ jsxs(InputArea, { children: [
            /* @__PURE__ */ jsx(Box, { flex: "1", children: /* @__PURE__ */ jsx(
              TextInput,
              {
                placeholder: "Type your message...",
                "aria-label": "Chat message",
                value: input,
                onChange: (e) => setInput(e.target.value)
              }
            ) }),
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "submit",
                disabled: isLoading || !input.trim(),
                loading: isLoading,
                size: "L",
                startIcon: /* @__PURE__ */ jsx(Sparkle, {}),
                children: "Send"
              }
            )
          ] })
        }
      )
    ] })
  ] });
}
const HomePage = () => {
  return /* @__PURE__ */ jsxs(Main, { children: [
    /* @__PURE__ */ jsx(
      Layouts.Header,
      {
        title: "AI Chat",
        subtitle: "Chat with AI powered by Vercel AI SDK"
      }
    ),
    /* @__PURE__ */ jsx(Layouts.Content, { children: /* @__PURE__ */ jsx(AvatarAnimationProvider, { children: /* @__PURE__ */ jsx(Chat, {}) }) })
  ] });
};
const App = () => {
  return /* @__PURE__ */ jsxs(Routes, { children: [
    /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(HomePage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(Page.Error, {}) })
  ] });
};
export {
  App
};
