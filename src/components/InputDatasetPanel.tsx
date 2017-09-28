import * as React from 'react';
import {ListBox, ListBoxSelectionMode} from './ListBox';
import {InputDataset, State} from '../state';
import {connect, Dispatch} from 'react-redux';
import {updateInputDatasetSelection} from '../actions';

interface InputDatasetPanelProps {
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

class InputDatasetPanel extends React.Component<InputDatasetPanelProps, any> {
    render() {
        if (this.props.inputDatasets.length > 0) {
            return (
                <div className="input-dataset-container">
                    <div className="input-dataset-title">
                        Input Dataset
                    </div>
                    <div className="input-dataset-list-container">
                        <div className="input-dataset-list">
                            <ListBox
                                numItems={this.props.inputDatasets.length}
                                renderItem={this.renderInputDataset}
                                onSelection={this.handleSelectInputDataset}
                                selection={this.props.selectedDatasetIndex}
                                selectionMode={ListBoxSelectionMode.SINGLE}
                                style={{border: '2px solid #373B50'}}
                                itemStyle={{
                                    cursor: 'pointer',
                                    color: '#373B50',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    borderBottom: '0.01em solid #373B50'
                                }}
                                itemSelectedStyle={{backgroundColor: '#373B50', color: '#7AC6CF'}}
                            />
                        </div>
                        <div className="input-dataset-info">
                            {this.renderInputDatasetInfo()}
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="input-dataset-container">
                    <div className="input-dataset-title">
                        Input Dataset
                    </div>
                    <div className="input-dataset-list-container">
                        No available datasets
                    </div>
                </div>
            );
        }
    }

    private renderInputDatasetInfo() {
        let selectedDataset: InputDataset = this.props.inputDatasets[this.props.selectedDatasetIndex[0]];
        let items: Array<JSX.Element> = [];
        const datasetLineClassName = 'input-dataset-info-line';
        const datasetInfoTitleClassName = 'input-dataset-info-title';
        const datasetInfoContentClassName = 'input-dataset-info-content';
        if (selectedDataset) {
            items.push(
                <span
                    key="type"
                    className={datasetLineClassName}
                >
                    <span className={datasetInfoTitleClassName}>Type</span> : 
                    <span className={datasetInfoContentClassName}>{selectedDataset.productType}</span>
                </span>);
            items.push(
                <span
                    key="minDate"
                    className={datasetLineClassName}
                >
                    <span className={datasetInfoTitleClassName}>Start Date</span> : 
                    <span className={datasetInfoContentClassName}>{selectedDataset.minDate}</span>
                </span>);
            items.push(
                <span
                    key="maxDate"
                    className={datasetLineClassName}
                >
                    <span className={datasetInfoTitleClassName}>End Date</span> : 
                    <span className={datasetInfoContentClassName}>{selectedDataset.maxDate}</span>
                </span>);
            items.push(
                <span
                    key="regionName"
                    className={datasetLineClassName}
                >
                    <span className={datasetInfoTitleClassName}>Region name</span> : 
                    <span className={datasetInfoContentClassName}>{selectedDataset.regionName}</span>
                </span>);
            items.push(
                <span
                    key="geoInventory"
                    className={datasetLineClassName}
                >
                    <span className={datasetInfoTitleClassName}>Geo Inventory</span> :
                    <span className={datasetInfoContentClassName}>{selectedDataset.geoInventory ? ' Yes' : ' No'}</span>
                </span>);
        } else {
            items.push(
                <span key="noDataset" className="input-dataset-info-empty">
                Please select an input dataset
            </span>);
        }
        return items;
    }

    private handleSelectInputDataset = (oldSelection: Array<React.Key> | undefined, newSelection: Array<React.Key>) => {
        if (oldSelection && oldSelection[0] === newSelection[0]) {
            this.props.dispatch(updateInputDatasetSelection(null));
        }
        this.props.dispatch(updateInputDatasetSelection(newSelection[0] as number));
    }

    private renderInputDataset = (itemIndex: number) => {
        return (
            <div>
                {this.props.inputDatasets[itemIndex].name}
            </div>
        );
    }
}

export default connect(mapStateToProps)(InputDatasetPanel);