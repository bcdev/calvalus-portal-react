import * as React from 'react';
import {InputDataset, State} from '../state';
import {connect, Dispatch} from 'react-redux';
import {OpenLayersMap} from './openlayers/OpenLayersMap';

interface MapPanelProps {
    dispatch: Dispatch<State>;
    inputDatasets: InputDataset[];
    selectedDatasetIndex: number[];
}

function mapStateToProps(state: State) {
    return {
        inputDatasets: state.data.inputDatasets,
        selectedDatasetIndex: [state.control.selectedInputDataset]
    };
}

class MapPanel extends React.Component<MapPanelProps, any> {
    render() {
        return (
            <div className="map-container">
                <div className="map-panel-title">
                    Spatial Filter
                </div>
                <div className="map-panel-content">
                    <OpenLayersMap
                        id={'OpenLayersMap'}
                        debug={false}
                        projectionCode="EPSG:4326"
                        offlineMode={false}
                        className="ol-map"
                    />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(MapPanel);