declare module "*.svg" {
  const content: string;
  export default content;
}
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";

// EventSourcePolyfill class 타입 정의를 위해 추가
// 원래 new 연산자로 생성 시 any 타입으로 간주
declare module "event-source-polyfill" {
  export interface EventSourcePolyfillInit {
    headers?: Record<string, string>;
    heartbeatTimeout?: number;
    lastEventIdQueryParameterName?: string;
    withCredentials?: boolean;
  }

  export class EventSourcePolyfill extends EventTarget {
    constructor(url: string, configuration?: EventSourcePolyfillInit);

    readonly url: string;
    readonly readyState: number;
    readonly withCredentials: boolean;

    onopen: ((this: EventSourcePolyfill, ev: Event) => void) | null;
    onmessage: ((this: EventSourcePolyfill, ev: MessageEvent) => void) | null;
    onerror: ((this: EventSourcePolyfill, ev: Event) => void) | null;

    close(): void;

    static readonly CONNECTING: number;
    static readonly OPEN: number;
    static readonly CLOSED: number;
  }
}
