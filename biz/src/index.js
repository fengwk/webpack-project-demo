import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import Header from './Header.js';
import Content from './Content.js';
import { Button } from 'antd-mobile';
import TestSvg from './test.svg';
import styles from './index.css';

class App extends Component {
    render() {
        return (
            <div>
                <div className={styles.bg}>hello world</div>
                <BrowserRouter>
                    <Route path="/" exact component={Header} />
                    <Route path="/content" component={Content} />
                </BrowserRouter>
                <div>
                    <Button type="primary">Primary</Button>
                    <Button>Default</Button>
                    <Button type="dashed">Dashed</Button>
                    <Button type="danger">Danger</Button>
                    <Button type="link">Link</Button>
                    <TestSvg />
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));

if (module.hot) {
    module.hot.accept()
}