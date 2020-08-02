/*Added router  */

import React, { Fragment } from 'react';
import { ConnectedRouter } from 'react-router-redux';
import { Switch, Route } from 'react-router-dom';
import Campaigns from './pages/campaigns';

function RouterConfig({ history }) {
    return (
      <Fragment>
    
          <ConnectedRouter history={history}>
            <Switch>
              <Route path="/" exact component={Campaigns} />
            </Switch>
          </ConnectedRouter>
  
      </Fragment>
    );
  }
  
  export default RouterConfig;
  
