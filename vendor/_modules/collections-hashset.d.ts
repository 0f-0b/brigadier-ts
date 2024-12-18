/*!
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
*/
import { Collection, ReadonlyCollection } from "@esfx/collection-core";
import { Equaler } from "@esfx/equatable";
export declare class HashSet<T> implements Collection<T> {
    private _hashData;
    constructor(equaler?: Equaler<T>);
    constructor(iterable?: Iterable<T>, equaler?: Equaler<T>);
    constructor(capacity: number, equaler?: Equaler<T>);
    get equaler(): Equaler<T>;
    get size(): number;
    has(value: T): boolean;
    add(value: T): this;
    tryAdd(value: T): boolean;
    delete(value: T): boolean;
    clear(): void;
    ensureCapacity(capacity: number): number;
    trimExcess(capacity?: number): void;
    keys(): Generator<T, void, unknown>;
    values(): Generator<T, void, unknown>;
    entries(): Generator<[T, T], void, unknown>;
    [Symbol.iterator](): Generator<T, void, unknown>;
    forEach(callback: (value: T, key: T, set: this) => void, thisArg?: any): void;
    [Symbol.toStringTag]: string;
    get [Collection.size](): number;
    [Collection.has](value: T): boolean;
    [Collection.add](value: T): void;
    [Collection.delete](value: T): boolean;
    [Collection.clear](): void;
}
export interface ReadonlyHashSet<T> extends ReadonlyCollection<T> {
    readonly equaler: Equaler<T>;
    readonly size: number;
    has(value: T): boolean;
    keys(): IterableIterator<T>;
    values(): IterableIterator<T>;
    entries(): IterableIterator<[T, T]>;
    [Symbol.iterator](): IterableIterator<T>;
    forEach(callbackfn: (value: T, key: T, set: this) => void, thisArg?: any): void;
}
