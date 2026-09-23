export interface ZipDataset { zip: string[]; city: string[]; state: string[]; lat: number[]; lon: number[] }
export interface ZipLocation { city: string; state: string; lat: number; lon: number }

export function parseZip(input: string): string | null {
  void input;
  throw new Error('not implemented');
}

export function lookupZip(zip: string, data: ZipDataset): ZipLocation | null {
  void zip;
  void data;
  throw new Error('not implemented');
}

export function loadZips(url: string, fetchImpl?: typeof fetch): Promise<ZipDataset> {
  void url;
  void fetchImpl;
  throw new Error('not implemented');
}
