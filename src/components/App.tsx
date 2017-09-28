import * as React from 'react';
import './App.css';

import AceEditor from 'react-ace';
import 'brace/mode/xml';
import 'brace/snippets/xml';
import 'brace/theme/solarized_dark';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';
import {Button} from '@blueprintjs/core';
import {connect, Dispatch} from 'react-redux';
import {HttpCall, InputDataset, State} from '../state';
import {sendInputDatasetRequest, sendWpsRequest} from '../actions';
import UsernamePasswordDialog from './UsernamePasswordDialog';
import InputDatasetPanel from './InputDatasetPanel';
import WarningDialog from './WarningDialog';
import {getExecuteRequest} from '../template/wpsRequest';

interface AppProps {
    dispatch: Dispatch<State>;
    httpCalls: HttpCall[];
    inputDatasets: InputDataset[];
    selectedDatasetIndex: number[];
}

function mapStateToProps(state: State) {
    return ({
        httpCalls: state.communication.httpCalls,
        inputDatasets: state.data.inputDatasets,
        selectedDatasetIndex: [state.control.selectedInputDataset]
    });
}

class App extends React.Component<AppProps, any> {
    initialDialogState = {
        isUserPasswordDialogOpen: false,
        isDatasetNotSelectedDialogOpen: false,
        username: '',
        password: ''
    };

    public state = {
        ...this.initialDialogState,
        requestString: '',
        callType: ''
    };

    public render() {
        return (
            <div className="container">
                <div className="header">Calvalus Portal</div>
                <div className="main">
                    <InputDatasetPanel/>
                    <div className="submit-button-container">
                        <Button
                            iconName="pt-icon-play"
                            className="pt-intent-primary margin-right-10"
                            onClick={this.retrieveInputDatasets}
                        >
                            Input Dataset
                        </Button>
                        <Button
                            iconName="pt-icon-play"
                            className="pt-intent-primary margin-right-10"
                            onClick={this.openUserPasswordDialog.bind(this, 'getCapabilities')}
                        >
                            GetCapabilities
                        </Button>
                        <Button
                            iconName="pt-icon-play"
                            className="pt-intent-primary margin-right-10"
                            onClick={this.openUserPasswordDialog.bind(this, 'describeProcess')}
                        >
                            DescribeProcess
                        </Button>
                        <Button
                            iconName="pt-icon-play"
                            className="pt-intent-primary"
                            onClick={this.handleExecuteCall}
                        >
                            Execute
                        </Button>
                    </div>
                    <div className="response-container">
                        <AceEditor
                            mode="xml"
                            theme="monokai"
                            name="Response window"
                            editorProps={{$blockScrolling: true}}
                            showGutter={false}
                            setOptions={{
                                enableBasicAutocompletion: true,
                                tabSize: 2
                            }}
                            defaultValue={'Response XML will be displayed here'}
                            value={this.props.httpCalls.length ?
                                this.props.httpCalls[this.props.httpCalls.length - 1].response : 'no response'}
                            width="1000px"
                            showPrintMargin={false}
                            readOnly={true}

                        />
                    </div>
                    <div className="portal-footer">
                        <div className="portal-footer-copyright">
                            &#169;2017 Brockmann Consult GmbH
                        </div>
                    </div>
                </div>

                <UsernamePasswordDialog
                    isOpen={this.state.isUserPasswordDialogOpen}
                    username={this.state.username}
                    password={this.state.password}
                    closeDialog={this.closeUserPasswordDialog}
                    submitCredentials={this.submitRequest}
                    onUsernameChange={this.handleUsernameChange}
                    onPasswordChange={this.handlePasswordChange}
                />
                <WarningDialog
                    isOpen={this.state.isDatasetNotSelectedDialogOpen}
                    title="Missing input dataset"
                    message="Please select an input dataset."
                    closeDialog={this.closeDatasetNotSelectedDialog}
                />
            </div>
        );
    }

    private retrieveInputDatasets = () => {
        this.props.dispatch(sendInputDatasetRequest());
    }

    private handleUsernameChange = (newUsername: string) => {
        this.setState({
            username: newUsername
        });
    }

    private handlePasswordChange = (newPassword: string) => {
        this.setState({
            password: newPassword
        });
    }

    private submitRequest = () => {
        const encodedCredentials = 'Basic ' + btoa(this.state.username + ':' + this.state.password);
        this.props.dispatch(sendWpsRequest(
            encodedCredentials,
            this.state.callType,
            getExecuteRequest(this.props.inputDatasets[this.props.selectedDatasetIndex[0]].name)));
        this.setState({...this.initialDialogState});
    }

    private handleExecuteCall = () => {
        if (!this.props.selectedDatasetIndex.length ||
            (!this.props.selectedDatasetIndex[0] && this.props.selectedDatasetIndex[0] !== 0)) {
            this.openDatasetNotSelectedDialog();
        } else {
            this.openUserPasswordDialog('execute');
        }
    }

    private openDatasetNotSelectedDialog = () => {
        this.setState({
            isDatasetNotSelectedDialogOpen: true
        });
    }

    private closeDatasetNotSelectedDialog = () => {
        this.setState({
            isDatasetNotSelectedDialogOpen: false
        });
    }

    private openUserPasswordDialog = (callType: string) => {
        this.setState({
            isUserPasswordDialogOpen: true,
            callType: callType
        });
    }

    private closeUserPasswordDialog = () => {
        this.setState({...this.initialDialogState});
    }
}

export default connect(mapStateToProps)(App);
