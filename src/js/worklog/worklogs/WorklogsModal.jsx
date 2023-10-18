import 'js-datepicker/dist/datepicker.min.css';
import '@/styles/worklog/datepicker.scss';

import React, { useState } from 'react';
import { WorklogsModalIncome } from '@/js/worklog/worklogs/worklogsModalIncome';
import { WorklogsModalExpense } from '@/js/worklog/worklogs/worklogsModalExpense';

export function WorklogsModal({
  activeTab,
  setActiveTab,
  worklogProfile,
  callbackIncomeOrExpenseSaved,
  callbackIncomeOrExpenseDeleted,
}) {
  return (
    <div method="dialog" className="modal-box overflow-visible">
      <div className="flex items-center justify-between">
        <h3 id="modal-title" className="font-bold text-sm"></h3>
        <div className="tabs tabs-boxed font-bold">
          <a
            id="tabIncome"
            className={`tab tab-lifted text-xs ${activeTab === 'Income' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('Income')}
          >
            매출
          </a>
          <a
            id="tabExpense"
            className={`tab tab-lifted text-xs ${activeTab === 'Expense' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('Expense')}
          >
            지출
          </a>
        </div>
      </div>
      {activeTab === 'Income' ? (
        <WorklogsModalIncome
          worklogProfile={worklogProfile}
          callbackIncomeOrExpenseSaved={callbackIncomeOrExpenseSaved}
          callbackIncomeOrExpenseDeleted={callbackIncomeOrExpenseDeleted}
        />
      ) : (
        <WorklogsModalExpense
          worklogProfile={worklogProfile}
          callbackIncomeOrExpenseSaved={callbackIncomeOrExpenseSaved}
          callbackIncomeOrExpenseDeleted={callbackIncomeOrExpenseDeleted}
        />
      )}
    </div>
  );
}
