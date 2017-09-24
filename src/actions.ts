import {Dispatch} from 'react-redux';
import {HttpCall, HttpCallMethod, InputDataset, State} from './state';

export const UPDATE_HTTP_RESPONSE = 'UPDATE_HTTP_RESPONSE';
export const UPDATE_INPUT_DATASETS = 'UPDATE_INPUT_DATASETS';

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
        const action = (response: Response) => {
            if (response.body) {
                response.json()
                    .then((data) => {
                        dispatch(updateInputDatasets(data));
                    });
            }
        };
        sendHttpRequest(httpCall, action);
    };
}

export function sendRequest(authorization: string, callType: string, requestBody?: string) {
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

        const action = (response: Response) => {
            if (response.body) {
                response.text()
                    .then((data) => {
                        httpCall.response = data;
                        dispatch(receiveHttpResponse(httpCall));
                    });
            }
        };

        if (httpCall.method === HttpCallMethod.GET) {
            sendHttpRequest(httpCall, action);
        } else if (httpCall.method === HttpCallMethod.POST) {
            httpCall = Object.assign({}, httpCall, {
                requestBody: requestBody
            });
            sendHttpRequest(httpCall, action);
        }

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