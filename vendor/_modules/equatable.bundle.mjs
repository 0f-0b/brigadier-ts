/* esm.sh - esbuild bundle(@esfx/equatable@1.0.2) esnext production */
var __global$ = globalThis || (typeof window !== "undefined" ? window : self);
function C(t,o,s,u){if(o%4)throw new TypeError("Pointer not aligned");let r=new Uint32Array(t),e,n,a,i,l,h,c;if(n=o+s,o>>=2,s>=16){a=n-16>>2,i=(u+2654435761|0)+2246822519|0,l=u+2246822519|0,h=u+0|0,c=u+2654435761|0;do i=i+r[o++]*2246822519|0|0,i=(i<<13|i>>>19)*2654435761|0,l=l+r[o++]*2246822519|0|0,l=(l<<13|l>>>19)*2654435761|0,h=h+r[o++]*2246822519|0|0,h=(h<<13|h>>>19)*2654435761|0,c=c+r[o++]*2246822519|0|0,c=(c<<13|c>>>19)*2654435761|0;while(o<=a);e=(i<<1|i>>>31)+(l<<7|l>>>25)|(h<<12|h>>>20)|(c<<18|c>>>14)}else e=u+374761393|0;for(e=e+s|0,a=n-4>>2;o<=a;)e=e+r[o++]*3266489917|0|0,e=(e<<17|e>>>15)*668265263|0;if(o=o<<2,o<n){let m=new Uint8Array(r.buffer);do e=e+m[o++]*374761393|0|0,e=(e<<11|e>>>21)*2654435761|0;while(o<n)}return e=(e^e>>>15)*2246822519|0,e=(e^e>>>13)*3266489917|0,e=e^e>>>16,e>>>0}var Q=typeof WebAssembly<"u"&&typeof WebAssembly.Module=="function"&&typeof WebAssembly.Instance=="function",V=new Uint8Array([0,97,115,109,1,0,0,0,1,8,1,96,3,127,127,126,1,126,3,2,1,0,5,3,1,0,1,7,15,2,3,109,101,109,2,0,5,120,120,104,54,52,0,0,10,130,6,1,255,5,2,3,126,1,127,32,0,32,1,106,33,6,32,1,65,32,79,4,126,32,6,65,32,107,33,6,32,2,66,214,235,130,238,234,253,137,245,224,0,124,33,3,32,2,66,177,169,172,193,173,184,212,166,61,125,33,4,32,2,66,249,234,208,208,231,201,161,228,225,0,124,33,5,3,64,32,3,32,0,41,3,0,66,207,214,211,190,210,199,171,217,66,126,124,66,31,137,66,135,149,175,175,152,182,222,155,158,127,126,33,3,32,4,32,0,65,8,106,34,0,41,3,0,66,207,214,211,190,210,199,171,217,66,126,124,66,31,137,66,135,149,175,175,152,182,222,155,158,127,126,33,4,32,2,32,0,65,8,106,34,0,41,3,0,66,207,214,211,190,210,199,171,217,66,126,124,66,31,137,66,135,149,175,175,152,182,222,155,158,127,126,33,2,32,5,32,0,65,8,106,34,0,41,3,0,66,207,214,211,190,210,199,171,217,66,126,124,66,31,137,66,135,149,175,175,152,182,222,155,158,127,126,33,5,32,6,32,0,65,8,106,34,0,79,13,0,11,32,2,66,12,137,32,5,66,18,137,124,32,4,66,7,137,124,32,3,66,1,137,124,32,3,66,207,214,211,190,210,199,171,217,66,126,66,31,137,66,135,149,175,175,152,182,222,155,158,127,126,133,66,135,149,175,175,152,182,222,155,158,127,126,66,157,163,181,234,131,177,141,138,250,0,125,32,4,66,207,214,211,190,210,199,171,217,66,126,66,31,137,66,135,149,175,175,152,182,222,155,158,127,126,133,66,135,149,175,175,152,182,222,155,158,127,126,66,157,163,181,234,131,177,141,138,250,0,125,32,2,66,207,214,211,190,210,199,171,217,66,126,66,31,137,66,135,149,175,175,152,182,222,155,158,127,126,133,66,135,149,175,175,152,182,222,155,158,127,126,66,157,163,181,234,131,177,141,138,250,0,125,32,5,66,207,214,211,190,210,199,171,217,66,126,66,31,137,66,135,149,175,175,152,182,222,155,158,127,126,133,66,135,149,175,175,152,182,222,155,158,127,126,66,157,163,181,234,131,177,141,138,250,0,125,5,32,2,66,197,207,217,178,241,229,186,234,39,124,11,32,1,173,124,33,2,32,0,32,1,65,31,113,106,33,1,3,64,32,1,32,0,65,8,106,79,4,64,32,0,41,3,0,66,207,214,211,190,210,199,171,217,66,126,66,31,137,66,135,149,175,175,152,182,222,155,158,127,126,32,2,133,66,27,137,66,135,149,175,175,152,182,222,155,158,127,126,66,157,163,181,234,131,177,141,138,250,0,125,33,2,32,0,65,8,106,33,0,12,1,11,11,32,0,65,4,106,32,1,77,4,64,32,2,32,0,53,2,0,66,135,149,175,175,152,182,222,155,158,127,126,133,66,23,137,66,207,214,211,190,210,199,171,217,66,126,66,249,243,221,241,153,246,153,171,22,124,33,2,32,0,65,4,106,33,0,11,3,64,32,0,32,1,73,4,64,32,2,32,0,49,0,0,66,197,207,217,178,241,229,186,234,39,126,133,66,11,137,66,135,149,175,175,152,182,222,155,158,127,126,33,2,32,0,65,1,106,33,0,12,1,11,11,32,2,32,2,66,33,136,133,66,207,214,211,190,210,199,171,217,66,126,34,2,66,29,136,32,2,133,66,249,243,221,241,153,246,153,171,22,126,34,2,66,32,136,32,2,133,11]),I=Q?new WebAssembly.Instance(new WebAssembly.Module(V)).exports:void 0;var w=I===null||I===void 0?void 0:I.mem,P=I===null||I===void 0?void 0:I.xxh64;var ee=typeof TextEncoder=="function",q=(t,o)=>(q=te())(t,o),H=(t,o)=>q(t,o);function te(){function t(){let s=new TextEncoder;function u(r,e){let{written:n=0}=s.encodeInto(r,e);return n}return u}function o(){function s(u,r){let e=u.length,n=0;for(let a=0;a<e;a++){let i=u.charCodeAt(a);if(i&55296&&!(i&4294910976)&&a<e-1){let l=u.charCodeAt(a+1);(l&64512)===56320&&(i=((i&1023)<<10)+(l&1023)+65536,a++)}if(!(i&4294967168))r[n++]=i;else if(!(i&4294965248))r[n++]=i>>6|192,r[n++]=i&63|128;else if(!(i&268431360))r[n++]=i>>12|224,r[n++]=i>>6&63|128,r[n++]=i&63|128;else if(!(i&4292870144))r[n++]=i>>18|240,r[n++]=i>>12&63|128,r[n++]=i>>6&63|128,r[n++]=i&63|128;else throw new RangeError("Unsupported charCode.")}return n}return s}return ee?t():o()}var T=typeof BigInt=="function"&&typeof BigInt(0)=="bigint",N=typeof BigUint64Array=="function",re=typeof w=="object"&&typeof P=="function",v=new ArrayBuffer(8),ae=new Float64Array(v),g=new Uint32Array(v),S=()=>(S=oe())(),F=t=>(F=se())(t),W=t=>(W=ue())(t),X=t=>(X=S())(t),Z=t=>(Z=ce())(t),$=t=>($=ie())(t),k=t=>F(t),K=t=>W(t),L=t=>X(t),D=t=>Z(t),O=t=>$(t);function oe(){function t(){let s=new BigUint64Array(g.buffer),u=new Uint8Array(w.buffer);function r(l){w.buffer.byteLength<l&&(w.grow(Math.ceil((l-w.buffer.byteLength)/65536)),u=new Uint8Array(w.buffer))}function e(l){s[0]=l;let h=g[0],c=g[1];return(h<<7|h>>>25)^c}function n(){return g[0]=U(),g[1]=U(),s[0]}function a(l,h){r(l.length*3);let c=H(l,u);return e(P(0,c,h))}function i(){let l=n();function h(c){return a(c,l)}return h}return i}function o(){let s=new Uint8Array(65536);function u(n){s.byteLength<n&&(s=new Uint8Array(n+(65536-n%65536)))}function r(n,a){u(n.length*3);let i=H(n,s);return C(s.buffer,0,i,a)>>0}function e(){let n=U();function a(i){return r(i,n)}return a}return e}return T&&N&&re?t():o()}function se(){function t(s){ae[0]=s;let u=g[0],r=g[1];return(u<<7|u>>>25)^r|0}function o(s){return s>>0===s?s|0:t(s)}return o}function ue(){function t(){let u=new BigUint64Array(v),r=BigInt(0),e=BigInt(1),n=BigInt(2),a=BigInt(2)**BigInt(31)-BigInt(1),i=~a,l=BigInt(64);function h(c){if(c===r)return 0;if(c>=i&&c<=a)return Number(c);c=c<r?~c*n+e:c*n;let m=0;for(;c;)u[0]=c,m=(m<<7|m>>>25)^g[0],m=(m<<7|m>>>25)^g[1],c=c>>l;return m|0}return h}function o(){let u=BigInt(0),r=BigInt(1),e=BigInt(2),n=BigInt(2)**BigInt(31)-BigInt(1),a=~n,i=BigInt(32),l=BigInt("0xFFFFFFFF");function h(c){if(c===u)return 0;if(c>=a&&c<=n)return Number(c);c=c<u?~c*e+r:c*e;let m=0;for(;c!==u;)m=(m<<7|m>>>25)^Number(c&l),c>>=i,m=(m<<7|m>>>25)^Number(c&l),c>>=i;return m|0}return h}function s(){let u=S();function r(e){return u(e.toString())}return r}return T&&N?t():T?o():s()}function ce(){let t="description"in Symbol.prototype?f=>f.description:f=>{let b=f.toString();return b.length>=8&&b.slice(0,7)==="Symbol("&&b.slice(-1)===")"?b.slice(7,-1):b},o=S(),s,u;try{new WeakMap().set(Symbol.iterator,null),s=new WeakMap,u=new WeakMap}catch{s=new Map,u=new Map}for(let f of Object.getOwnPropertyNames(Symbol))if(typeof f=="string"){let b=Symbol[f];typeof b=="symbol"&&u.set(b,`Symbol.${f}`)}let r=S(),e;try{new WeakMap().set(Symbol.for("@esfx/equatable!~globalSymbolTest"),null),e=new WeakMap}catch{e=new Map}let n=S(),a,i=1;try{new WeakMap().set(Symbol(),null),a=new WeakMap}catch{a=new Map}function l(f,b){let d=e.get(f);return d===void 0&&(d=r(b),e.set(f,d)),d}function h(f,b){let d=s.get(f);return d===void 0&&(d=o(b),s.set(f,d)),d}function c(f){let b=a.get(f);return b===void 0&&(b=n(`${i++}#${t(f)}`),a.set(f,b)),b}function m(f){let b=u.get(f);if(b!==void 0)return h(f,b);let d=Symbol.keyFor(f);return d!==void 0?l(f,d):c(f)}return m}function ie(){let t=new WeakMap,o=U(),s=1;function u(e){return e=~e+(e<<15),e=e^e>>12,e=e+(e<<2),e=e^e>>4,e=e*2057,e=e^e>>16,e>>>0}function r(e){let n=t.get(e);return n===void 0&&(n=u(s++^o)^o,t.set(e,n)),n}return r}function U(){return Math.floor(Math.random()*4294967295)>>>0}var B=typeof globalThis=="object"?globalThis:typeof __global$=="object"?__global$:typeof self=="object"?self:void 0,R=Symbol.for("@esfx/equatable!~hashUnknown"),x;B&&typeof B[R]=="function"?x=B[R]:(x=function(o){switch(typeof o){case"boolean":return o?1:0;case"number":return k(o);case"bigint":return K(o);case"string":return L(o);case"symbol":return D(o);case"function":return O(o);case"object":return o===null?0:O(o);case"undefined":return 0;default:throw new TypeError(`Unsupported type: ${typeof o}`)}},Object.defineProperty(B,R,{value:x}));function G(t){return x(t)}var p;(function(t){t.equals=Symbol.for("@esfx/equatable:Equatable.equals"),t.hash=Symbol.for("@esfx/equatable:Equatable.hash"),t.name="Equatable";function o(s){let u;return s!=null&&t.equals in(u=Object(s))&&t.hash in u}t.hasInstance=o,Object.defineProperty(t,Symbol.hasInstance,{configurable:!0,writable:!0,value:o})})(p||(p={}));var E;(function(t){t.compareTo=Symbol.for("@esfx/equatable:Comparable.compareTo"),t.name="Comparable";function o(s){return s!=null&&t.compareTo in Object(s)}t.hasInstance=o,Object.defineProperty(t,Symbol.hasInstance,{configurable:!0,writable:!0,value:o})})(E||(E={}));var y;(function(t){t.structuralEquals=Symbol.for("@esfx/equatable:StructualEquatable.structuralEquals"),t.structuralHash=Symbol.for("@esfx/equatable:StructuralEquatable.structuralHash"),t.name="StructuralEquatable";function o(s){let u;return s!=null&&t.structuralEquals in(u=Object(s))&&t.structuralHash in u}t.hasInstance=o,Object.defineProperty(t,Symbol.hasInstance,{configurable:!0,writable:!0,value:o})})(y||(y={}));var j;(function(t){t.structuralCompareTo=Symbol.for("@esfx/equatable:StructuralComparable.structuralCompareTo"),t.name="StructuralComparable";function o(s){return s!=null&&t.structuralCompareTo in Object(s)}t.hasInstance=o,Object.defineProperty(t,Symbol.hasInstance,{configurable:!0,writable:!0,value:o})})(j||(j={}));var _;(function(t){let o=Object.defineProperty({},Symbol.toStringTag,{configurable:!0,value:"Equaler"});t.defaultEqualer=s((e,n)=>p.hasInstance(e)?e[p.equals](n):p.hasInstance(n)?n[p.equals](e):Object.is(e,n),e=>p.hasInstance(e)?e[p.hash]():fe(e)),t.structuralEqualer=s((e,n)=>y.hasInstance(e)?e[y.structuralEquals](n,t.structuralEqualer):y.hasInstance(n)?n[y.structuralEquals](e,t.structuralEqualer):t.defaultEqualer.equals(e,n),e=>y.hasInstance(e)?e[y.structuralHash](t.structuralEqualer):t.defaultEqualer.hash(e)),t.tupleEqualer=s((e,n)=>{if(e!=null&&!Array.isArray(e)||n!=null&&!Array.isArray(n))throw new TypeError("Array expected");if(e===n)return!0;if(!e||!n||e.length!==n.length)return!1;for(let a=0;a<e.length;a++)if(!t.defaultEqualer.equals(e[a],n[a]))return!1;return!0},e=>{if(e==null)return 0;if(!Array.isArray(e))throw new TypeError("Array expected");let n=0;for(let a of e)n=u(n,t.defaultEqualer.hash(a));return n}),t.tupleStructuralEqualer=s((e,n)=>{if(e!=null&&!Array.isArray(e)||n!=null&&!Array.isArray(n))throw new TypeError("Array expected");if(e===n)return!0;if(!e||!n||e.length!==n.length)return!1;for(let a=0;a<e.length;a++)if(!t.structuralEqualer.equals(e[a],n[a]))return!1;return!0},e=>{if(e==null)return 0;if(!Array.isArray(e))throw new TypeError("Array expected");let n=0;for(let a of e)n=u(n,t.structuralEqualer.hash(a));return n});function s(e,n=t.defaultEqualer.hash){return Object.setPrototypeOf({equals:e,hash:n},o)}t.create=s;function u(e,n,a=7){if(typeof e!="number")throw new TypeError("Integer expected: x");if(typeof n!="number")throw new TypeError("Integer expected: y");if(typeof a!="number")throw new TypeError("Integer expected: rotate");if(isNaN(e)||!isFinite(e))throw new RangeError("Argument must be a finite number value: x");if(isNaN(n)||!isFinite(n))throw new RangeError("Argument must be a finite number value: y");if(isNaN(a)||!isFinite(a))throw new RangeError("Argument must be a finite number value: rotate");for(;a<0;)a+=32;for(;a>=32;)a-=32;return(e<<a|e>>>32-a)^n}t.combineHashes=u;function r(e){return typeof e=="object"&&e!==null&&typeof e.equals=="function"&&typeof e.hash=="function"}t.hasInstance=r,Object.defineProperty(t,Symbol.hasInstance,{configurable:!0,writable:!0,value:r})})(_||(_={}));var he=_.defaultEqualer,be=_.structuralEqualer,me=_.tupleEqualer,de=_.tupleEqualer,ge=_.combineHashes,A;(function(t){let o=Object.defineProperty({},Symbol.toStringTag,{configurable:!0,value:"Comparer"});t.defaultComparer=s((r,e)=>E.hasInstance(r)?r[E.compareTo](e):E.hasInstance(e)?-e[E.compareTo](r):r<e?-1:r>e?1:0),t.structuralComparer=s((r,e)=>j.hasInstance(r)?r[j.structuralCompareTo](e,t.structuralComparer):j.hasInstance(e)?-e[j.structuralCompareTo](r,t.structuralComparer):t.defaultComparer.compare(r,e)),t.tupleComparer=s((r,e)=>{if(r!=null&&!Array.isArray(r)||e!=null&&!Array.isArray(e))throw new TypeError("Array expected");let n;if(n=t.defaultComparer.compare(r.length,e.length))return n;for(let a=0;a<r.length;a++)if(n=t.defaultComparer.compare(r[a],e[a]))return n;return 0}),t.tupleStructuralComparer=s((r,e)=>{if(r!=null&&!Array.isArray(r)||e!=null&&!Array.isArray(e))throw new TypeError("Array expected");let n;if(n=t.defaultComparer.compare(r.length,e.length))return n;for(let a=0;a<r.length;a++)if(n=t.structuralComparer.compare(r[a],e[a]))return n;return 0});function s(r){return Object.setPrototypeOf({compare:r},o)}t.create=s;function u(r){return typeof r=="object"&&r!==null&&typeof r.compare=="function"}t.hasInstance=u,Object.defineProperty(t,Symbol.hasInstance,{configurable:!0,writable:!0,value:u})})(A||(A={}));var pe=A.defaultComparer,ye=A.structuralComparer,Ie=A.tupleComparer,we=A.tupleStructuralComparer;function fe(t){return G(t)}export{E as Comparable,A as Comparer,_ as Equaler,p as Equatable,j as StructuralComparable,y as StructuralEquatable,ge as combineHashes,pe as defaultComparer,he as defaultEqualer,fe as rawHash,ye as structuralComparer,be as structuralEqualer,Ie as tupleComparer,me as tupleEqualer,we as tupleStructuralComparer,de as tupleStructuralEqualer};
/*! Bundled license information:

@esfx/equatable/dist/esm/internal/hashers/xxhash32.mjs:
  (*!
     Copyright 2022 Ron Buckton
  
     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at
  
         http://www.apache.org/licenses/LICENSE-2.0
  
     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
  
     THIRD PARTY LICENSE NOTICE:
  
     xxHash Library
     Copyright (c) 2012-2021 Yann Collet
     All rights reserved.
  
     BSD 2-Clause License (https://www.opensource.org/licenses/bsd-license.php)
  
     Redistribution and use in source and binary forms, with or without modification,
     are permitted provided that the following conditions are met:
  
     * Redistributions of source code must retain the above copyright notice, this
       list of conditions and the following disclaimer.
  
     * Redistributions in binary form must reproduce the above copyright notice, this
       list of conditions and the following disclaimer in the documentation and/or
       other materials provided with the distribution.
  
     THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
     ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
     ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
     LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
     ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
     SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  *)

@esfx/equatable/dist/esm/internal/hashers/xxhash64.mjs:
  (*!
     Copyright 2022 Ron Buckton
  
     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at
  
         http://www.apache.org/licenses/LICENSE-2.0
  
     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
  *)

@esfx/equatable/dist/esm/internal/utf8.mjs:
  (*!
     Copyright 2022 Ron Buckton
  
     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at
  
         http://www.apache.org/licenses/LICENSE-2.0
  
     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
  *)

@esfx/equatable/dist/esm/internal/hashCode.mjs:
  (*!
     Copyright 2022 Ron Buckton
  
     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at
  
         http://www.apache.org/licenses/LICENSE-2.0
  
     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
  *)

@esfx/equatable/dist/esm/internal/hashUnknown.mjs:
  (*!
     Copyright 2021 Ron Buckton
  
     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at
  
         http://www.apache.org/licenses/LICENSE-2.0
  
     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
  *)

@esfx/equatable/dist/esm/index.mjs:
  (*!
     Copyright 2019 Ron Buckton
  
     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at
  
         http://www.apache.org/licenses/LICENSE-2.0
  
     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
  *)
*/
