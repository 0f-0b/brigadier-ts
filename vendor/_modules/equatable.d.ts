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
 * Represents a value that can compare its equality with another value.
 */
export interface Equatable {
    /**
     * Determines whether this value is equal to another value.
     * @param other The other value.
     * @returns `true` if this value is equal to `other`; otherwise, `false`.
     */
    [Equatable.equals](other: unknown): boolean;
    /**
     * Compute a hash code for an value.
     * @returns The numeric hash-code for the value.
     */
    [Equatable.hash](): number;
}
/**
 * Utility functions and well-known symbols used to define an `Equatable`.
 */
export declare namespace Equatable {
    /**
     * A well-known symbol used to define an equality test method on a value.
     */
    const equals: unique symbol;
    /**
     * A well-known symbol used to define a hashing method on a value.
     */
    const hash: unique symbol;
    const name = "Equatable";
    /**
     * Determines whether a value is Equatable.
     * @param value The value to test.
     * @returns `true` if the value is an Equatable; otherwise, `false`.
     */
    function hasInstance(value: unknown): value is Equatable;
}
/**
 * Represents a value that can compare itself relationally with another value.
 */
export interface Comparable {
    /**
     * Compares this value with another value, returning a value indicating one of the following conditions:
     *
     * - A negative value indicates this value is lesser.
     *
     * - A positive value indicates this value is greater.
     *
     * - A zero value indicates this value is the same.
     *
     * @param other The other value to compare against.
     * @returns A number indicating the relational comparison result.
     */
    [Comparable.compareTo](other: unknown): number;
}
/**
 * Utility functions and well-known symbols used to define a `Comparable`.
 */
export declare namespace Comparable {
    /**
     * A well-known symbol used to define a relational comparison method on a value.
     */
    const compareTo: unique symbol;
    const name = "Comparable";
    /**
     * Determines whether a value is Comparable.
     * @param value The value to test.
     * @returns `true` if the value is a Comparable; otherwise, `false`.
     */
    function hasInstance(value: unknown): value is Comparable;
}
/**
 * Represents a value that can compare its structural equality with another value.
 */
export interface StructuralEquatable {
    /**
     * Determines whether this value is structurally equal to another value using the supplied `Equaler`.
     * @param other The other value.
     * @param equaler The `Equaler` to use to test equality.
     * @returns `true` if this value is structurally equal to `other`; otherwise, `false`.
     */
    [StructuralEquatable.structuralEquals](other: unknown, equaler: Equaler<unknown>): boolean;
    /**
     * Compute a structural hash code for a value using the supplied `Equaler`.
     * @param equaler The `Equaler` to use to generate hashes for values in the structure.
     * @returns The numeric hash-code of the structure.
     */
    [StructuralEquatable.structuralHash](equaler: Equaler<unknown>): number;
}
/**
 * Utility functions and well-known symbols used to define a `StructuralEquatable`.
 */
export declare namespace StructuralEquatable {
    /**
     * A well-known symbol used to define a structural equality test method on a value.
     */
    const structuralEquals: unique symbol;
    /**
     * A well-known symbol used to define a structural hashing method on a value.
     */
    const structuralHash: unique symbol;
    const name = "StructuralEquatable";
    /**
     * Determines whether a value is StructuralEquatable.
     * @param value The value to test.
     * @returns `true` if the value is StructuralEquatable; otherwise, `false`.
     */
    function hasInstance(value: unknown): value is StructuralEquatable;
}
/**
 * Represents a value that can compare its structure relationally with another value.
 */
export interface StructuralComparable {
    /**
     * Compares the structure of this value with another value using the supplied comparer,
     * returning a value indicating one of the following conditions:
     * - A negative value indicates this value is lesser.
     * - A positive value indicates this value is greater.
     * - A zero value indicates this value is the same.
     * @param other The other value to compare against.
     * @param comparer The compare to use to compare values in the structure.
     * @returns A numeric value indicating the relational comparison result.
     */
    [StructuralComparable.structuralCompareTo](other: unknown, comparer: Comparer<unknown>): number;
}
/**
 * Utility functions and well-known symbols used to define a `StructuralComparable`.
 */
export declare namespace StructuralComparable {
    /**
     * A well-known symbol used to define a structural comparison method on a value.
     */
    const structuralCompareTo: unique symbol;
    const name = "StructuralComparable";
    /**
     * Determines whether a value is StructuralComparable.
     * @param value The value to test.
     * @returns `true` if the value is StructuralComparable; otherwise, `false`.
     */
    function hasInstance(value: unknown): value is StructuralComparable;
}
/**
 * Describes a function that can be used to compare the equality of two values.
 * @typeParam T The type of value that can be compared.
 */
export declare type EqualityComparison<T> = (x: T, y: T) => boolean;
/**
 * Describes a function that can be used to compute a hash code for a value.
 * @typeParam T The type of value that can be hashed.
 */
export declare type HashGenerator<T> = (x: T) => number;
/**
 * Represents an object that can be used to compare the equality of two values.
 * @typeParam T The type of each value that can be compared.
 */
export interface Equaler<T> {
    /**
     * Tests whether two values are equal to each other.
     * @param x The first value.
     * @param y The second value.
     * @returns `true` if the values are equal; otherwise, `false`.
     */
    equals(x: T, y: T): boolean;
    /**
     * Generates a hash code for a value.
     * @param x The value to hash.
     * @returns The numeric hash-code for the value.
     */
    hash(x: T): number;
}
/**
 * Provides various implementations of `Equaler`.
 */
export declare namespace Equaler {
    /**
     * Gets the default `Equaler`.
     */
    const defaultEqualer: Equaler<unknown>;
    /**
     * Gets a default `Equaler` that supports `StructuralEquatable` values.
     */
    const structuralEqualer: Equaler<unknown>;
    /**
     * An `Equaler` that compares array values rather than the arrays themselves.
     */
    const tupleEqualer: Equaler<readonly unknown[]>;
    /**
     * An `Equaler` that compares array values that may be `StructuralEquatable` rather than the arrays themselves.
     */
    const tupleStructuralEqualer: Equaler<readonly unknown[]>;
    /**
     * Creates an `Equaler` from a comparison function and an optional hash generator.
     * @typeParam T The type of value that can be compared.
     * @param equalityComparison A callback used to compare the equality of two values.
     * @param hashGenerator A callback used to compute a numeric hash-code for a value.
     * @returns An Equaler for the provided callbacks.
     */
    function create<T>(equalityComparison: EqualityComparison<T>, hashGenerator?: HashGenerator<T>): Equaler<T>;
    /**
     * Combines two hash codes.
     * @param x The first hash code.
     * @param y The second hash code.
     * @param rotate The number of bits (between 0 and 31) to left-rotate the first hash code before XOR'ing it with the second (default 7).
     */
    function combineHashes(x: number, y: number, rotate?: number): number;
    function hasInstance(value: unknown): value is Equaler<unknown>;
}
export import defaultEqualer = Equaler.defaultEqualer;
export import structuralEqualer = Equaler.structuralEqualer;
export import tupleEqualer = Equaler.tupleEqualer;
export import tupleStructuralEqualer = Equaler.tupleEqualer;
export import combineHashes = Equaler.combineHashes;
/**
 * Describes a function that can be used to compare the relational equality of two values, returning a
 * value indicating one of the following conditions:
 * - A negative value indicates `x` is lesser than `y`.
 * - A positive value indicates `x` is greater than `y`.
 * - A zero value indicates `x` and `y` are equivalent.
 * @typeParam T The type of value that can be compared.
 */
export declare type Comparison<T> = (x: T, y: T) => number;
/**
 * Represents an object that can be used to perform a relational comparison between two values.
 * @typeParam T The type of value that can be compared.
 */
export interface Comparer<T> {
    /**
     * Compares two values, returning a value indicating one of the following conditions:
     * - A negative value indicates `x` is lesser than `y`.
     * - A positive value indicates `x` is greater than `y`.
     * - A zero value indicates `x` and `y` are equivalent.
     * @param x The first value to compare.
     * @param y The second value to compare.
     * @returns A number indicating the relational comparison result.
     */
    compare(x: T, y: T): number;
}
/**
 * Provides various implementations of `Comparer`.
 */
export declare namespace Comparer {
    /**
     * The default `Comparer`.
     */
    const defaultComparer: Comparer<unknown>;
    /**
     * A default `Comparer` that supports `StructuralComparable` values.
     */
    const structuralComparer: Comparer<unknown>;
    /**
     * A default `Comparer` that compares array values rather than the arrays themselves.
     */
    const tupleComparer: Comparer<readonly unknown[]>;
    /**
     * A default `Comparer` that compares array values that may be `StructuralComparable` rather than the arrays themselves.
     */
    const tupleStructuralComparer: Comparer<readonly unknown[]>;
    /**
     * Creates a `Comparer` from a comparison function.
     * @typeParam T The type of value that can be compared.
     * @param comparison A Comparison function used to create a Comparer.
     * @returns The Comparer for the provided comparison function.
     */
    function create<T>(comparison: Comparison<T>): Comparer<T>;
    function hasInstance(value: unknown): value is Comparer<unknown>;
}
export import defaultComparer = Comparer.defaultComparer;
export import structuralComparer = Comparer.structuralComparer;
export import tupleComparer = Comparer.tupleComparer;
export import tupleStructuralComparer = Comparer.tupleStructuralComparer;
/**
 * Gets the raw hashcode for a value. This bypasses any `[Equatable.hash]` properties on an object.
 * @param value Any value.
 * @returns The hashcode for the value.
 */
export declare function rawHash(value: unknown): number;
