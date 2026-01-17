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

  // input related fields
  isIsbn10: boolean;
  isIsbn13: boolean;

  // isbn13 related fields
  prefix: string;
  check13: string;
  isbn13: string;
  isbn13h: string;
}

// ISBN-13 only (no ISBN-10 equivalent)
interface ISBN13Only extends ISBNBase {
  isbn10: undefined;
}

// ISBN-10 specific fields
interface ISBN10 extends ISBNBase {
  isbn10: string;
  check10: string;
  isbn10h: string;
}

type ISBN = ISBN10 | ISBN13Only;

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
