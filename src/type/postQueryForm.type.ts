export interface PostQueryForm {
    id: string;
    text: string;
    timestamp: string[] | null;
    source: string;
    symbols: string;
    company_name: string;
    table: string | null;
}
