/**
 * HTTP-related interfaces and type definitions.
 *
 * @author Norman Fomferra, Hans Permana
 */

/**
 * A HttpCall represents the execution of a remote HTTP API call.
 */
export interface HttpCall {
    getId(): number;

    getUrl(): string;

    getMethod(): HttpCallMethodEnum;

    getRequest(): HttpRequest;

    getResponse(): HttpResponse;

    getStatus(): HttpStatus;
}

/**
 * A promise representing a remote method call.
 */
export interface HttpCallPromise<HttpCallResponse> extends Promise<HttpCallResponse> {
    getHttpCall(): HttpCall;

    getHttpCallId(): number;
}

/**
 * All the possible HTTP call statuses.
 */
export type HttpStatus = 'SENT' | 'SUCCESSFUL' | 'FAILED';

export class HttpStatusEnum {
    static readonly SENT = 'SENT';
    static readonly SUCCESSFUL = 'SUCCESSFUL';
    static readonly FAILED = 'FAILED';
}

export interface HttpRequest {
    readonly headers: HttpHeader;
    readonly body: string;
}

export interface HttpResponse {
    readonly headers: HttpHeader;
    readonly body: string;
}

export interface HttpHeader {
    [key: string]: string;
}

export class HttpCallMethodEnum {
    static readonly POST = 'post';
    static readonly GET = 'get';
}

/**
 * Represents a job failure using the JSON-RCP 2.0 style.
 */
export interface HttpCallFailure {

    /** A Number that indicates the error type that occurred. */
    readonly httpErrorCode: number;

    /** A string providing a short description of the error. */
    readonly message: string;

    /**
     * A Primitive or Structured value that contains additional information about the error.
     * This may be omitted.
     * The value of this member is defined by the Server (e.g. detailed error information, nested errors etc.).
     */
    readonly data?: any;
}

/**
 * A callback listening for HTTP call responses.
 */
export type HttpCallResponseHandler<HttpCallResponse> = (response: HttpCallResponse) => void;

/**
 * A callback listening for failed HTTP calls.
 */
export type HttpCallFailureHandler = (failure: HttpCallFailure) => void;
