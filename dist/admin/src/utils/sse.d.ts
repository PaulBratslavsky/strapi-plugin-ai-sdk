export type SSEEvent = {
    type: 'text-delta';
    delta: string;
} | {
    type: 'tool-input-available';
    toolCallId: string;
    toolName: string;
    input: unknown;
} | {
    type: 'tool-output-available';
    toolCallId: string;
    output: unknown;
};
export interface SSECallbacks {
    onTextDelta: (accumulated: string) => void;
    onToolInput?: (toolCallId: string, toolName: string, input: unknown) => void;
    onToolOutput?: (toolCallId: string, output: unknown) => void;
}
export declare function readSSEStream(reader: ReadableStreamDefaultReader<Uint8Array>, callbacksOrOnDelta: SSECallbacks | ((accumulated: string) => void)): Promise<string>;
