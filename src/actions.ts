import {Dispatch} from 'react-redux';
import {HttpCall, HttpCallMethod, State} from './state';

export const UPDATE_HTTP_RESPONSE = 'UPDATE_HTTP_RESPONSE';

function receiveHttpResponse(httpCall: HttpCall) {
    return {
        type: UPDATE_HTTP_RESPONSE, payload: httpCall
    };
}

export function sendRequest(authorization: string, callType: string) {
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
                    'Version=1.0.0&Identifier=all';
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
        fetch(url, {
            method: httpCall.method === HttpCallMethod.GET ? 'get' : 'post',
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