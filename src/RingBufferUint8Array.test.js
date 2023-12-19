const { RingBufferUint8Array } = require('../src/RingBufferUint8Array');

test('List should add and retrieve items', () => {
    const ringBufferUint8Array = new RingBufferUint8Array(50);
    ringBufferUint8Array.pushByte(1);
    ringBufferUint8Array.pushByte(2);
    expect(ringBufferUint8Array.shiftByte()).toBe(1);
    expect(ringBufferUint8Array.shiftByte()).toBe(2);
});


test('qwe', () => {
    const ringBufferUint8Array = new RingBufferUint8Array(50);
    ringBufferUint8Array.flagOverwrite = true;
    expect(ringBufferUint8Array.flagOverwrite).toBe(true);
});




test('qwqe', () => {
    const ringBufferUint8Array = new RingBufferUint8Array(50);
    ringBufferUint8Array.flagOverwrite = true;


    ringBufferUint8Array.pushUint8ArrayIfEndsWithUint8ArraysThenFlushUint8Array(
        new Uint8Array([10,20,30,40,50,60,70,80,90,100,110,120]),
        [new Uint8Array([40,50])],
        false,
        (packetData)=>{
            console.log("packetData",packetData)
            expect(packetData).toStrictEqual(new Uint8Array( [ 10, 20, 30 ]));

        });


});






// import {RingBufferUint8Array} from "../RingBufferUint8Array"
//
//
// let rr = new RingBufferUint8Array(-20);
//
//
//
// const textEncoder = new TextEncoder();
// const textDecoder = new TextDecoder();
//
// let rb = new RingBufferUint8Array(10);
//
// let tmp;
// // rb.pushByte(1);console.log(rb.toString());
// // rb.pushByte(3);console.log(rb.toString());
// // rb.pushByte(5);console.log(rb.toString());
// // rb.pushByte(textEncoder.encode('\r')[0]);console.log(rb.toString());
// // rb.pushByte(textEncoder.encode('\n')[0]);console.log(rb.toString());
// //tmp = rb.shiftByte(); console.log(rb.toString(), tmp);
// //rb.setupFlagOverwrite(true);
// rb.getMaxSizeBytes();
// rb.getFreeSpaceBytes();
//
// const inputStream = "Hello\r\nworld! May be.";
// const binarySeparators = [textEncoder.encode('\r\n'), textEncoder.encode('!')];
// for(let c of inputStream)
// {
//     rb.pushByte(textEncoder.encode(c)[0]);
//     let arr = rb.ifEndsWithUint8ArraysThenFlushUint8Array(binarySeparators, false);
//     if(arr !== null)
//         console.log("Find: ", textDecoder.decode(arr));
// }
//
// //console.log("h=",h);
// // console.log("hello1", true == 1);
// // console.log("hello1", true == "1");
// // console.log("hello1", true === 1);
// // console.log("hello1", true === "1");