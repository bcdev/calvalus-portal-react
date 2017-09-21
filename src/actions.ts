import {Dispatch} from 'react-redux';
import {HttpCall, HttpCallMethod, State} from './state';

export const UPDATE_HTTP_RESPONSE = 'UPDATE_HTTP_RESPONSE';

function receiveHttpResponse(httpCall: HttpCall) {
    return {
        type: UPDATE_HTTP_RESPONSE, payload: httpCall
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

function resolveNewId(calls: HttpCall[]): number {
    let lastCallId = 0;
    for (let call of calls) {
        if (call.id > lastCallId) {
            lastCallId = call.id;
        }
    }
    return ++lastCallId;
}