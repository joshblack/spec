import React from 'react';
import { css } from 'glamor';
import { Switch, Route } from 'react-router-dom';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import PluginsRoute from '../Plugins';

const App = () => (
  <>
    <section {...section}>
      <Sidebar />
      <Switch>
        <Route exact path="/" component={() => <h1>About</h1>} />
        {PluginsRoute}
        <Route path="/configuration" component={() => <h1>Configuration</h1>} />
        <Route path="/tasks" component={() => <h1>Tasks</h1>} />
        <Route component={() => 'Not found'} />
      </Switch>
    </section>
    <Footer />
  </>
);

const section = css({
  display: 'flex',
  height: '100%',
});

export default App;
