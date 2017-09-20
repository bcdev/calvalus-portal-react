import * as React from 'react';
import {Button, Dialog, Intent} from '@blueprintjs/core';
import './Dialog.css';

interface UsernamePasswordDialogOwnProps {
    isOpen: boolean;
    username: string;
    password: string;
    closeDialog: () => void;
    submitCredentials: () => void;
    onUsernameChange: (newUsername: string) => void;
    onPasswordChange: (newPassword: string) => void;
}

export default class UsernamePasswordDialog extends React.Component<UsernamePasswordDialogOwnProps, any> {
    render() {
        return (
            <Dialog
                iconName="inbox"
                isOpen={this.props.isOpen}
                onClose={this.props.closeDialog}
                title={<span style={{color: 'white'}}>Enter user name and password</span>}
            >
                <div className="pt-dialog-body">
                    <div>
                        <label className="pt-label pt-inline">
                            <span>Username</span>
                            <input
                                className={'pt-input pt-inline'}
                                type="text"
                                placeholder="Enter username"
                                dir="auto"
                                value={this.props.username}
                                onChange={this.handleUsernameChange}
                            />
                        </label>
                    </div>
                    <div>
                        <label className="pt-label pt-inline">
                            <span>Password</span>
                            <input
                                className={'pt-input pt-inline'}
                                type="password"
                                placeholder="Enter password"
                                dir="auto"
                                value={this.props.password}
                                onChange={this.handlePasswordChange}
                            />
                        </label>
                    </div>
                </div>
                <div className="pt-dialog-footer">
                    <div className="pt-dialog-footer-actions">
                        <Button
                            onClick={this.props.closeDialog}
                            text="Cancel"
                        />
                        <Button
                            intent={Intent.PRIMARY}
                            onClick={this.props.submitCredentials}
                            text="Submit"
                        />
                    </div>
                </div>
            </Dialog>
        );
    }

    private handleUsernameChange = (event: any) => {
        const value = event.currentTarget.value;
        this.props.onUsernameChange(value);
    }

    private handlePasswordChange = (event: any) => {
        const value = event.currentTarget.value;
        this.props.onPasswordChange(value);
    }
}