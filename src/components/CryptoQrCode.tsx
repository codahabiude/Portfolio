import { useMemo } from 'react';

interface CryptoQrCodeProps {
  address: string;
}

function isFinderCell(r: number, c: number, size: number): boolean | null {
  const corners: [number, number][] = [
    [0, 0],
    [0, size - 7],
    [size - 7, 0],
  ];
  for (const [cr, cc] of corners) {
    const dr = r - cr;
    const dc = c - cc;
    if (dr >= 0 && dr < 7 && dc >= 0 && dc < 7) {
      if (dr === 0 || dr === 6 || dc === 0 || dc === 6) return true;
      if (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4) return true;
      return false;
    }
    if (dr >= -1 && dr <= 7 && dc >= -1 && dc <= 7) {
      return false;
    }
  }
  return null;
}

export function CryptoQrCode({ address }: CryptoQrCodeProps) {
  const size = 21;

  const cells = useMemo(() => {
    const matrix: boolean[][] = [];
    let hash = 2166136261;
    for (let i = 0; i < address.length; i++) {
      hash ^= address.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    for (let r = 0; r < size; r++) {
      const row: boolean[] = [];
      for (let c = 0; c < size; c++) {
        const finder = isFinderCell(r, c, size);
        if (finder !== null) {
          row.push(finder);
          continue;
        }
        const charCode = address.charCodeAt((r * size + c) % address.length);
        const bit = ((hash ^ (r * 31 + c * 17 + charCode)) >>> ((r + c) % 8)) & 1;
        row.push(bit === 1);
      }
      matrix.push(row);
    }
    return matrix;
  }, [address]);

  return (
    <svg
      viewBox={`0 0 ${size + 2} ${size + 2}`}
      role="img"
      aria-label={`Wallet QR graphic for ${address}`}
      className="w-28 h-28 rounded-lg bg-white p-1.5 mx-auto"
    >
      <rect x={0} y={0} width={size + 2} height={size + 2} fill="#ffffff" />
      {cells.map((row, r) =>
        row.map((filled, c) =>
          filled ? (
            <rect key={`${r}-${c}`} x={c + 1} y={r + 1} width={1} height={1} fill="#050507" />
          ) : null
        )
      )}
    </svg>
  );
}
