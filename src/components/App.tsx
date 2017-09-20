import * as React from 'react';
import './App.css';

import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/snippets/json';
import 'brace/theme/solarized_dark';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';
import {Button} from '@blueprintjs/core';
import {connect, Dispatch} from 'react-redux';
import {HttpCall, HttpCallMethod, State} from '../state';
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
    private initialState = {
        isUserPasswordDialogOpen: false,
        username: '',
        password: ''
    };

    public state = {
        ...this.initialState
    };

    public render() {
        return (
            <div className="container">
                <div className="header">Calvalus Portal</div>
                <div className="main">
                    <div className="code-editor">
                        <AceEditor
                            mode="json"
                            theme="solarized_dark"
                            name="UNIQUE_ID_OF_DIV"
                            editorProps={{$blockScrolling: true}}
                            showGutter={false}
                            setOptions={{
                                enableBasicAutocompletion: true,
                                tabSize: 2
                            }}
                            defaultValue={'Please enter the XML request here'}
                            value={this.props.httpCalls.length ?
                                this.props.httpCalls[this.props.httpCalls.length - 1].response : 'no response'}
                            width="100%"
                            showPrintMargin={false}

                        />
                    </div>
                    <div className="submit-button-container">
                        <Button
                            iconName="pt-icon-play"
                            className="pt-intent-primary"
                            onClick={this.openUserPasswordDialog}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
                <div className="portal-footer">
                    <div className="portal-footer-copyright">
                        &#169;2017 Brockmann Consult GmbH
                    </div>
                </div>
                <UsernamePasswordDialog
                    isOpen={this.state.isUserPasswordDialogOpen}
                    username={this.state.username}
                    password={this.state.password}
                    closeDialog={this.closeUserPasswordDialog}
                    submitCredentials={this.encodeCredentials}
                    onUsernameChange={this.handleUsernameChange}
                    onPasswordChange={this.handlePasswordChange}
                />
            </div>
        );
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

    private encodeCredentials = () => {
        const encodedCredentials = 'Basic ' + btoa(this.state.username + ':' + this.state.password);
        this.props.dispatch(sendRequest(
            HttpCallMethod.GET,
            'http://www.brockmann-consult.de/bc-wps/wps/calvalus?Service=WPS&Request=GetCapabilities',
            encodedCredentials));
        this.setState({...this.initialState});
    }

    private openUserPasswordDialog = () => {
        this.setState({
            isUserPasswordDialogOpen: true
        });
    }

    private closeUserPasswordDialog = () => {
        this.setState({...this.initialState});
    }
}

export default connect(mapStateToProps)(App);
