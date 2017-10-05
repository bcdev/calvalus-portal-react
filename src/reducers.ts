import {CommunicationState, ControlState, DataState, SessionState, State} from './state';
import {combineReducers} from 'redux';
import {initialCommunicationState, initialControlState, initialDataState, initialSessionState} from './initialStates';
import * as actions from './actions';

interface Action {
    type: string;
    payload: any;
}

const dataReducer = (state: DataState = initialDataState, action: Action) => {
    switch (action.type) {
        case actions.UPDATE_INPUT_DATASETS: {
            return Object.assign({}, state, {
                inputDatasets: action.payload
            });
        }
        default:
            return state;
    }
};

const controlReducer = (state: ControlState = initialControlState, action: Action) => {
    switch (action.type) {
        case actions.UPDATE_INPUT_DATASET_SELECTION: {
            return Object.assign({}, state, {
                selectedInputDataset: action.payload
            });
        }
        case actions.UPDATE_REGION_WKT_SELECTION: {
            return Object.assign({}, state, {
                selectedRegionWkt: action.payload
            });
        }
        default:
            return state;
    }
};

const sessionReducer = (state: SessionState = initialSessionState, action: Action) => {
    switch (action.type) {
        default:
            return state;
    }
};

const communicationReducer = (state: CommunicationState = initialCommunicationState, action: Action) => {
    switch (action.type) {
        case actions.ADD_NEW_HTTP_CALL: {
            return Object.assign({}, state, {
                httpCalls: [
                    ...state.httpCalls,
                    action.payload
                ]
            });
        }
        case actions.UPDATE_HTTP_CALL_RESPONSE: {
            const callIndex = state.httpCalls.findIndex((x) => x.id === action.payload.callId);
            const selectedHttpCall = state.httpCalls[callIndex];
            const updatedHttpCall = Object.assign({}, selectedHttpCall, {
                response: action.payload.response
            });
            return Object.assign({}, state, {
                httpCalls: [
                    ...state.httpCalls.slice(0, callIndex),
                    updatedHttpCall,
                    ...state.httpCalls.slice(callIndex + 1)
                ]
            });
        }
        case actions.UPDATE_HTTP_CALL_STATUS: {
            const callIndex = state.httpCalls.findIndex((x) => x.id === action.payload.callId);
            const selectedHttpCall = state.httpCalls[callIndex];
            const updatedHttpCall = Object.assign({}, selectedHttpCall, {
                status: action.payload.status
            });
            return Object.assign({}, state, {
                httpCalls: [
                    ...state.httpCalls.slice(0, callIndex),
                    updatedHttpCall,
                    ...state.httpCalls.slice(callIndex + 1)
                ]
            });
        }
        default: {
            return state;
        }
    }
};

//noinspection JSUnusedLocalSymbols
const locationReducer = (state: Object = {}, action: Action) => {
    return state;
};

export const reducers = combineReducers<State>({
    data: dataReducer,
    control: controlReducer,
    session: sessionReducer,
    communication: communicationReducer,
    location: locationReducer,
});
