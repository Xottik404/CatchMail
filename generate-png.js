const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function createPNG(size) {
  const width = size;
  const height = size;

  // CRC32 implementation
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c;
  }

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const chunkData = Buffer.concat([typeBuf, data]);
    crcBuf.writeUInt32BE(crc32(chunkData), 0);
    return Buffer.concat([len, chunkData, crcBuf]);
  }

  // Header: 8 bytes
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk: 13 bytes
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth: 8
  ihdr.writeUInt8(6, 9); // color type: 6 (RGBA)
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Generate pixel data (RGBA) with scanline filter byte 0
  const scanlineLength = 1 + width * 4;
  const rawData = Buffer.alloc(scanlineLength * height);

  const radius = Math.floor(size * 0.22);
  const stroke = Math.max(3, Math.floor(size * 0.055));

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;

      // Rounded rect mask
      let inRect = false;
      const rx = Math.min(x, width - 1 - x);
      const ry = Math.min(y, height - 1 - y);

      if (rx < radius && ry < radius) {
        const dx = radius - rx;
        const dy = radius - ry;
        inRect = (dx * dx + dy * dy) <= (radius * radius);
      } else {
        inRect = true;
      }

      if (!inRect) {
        // Transparent
        rawData[pixelOffset] = 0;
        rawData[pixelOffset + 1] = 0;
        rawData[pixelOffset + 2] = 0;
        rawData[pixelOffset + 3] = 0;
        continue;
      }

      // Gradient from blue (#3b82f6 -> rgb 59, 130, 246) to indigo (#6366f1 -> rgb 99, 102, 241)
      const t = (x + y) / (width + height);
      let r = Math.round(59 + (99 - 59) * t);
      let g = Math.round(130 + (102 - 130) * t);
      let b = Math.round(246 + (241 - 246) * t);

      // Draw Mail Icon (envelope) in white
      // Envelope box: from 22% to 78% width, 32% to 68% height
      const left = Math.floor(width * 0.22);
      const right = Math.floor(width * 0.78);
      const top = Math.floor(height * 0.32);
      const bottom = Math.floor(height * 0.68);
      const midX = Math.floor(width * 0.5);
      const midY = Math.floor(height * 0.53);

      let isWhite = false;

      // Outer box borders
      const onBorder =
        (Math.abs(x - left) <= stroke / 2 && y >= top && y <= bottom) ||
        (Math.abs(x - right) <= stroke / 2 && y >= top && y <= bottom) ||
        (Math.abs(y - top) <= stroke / 2 && x >= left && x <= right) ||
        (Math.abs(y - bottom) <= stroke / 2 && x >= left && x <= right);

      // V-shaped flap lines from (left, top) to (midX, midY) and (right, top) to (midX, midY)
      let onFlap = false;
      if (x >= left && x <= midX && y >= top && y <= midY) {
        const expectedY = top + (midY - top) * ((x - left) / (midX - left));
        if (Math.abs(y - expectedY) <= stroke / 1.8) onFlap = true;
      } else if (x >= midX && x <= right && y >= top && y <= midY) {
        const expectedY = midY - (midY - top) * ((x - midX) / (right - midX));
        if (Math.abs(y - expectedY) <= stroke / 1.8) onFlap = true;
      }

      if (onBorder || onFlap) {
        isWhite = true;
      }

      if (isWhite) {
        rawData[pixelOffset] = 255;
        rawData[pixelOffset + 1] = 255;
        rawData[pixelOffset + 2] = 255;
        rawData[pixelOffset + 3] = 255;
      } else {
        rawData[pixelOffset] = r;
        rawData[pixelOffset + 1] = g;
        rawData[pixelOffset + 2] = b;
        rawData[pixelOffset + 3] = 255;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const dir = path.join(__dirname, 'CatchMail', 'public');
fs.writeFileSync(path.join(dir, 'icon-192.png'), createPNG(192));
fs.writeFileSync(path.join(dir, 'icon-512.png'), createPNG(512));
console.log('Generated icon-192.png and icon-512.png successfully!');

