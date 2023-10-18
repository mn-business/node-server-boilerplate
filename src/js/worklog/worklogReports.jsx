import React from 'react';
import ReactDOM from 'react-dom/client';
import { FormProvider, useForm } from 'react-hook-form';
import { Reports } from '@/js/worklog/reports/Reports';

/* global worklogProfile */

function App() {
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <Reports worklogProfile={worklogProfile} />
    </FormProvider>
  );
}

let modal = ReactDOM.createRoot(document.getElementById('chartJs'));
modal.render(<App />);
