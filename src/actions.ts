import {Dispatch} from 'react-redux';
import {HttpCall, HttpCallMethod, HttpCallState, InputDataset, State} from './state';
import {HttpCallFailure, HttpCallPromise, HttpStatusEnum} from './restapi/HttpCall';

export const UPDATE_HTTP_RESPONSE = 'UPDATE_HTTP_RESPONSE';
export const UPDATE_INPUT_DATASETS = 'UPDATE_INPUT_DATASETS';
export const SET_CALL_STATE = 'SET_CALL_STATE';

function receiveHttpResponse(httpCall: HttpCall) {
    return {
        type: UPDATE_HTTP_RESPONSE, payload: httpCall
    };
}

function updateInputDatasets(inputDatasets: InputDataset[]) {
    return {
        type: UPDATE_INPUT_DATASETS, payload: inputDatasets
    };
}

export function sendInputDatasetRequest() {
    return (dispatch: Dispatch<State>, getState: Function) => {
        const id: number = resolveNewId(getState().communication.httpCalls);
        let httpCall: HttpCall = {
            id: id,
            method: HttpCallMethod.GET,
            url: 'http://urbantep-test:9080/calvalus-rest/input-dataset'
        };
        sendGetRequest2(httpCall, dispatch);
    };
}

export function sendRequest(authorization: string, callType: string, requestBody?: string) {
    return (dispatch: Dispatch<State>, getState: Function) => {
        const id: number = resolveNewId(getState().communication.httpCalls);
        let method: HttpCallMethod;
        let url: string = '';
        switch (callType) {
            case 'getCapabilities':
                method = HttpCallMethod.GET;
                url = 'http://www.brockmann-consult.de/bc-wps/wps/calvalus?Service=WPS&Request=GetCapabilities';
                break;
            case 'describeProcess':
                method = HttpCallMethod.GET;
                url = 'http://www.brockmann-consult.de/bc-wps/wps/calvalus?Service=WPS&Request=DescribeProcess&' +
                    'Version=1.0.0&Identifier=urbantep-subsetting~1.0~Subset';
                break;
            case 'execute':
                method = HttpCallMethod.POST;
                url = 'http://www.brockmann-consult.de/bc-wps/wps/calvalus';
                break;
            default:
                method = HttpCallMethod.GET;
                url = 'http://www.brockmann-consult.de/bc-wps/wps/calvalus?Service=WPS&Request=GetCapabilities';
        }
        let httpCall: HttpCall = {
            id: id,
            method: method,
            url: url
        };

        if (httpCall.method === HttpCallMethod.GET) {
            sendGetRequest(httpCall, authorization, dispatch);
        } else if (httpCall.method === HttpCallMethod.POST && requestBody) {
            sendPostRequest(httpCall, authorization, requestBody, dispatch);
        }

    };
}

function sendGetRequest2(httpCall: HttpCall, dispatch: Dispatch<State>) {
    fetch(httpCall.url, {
        method: 'get'
    })
        .then((response: Response) => {
            if (response.body) {
                response.json()
                    .then((data) => {
                        dispatch(updateInputDatasets(data));
                    });
            }
        })
        .catch(errorResponse => {
            throw(errorResponse);
        });
}

function sendGetRequest(httpCall: HttpCall, authorization: string, dispatch: Dispatch<State>) {
    fetch(httpCall.url, {
        method: 'get',
        headers: {
            'Authorization': authorization
        }
    })
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
}

function sendPostRequest(httpCall: HttpCall, authorization: string, requestBody: string, dispatch: Dispatch<State>) {
    fetch(httpCall.url, {
        method: 'post',
        headers: {
            'Authorization': authorization,
            'Content-Type': 'application/xml'
        },
        body: requestBody
    })
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
}

export function setCallState(callState: HttpCallState) {
    return {type: SET_CALL_STATE, payload: {callState: callState}};
}

function httpCallSent(httpCallId: number, callType: string) {
    return setCallState({id: httpCallId, status: HttpStatusEnum.SENT, callType: callType});
}

function httpCallSuccessful(httpCallId: number) {
    return setCallState({id: httpCallId, status: HttpStatusEnum.SUCCESSFUL});
}

function httpCallFailed(httpCallId: number, failure: HttpCallFailure) {
    console.error(failure);
    return setCallState({id: httpCallId, status, failure});
}

export type HttpCallPromiseFactory<T> = () => HttpCallPromise<T>;
export type HttpCallPromiseAction<T> = (httpCallResponseData: T) => void;

/**
 * Call some (remote) API asynchronously.
 *
 * @param dispatch Redux' dispatch() function.
 * @param callType A human-readable callType for the job that is being created
 * @param call The API call which must produce a JobPromise
 * @param action The action to be performed when the call succeeds.
 * @param failureAction The action to be performed when the call fails.
 */
export function callAPI<T>(dispatch: Dispatch<State>,
                           callType: string,
                           call: HttpCallPromiseFactory<T>,
                           action?: HttpCallPromiseAction<T>,
                           failureAction?: HttpCallPromiseAction<HttpCallFailure>): void {

    const httpCallPromise = call();
    dispatch(httpCallSent(httpCallPromise.getHttpCallId(), callType));

    const onDone = (httpCallResponseData: T) => {
        dispatch(httpCallSuccessful(httpCallPromise.getHttpCallId()));
        if (action) {
            action(httpCallResponseData);
        }
    };
    const onFailure = (httpCallFailure: HttpCallFailure) => {
        dispatch(httpCallFailed(httpCallPromise.getHttpCallId(), httpCallFailure));
        if (failureAction) {
            failureAction(httpCallFailure);
        }
    };
    httpCallPromise.then(onDone, onFailure);
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