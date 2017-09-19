import {Dispatch} from 'react-redux';
import {HttpCall, HttpCallMethod, State} from './state';

export const UPDATE_HTTP_RESPONSE = 'UPDATE_HTTP_RESPONSE';

function receiveHttpResponse(httpCall: HttpCall) {
    return {
        type: UPDATE_HTTP_RESPONSE, payload: httpCall
    };
}

export function sendRequest(method: HttpCallMethod, url: string) {
    return (dispatch: Dispatch<State>, getState: Function) => {
        const id: number = resolveNewId(getState().communication.httpCalls);
        let httpCall: HttpCall = {
            id: id,
            method: method,
            url: url
        };
        fetch(url)
            .then((response: Response) => {
                if (response.body) {
                    response.text()
                        .then((data) => {
                            httpCall.response = data;
                            dispatch(receiveHttpResponse(httpCall));
                        });
                }
            })
            .catch(errorResponse => {
                throw(errorResponse);
            });
    };
}

function resolveNewId(calls: HttpCall[]): number {
    let lastCallId = 0;
    for (let call of calls) {
        if (call.id > lastCallId) {
            lastCallId = call.id;
        }
    }
    return ++lastCallId;
}