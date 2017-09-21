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
import {HttpCall, State} from '../state';
import {sendRequest} from '../actions';
import UsernamePasswordDialog from './UsernamePasswordDialog';

interface AppProps {
    dispatch: Dispatch<State>;
    httpCalls: HttpCall[];
}

function mapStateToProps(state: State) {
    return ({
        httpCalls: state.communication.httpCalls
    });
}

class App extends React.Component<AppProps, any> {
    initialDialogState = {
        isUserPasswordDialogOpen: false,
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
                    <div className="code-editor">
                        <AceEditor
                            mode="xml"
                            theme="solarized_dark"
                            name="Request window"
                            editorProps={{$blockScrolling: true}}
                            showGutter={false}
                            setOptions={{
                                enableBasicAutocompletion: true,
                                tabSize: 2
                            }}
                            defaultValue={'Please enter the XML request here'}
                            value={this.state.requestString}
                            width="1000px"
                            showPrintMargin={false}
                            onChange={this.handleRequestChange}

                        />
                    </div>
                    <div className="submit-button-container">
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
                            onClick={this.openUserPasswordDialog.bind(this, 'execute')}
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
            </div>
        );
    }

    private handleRequestChange = (newRequest: string) => {
        this.setState({
            requestString: newRequest
        });
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
        this.props.dispatch(sendRequest(
            encodedCredentials, this.state.callType, this.state.requestString));
        this.setState({...this.initialDialogState});
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
