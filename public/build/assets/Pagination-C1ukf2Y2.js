import{c}from"./button-BSRvVZPc.js";import{j as r,L as n}from"./app-MPP7RAXK.js";/**
 * @license lucide-react v1.0.1 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],h=c("chevron-left",a);/**
 * @license lucide-react v1.0.1 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],d=c("chevron-right",l);/**
 * @license lucide-react v1.0.1 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]],g=c("search",u);function p({links:s,meta:e}){return!s||s.length<=3?null:r.jsxs("div",{className:"flex items-center justify-between pt-4",children:[r.jsxs("p",{className:"text-sm text-gray-500",children:["Mostrando ",(e==null?void 0:e.from)||0," a ",(e==null?void 0:e.to)||0," de ",(e==null?void 0:e.total)||0," resultados"]}),r.jsx("div",{className:"flex items-center gap-1",children:s.map((t,o)=>o===0?r.jsx(n,{href:t.url||"#",className:`p-2 rounded-md text-sm ${t.url?"text-gray-600 hover:bg-gray-100":"text-gray-300 pointer-events-none"}`,preserveScroll:!0,children:r.jsx(h,{className:"w-4 h-4"})},"prev"):o===s.length-1?r.jsx(n,{href:t.url||"#",className:`p-2 rounded-md text-sm ${t.url?"text-gray-600 hover:bg-gray-100":"text-gray-300 pointer-events-none"}`,preserveScroll:!0,children:r.jsx(d,{className:"w-4 h-4"})},"next"):r.jsx(n,{href:t.url||"#",className:`px-3 py-1.5 rounded-md text-sm font-medium ${t.active?"bg-indigo-600 text-white":"text-gray-600 hover:bg-gray-100"}`,preserveScroll:!0,dangerouslySetInnerHTML:{__html:t.label}},o))})]})}export{p as P,g as S};
