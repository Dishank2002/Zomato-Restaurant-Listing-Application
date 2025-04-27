declare module 'csv-parser' {
    import { Transform } from 'stream';

    interface CsvParserOptions {
        separator?: string;
        headers?: boolean | string[];
        mapHeaders?: (args: { header: string; index: number }) => string | null;
        mapValues?: (args: { header: string; index: number; value: string }) => any;
        strict?: boolean;
        skipLines?: number;
        maxRowBytes?: number;
        escape?: string;
        quote?: string;
        raw?: boolean;
    }

    function csvParser(options?: CsvParserOptions): Transform;

    export = csvParser;
}