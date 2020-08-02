// entry file 

import dva from 'dva';
import RouterConfig from './router';
import createHistory from 'history/createBrowserHistory';

const app = dva({
    history: createHistory(),               
  });
app.router(RouterConfig);
app.start('#root');