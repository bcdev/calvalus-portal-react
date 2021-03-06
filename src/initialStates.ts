import {CommunicationState, ControlState, DataState, SessionState} from './state';

export const initialControlState: ControlState = {
    selectedInputDataset: null,
    selectedRegionWkt: '',
    regionSelectorType: 'box'
};

export const initialDataState: DataState = {
    inputDatasets: []
};

export const initialSessionState: SessionState = {};

export const initialCommunicationState: CommunicationState = {
    httpCalls: []
};