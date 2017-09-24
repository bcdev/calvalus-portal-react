export interface State {
    data: DataState;
    communication: CommunicationState;
    control: ControlState;
    session: SessionState;
    location: LocationState; // not used
}

export interface DataState {
    inputDatasets: InputDataset[];
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

export interface InputDataset {
    productType: string;
    name: string;
    path: string;
    minDate: string;
    maxDate: string;
    regionName: string;
    bandNames: string[];
    geoInventory: string;
}

export interface HttpCall {
    id: number;
    method: HttpCallMethod;
    url: string;
    headers?: HttpHeader;
    requestBody?: string;
    response?: string;
    status?: HttpCallStatus;
}

export interface HttpHeader {
    [key: string]: string;
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