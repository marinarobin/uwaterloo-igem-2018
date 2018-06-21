import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Layout from './components/Layout';
import About from './pages/About';


class App extends Component {
  render() {
    return (
        <Router>
          <Layout {...this.props}>
            <Switch>
              <Route path="/" component={About} />
            </Switch>
          </Layout>
        </Router>
    );
  }
}

export default App;
