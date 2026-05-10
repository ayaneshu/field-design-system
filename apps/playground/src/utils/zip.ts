/**
 * Minimal ZIP builder using the STORE (no compression) method.
 *
 * .otf font files are already structurally compressed — running deflate over
 * them gives a tiny win at the cost of pulling in a 30kB+ deflate lib. STORE
 * keeps the bundle small (~60 lines) and yields a perfectly valid .zip that
 * Finder, Explorer, and `unzip` all accept.
 *
 * Format reference: https://en.wikipedia.org/wiki/ZIP_(file_format)
 */

type Entry = { name: string; data: Uint8Array };

// Precomputed CRC32 table — IEEE 802.3 polynomial 0xEDB88320.
const CRC_TABLE: Uint32Array = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ bytes[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function writeU16(view: DataView, offset: number, value: number) {
  view.setUint16(offset, value, true);
}
function writeU32(view: DataView, offset: number, value: number) {
  view.setUint32(offset, value, true);
}

function dosTime(d: Date): { time: number; date: number } {
  const time =
    ((d.getHours() & 0x1f) << 11) |
    ((d.getMinutes() & 0x3f) << 5) |
    ((Math.floor(d.getSeconds() / 2)) & 0x1f);
  const date =
    (((d.getFullYear() - 1980) & 0x7f) << 9) |
    (((d.getMonth() + 1) & 0x0f) << 5) |
    (d.getDate() & 0x1f);
  return { time, date };
}

/** Build a STORED-method .zip Blob from a list of name + bytes entries. */
export function buildZip(entries: Entry[]): Blob {
  const encoder = new TextEncoder();
  const now = new Date();
  const { time, date } = dosTime(now);

  // Pre-compute per-entry metadata so we can size the output up-front.
  const records = entries.map((e) => {
    const nameBytes = encoder.encode(e.name);
    const crc = crc32(e.data);
    return {
      name: e.name,
      nameBytes,
      data: e.data,
      crc,
      size: e.data.length,
    };
  });

  // Local file headers + file data.
  let localPart = 0;
  for (const r of records) localPart += 30 + r.nameBytes.length + r.size;
  // Central directory records.
  let centralPart = 0;
  for (const r of records) centralPart += 46 + r.nameBytes.length;
  const endRecord = 22;
  const total = localPart + centralPart + endRecord;

  const buf = new ArrayBuffer(total);
  const view = new DataView(buf);
  const u8 = new Uint8Array(buf);

  let offset = 0;
  const localOffsets: number[] = [];

  for (const r of records) {
    localOffsets.push(offset);
    // Local file header signature.
    writeU32(view, offset, 0x04034b50);
    writeU16(view, offset + 4, 20); // version needed
    writeU16(view, offset + 6, 0); // flags
    writeU16(view, offset + 8, 0); // STORE
    writeU16(view, offset + 10, time);
    writeU16(view, offset + 12, date);
    writeU32(view, offset + 14, r.crc);
    writeU32(view, offset + 18, r.size); // compressed
    writeU32(view, offset + 22, r.size); // uncompressed
    writeU16(view, offset + 26, r.nameBytes.length);
    writeU16(view, offset + 28, 0); // extra
    offset += 30;
    u8.set(r.nameBytes, offset);
    offset += r.nameBytes.length;
    u8.set(r.data, offset);
    offset += r.size;
  }

  const centralStart = offset;
  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    writeU32(view, offset, 0x02014b50); // central dir signature
    writeU16(view, offset + 4, 0x14); // version made by
    writeU16(view, offset + 6, 20); // version needed
    writeU16(view, offset + 8, 0); // flags
    writeU16(view, offset + 10, 0); // STORE
    writeU16(view, offset + 12, time);
    writeU16(view, offset + 14, date);
    writeU32(view, offset + 16, r.crc);
    writeU32(view, offset + 20, r.size); // compressed
    writeU32(view, offset + 24, r.size); // uncompressed
    writeU16(view, offset + 28, r.nameBytes.length);
    writeU16(view, offset + 30, 0); // extra
    writeU16(view, offset + 32, 0); // comment
    writeU16(view, offset + 34, 0); // disk number
    writeU16(view, offset + 36, 0); // internal attrs
    writeU32(view, offset + 38, 0); // external attrs
    writeU32(view, offset + 42, localOffsets[i]);
    offset += 46;
    u8.set(r.nameBytes, offset);
    offset += r.nameBytes.length;
  }

  // End of central directory record.
  writeU32(view, offset, 0x06054b50);
  writeU16(view, offset + 4, 0); // disk number
  writeU16(view, offset + 6, 0); // disk with central dir start
  writeU16(view, offset + 8, records.length); // entries on this disk
  writeU16(view, offset + 10, records.length); // total entries
  writeU32(view, offset + 12, centralPart);
  writeU32(view, offset + 16, centralStart);
  writeU16(view, offset + 20, 0); // comment length

  return new Blob([buf], { type: "application/zip" });
}
