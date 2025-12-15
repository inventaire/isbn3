interface ISBNAudit {
  source: string;
  validIsbn: boolean;
  groupname?: string;
  clues: Array<{
    message: string;
    candidate: string;
    groupname: string;
  }>;
}

interface ISBN {
  source: string;
  isValid: boolean;
  isIsbn10: boolean;
  isIsbn13: boolean;
  prefix?: string;
  group: string;
  publisher: string;
  article: string;
  check: string;
  isbn13?: string;
  isbn13h?: string;
  check10: string;
  check13: string;
  groupname: string;
  isbn10?: string;
  isbn10h?: string;
}

declare module "isbn3" {
  export function parse(isbn: string): ISBN | null;
  export function asIsbn13(isbn: string, hyphen?: boolean): string | null;
  export function asIsbn10(isbn: string, hyphen?: boolean): string | null;
  export function hyphenate(isbn: string): string;
  export function audit(isbn: string): ISBNAudit;
  export const groups: Record<
    string,
    {
      name: string;
      ranges: Array<[string, string]>;
    }
  >;
}
