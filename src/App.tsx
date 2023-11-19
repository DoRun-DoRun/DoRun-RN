import React from 'react';
import ExampleUsage from './Modal/ExampleUsage';
import {ModalProvider} from './Modal/ModalProvider';

const App = () => {
  return (
    <ModalProvider>
      <ExampleUsage />
    </ModalProvider>
  );
};

export default App;
