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
        default:
            return state;
    }
};

const controlReducer = (state: ControlState = initialControlState, action: Action) => {
    switch (action.type) {
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
        case actions.UPDATE_HTTP_RESPONSE: {
            const callIndex = state.httpCalls.findIndex((x) => x.id === action.payload.id);
            if (callIndex < 0) {
                return Object.assign({}, state, {
                    httpCalls: [
                        ...state.httpCalls,
                        action.payload
                    ]
                });
            }
            return Object.assign({}, state, {
                httpCalls: [
                    ...state.httpCalls.slice(0, callIndex),
                    action.payload,
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
