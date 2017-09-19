export interface State {
    data: DataState;
    communication: CommunicationState;
    control: ControlState;
    session: SessionState;
    location: LocationState; // not used
}

export interface DataState {
}

export interface CommunicationState {
    httpCalls: HttpCall[];
}

export interface ControlState {
}

export interface SessionState {
}

export interface LocationState {
}

export interface HttpCall {
    id: number;
    method: HttpCallMethod;
    url: string;
    requestBody?: string;
    response?: string;
    status?: HttpCallStatus;
}

export enum HttpCallMethod {
    POST,
    GET
}

export enum HttpCallStatus {
    SENT,
    SUCCESSFUL,
    ERROR
}