import React from 'react';
import ReactDOM from 'react-dom/client';
import { FormProvider, useForm } from 'react-hook-form';
import { Master } from '@/js/worklog/master/Master';

/* global worklogProfile */

function App() {
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <Master worklogProfile={worklogProfile} />
    </FormProvider>
  );
}

let modal = ReactDOM.createRoot(document.getElementById('root'));
modal.render(<App />);
