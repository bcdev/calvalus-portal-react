import * as React from 'react';
import './App.css';

import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/snippets/json';
import 'brace/theme/solarized_dark';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';
import {Button} from '@blueprintjs/core';

class App extends React.Component {
    render() {
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

                        />
                    </div>
                    <div className="submit-button-container">
                        <Button iconName="pt-icon-play" className="pt-intent-primary">
                            Submit
                        </Button>
                    </div>
                </div>
                <div className="portal-footer">
                    <div className="portal-footer-copyright">
                        &#169;2017 Brockmann Consult GmbH
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
