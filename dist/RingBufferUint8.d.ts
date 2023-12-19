/**
 * @file    RingBufferUint8.ts
 * @brief   Typescript circular ring buffer uint8array with push shift read write find operations
 * @author  Dmitrii Arshinnikov <www.telemok.com@gmail.com> https://github.com/Telemok npmjs.com/search?q=%40telemok
 * @version 0.0.20231219 alpha
 * @date 2023-12-17
 *
 @verbatim
 Copyright (c) 2023 telemok.com Dmitrii Arshinnikov

 Licensed under the Apache License, Version 2.0(the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 @endverbatim
 */
export declare class RingBufferUint8 {
    protected _addressFirstByte: number;
    protected _countStoredBytes: number;
    protected readonly _bufferSize: number;
    protected readonly _buffer: Uint8Array;
    protected _flagOverwrite: boolean;
    /**
     * Constructs a circular buffer with the specified size in bytes.
     * @param {number} sizeBytes - The size of the circular buffer in bytes.
     * @param {boolean} [flagOverwrite=false] - A flag indicating whether to overwrite existing values when the buffer is full.
     */
    constructor(sizeBytes: number, flagOverwrite?: boolean);
    /**
     * Sets the flag indicating whether to overwrite existing values when the buffer is full.
     * @param {boolean} flagOverwrite - The new value for the flag.
     */
    set flagOverwrite(flagOverwrite: boolean);
    /**
     * Gets the current value of the flag indicating whether to overwrite existing values when the buffer is full.
     * @returns {boolean} - The current value of the flag.
     */
    get flagOverwrite(): boolean;
    /**
     * Fast clears the circular buffer, removing all stored values.
     */
    clear(): void;
    /**
     * Gets the maximum size of the circular buffer in bytes.
     * @returns {number} - The maximum size of the buffer.
     */
    getMaxSizeBytes(): number;
    /**
     * Gets the current count of stored bytes in the circular buffer.
     * @returns {number} - The count of stored bytes.
     */
    getCountStoredBytes(): number;
    /**
     * Gets the free space available in the circular buffer in bytes.
     * @returns {number} - The amount of free space in the buffer.
     */
    getFreeSpaceBytes(): number;
    static assertByteToWrite(valueOneByte: number, functionName: string, functionCode: string): void | never;
    /**
     * Reads a byte from the beginning of the circular buffer at the specified index.
     * not throws Error if arguments wrong, check it manually.
     * @param {number} indexAtBegin - The index from the beginning.
     * @returns {number} - The byte value.
     */
    _readByteAtBegin(indexAtBegin: number): number;
    /**
     * Reads a byte from the beginning of the circular buffer at the specified index.
     * @param {number} indexAtBegin - The index from the beginning.
     * @returns {number} - The byte value.
     * @throws {Error} - Throws an error if the index is out of bounds.
     */
    readByteAtBegin(indexAtBegin: number): number | never;
    /**
     * Reads a byte from the end of the circular buffer at the specified index.
     * not throws Error if arguments wrong, check it manually.
     * @param {number} indexAtEnd - The index from the end.
     * @returns {number} - The byte value.
     */
    _readByteAtEnd(indexAtEnd: number): number;
    /**
     * Reads a byte from the end of the circular buffer at the specified index.
     * @param {number} indexAtEnd - The index from the end.
     * @returns {number} - The byte value.
     * @throws {Error} - Throws an error if the index is out of bounds.
     */
    readByteAtEnd(indexAtEnd: number): number | never;
    /**
     * Writes a byte to the beginning of the circular buffer at the specified index.
     * not throws Error if arguments wrong, check it manually.
     * @param {number} indexAtBegin - The index from the beginning.
     * @param {number} valueOneByte - The value of the byte to write.
     */
    _writeByteAtBegin(indexAtBegin: number, valueOneByte: number): void;
    /**
     * Writes a byte to the beginning of the circular buffer at the specified index.
     * @param {number} indexAtBegin - The index from the beginning.
     * @param {number} valueOneByte - The value of the byte to write.
     * @throws {Error} - Throws an error if the index is out of bounds.
     */
    writeByteAtBegin(indexAtBegin: number, valueOneByte: number): void | never;
    /**
     * Writes a byte to the end of the circular buffer at the specified index.
     * not throws Error if arguments wrong, check it manually.
     * @param {number} indexAtEnd - The index from the end.
     * @param {number} valueOneByte - The value of the byte to write.
     */
    _writeByteAtEnd(indexAtEnd: number, valueOneByte: number): void;
    /**
     * Writes a byte to the end of the circular buffer at the specified index.
     * @param {number} indexAtEnd - The index from the end.
     * @param {number} valueOneByte - The value of the byte to write.
     * @throws {Error} - Throws an error if the index is out of bounds.
     */
    writeByteAtEnd(indexAtEnd: number, valueOneByte: number): void | never;
    /**
     * Shifts a byte from the beginning of the circular buffer.
     * @not throws Error if the buffer is empty, check it manually.
     */
    _shiftByte(): number;
    /**
     * Shifts a byte from the beginning of the circular buffer.
     * @returns {number} - The shifted byte value.
     * @throws {Error} - Throws an error if the buffer is empty.
     */
    shiftByte(): number | never;
    /**
     * Pushes a byte to the circular buffer.
     * @param {number} valueOneByte - The value of the byte to push.
     * @not throws Error if the buffer is full, check it manually.
     */
    _pushByteNoOverwrite(valueOneByte: number): void;
    _pushByteOrOverwrite(valueOneByte: number): void;
    /**
     * Pushes a byte to the circular buffer.
     * @param {number} valueOneByte - The value of the byte to push.
     * @param {boolean} [overwrite=false] - Whether to overwrite the existing value if the buffer is full.
     * @throws {Error} - Throws an error if the buffer is full and overwrite is set to false.
     */
    pushByte(valueOneByte: number, overwrite?: boolean): void | never;
    shiftUint8Array(countBytesToShift?: number | undefined): Uint8Array | never;
    /**
     * Compare end of ring buffer with Uint8Array
     * true - equals
     * false - not equals
     * */
    isEndWithUint8array(uint8Array: Uint8Array): boolean;
    ifEndsWithUint8ArrayThenFlushUint8Array(separatorUint8Array: Uint8Array, returnWithSeparator?: boolean): null | Uint8Array;
    ifEndsWithUint8ArraysThenFlushUint8Array(uint8Arrays: Uint8Array[], returnWithSeparator?: boolean): null | Uint8Array;
    pushUint8ArrayIfEndsWithUint8ArraysThenFlushUint8Array(pushBytes: Uint8Array, endWithSplitters: Uint8Array[], returnWithSeparator: boolean, callback: (packetData: Uint8Array) => void): void;
    toString(): string;
}
