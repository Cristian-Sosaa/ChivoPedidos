import{r as i,j as e,L as le,a as v}from"./app-MPP7RAXK.js";import{u as Ne,A as we,b as oe,P as Ce}from"./AuthenticatedLayout-BdGqft-E.js";import{C as ke}from"./ConfirmDialog-Drj_9QUZ.js";import{c as k,B as o}from"./button-BSRvVZPc.js";import{I as A}from"./input-BxWDMz33.js";import{B as N}from"./badge-DjSEL2Wi.js";import{C as c,a as d,b as w,c as C}from"./card-dE4VZlgp.js";import{A as Se}from"./arrow-left-CVYGrqC8.js";import{U as _e}from"./user-BZdlvX3v.js";import{P as ce}from"./plus-DdR0ndh6.js";import{T as $e}from"./trash-2-Dwv8kbtN.js";import"./triangle-alert-5Xe8OdLn.js";/**
 * @license lucide-react v1.0.1 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ze=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 18h.01",key:"lrp35t"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M16 18h.01",key:"kzsmim"}]],Ee=k("calendar-days",ze);/**
 * @license lucide-react v1.0.1 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pe=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 6v6l4 2",key:"mmk7yg"}]],Ae=k("clock",Pe);/**
 * @license lucide-react v1.0.1 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Me=[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]],De=k("printer",Me);/**
 * @license lucide-react v1.0.1 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ie=[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]],de=k("send",Ie),xe={pendiente:"warning",en_proceso:"default",enviado:"default",entregado:"success",cancelado:"destructive"},f={pendiente:"Pendiente",en_proceso:"En proceso",enviado:"Enviado",entregado:"Entregado",cancelado:"Cancelado"};function r(s){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(s||0)}function me(s){return new Date(s).toLocaleDateString("es-SV",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"})}function he(s){return new Date(s).toLocaleDateString("es-SV",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function Ge({pedido:s,estados:ge,totalPagado:pe,saldoPendiente:S,productosDisponibles:M}){var Y,q,G,J,Q,W,X,Z,ee,te,se,ae,re;const{can:D}=Ne(),[b,I]=i.useState(""),[T,F]=i.useState(""),[_,x]=i.useState(!1),[L,$]=i.useState(!1),[j,U]=i.useState(""),[R,B]=i.useState(1),[m,z]=i.useState(null),[ue,E]=i.useState(null),[V,P]=i.useState(""),H=((Y=s.estado)==null?void 0:Y.nombre)==="cancelado",fe=((q=s.estado)==null?void 0:q.nombre)==="entregado",l=D("pedidos.editar")&&!H&&!fe,O=i.useRef(null);function be(t){t.preventDefault(),b&&(x(!0),v.patch(`/pedidos/${s.id}/estado`,{estado_id:b,comentario:T||null},{preserveScroll:!0,onFinish:()=>{x(!1),I(""),F("")}}))}function je(t){t.preventDefault(),j&&(x(!0),v.post(`/pedidos/${s.id}/detalle`,{producto_id:j,cantidad:R},{preserveScroll:!0,onFinish:()=>{x(!1),U(""),B(1),$(!1)}}))}function ye(){m&&v.delete(`/pedidos/${s.id}/detalle/${m.id}`,{preserveScroll:!0,onFinish:()=>z(null)})}function K(t){const a=parseInt(V);!a||a<1||(x(!0),v.patch(`/pedidos/${s.id}/detalle/${t}/cantidad`,{cantidad:a},{preserveScroll:!0,onFinish:()=>{x(!1),E(null),P("")}}))}function ve(){var n,h,g,p,u,ne;if(!O.current)return;const a=window.open("","_blank");a.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Pedido #${String(s.id).padStart(4,"0")}</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333; }
                    h1 { font-size: 22px; margin-bottom: 4px; }
                    .subtitle { color: #666; font-size: 13px; margin-bottom: 20px; }
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
                    .info-item label { font-size: 11px; color: #999; text-transform: uppercase; display: block; }
                    .info-item span { font-size: 14px; font-weight: 600; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    th { text-align: left; padding: 8px; border-bottom: 2px solid #ddd; font-size: 12px; color: #666; }
                    td { padding: 8px; border-bottom: 1px solid #eee; font-size: 13px; }
                    .text-right { text-align: right; }
                    .text-center { text-align: center; }
                    .total-row td { border-top: 2px solid #333; font-weight: bold; font-size: 15px; }
                    .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
                    .badge-pendiente { background: #fef3c7; color: #92400e; }
                    .badge-en_proceso { background: #dbeafe; color: #1e40af; }
                    .badge-enviado { background: #e0e7ff; color: #3730a3; }
                    .badge-entregado { background: #d1fae5; color: #065f46; }
                    .badge-cancelado { background: #fee2e2; color: #991b1b; }
                    .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 15px; }
                    @media print { body { padding: 0; } }
                </style>
            </head>
            <body>
                <h1>Pedido #${String(s.id).padStart(4,"0")}</h1>
                <p class="subtitle">Fecha: ${me(s.created_at)}</p>

                <div class="info-grid">
                    <div class="info-item">
                        <label>Cliente</label>
                        <span>${(n=s.cliente)==null?void 0:n.nombre}</span>
                    </div>
                    <div class="info-item">
                        <label>Estado</label>
                        <span class="badge badge-${(h=s.estado)==null?void 0:h.nombre}">${f[(g=s.estado)==null?void 0:g.nombre]||((p=s.estado)==null?void 0:p.nombre)}</span>
                    </div>
                    <div class="info-item">
                        <label>Atendido por</label>
                        <span>${(u=s.usuario)==null?void 0:u.name}</span>
                    </div>
                    <div class="info-item">
                        <label>Total</label>
                        <span>${r(s.total)}</span>
                    </div>
                </div>

                ${s.observaciones?`<p style="font-size:13px;color:#555;margin-bottom:16px;"><strong>Observaciones:</strong> ${s.observaciones}</p>`:""}

                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th class="text-center">Cant.</th>
                            <th class="text-right">P. Unit.</th>
                            <th class="text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(ne=s.detalles)==null?void 0:ne.map(y=>{var ie;return`
                            <tr>
                                <td>${(ie=y.producto)==null?void 0:ie.nombre}</td>
                                <td class="text-center">${y.cantidad}</td>
                                <td class="text-right">${r(y.precio_unitario)}</td>
                                <td class="text-right">${r(y.subtotal)}</td>
                            </tr>
                        `}).join("")}
                        <tr class="total-row">
                            <td colspan="3" class="text-right">Total:</td>
                            <td class="text-right">${r(s.total)}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="footer">
                    <p>Chivo Pedidos — Comprobante de pedido</p>
                </div>
            </body>
            </html>
        `),a.document.close(),a.print()}return e.jsxs(we,{children:[e.jsxs("div",{className:"max-w-4xl mx-auto space-y-6",ref:O,children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(le,{href:"/pedidos",children:e.jsx(o,{variant:"ghost",size:"icon",children:e.jsx(Se,{className:"w-5 h-5"})})}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsxs("h1",{className:"text-2xl font-bold text-gray-900",children:["Pedido #",String(s.id).padStart(4,"0")]}),e.jsx(N,{variant:xe[(G=s.estado)==null?void 0:G.nombre]||"secondary",children:f[(J=s.estado)==null?void 0:J.nombre]||((Q=s.estado)==null?void 0:Q.nombre)})]}),e.jsxs("p",{className:"mt-1 text-sm text-gray-500",children:["Creado el ",me(s.created_at)," por ",(W=s.usuario)==null?void 0:W.name]})]})]}),e.jsxs(o,{variant:"outline",size:"sm",onClick:ve,className:"hidden sm:flex",children:[e.jsx(De,{className:"w-4 h-4 mr-2"}),"Imprimir"]})]}),e.jsxs("div",{className:"grid grid-cols-1 gap-4 sm:grid-cols-3",children:[e.jsx(c,{children:e.jsxs(d,{className:"flex items-center gap-3 p-4",children:[e.jsx("div",{className:"flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg",children:e.jsx(_e,{className:"w-5 h-5 text-blue-600"})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-gray-500",children:"Cliente"}),e.jsx("p",{className:"font-semibold text-gray-900",children:(X=s.cliente)==null?void 0:X.nombre})]})]})}),e.jsx(c,{children:e.jsxs(d,{className:"flex items-center gap-3 p-4",children:[e.jsx("div",{className:"flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg",children:e.jsx(oe,{className:"w-5 h-5 text-green-600"})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-gray-500",children:"Total / Pagado"}),e.jsxs("p",{className:"font-semibold text-gray-900",children:[r(s.total),e.jsxs("span",{className:"ml-1 text-xs font-normal text-gray-400",children:["/ ",r(pe)]})]})]})]})}),e.jsx(c,{children:e.jsxs(d,{className:"flex items-center gap-3 p-4",children:[e.jsx("div",{className:"flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100",children:e.jsx(Ee,{className:"w-5 h-5 text-amber-600"})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-gray-500",children:"Saldo pendiente"}),e.jsx("p",{className:`font-semibold ${S>0,""}`,children:r(S)})]})]})})]}),s.observaciones&&e.jsx(c,{children:e.jsxs(d,{className:"p-4",children:[e.jsx("p",{className:"mb-1 text-xs text-gray-500",children:"Observaciones"}),e.jsx("p",{className:"text-sm text-gray-700",children:s.observaciones})]})}),e.jsxs(c,{children:[e.jsx(w,{children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs(C,{className:"flex items-center gap-2 text-base",children:[e.jsx(Ce,{className:"w-4 h-4"}),"Productos (",((Z=s.detalles)==null?void 0:Z.length)||0,")"]}),l&&M.length>0&&e.jsxs(o,{variant:"outline",size:"sm",onClick:()=>$(!L),children:[e.jsx(ce,{className:"w-4 h-4 mr-1"}),"Agregar"]})]})}),e.jsxs(d,{children:[L&&e.jsxs("form",{onSubmit:je,className:"flex flex-col gap-3 p-3 mb-4 border border-gray-100 rounded-lg sm:flex-row bg-gray-50",children:[e.jsx("div",{className:"flex-1",children:e.jsxs("select",{value:j,onChange:t=>U(t.target.value),className:"flex w-full px-3 py-1 text-sm bg-white border border-gray-300 rounded-md shadow-sm h-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",children:[e.jsx("option",{value:"",children:"Seleccionar producto..."}),M.map(t=>e.jsxs("option",{value:t.id,children:[t.nombre," — ",r(t.precio)," (stock: ",t.stock,")"]},t.id))]})}),e.jsx("div",{className:"w-24",children:e.jsx(A,{type:"number",min:"1",value:R,onChange:t=>B(parseInt(t.target.value)||1),className:"text-center"})}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(o,{type:"submit",size:"sm",disabled:!j||_,children:"Agregar"}),e.jsx(o,{type:"button",variant:"ghost",size:"sm",onClick:()=>$(!1),children:"Cancelar"})]})]}),e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"w-full text-sm",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b border-gray-200",children:[e.jsx("th",{className:"py-2 font-medium text-left text-gray-600",children:"Producto"}),e.jsx("th",{className:"py-2 font-medium text-center text-gray-600",children:"Cantidad"}),e.jsx("th",{className:"py-2 font-medium text-right text-gray-600",children:"P. Unitario"}),e.jsx("th",{className:"py-2 font-medium text-right text-gray-600",children:"Subtotal"}),l&&e.jsx("th",{className:"w-20 py-2 font-medium text-center text-gray-600",children:"Acc."})]})}),e.jsx("tbody",{className:"divide-y divide-gray-100",children:(ee=s.detalles)==null?void 0:ee.map(t=>{var a;return e.jsxs("tr",{children:[e.jsx("td",{className:"py-2 font-medium text-gray-900",children:(a=t.producto)==null?void 0:a.nombre}),e.jsx("td",{className:"py-2 text-center text-gray-600",children:ue===t.id?e.jsxs("div",{className:"flex items-center justify-center gap-1",children:[e.jsx(A,{type:"number",min:"1",value:V,onChange:n=>P(n.target.value),className:"w-20 text-xs text-center h-7",autoFocus:!0,onKeyDown:n=>{n.key==="Enter"&&(n.preventDefault(),K(t.id)),n.key==="Escape"&&E(null)}}),e.jsx(o,{variant:"ghost",size:"icon",className:"h-7 w-7",onClick:()=>K(t.id),children:e.jsx(de,{className:"w-3 h-3"})})]}):e.jsx("span",{className:l?"cursor-pointer hover:text-indigo-600 hover:underline":"",onClick:()=>{l&&(E(t.id),P(String(t.cantidad)))},title:l?"Clic para editar cantidad":"",children:t.cantidad})}),e.jsx("td",{className:"py-2 text-right text-gray-600",children:r(t.precio_unitario)}),e.jsx("td",{className:"py-2 font-semibold text-right text-gray-900",children:r(t.subtotal)}),l&&e.jsx("td",{className:"py-2 text-center",children:e.jsx(o,{variant:"ghost",size:"icon",className:"text-red-500 h-7 w-7 hover:text-red-700 hover:bg-red-50",onClick:()=>z(t),title:"Eliminar producto",children:e.jsx($e,{className:"w-3.5 h-3.5"})})})]},t.id)})}),e.jsx("tfoot",{children:e.jsxs("tr",{className:"border-t-2 border-gray-200",children:[e.jsx("td",{colSpan:3,className:"py-3 font-semibold text-right text-gray-700",children:"Total:"}),e.jsx("td",{className:"py-3 text-lg font-bold text-right text-gray-900",children:r(s.total)}),l&&e.jsx("td",{})]})})]})})]})]}),l&&e.jsxs(c,{children:[e.jsx(w,{children:e.jsxs(C,{className:"flex items-center gap-2 text-base",children:[e.jsx(de,{className:"w-4 h-4"}),"Cambiar estado"]})}),e.jsx(d,{children:e.jsxs("form",{onSubmit:be,className:"flex flex-col gap-3 sm:flex-row",children:[e.jsx("div",{className:"flex-1",children:e.jsxs("select",{value:b,onChange:t=>I(t.target.value),className:"flex w-full px-3 py-1 text-sm bg-white border border-gray-300 rounded-md shadow-sm h-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",children:[e.jsx("option",{value:"",children:"Seleccionar nuevo estado..."}),ge.filter(t=>t.id!==s.estado_id).map(t=>e.jsx("option",{value:t.id,children:f[t.nombre]||t.nombre},t.id))]})}),e.jsx("div",{className:"flex-1",children:e.jsx(A,{type:"text",value:T,onChange:t=>F(t.target.value),placeholder:"Comentario (opcional)"})}),e.jsx(o,{type:"submit",disabled:!b||_,children:_?"Actualizando...":"Actualizar"})]})})]}),((te=s.historial)==null?void 0:te.length)>0&&e.jsxs(c,{children:[e.jsx(w,{children:e.jsxs(C,{className:"flex items-center gap-2 text-base",children:[e.jsx(Ae,{className:"w-4 h-4"}),"Historial de cambios"]})}),e.jsx(d,{children:e.jsx("div",{className:"space-y-3",children:s.historial.map(t=>{var a,n,h,g,p,u;return e.jsxs("div",{className:"flex items-start gap-3 text-sm",children:[e.jsx("div",{className:"w-2 h-2 rounded-full bg-indigo-400 mt-1.5 shrink-0"}),e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[t.estado_anterior?e.jsxs(e.Fragment,{children:[e.jsx(N,{variant:"secondary",className:"text-xs",children:f[(a=t.estado_anterior)==null?void 0:a.nombre]||((n=t.estado_anterior)==null?void 0:n.nombre)}),e.jsx("span",{className:"text-gray-400",children:"→"})]}):null,e.jsx(N,{variant:xe[(h=t.estado_nuevo)==null?void 0:h.nombre]||"secondary",className:"text-xs",children:f[(g=t.estado_nuevo)==null?void 0:g.nombre]||((p=t.estado_nuevo)==null?void 0:p.nombre)})]}),t.comentario&&e.jsx("p",{className:"text-gray-600 mt-0.5",children:t.comentario}),e.jsxs("p",{className:"text-xs text-gray-400 mt-0.5",children:[(u=t.usuario)==null?void 0:u.name," · ",he(t.created_at)]})]})]},t.id)})})})]}),e.jsxs(c,{children:[e.jsx(w,{children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs(C,{className:"flex items-center gap-2 text-base",children:[e.jsx(oe,{className:"w-4 h-4"}),"Pagos (",((se=s.pagos)==null?void 0:se.length)||0,")"]}),D("pagos.crear")&&!H&&S>0&&e.jsx(le,{href:`/pagos/crear?pedido_id=${s.id}`,children:e.jsxs(o,{variant:"outline",size:"sm",children:[e.jsx(ce,{className:"w-4 h-4 mr-1"}),"Registrar pago"]})})]})}),e.jsx(d,{children:((ae=s.pagos)==null?void 0:ae.length)===0?e.jsx("p",{className:"py-4 text-sm text-center text-gray-400",children:"No hay pagos registrados para este pedido."}):e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"w-full text-sm",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b border-gray-200",children:[e.jsx("th",{className:"py-2 font-medium text-left text-gray-600",children:"Fecha"}),e.jsx("th",{className:"py-2 font-medium text-left text-gray-600",children:"Método"}),e.jsx("th",{className:"hidden py-2 font-medium text-left text-gray-600 sm:table-cell",children:"Referencia"}),e.jsx("th",{className:"py-2 font-medium text-right text-gray-600",children:"Monto"}),e.jsx("th",{className:"py-2 font-medium text-center text-gray-600",children:"Estado"})]})}),e.jsx("tbody",{className:"divide-y divide-gray-100",children:s.pagos.map(t=>e.jsxs("tr",{children:[e.jsx("td",{className:"py-2 text-gray-600",children:he(t.created_at)}),e.jsx("td",{className:"py-2 text-gray-600 capitalize",children:t.metodo_pago}),e.jsx("td",{className:"hidden py-2 text-gray-500 sm:table-cell",children:t.referencia||"—"}),e.jsx("td",{className:"py-2 font-semibold text-right",children:r(t.monto)}),e.jsx("td",{className:"py-2 text-center",children:e.jsx(N,{variant:t.estado==="confirmado"?"success":"warning",children:t.estado})})]},t.id))})]})})})]})]}),e.jsx(ke,{open:!!m,title:"Eliminar producto del pedido",message:`¿Estás seguro de eliminar "${(re=m==null?void 0:m.producto)==null?void 0:re.nombre}" del pedido? El stock será devuelto.`,confirmText:"Eliminar",variant:"destructive",onConfirm:ye,onCancel:()=>z(null)})]})}export{Ge as default};
