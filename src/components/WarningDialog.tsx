import * as React from 'react';
import {Button, Dialog} from '@blueprintjs/core';
import './Dialog.css';

interface WarningDialogOwnProps {
    isOpen: boolean;
    title?: string;
    message: string;
    closeDialog: () => void;
}

export default class WarningDialog extends React.Component<WarningDialogOwnProps, any> {
    render() {
        return (
            <Dialog
                iconName="warning-sign"
                isOpen={this.props.isOpen}
                onClose={this.props.closeDialog}
                title={<span style={{color: 'white'}}>{this.props.title ? this.props.title : 'Warning'}</span>}
            >
                <div className="pt-dialog-body">
                    {this.props.message}
                </div>
                <div className="pt-dialog-footer">
                    <div className="pt-dialog-footer-actions">
                        <Button
                            onClick={this.props.closeDialog}
                            text="Close"
                        />
                    </div>
                </div>
            </Dialog>
        );
    }
}