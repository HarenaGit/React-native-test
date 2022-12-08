import { Buffer } from 'buffer';

const ByteToBase64String = (byte) => {
    const buff = Buffer.from(byte, 'base64')
    return buff.toString('base64')
}

export default ByteToBase64String;