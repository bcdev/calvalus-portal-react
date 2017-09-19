import {CommunicationState, ControlState, DataState, SessionState} from './state';

export const initialControlState: ControlState = {};

export const initialDataState: DataState = {};

export const initialSessionState: SessionState = {};

export const initialCommunicationState: CommunicationState = {
    httpCalls: []
};