import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';


import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
if(module.hot){
    module.hot.accept()
}
// if (module.hot) {
//     module.hot.accept();
//     ReactDOM.render(
//       <AppContainer>
//         <App />
//       </AppContainer>, document.getElementById("root")
//     );
//   }
//   else {
//     ReactDOM.render(<App />, document.getElementById("stub"));
//   }
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
