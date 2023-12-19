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

export class RingBufferUint8
{
    protected _addressFirstByte:number = 0;
    protected _countStoredBytes:number = 0;
    protected readonly _bufferSize:number;//Like this._buffer.length, but may be faster
    protected readonly _buffer:Uint8Array;
    protected _flagOverwrite:boolean;

    /**
     * Constructs a circular buffer with the specified size in bytes.
     * @param {number} sizeBytes - The size of the circular buffer in bytes.
     * @param {boolean} [flagOverwrite=false] - A flag indicating whether to overwrite existing values when the buffer is full.
     */
    public constructor(sizeBytes: number, flagOverwrite = false)
    {
        if((sizeBytes % 1 !== 0) || !(sizeBytes > 0))
           throw new (class extends Error {
                name="CONSTRUCTOR_WRONG_SIZE_BYTES";
            })(`RingBufferUint8.construct(sizeBytes must be integer > 0, but it "${sizeBytes}")`)

        this._flagOverwrite = flagOverwrite;

        this._bufferSize = Math.floor(sizeBytes);
        this._buffer = new Uint8Array(this._bufferSize);
    }
    /**
     * Sets the flag indicating whether to overwrite existing values when the buffer is full.
     * @param {boolean} flagOverwrite - The new value for the flag.
     */
    public set flagOverwrite(flagOverwrite:boolean){
        this._flagOverwrite = flagOverwrite;
    }
    /**
     * Gets the current value of the flag indicating whether to overwrite existing values when the buffer is full.
     * @returns {boolean} - The current value of the flag.
     */
    public get flagOverwrite():boolean{
        return this._flagOverwrite;
    }

    /**
     * Fast clears the circular buffer, removing all stored values.
     */
    public clear():void
    {
        this._countStoredBytes = 0;
        this._addressFirstByte = 0;
    }
    /**
     * Gets the maximum size of the circular buffer in bytes.
     * @returns {number} - The maximum size of the buffer.
     */
    public getMaxSizeBytes():number
    {
        return this._bufferSize;
    }
    /**
     * Gets the current count of stored bytes in the circular buffer.
     * @returns {number} - The count of stored bytes.
     */
    public getCountStoredBytes():number
    {
        return this._countStoredBytes;
    }
    /**
     * Gets the free space available in the circular buffer in bytes.
     * @returns {number} - The amount of free space in the buffer.
     */
    public getFreeSpaceBytes():number
    {
        return this._bufferSize - this._countStoredBytes;
    }

    public static assertByteToWrite(valueOneByte:number, functionName:string, functionCode:string):void|never
    {
        if(!(valueOneByte <= 255))
            throw new (class extends Error {
                name=`${functionCode}_VALUE_MORE_255`;
            })(`RingBufferUint8.${functionName}(valueOneByte(${valueOneByte}) must be <= 255)`);
        if(!(valueOneByte >= 0))
            throw new (class extends Error {
                name=`${functionCode}_VALUE_LOWER_0`;
            })(`RingBufferUint8.${functionName}(valueOneByte(${valueOneByte}) must be >= 0)`);
        if(valueOneByte % 1 !== 0)
            throw new (class extends Error {
                name=`${functionCode}_VALUE_NOT_INTEGER`;
            })(`RingBufferUint8.${functionName}(valueOneByte(${valueOneByte}) must be integer)`);
    }




    /**
     * Reads a byte from the beginning of the circular buffer at the specified index.
     * not throws Error if arguments wrong, check it manually.
     * @param {number} indexAtBegin - The index from the beginning.
     * @returns {number} - The byte value.
     */
    public _readByteAtBegin(indexAtBegin:number):number
    {
        return this._buffer[(this._addressFirstByte + indexAtBegin) % this._bufferSize];
    }
    /**
     * Reads a byte from the beginning of the circular buffer at the specified index.
     * @param {number} indexAtBegin - The index from the beginning.
     * @returns {number} - The byte value.
     * @throws {Error} - Throws an error if the index is out of bounds.
     */
    public readByteAtBegin(indexAtBegin:number):number|never
    {
        if(!(indexAtBegin <= this._countStoredBytes))
            throw new (class extends Error {
                name=`READ_BYTE_AT_BEGIN_WRONG_ADDRESS`;
            })(`RingBufferUint8.readByteAtBegin(indexAtBegin(${indexAtBegin}) must be <= ${this._countStoredBytes})`);
        return this._readByteAtBegin(indexAtBegin);
    }

    /**
     * Reads a byte from the end of the circular buffer at the specified index.
     * not throws Error if arguments wrong, check it manually.
     * @param {number} indexAtEnd - The index from the end.
     * @returns {number} - The byte value.
     */
    public _readByteAtEnd(indexAtEnd:number):number
    {
        return this._buffer[(this._addressFirstByte + this._countStoredBytes - indexAtEnd - 1) % this._bufferSize];
        //return this._buffer[(this._addressFirstByte + this._countStoredBytes - indexAtEnd + this._bufferSize) % this._bufferSize];
    }
    /**
     * Reads a byte from the end of the circular buffer at the specified index.
     * @param {number} indexAtEnd - The index from the end.
     * @returns {number} - The byte value.
     * @throws {Error} - Throws an error if the index is out of bounds.
     */
    public readByteAtEnd(indexAtEnd:number):number|never
    {
        if(!(indexAtEnd <= this._countStoredBytes))
            throw new (class extends Error {
                name=`READ_BYTE_AT_END_WRONG_ADDRESS`;
            })(`RingBufferUint8.readByteAtEnd(indexAtEnd(${indexAtEnd}) must be <= ${this._countStoredBytes})`);
        return this._readByteAtEnd(indexAtEnd);
    }




    /**
     * Writes a byte to the beginning of the circular buffer at the specified index.
     * not throws Error if arguments wrong, check it manually.
     * @param {number} indexAtBegin - The index from the beginning.
     * @param {number} valueOneByte - The value of the byte to write.
     */
    public _writeByteAtBegin(indexAtBegin:number, valueOneByte: number):void
    {
        //this._buffer[(this._addressFirstByte + indexAtBegin + this._bufferSize) % this._bufferSize] = valueOneByte;
        this._buffer[(this._addressFirstByte + indexAtBegin) % this._bufferSize] = valueOneByte;
    }
    /**
     * Writes a byte to the beginning of the circular buffer at the specified index.
     * @param {number} indexAtBegin - The index from the beginning.
     * @param {number} valueOneByte - The value of the byte to write.
     * @throws {Error} - Throws an error if the index is out of bounds.
     */
    public writeByteAtBegin(indexAtBegin:number, valueOneByte: number):void|never
    {
        if(!(indexAtBegin <= this._countStoredBytes))
            throw new (class extends Error {
                name=`WRITE_BYTE_AT_BEGIN_WRONG_ADDRESS`;
            })(`RingBufferUint8.writeByteAtBegin(indexAtBegin(${indexAtBegin}) must be <= ${this._countStoredBytes})`);
        RingBufferUint8.assertByteToWrite(valueOneByte, "writeByteAtBegin", "WRITE_BYTE_AT_BEGIN");
        this._writeByteAtBegin(indexAtBegin, valueOneByte);
    }

    /**
     * Writes a byte to the end of the circular buffer at the specified index.
     * not throws Error if arguments wrong, check it manually.
     * @param {number} indexAtEnd - The index from the end.
     * @param {number} valueOneByte - The value of the byte to write.
     */
    public _writeByteAtEnd(indexAtEnd:number, valueOneByte: number):void
    {
        //this._buffer[(this._addressFirstByte + this._countStoredBytes - indexAtEnd + this._bufferSize) % this._bufferSize] = valueOneByte;
        this._buffer[(this._addressFirstByte + this._countStoredBytes - indexAtEnd) % this._bufferSize] = valueOneByte;
    }
    /**
     * Writes a byte to the end of the circular buffer at the specified index.
     * @param {number} indexAtEnd - The index from the end.
     * @param {number} valueOneByte - The value of the byte to write.
     * @throws {Error} - Throws an error if the index is out of bounds.
     */
    public writeByteAtEnd(indexAtEnd:number, valueOneByte: number):void|never
    {
        if(!(indexAtEnd <= this._countStoredBytes))
            throw new (class extends Error {
                name=`WRITE_BYTE_AT_END_WRONG_ADDRESS`;
            })(`RingBufferUint8.writeByteAtEnd(indexAtEnd(${indexAtEnd}) must be <= ${this._countStoredBytes})`);
        RingBufferUint8.assertByteToWrite(valueOneByte, "writeByteAtEnd", "WRITE_BYTE_AT_END");
        this._writeByteAtEnd(indexAtEnd, valueOneByte);
    }


    /**
     * Shifts a byte from the beginning of the circular buffer.
     * @not throws Error if the buffer is empty, check it manually.
     */
    public _shiftByte():number
    {
        let valueOneByte = this._buffer[this._addressFirstByte];
        this._addressFirstByte = (this._addressFirstByte + 1) % this._bufferSize;
        this._countStoredBytes--;
        return valueOneByte;
    }
    /**
     * Shifts a byte from the beginning of the circular buffer.
     * @returns {number} - The shifted byte value.
     * @throws {Error} - Throws an error if the buffer is empty.
     */
    public shiftByte():number|never
    {
        if(!(this.getCountStoredBytes() > 0))
            throw new (class extends Error {
                name=`SHIFT_BYTE_NO_DATA`;
            })(`TelemokRingBufferUint8.shiftByte no date`);
        return this._shiftByte();
    }



    /**
     * Pushes a byte to the circular buffer.
     * @param {number} valueOneByte - The value of the byte to push.
     * @not throws Error if the buffer is full, check it manually.
     */
    public _pushByteNoOverwrite(valueOneByte:number):void
    {
        this._buffer[(this._addressFirstByte + this._countStoredBytes ) % this._bufferSize] = valueOneByte;
        this._countStoredBytes++;
    }
    public _pushByteOrOverwrite(valueOneByte:number):void
    {
        if(this._countStoredBytes == this._bufferSize){
            this._buffer[this._addressFirstByte] = valueOneByte;
            this._addressFirstByte = (this._addressFirstByte + 1) % this._bufferSize;
        }
        else
        {
            this._buffer[(this._addressFirstByte + this._countStoredBytes ) % this._bufferSize] = valueOneByte;
            this._countStoredBytes++;
        }
    }
    /**
     * Pushes a byte to the circular buffer.
     * @param {number} valueOneByte - The value of the byte to push.
     * @param {boolean} [overwrite=false] - Whether to overwrite the existing value if the buffer is full.
     * @throws {Error} - Throws an error if the buffer is full and overwrite is set to false.
     */
    public pushByte(valueOneByte:number, overwrite:boolean = this._flagOverwrite):void|never
    {
        RingBufferUint8.assertByteToWrite(valueOneByte, "pushByte", "PUSH_BYTE");
        if(overwrite)
        {
            this._pushByteOrOverwrite(valueOneByte);
        }
        else
        {
            if(this._countStoredBytes >= this._bufferSize)
                throw new (class extends Error {
                    name=`PUSH_BYTE_OVERFLOW`;
                })(`RingBufferUint8.pushByte() overflow ${this._bufferSize} bytes full`);
            this._pushByteNoOverwrite(valueOneByte);
        }
    }











    public shiftUint8Array(countBytesToShift:number|undefined = undefined):Uint8Array|never
    {
        if(typeof countBytesToShift === 'undefined')
            countBytesToShift = this.getCountStoredBytes();
        else
        {
            if(countBytesToShift % 1 !== 0)
                throw new (class extends Error {
                    name=`SHIFT_UINT8ARRAY_WITH_NON_INTEGER_COUNT`;
                })(`Wrong countBytesToShift(${countBytesToShift}), required integer!`);
            if(countBytesToShift > 0)
            {
                if(countBytesToShift > this.getCountStoredBytes())
                    throw new (class extends Error {
                        name=`SHIFT_UINT8ARRAY_WITH_COUNT_NO_DATA`;
                    })(`Wrong countBytesToShift(${countBytesToShift}) > stored(${this.getCountStoredBytes()}!`);
            }
            else if(countBytesToShift < 0)
            {
                if(-countBytesToShift >= this.getCountStoredBytes())
                    throw new (class extends Error {
                        name=`SHIFT_UINT8ARRAY_WITHOUT_COUNT_NO_DATA`;
                    })(`Wrong countBytesToShift(-(${countBytesToShift})) >= stored(${this.getCountStoredBytes()})!`);

                countBytesToShift =  this.getCountStoredBytes() + countBytesToShift;
            }
            else
                throw new (class extends Error {
                    name=`SHIFT_UINT8ARRAY_WRONG_COUNT_BYTES_TO_SHIFT`;
                })(`Wrong argument countBytesToShift(${countBytesToShift}), need > 0, < 0 or undefined!`);

        }

        let uint8Array = new Uint8Array(countBytesToShift);
        for(let i = 0; i < countBytesToShift; i++)
            uint8Array[i] = this._shiftByte();
        return uint8Array;
    }

    // _pushUint8ArrayOrOverwrite_noChecks(uint8Array, overwrite = false)
    // {
    //     for(let i of uint8Array)
    //         this._pushByteOrOverwrite(uint8Array[i]);
    //
    //     if(overwrite)
    //     {
    //         this._pushByteOrOverwrite(valueOneByte);
    //     }
    //     else
    //     {
    //         if(this._countStoredBytes == this._bufferSize)
    //             throw new ErrorWithCode(`RingBufferUint8.pushByte() overflow ${this._bufferSize} bytes full`, `PUSH_BYTE_OVERFLOW`);
    //         this._pushByteNoOverwrite(valueOneByte);
    //     }
    //
    // }
    // pushUint8Array(uint8Array, overwrite = false)
    // {
    //     if(uint8Array.constructor !== Uint8Array)
    //         throw new ErrorWithCode("","PUSH_UINT8ARRAY_WRONG_ARG");
    //
    //    // this._pushUint8Array_noChecks(uint8Array);
    //
    //     //valda.uint8Array.assert(uint8Array, "TelemokRingBufferUint8.pushUint8Array");
    //     let bytesFree = this.getFreeSpaceBytes();
    //     //if(uint8Array.length > bytesFree)
    //     //	throw new Error(`Can't push uint8Array.length = ${uint8Array.length} bytes to TelemokRingBufferUint8 with free space = ${bytesFree} bytes!`);
    //     for(let i in uint8Array)
    //         this.pushByte(uint8Array[i]);
    // }
    // pop(count)
    // {
    // 	if(!(count <= this.getCountStoredBytes()))
    // 		throw new Error(`RingBufferUint8 cant pop ${count} bytes, because stored ${this.getCountStoredBytes()} bytes`);
    // 	this._head -= count;
    // }
    // pushByteAndShiftIfEndOf(valueOneByte, separatorsSetOfUint8Arrays, removeSeparator = false)
    // {
    // 	this.pushByte(valueOneByte);
    //
    // }


    /**
     * Compare end of ring buffer with Uint8Array
     * true - equals
     * false - not equals
     * */
    isEndWithUint8array(uint8Array:Uint8Array):boolean
    {
       // console.log(" isEndWithUint8array(uint8Array",uint8Array);
        if(uint8Array.length > this.getCountStoredBytes())
            return false;
        for(let i = 0; i < uint8Array.length; i++)
        {
            if(uint8Array[uint8Array.length - 1 - i] !== this.readByteAtEnd(i))
                return false;
        }

        //console.log(" isEndWithUint8array return true",this.readByteAtEnd(0));
        return true;
    }

    // isEndWithUint8arrays(uint8Arrays:Uint8Array[]):boolean
    // {
    //     for(let uint8Array of uint8Arrays)
    //     {
    //         if(this.isEndWithUint8array(uint8Array);
    //             return true;
    //     }
    //     return false;
    // }



    ifEndsWithUint8ArrayThenFlushUint8Array(separatorUint8Array:Uint8Array, returnWithSeparator:boolean = true):null|Uint8Array
    {
        if(!this.isEndWithUint8array(separatorUint8Array))
            return null;


        let count = this.getCountStoredBytes();
        if(!returnWithSeparator)
            count -= separatorUint8Array.length;

        let result = this.shiftUint8Array(count);
        this.clear();
        //console.log("count = "+count)
        //console.log(result)
        return result;
    }

    ifEndsWithUint8ArraysThenFlushUint8Array(uint8Arrays:Uint8Array[], returnWithSeparator:boolean = true):null|Uint8Array
    {
        for(let separatorUint8Array of uint8Arrays)
        {
            let allUint8Array = this.ifEndsWithUint8ArrayThenFlushUint8Array(separatorUint8Array, returnWithSeparator);
            if(allUint8Array !== null)
                return allUint8Array;
        }
        return null;
    }



    public pushUint8ArrayIfEndsWithUint8ArraysThenFlushUint8Array(
        pushBytes:Uint8Array,
        endWithSplitters:Uint8Array[],
        returnWithSeparator:boolean = true,
        callback:(packetData:Uint8Array)=>void):void{
        for(let oneByte of pushBytes)
        {
            this._pushByteOrOverwrite(oneByte);
            let resultUint8Array = this.ifEndsWithUint8ArraysThenFlushUint8Array(endWithSplitters,returnWithSeparator);
            if(resultUint8Array !== null)
            {
                callback(resultUint8Array);
            }
        }

    }

    toString()
    {
        let n = this.getCountStoredBytes();
        let a = [];
        for(let i = 0; i < n; i++)
        {
            a.push(this.readByteAtBegin(i));
        }
        return `RB tail = ${this._addressFirstByte} stored = ${this._countStoredBytes} [${a.join(", ")}]`;
    }
}

/* like npmjs.com/package/circular-buffer but Uint8Array instead of Array, add greatly more functionality and work faster. */