import '@/styles/worklog/worklogs.scss';

import React from 'react';
import ReactDOM from 'react-dom/client';
import {Logs} from '@/js/worklog/worklogs/Logs';
import {FormProvider, useForm} from 'react-hook-form';

/* global worklogProfile */

function App() {
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <Logs worklogProfile={worklogProfile} />
    </FormProvider>
  );
}

let modal = ReactDOM.createRoot(document.getElementById('modal'));
modal.render(<App />);
