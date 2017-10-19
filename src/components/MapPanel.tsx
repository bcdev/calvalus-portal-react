import * as React from 'react';
import {State} from '../state';
import {connect, Dispatch} from 'react-redux';
import {OpenLayersMap} from './openlayers/OpenLayersMap';
import {updateRegionWktSelection} from '../actions';

interface MapPanelProps {
    dispatch: Dispatch<State>;
    selectedRegionWkt: string;
    regionSelectorType: 'box' | 'polygon';
}

function mapStateToProps(state: State) {
    return {
        selectedRegionWkt: state.control.selectedRegionWkt,
        regionSelectorType: state.control.regionSelectorType
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
                        onSelectRegion={this.handleSelectRegion}
                        regionSelectorType={this.props.regionSelectorType}
                    />
                    <div className="spatial-filter-info">
                        Selected region: {this.props.selectedRegionWkt}
                    </div>
                </div>
            </div>
        );
    }

    private handleSelectRegion = (regionWkt: string) => {
        this.props.dispatch(updateRegionWktSelection(regionWkt));
    }
}

export default connect(mapStateToProps)(MapPanel);