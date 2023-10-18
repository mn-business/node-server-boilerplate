import React from 'react';
import ReactDOM from 'react-dom/client';
import { FormProvider, useForm } from 'react-hook-form';
import { YetPayments } from '@/js/worklog/yetPayments/YetPayments';

/* global worklogProfile */

function App() {
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <YetPayments worklogProfile={worklogProfile} />
    </FormProvider>
  );
}

let modal = ReactDOM.createRoot(document.getElementById('root'));
modal.render(<App />);
