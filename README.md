# ts-circular-ring-buffer-uint8-array

https://npmjs.com/package/@telemok/ts-circular-ring-buffer-uint8-array is the typescript circular ring buffer uint8array with .push .shift .read .write find operations

## Features

- Work in Uint8array - it faster and native.
- UART/USART stream parsing compatible.
- Argument checking and fast functions without checking.
- Fast and easy to learn.
- Ring overwrite on/off.
- Any buffer size, not 2^n.
- NodeJs and browser Javascript support

## Installation:
1. Create your NodeJs, Browser or Webview app.
2. run: npm install @telemok/ring-buffer-uint8array
3. import { RingBufferUint8 } from "@telemok/RingBufferUint8.ts"
4. Ready.


## Examples:

1. Parsing students database

```javascript
import {RingBufferUint8} from "@telemok/RingBufferUint8"

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/* Create instance of RingBuffer */
let rb = new RingBufferUint8(10);

/* Data to parse, like streaming from UART. */
const inputStream = "Hello\r\nworld! May be.";

/* Separators to split data. */
const binarySeparators = [textEncoder.encode('\r\n'), textEncoder.encode('!')];

/* Iterate stream data.*/
for(let c of inputStream)
{
    /* Push bytes from stream. */
    rb.pushByte(textEncoder.encode(c)[0]);
    
    /* Extract Uint8array from ringbuffer without separator if separator match or return null. */
    let arr = rb.ifEndsWithUint8ArraysThenFlushUint8Array(binarySeparators, false);
    if(arr !== null)
        console.log("Find: ", textDecoder.decode(arr));
}
```
It will return:  
Find:  Hello  
Find:  world
