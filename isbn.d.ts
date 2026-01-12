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

interface ISBNBase {
  source: string;
  isValid: true;
  group: string;
  publisher: string;
  article: string;
  check: string;
  groupname: string;
}

interface ISBN10 extends ISBNBase {
  isIsbn10: true;
  isIsbn13: false;
  check10: string;
  isbn10: string;
  isbn10h: string;
}

interface ISBN13 extends ISBNBase {
  isIsbn10: false;
  isIsbn13: true;
  prefix: string;
  check13: string;
  isbn13: string;
  isbn13h: string;
}

type ISBN = ISBN10 | ISBN13;

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
