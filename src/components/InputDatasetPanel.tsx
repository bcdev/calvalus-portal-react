import * as React from 'react';
import {ListBox} from './ListBox';
import {InputDataset, State} from '../state';
import {connect, Dispatch} from 'react-redux';

interface InputDatasetPanelProps {
    dispatch: Dispatch<State>;
    inputDatasets: InputDataset[];
}

function mapStateToProps(state: State) {
    return {
        inputDatasets: state.data.inputDatasets
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
                    <div className="input-dataset-list">
                        <ListBox
                            numItems={this.props.inputDatasets.length}
                            renderItem={this.renderInputDataset}
                        />
                    </div>
                </div>
            );
        } else {
            return (
                <div className="input-dataset-container">
                    <div className="input-dataset-title">
                        Input Dataset
                    </div>
                    <div className="input-dataset-list">
                        No available datasets
                    </div>
                </div>
            );
        }
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