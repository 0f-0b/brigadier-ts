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
*/
/**
 * A {@link ReadonlyContainer} describes an object that can contain other values.
 */
export interface ReadonlyContainer<T> {
    /**
     * Tests whether an element is present in the container.
     */
    [ReadonlyContainer.has](value: T): boolean;
}
export declare namespace ReadonlyContainer {
    /**
     * A well-known symbol used to define the `ReadonlyContainer#[ReadonlyContainer.has]` method.
     */
    const has: unique symbol;
    const name = "ReadonlyContainer";
    /**
     * Tests whether a value supports the minimal representation of a {@link ReadonlyContainer}.
     */
    function hasInstance(value: any): value is ReadonlyContainer<unknown>;
}
/**
 * A {@link Container} describes a container object that can contain other values and
 * may have its contents modified.
 */
export interface Container<T> extends ReadonlyContainer<T> {
    /**
     * Adds an element to the container.
     */
    [Container.add](value: T): void;
    /**
     * Deletes an element from the container.
     */
    [Container.delete](value: T): boolean;
}
export declare namespace Container {
    export import has = ReadonlyContainer.has;
    /**
     * A well-known symbol used to define the `Container#[Container.add]` method.
     */
    const add: unique symbol;
    const name = "Container";
    /**
     * Tests whether a value supports the minimal representation of a {@link Container}.
     */
    function hasInstance(value: any): value is Container<unknown>;
}
export declare namespace Container {
    /**
     * A well-known symbol used to define the `Container#[Container.delete]` method.
     */
    const _delete: unique symbol;
    export { _delete as delete };
}
/**
 * A {@link ReadonlyCollection} describes a collection object, such as an Array or Set, that
 * can contain other values and has a known size.
 */
export interface ReadonlyCollection<T> extends Iterable<T>, ReadonlyContainer<T> {
    /**
     * Gets the number of elements in the collection.
     */
    readonly [ReadonlyCollection.size]: number;
}
export declare namespace ReadonlyCollection {
    export import has = ReadonlyContainer.has;
    /**
     * A well-known symbol used to define the `ReadonlyCollection#[ReadonlyCollection.size]` property.
     */
    const size: unique symbol;
    const name = "ReadonlyCollection";
    /**
     * Tests whether a value supports the minimal representation of a `ReadonlyCollection`.
     */
    function hasInstance<T>(value: Iterable<T>): value is ReadonlyCollection<T>;
    /**
     * Tests whether a value supports the minimal representation of a `ReadonlyCollection`.
     */
    function hasInstance(value: any): value is ReadonlyCollection<unknown>;
}
/**
 * A {@link Collection} describes a collection object, such as an Array or Set, that can
 * contain other values, has a known size, and may have its contents modified.
 */
export interface Collection<T> extends ReadonlyCollection<T>, Container<T> {
    /**
     * Adds an element to the collection.
     */
    [Collection.add](value: T): void;
    /**
     * Deletes an element from the collection.
     */
    [Collection.delete](value: T): boolean;
    /**
     * Clears the collection.
     */
    [Collection.clear](): void;
}
export declare namespace Collection {
    export import size = ReadonlyCollection.size;
    export import has = ReadonlyCollection.has;
    export import add = Container.add;
    /**
     * A well-known symbol used to define the `Collection#[Collection.clear]` method.
     */
    const clear: unique symbol;
    const name = "Collection";
    /**
     * Tests whether a value supports the minimal representation of a `Collection`.
     */
    function hasInstance<T>(value: Iterable<T>): value is Collection<T>;
    /**
     * Tests whether a value supports the minimal representation of a `Collection`.
     */
    function hasInstance(value: any): value is Collection<unknown>;
}
export declare namespace Collection {
    /**
     * A well-known symbol used to define the `Collection#[Collection.delete]` method.
     */
    const _delete: typeof Container.delete;
    export { _delete as delete };
}
/**
 * A {@link ReadonlyIndexedCollection} describes an indexed collection object, such as an Array, that
 * can contain other values, has a known size, and whose elements can be accessed by ordinal index.
 */
export interface ReadonlyIndexedCollection<T> extends ReadonlyCollection<T> {
    /**
     * Gets the index for a value in the collection, or `-1` if the value was not found.
     */
    [ReadonlyIndexedCollection.indexOf](value: T, fromIndex?: number): number;
    /**
     * Gets the value at the specified index in the collection, or `undefined` if the index was outside of the bounds of the collection.
     */
    [ReadonlyIndexedCollection.getAt](index: number): T | undefined;
}
export declare namespace ReadonlyIndexedCollection {
    export import size = ReadonlyCollection.size;
    export import has = ReadonlyCollection.has;
    /**
     * A well-known symbol used to define the `ReadonlyIndexedCollection#[ReadonlyIndexedCollection.indexOf]` method.
     */
    const indexOf: unique symbol;
    /**
     * A well-known symbol used to define the `ReadonlyIndexedCollection#[ReadonlyIndexedCollection.getAt]` method.
     */
    const getAt: unique symbol;
    const name = "ReadonlyIndexedCollection";
    /**
     * Tests whether a value supports the minimal representation of a `ReadonlyIndexedCollection`.
     */
    function hasInstance<T>(value: Iterable<T>): value is ReadonlyIndexedCollection<T>;
    /**
     * Tests whether a value supports the minimal representation of a `ReadonlyIndexedCollection`.
     */
    function hasInstance(value: unknown): value is ReadonlyIndexedCollection<unknown>;
}
export interface FixedSizeIndexedCollection<T> extends ReadonlyIndexedCollection<T> {
    /**
     * Sets a value at the specified index in the collection.
     * @returns `true` if the value was set at the provided index, otherwise `false`.
     */
    [FixedSizeIndexedCollection.setAt](index: number, value: T): boolean;
}
export declare namespace FixedSizeIndexedCollection {
    export import size = ReadonlyCollection.size;
    export import has = ReadonlyCollection.has;
    export import indexOf = ReadonlyIndexedCollection.indexOf;
    export import getAt = ReadonlyIndexedCollection.getAt;
    /**
     * A well-known symbol used to define the `FixedSizeIndexedCollection#[FixedSizeIndexedCollection.setAt]` method.
     */
    const setAt: unique symbol;
    const name = "FixedSizeIndexedCollection";
    /**
     * Tests whether a value supports the minimal representation of a `FixedSizeIndexedCollection`.
     */
    function hasInstance<T>(value: Iterable<T>): value is FixedSizeIndexedCollection<T>;
    /**
     * Tests whether a value supports the minimal representation of a `FixedSizeIndexedCollection`.
     */
    function hasInstance(value: unknown): value is FixedSizeIndexedCollection<unknown>;
}
export interface IndexedCollection<T> extends FixedSizeIndexedCollection<T>, Collection<T> {
    /**
     * Inserts a value at the specified index in the collection, shifting any following elements to the right one position.
     */
    [IndexedCollection.insertAt](index: number, value: T): void;
    /**
     * Removes the value at the specified index in the collection, shifting any following elements to the left one position.
     */
    [IndexedCollection.removeAt](index: number): void;
}
export declare namespace IndexedCollection {
    export import size = ReadonlyCollection.size;
    export import has = ReadonlyCollection.has;
    export import indexOf = ReadonlyIndexedCollection.indexOf;
    export import getAt = ReadonlyIndexedCollection.getAt;
    export import setAt = FixedSizeIndexedCollection.setAt;
    export import add = Collection.add;
    export import clear = Collection.clear;
    /**
     * A well-known symbol used to define the `IndexedCollection#[IndexedCollection.insertAt]` method.
     */
    const insertAt: unique symbol;
    /**
     * A well-known symbol used to define the `IndexedCollection#[IndexedCollection.removeAt]` method.
     */
    const removeAt: unique symbol;
    const name = "IndexedCollection";
    /**
     * Tests whether a value supports the minimal representation of an `IndexedCollection`.
     */
    function hasInstance<T>(value: Iterable<T>): value is IndexedCollection<T>;
    /**
     * Tests whether a value supports the minimal representation of an `IndexedCollection`.
     */
    function hasInstance(value: unknown): value is IndexedCollection<unknown>;
}
export declare namespace IndexedCollection {
    const _delete: typeof Collection.delete;
    export { _delete as delete };
}
export interface ReadonlyKeyedContainer<K, V> {
    /**
     * Tests whether a key is present in the container.
     */
    [ReadonlyKeyedContainer.has](key: K): boolean;
    /**
     * Gets the value in the container associated with the provided key, if it exists.
     */
    [ReadonlyKeyedContainer.get](key: K): V | undefined;
}
export declare namespace ReadonlyKeyedContainer {
    /**
     * A well-known symbol used to define the `ReadonlyKeyedContainer#[ReadonlyKeyedContainer.has]` method.
     */
    const has: unique symbol;
    /**
     * A well-known symbol used to define the `ReadonlyKeyedContainer#[ReadonlyKeyedContainer.get]` method.
     */
    const get: unique symbol;
    const name = "ReadonlyKeyedContainer";
    /**
     * Tests whether a value supports the minimal representation of a `ReadonlyKeyedContainer`.
     */
    function hasInstance(value: unknown): value is ReadonlyKeyedContainer<unknown, unknown>;
}
export interface KeyedContainer<K, V> extends ReadonlyKeyedContainer<K, V> {
    /**
     * Sets a value in the container for the provided key.
     */
    [KeyedContainer.set](key: K, value: V): void;
    /**
     * Deletes a key and its associated value from the container.
     * @returns `true` if the key was found and removed; otherwise, `false`.
     */
    [KeyedContainer.delete](key: K): boolean;
}
export declare namespace KeyedContainer {
    export import has = ReadonlyKeyedContainer.has;
    export import get = ReadonlyKeyedContainer.get;
    /**
     * A well-known symbol used to define the `KeyedContainer#[KeyedContainer.set]` method.
     */
    const set: unique symbol;
    const name = "KeyedContainer";
    /**
     * Tests whether a value supports the minimal representation of a `KeyedContainer`.
     */
    function hasInstance(value: unknown): value is KeyedContainer<unknown, unknown>;
}
export declare namespace KeyedContainer {
    /**
     * A well-known symbol used to define the `KeyedContainer#[KeyedContainer.delete]` method.
     */
    const _delete: unique symbol;
    export { _delete as delete };
}
export interface ReadonlyKeyedCollection<K, V> extends ReadonlyKeyedContainer<K, V>, Iterable<[K, V]> {
    /**
     * Gets the number of elements in the collection.
     */
    readonly [ReadonlyKeyedCollection.size]: number;
    /**
     * Gets an `IterableIterator` for the keys present in the collection.
     */
    [ReadonlyKeyedCollection.keys](): IterableIterator<K>;
    /**
     * Gets an `IterableIterator` for the values present in the collection.
     */
    [ReadonlyKeyedCollection.values](): IterableIterator<V>;
}
export declare namespace ReadonlyKeyedCollection {
    export import has = ReadonlyKeyedContainer.has;
    export import get = ReadonlyKeyedContainer.get;
    /**
     * A well-known symbol used to define the `ReadonlyKeyedCollection#[ReadonlyKeyedCollection.size]` property.
     */
    const size: unique symbol;
    /**
     * A well-known symbol used to define the `ReadonlyKeyedCollection#[ReadonlyKeyedCollection.keys]` method.
     */
    const keys: unique symbol;
    /**
     * A well-known symbol used to define the `ReadonlyKeyedCollection#[ReadonlyKeyedCollection.values]` method.
     */
    const values: unique symbol;
    const name = "ReadonlyKeyedCollection";
    /**
     * Tests whether a value supports the minimal representation of a `ReadonlyKeyedCollection`.
     */
    function hasInstance<K, V>(value: Iterable<[K, V]>): value is ReadonlyKeyedCollection<K, V>;
    /**
     * Tests whether a value supports the minimal representation of a `ReadonlyKeyedCollection`.
     */
    function hasInstance(value: unknown): value is ReadonlyKeyedCollection<unknown, unknown>;
}
export interface KeyedCollection<K, V> extends ReadonlyKeyedCollection<K, V>, KeyedContainer<K, V> {
    /**
     * Clears the collection.
     */
    [KeyedCollection.clear](): void;
}
export declare namespace KeyedCollection {
    export import size = ReadonlyKeyedCollection.size;
    export import has = ReadonlyKeyedCollection.has;
    export import get = ReadonlyKeyedCollection.get;
    export import keys = ReadonlyKeyedCollection.keys;
    export import values = ReadonlyKeyedCollection.values;
    export import set = KeyedContainer.set;
    /**
     * A well-known symbol used to define the `KeyedCollection#[KeyedCollection.clear]` method.
     */
    const clear: unique symbol;
    const name = "KeyedCollection";
    /**
     * Tests whether a value supports the minimal representation of a `KeyedCollection`.
     */
    function hasInstance<K, V>(value: Iterable<[K, V]>): value is KeyedCollection<K, V>;
    /**
     * Tests whether a value supports the minimal representation of a `KeyedCollection`.
     */
    function hasInstance(value: unknown): value is KeyedCollection<unknown, unknown>;
}
export declare namespace KeyedCollection {
    /**
     * A well-known symbol used to define the `KeyedCollection#[KeyedCollection.delete]` method.
     */
    const _delete: typeof KeyedContainer.delete;
    export { _delete as delete };
}
/**
 * A {@link ReadonlyKeyedMultiCollection} describes a keyed collection object that can contain other
 * values, has a known size, and whose elements can be accessed by key, where each key can represent
 * one or more elements.
 */
export interface ReadonlyKeyedMultiCollection<K, V> extends Iterable<[K, V]> {
    /**
     * Gets the number of elements in the collection.
     */
    readonly [ReadonlyKeyedMultiCollection.size]: number;
    /**
     * Tests whether a key is present in the collection.
     */
    [ReadonlyKeyedMultiCollection.has](key: K): boolean;
    /**
     * Tests whether a key and value is present in the collection.
     */
    [ReadonlyKeyedMultiCollection.hasValue](key: K, value: V): boolean;
    /**
     * Gets the value in the collection associated with the provided key, if it exists.
     */
    [ReadonlyKeyedMultiCollection.get](key: K): Iterable<V> | undefined;
    /**
     * Gets an `IterableIterator` for the keys present in the collection.
     */
    [ReadonlyKeyedMultiCollection.keys](): IterableIterator<K>;
    /**
     * Gets an `IterableIterator` for the values present in the collection.
     */
    [ReadonlyKeyedMultiCollection.values](): IterableIterator<V>;
}
export declare namespace ReadonlyKeyedMultiCollection {
    /**
     * A well-known symbol used to define the `ReadonlyKeyedMultiCollection#[ReadonlyKeyedMultiCollection.size]` property.
     */
    const size: unique symbol;
    /**
     * A well-known symbol used to define the `ReadonlyKeyedMultiCollection#[ReadonlyKeyedMultiCollection.has]` method.
     */
    const has: unique symbol;
    /**
     * A well-known symbol used to define the `ReadonlyKeyedMultiCollection#[ReadonlyKeyedMultiCollection.hasValue]` method.
     */
    const hasValue: unique symbol;
    /**
     * A well-known symbol used to define the `ReadonlyKeyedMultiCollection#[ReadonlyKeyedMultiCollection.get]` method.
     */
    const get: unique symbol;
    /**
     * A well-known symbol used to define the `ReadonlyKeyedMultiCollection#[ReadonlyKeyedMultiCollection.keys]` method.
     */
    const keys: unique symbol;
    /**
     * A well-known symbol used to define the `ReadonlyKeyedMultiCollection#[ReadonlyKeyedMultiCollection.values]` method.
     */
    const values: unique symbol;
    const name = "ReadonlyKeyedMultiCollection";
    /**
     * Tests whether a value supports the minimal representation of a `ReadonlyKeyedMultiCollection`.
     */
    function hasInstance<K, V>(value: Iterable<[K, V]>): value is ReadonlyKeyedMultiCollection<K, V>;
    /**
     * Tests whether a value supports the minimal representation of a `ReadonlyKeyedMultiCollection`.
     */
    function hasInstance(value: unknown): value is ReadonlyKeyedMultiCollection<unknown, unknown>;
}
export interface KeyedMultiCollection<K, V> extends ReadonlyKeyedMultiCollection<K, V> {
    /**
     * Adds a value to the collection for the provided key.
     */
    [KeyedMultiCollection.add](key: K, value: V): void;
    /**
     * Deletes a key and its associated values from the collection.
     * @returns The number of values removed when the key was deleted.
     */
    [KeyedMultiCollection.delete](key: K): number;
    /**
     * Deletes a key and its associated value from the collection.
     * @returns `true` if the key and value were found and removed; otherwise, `false`.
     */
    [KeyedMultiCollection.deleteValue](key: K, value: V): boolean;
    /**
     * Clears the collection.
     */
    [KeyedMultiCollection.clear](): void;
}
export declare namespace KeyedMultiCollection {
    export import size = ReadonlyKeyedMultiCollection.size;
    export import has = ReadonlyKeyedMultiCollection.has;
    export import hasValue = ReadonlyKeyedMultiCollection.hasValue;
    export import get = ReadonlyKeyedMultiCollection.get;
    export import keys = ReadonlyKeyedMultiCollection.keys;
    export import values = ReadonlyKeyedMultiCollection.values;
    /**
     * A well-known symbol used to define the `KeyedMultiCollection#[KeyedMultiCollection.add]` method.
     */
    const add: unique symbol;
    /**
     * A well-known symbol used to define the `KeyedMultiCollection#[KeyedMultiCollection.deleteValue]` method.
     */
    const deleteValue: unique symbol;
    /**
     * A well-known symbol used to define the `KeyedMultiCollection#[KeyedMultiCollection.clear]` method.
     */
    const clear: unique symbol;
    const name = "KeyedMultiCollection";
    /**
     * Tests whether a value supports the minimal representation of a `KeyedMultiCollection`.
     */
    function hasInstance<K, V>(value: Iterable<[K, V]>): value is KeyedMultiCollection<K, V>;
    /**
     * Tests whether a value supports the minimal representation of a `KeyedMultiCollection`.
     */
    function hasInstance(value: unknown): value is KeyedMultiCollection<unknown, unknown>;
}
export declare namespace KeyedMultiCollection {
    /**
     * A well-known symbol used to define the `KeyedMultiCollection#[KeyedMultiCollection.delete]` method.
     */
    const _delete: unique symbol;
    export { _delete as delete };
}
