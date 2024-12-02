/* esm.sh - esbuild bundle(@esfx/collections-hashset@1.0.2) esnext production */
import*as k from"@esfx/collection-core";import*as S from"@esfx/equatable";var q,E=function(){var w={exports:{}};return function(r,u,_){"use strict";Object.defineProperty(u,"__esModule",{value:!0});let y=2**31-1,f=2146435069,N=101,m=[3,7,11,17,23,29,37,47,59,71,89,107,131,163,197,239,293,353,431,521,631,761,919,1103,1327,1597,1931,2333,2801,3371,4049,4861,5839,7013,8419,10103,12143,14591,17519,21023,25229,30293,36353,43627,52361,62851,75431,90523,108631,130363,156437,187751,225307,270371,324449,389357,467237,560689,672827,807403,968897,1162687,1395263,1674319,2009191,2411033,2893249,3471899,4166287,4999559,5999471,7199369];function A(e){if(e&1){let n=Math.sqrt(e)|0;for(let t=3;t<=n;t+=2)if(!(e%t))return!1;return!0}return e===2}function x(e){if(e<0)throw new RangeError;for(let n=0;n<m.length;n++){let t=m[n];if(t>=e)return t}for(let n=e|1;n<y;n+=2)if(A(n)&&(n-1)%N)return n;return e}function L(e){let n=2*e;return n>f&&f>e?f:x(n)}function p(){return{prevEntry:void 0,nextEntry:void 0,skipNextEntry:!1,next:0,hashCode:0,key:void 0,value:void 0}}function P(e,n){let t=p(),s={buckets:void 0,entries:void 0,freeSize:0,freeList:0,size:0,equaler:e,head:t,tail:t};return g(s,n),s}u.createHashData=P;function g(e,n){let t=x(n);return e.freeList=-1,e.buckets=new Int32Array(t),e.entries=new Array(t),t}function C(e,n){let t=e.size,s=new Int32Array(n),o=e.entries?e.entries.slice():[];o.length=n;for(let i=0;i<t;i++){let l=o[i];if(l&&l.hashCode>=0){let c=l.hashCode%n;l.next=s[c]-1,s[c]=i+1}}e.buckets=s,e.entries=o}function j(e,n){let t=-1;if(e.buckets&&e.entries){let s=e.equaler.hash(n)&y;t=e.buckets[s%e.buckets.length]-1;let o=e.entries.length;for(;t>>>0<o;){let i=e.entries[t];if(i.hashCode===s&&e.equaler.equals(i.key,n))break;t=i.next}}return t}u.findEntryIndex=j;function H(e,n,t){if(e.buckets||g(e,0),!e.buckets||!e.entries)throw new Error;let s=e.equaler.hash(n)&y,o=s%e.buckets.length,i=e.buckets[o]-1;for(;i>>>0<e.entries.length;){let b=e.entries[i];if(b.hashCode===s&&e.equaler.equals(b.key,n)){b.value=t;return}i=b.next}let l=!1,c;if(e.freeSize>0)c=e.freeList,l=!0,e.freeSize--;else{let b=e.size;if(b===e.entries.length){if(C(e,L(e.size)),!e.buckets||!e.entries)throw new Error;o=s%e.buckets.length}c=b,e.size=b+1}let d=e.entries[c]||(e.entries[c]=p());l&&(e.freeList=d.next),d.hashCode=s,d.next=e.buckets[o]-1,d.key=n,d.value=t,d.skipNextEntry=!1;let v=e.tail;v.nextEntry=d,d.prevEntry=v,e.tail=d,e.buckets[o]=c+1}u.insertEntry=H;function I(e,n){if(e.buckets&&e.entries){let t=e.equaler.hash(n)&y,s=t%e.buckets.length,o=-1,i;for(let l=e.buckets[s]-1;l>=0;l=i.next){if(i=e.entries[l],i.hashCode===t&&e.equaler.equals(i.key,n)){o<0?e.buckets[s]=i.next+1:e.entries[o].next=i.next;let c=i.prevEntry;return c.nextEntry=i.nextEntry,c.nextEntry&&(c.nextEntry.prevEntry=c),e.tail===i&&(e.tail=c),i.hashCode=-1,i.next=e.freeList,i.key=void 0,i.value=void 0,i.prevEntry=void 0,i.nextEntry=c,i.skipNextEntry=!0,e.freeList=l,e.freeSize++,!0}o=l}}return!1}u.deleteEntry=I;function O(e){if(e.size>0){e.buckets&&e.buckets.fill(0),e.entries&&e.entries.fill(void 0);let t=e.head.nextEntry;for(;t;){let s=t.nextEntry;t.prevEntry=void 0,t.nextEntry=e.head,t.skipNextEntry=!0,t=s}e.head.nextEntry=void 0,e.tail=e.head,e.size=0,e.freeList=-1,e.freeSize=0}}u.clearEntries=O;function R(e,n){if(n<0)throw new RangeError;let t=e.entries?e.entries.length:0;if(t>=n)return t;if(!e.buckets)return g(e,n);let s=x(n);return C(e,x(n)),s}u.ensureCapacity=R;function T(e,n=e.size-e.freeSize){if(n<e.size)throw new RangeError;if(!e.buckets||!e.entries)return;let t=x(n),s=e.entries;if(t>=(s?s.length:0))return;let o=e.size;if(g(e,t),!e.buckets||!e.entries)throw new Error;let i=0;for(let l=0;l<o;l++){let c=s[l].hashCode;if(c>=0){let d=c%t;e.entries[i]=s[l],e.entries[i].next=e.buckets[d]-1,e.buckets[d]=i+1,i++}}e.size=i,e.freeSize=0}u.trimExcessEntries=T;function K(e){return e.key}u.selectEntryKey=K;function M(e){return e.value}u.selectEntryValue=M;function V(e){return[e.key,e.value]}u.selectEntryEntry=V;function*F(e,n){let t=e;for(;t;){let s=t.skipNextEntry;t=t.nextEntry,!s&&t&&(yield n(t))}}u.iterateEntries=F;function X(e,n,t,s){let o=n;for(;o;){let i=o.skipNextEntry;o=o.nextEntry,!i&&o&&t.call(s,o.value,o.key,e)}}u.forEachEntry=X}(w,w.exports,null),w.exports}(),z=class{constructor(...r){let u,_,y;if(r.length>0){let f=r[0];if(typeof f=="number"){if(!(Object.is(f,f|0)&&f>=0))throw new RangeError("Argument out of range: capacity");u=f,r.length>1&&(y=r[1])}else f===void 0||f!=null&&Symbol.iterator in Object(f)?(_=f,r.length>1&&(y=r[1])):y=f}if(u??(u=0),y??(y=S.Equaler.defaultEqualer),this._hashData=(0,E.createHashData)(y,u),_)for(let f of _)this.add(f)}get equaler(){return this._hashData.equaler}get size(){return this._hashData.size-this._hashData.freeSize}has(r){return(0,E.findEntryIndex)(this._hashData,r)>=0}add(r){return(0,E.insertEntry)(this._hashData,r,r),this}tryAdd(r){let u=this.size;return(0,E.insertEntry)(this._hashData,r,r),this.size>u}delete(r){return(0,E.deleteEntry)(this._hashData,r)}clear(){(0,E.clearEntries)(this._hashData)}ensureCapacity(r){if(typeof r!="number")throw new TypeError("Number expected: capacity");if(!(Object.is(r,r|0)&&r>=0))throw new RangeError("Argument out of range: capacity");return(0,E.ensureCapacity)(this._hashData,r)}trimExcess(r){if(r!==void 0){if(typeof r!="number")throw new TypeError("Number expected: capacity");if(!(Object.is(r,r|0)&&r>=0))throw new RangeError("Argument out of range: capacity")}(0,E.trimExcessEntries)(this._hashData,r)}keys(){return(0,E.iterateEntries)(this._hashData.head,E.selectEntryKey)}values(){return(0,E.iterateEntries)(this._hashData.head,E.selectEntryValue)}entries(){return(0,E.iterateEntries)(this._hashData.head,E.selectEntryEntry)}[Symbol.iterator](){return this.values()}forEach(r,u){if(typeof r!="function")throw new TypeError("Function expected: callback");(0,E.forEachEntry)(this,this._hashData.head,r,u)}get[k.Collection.size](){return this.size}[k.Collection.has](r){return this.has(r)}[k.Collection.add](r){this.add(r)}[k.Collection.delete](r){return this.delete(r)}[k.Collection.clear](){this.clear()}};q=z;Object.defineProperty(q.prototype,Symbol.toStringTag,{configurable:!0,writable:!0,value:"HashSet"});export{z as HashSet};
/*! Bundled license information:

@esfx/collections-hashset/dist/esm/index.mjs:
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
  
     THIRD PARTY LICENSE NOTICE:
  
     HashSet is derived from the implementation of HashSet<T> in .NET Core.
  
     .NET Core is licensed under the MIT License:
  
     The MIT License (MIT)
  
     Copyright (c) .NET Foundation and Contributors
  
     All rights reserved.
  
     Permission is hereby granted, free of charge, to any person obtaining a copy
     of this software and associated documentation files (the "Software"), to deal
     in the Software without restriction, including without limitation the rights
     to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     copies of the Software, and to permit persons to whom the Software is
     furnished to do so, subject to the following conditions:
  
     The above copyright notice and this permission notice shall be included in all
     copies or substantial portions of the Software.
  
     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
     SOFTWARE.
  *)
  (*! The following comments were added due to code inlined from "@esfx/internal-collections-hash": *)
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
  
     THIRD PARTY LICENSE NOTICE:
  
     HashMap is derived from the implementation of Dictionary<T> in .NET Core.
     HashSet is derived from the implementation of HashSet<T> in .NET Core.
     "getPrime", "expandPrime", and "isPrime" are derived from the implementation
     of "HashHelpers" in .NET Core.
  
     .NET Core is licensed under the MIT License:
  
     The MIT License (MIT)
  
     Copyright (c) .NET Foundation and Contributors
  
     All rights reserved.
  
     Permission is hereby granted, free of charge, to any person obtaining a copy
     of this software and associated documentation files (the "Software"), to deal
     in the Software without restriction, including without limitation the rights
     to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     copies of the Software, and to permit persons to whom the Software is
     furnished to do so, subject to the following conditions:
  
     The above copyright notice and this permission notice shall be included in all
     copies or substantial portions of the Software.
  
     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
     SOFTWARE.
  *)
*/
