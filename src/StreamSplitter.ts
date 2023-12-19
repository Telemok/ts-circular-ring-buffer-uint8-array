
class StreamSplitter
{
    private readonly _buffer:Uint8Array;
    private _index:number = 0;
    public constructor(bufferSizeBytes:number)
    {
        this._buffer = new Uint8Array(bufferSizeBytes);
    }
    public clear():void
    {
        this._index = 0;
    }
    public pushByte(valueOneByte:number):void
    {
        if(this._index + 1 >= this._buffer.length)
        {
            this._index = 0;
        }
        this._buffer[this._index] = valueOneByte;
        this._index++;
    }
    public isEndsWith(uint8ArraySplitter:Uint8Array)
    {
        ///TODO
    }
}