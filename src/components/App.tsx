import * as React from 'react';
import './App.css';

class App extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="header">Calvalus Portal</div>
                <div className="main">MAIN</div>
                <div className="footer">
                    <div className="footer-copyright">
                        &#169;2017 Brockmann Consult GmbH
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
