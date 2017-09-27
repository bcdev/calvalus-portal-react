import {Dispatch} from 'react-redux';
import {HttpCall, HttpCallMethod, HttpCallStatus, InputDataset, State} from './state';

export const ADD_NEW_HTTP_CALL = 'ADD_NEW_HTTP_CALL';
export const UPDATE_HTTP_CALL_RESPONSE = 'UPDATE_HTTP_CALL_RESPONSE';
export const UPDATE_HTTP_CALL_STATUS = 'UPDATE_HTTP_CALL_STATUS';
export const UPDATE_INPUT_DATASETS = 'UPDATE_INPUT_DATASETS';

export const UPDATE_INPUT_DATASET_SELECTION = 'UPDATE_INPUT_DATASET_SELECTION';

function addNewHttpCall(httpCall: HttpCall) {
    return {type: ADD_NEW_HTTP_CALL, payload: httpCall};
}

function updateHttpCallResponse(callId: number, response: string) {
    return {
        type: UPDATE_HTTP_CALL_RESPONSE, payload: {
            callId: callId,
            response: response
        }
    };
}

function updateHttpCallStatus(callId: number, newStatus: HttpCallStatus) {
    return {
        type: UPDATE_HTTP_CALL_STATUS, payload: {
            callId: callId,
            status: newStatus
        }
    };
}

function updateInputDatasets(inputDatasets: InputDataset[]) {
    return {type: UPDATE_INPUT_DATASETS, payload: inputDatasets};
}

export function updateInputDatasetSelection(datasetIndex: number | null) {
    return {type: UPDATE_INPUT_DATASET_SELECTION, payload: datasetIndex};
}

export function sendInputDatasetRequest() {
    return (dispatch: Dispatch<State>, getState: Function) => {
        const id: number = resolveNewId(getState().communication.httpCalls);
        let httpCall: HttpCall = {
            id: id,
            method: HttpCallMethod.GET,
            url: 'http://urbantep-test:9080/calvalus-rest/input-dataset'
        };
        const successfulAction = (response: Response) => {
            if (response.body) {
                const clonedResponse = response.clone();
                response.json()
                    .then((data) => {
                        dispatch(updateInputDatasets(data));
                    });
                clonedResponse.text()
                    .then((data) => {
                        dispatch(updateHttpCallResponse(id, data));
                    });
                if (response.status === 200) {
                    dispatch(updateHttpCallStatus(id, HttpCallStatus.SUCCESSFUL));
                } else {
                    dispatch(updateHttpCallStatus(id, HttpCallStatus.FAILED));
                }
            }
        };
        const failedAction = () => {
            dispatch(updateHttpCallStatus(id, HttpCallStatus.ERROR));
        };
        sendHttpRequest(httpCall, successfulAction, failedAction);
        httpCall = Object.assign({}, httpCall, {status: HttpCallStatus.SENT});
        dispatch(addNewHttpCall(httpCall));
    };
}

export function sendWpsRequest(authorization: string, callType: string, requestBody?: string) {
    return (dispatch: Dispatch<State>, getState: Function) => {
        const id: number = resolveNewId(getState().communication.httpCalls);
        let method: HttpCallMethod;
        let url: string = '';
        let headers = {
            'Authorization': authorization
        };
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
                headers = Object.assign({}, headers, {
                    'Content-Type': 'application/xml'
                });
                break;
            default:
                method = HttpCallMethod.GET;
                url = 'http://www.brockmann-consult.de/bc-wps/wps/calvalus?Service=WPS&Request=GetCapabilities';
        }
        let httpCall: HttpCall = {
            id: id,
            method: method,
            url: url,
            headers: headers
        };

        const successfulAction = (response: Response) => {
            if (response.body) {
                response.text()
                    .then((data) => {
                        dispatch(updateHttpCallResponse(id, data));
                    });
                if (response.status === 200) {
                    dispatch(updateHttpCallStatus(id, HttpCallStatus.SUCCESSFUL));
                } else {
                    dispatch(updateHttpCallStatus(id, HttpCallStatus.FAILED));
                }
            }
        };

        const failedAction = () => {
            dispatch(updateHttpCallStatus(id, HttpCallStatus.ERROR));
        };

        if (httpCall.method === HttpCallMethod.POST && requestBody) {
            httpCall = Object.assign({}, httpCall, {
                requestBody: requestBody
            });
        }
        sendHttpRequest(httpCall, successfulAction, failedAction);
        dispatch(addNewHttpCall(httpCall));
    };
}

function doHttpCall(httpCall: HttpCall): Promise<Response> {
    let configuration = {
        method: httpCall.method === HttpCallMethod.GET ? 'get' : 'post'
    };
    if (httpCall.headers) {
        configuration = Object.assign({}, configuration, {
            headers: {...httpCall.headers}
        });
    }
    if (httpCall.method === HttpCallMethod.POST && httpCall.requestBody) {
        configuration = Object.assign({}, configuration, {
            body: httpCall.requestBody
        });
    }
    return fetch(httpCall.url, {...configuration});
}

function onSuccessful(processResponse: (response: Response) => void) {
    return (response: Response) => {
        processResponse(response);
    };
}

function onFailed(failedAction?: (errorResponse: Response) => void) {
    return (response: Response) => {
        if (failedAction) {
            failedAction(response);
        } else {
            throw(response);
        }
    };
}

function sendHttpRequest(httpCall: HttpCall,
                         nextAction: (response: Response) => void,
                         errorAction?: (response: Response) => void) {
    doHttpCall(httpCall)
        .then(onSuccessful(nextAction))
        .catch(onFailed(errorAction));
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