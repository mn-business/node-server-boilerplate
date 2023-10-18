import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { WORKLOG_COLOR, WORKLOG_TYPE } from '@/js/worklog/worklogEnum';
import { fetchGet, formatDate } from '@/js/common/common';
import { worklogsCalendar } from '@/js/worklog/worklogs/worklogsCalendar';
import { WorklogsModal } from '@/js/worklog/worklogs/WorklogsModal';

let calendar;
let sortIncomeIdx = 0;
let sortExpenseIdx = 999999999;
let totalIncomes = 0;
let totalExpenses = 0;
let totalLaborDays = 0;

/**
 * 이번달의 장비들의 Incomes & Expenses 정보 가져와서 Calendar Events 등록
 * @param calendar
 */
const factoryIncomesAndExpense = async (calendar, strDate) => {
  const params = new URLSearchParams();
  // let strDate = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
  params.append('date', strDate);
  totalIncomes = 0;
  totalExpenses = 0;
  totalLaborDays = 0;
  for (const equipment of worklogProfile.worklogEquipments) {
    await fetchGet(`/worklog/equipments/${equipment.id}/incomes`, params)
      .then((response) => response.json())
      .then((data) => {
        data.forEach((item) => {
          totalIncomes += item.income;
          totalLaborDays += item.laborDay;
          if (!calendar.getEventById(`${WORKLOG_TYPE.INCOME}_${item.id}`)) {
            let classNames = item.paymentDate
              ? 'text-xs text-right line-through'
              : 'text-xs text-right';
            calendar.addEvent({
              id: `${WORKLOG_TYPE.INCOME}_${item.id}`,
              title: item.income.toLocaleString(),
              customData: {
                income: item.income,
                laborDay: item.laborDay,
              },
              start: item.incomeDate,
              classNames: classNames,
              backgroundColor: WORKLOG_COLOR.BLUE_500,
              sortIdx: sortIncomeIdx++,
            });
          }
        });
        totalLaborDays = parseFloat(totalLaborDays.toFixed(1));
      })
      .catch((error) => {
        alert(`오류가 발생했습니다.\n${error}`);
      });

    await fetchGet(`/worklog/equipments/${equipment.id}/expenses`, params)
      .then((response) => response.json())
      .then((data) => {
        data.forEach((item) => {
          totalExpenses += item.expense;
          if (!calendar.getEventById(`${WORKLOG_TYPE.EXPENSE}_${item.id}`)) {
            let classNames = item.paymentDate
              ? 'text-xs text-right line-through'
              : 'text-xs text-right';
            calendar.addEvent({
              id: `${WORKLOG_TYPE.EXPENSE}_${item.id}`,
              title: item.expense.toLocaleString(),
              customData: {
                expense: item.expense,
              },
              start: item.expenseDate,
              classNames: classNames,
              backgroundColor: WORKLOG_COLOR.RED_500,
              sortIdx: sortExpenseIdx++,
            });
          }
        });
      })
      .catch((error) => {
        console.error(error);
        alert(`오류가 발생했습니다.\n${error}`);
      });
  }

  let headerLeft = document.querySelector('.fc-header-toolbar .fc-toolbar-chunk');
  headerLeft.innerHTML = '';

  let divIncomes = document.createElement('div');
  divIncomes.className = 'grid grid-cols-2';
  let divIncomesText = document.createElement('div');
  divIncomesText.textContent = `매출 : `;
  divIncomesText.className = `text-xs text-blue-700`;
  let divIncome = document.createElement('div');
  divIncome.id = `income`;
  divIncome.textContent = totalIncomes.toLocaleString();
  divIncome.className = 'text-xs  text-blue-700 text-right';

  let divExpensesText = document.createElement('div');
  divExpensesText.textContent = `지출 : `;
  divExpensesText.className = `text-xs text-red-700`;
  let divExpense = document.createElement('div');
  divExpense.id = `expense`;
  divExpense.textContent = totalExpenses.toLocaleString();
  divExpense.className = 'text-xs text-red-700 text-right';

  let divLaborDaysText = document.createElement('div');
  divLaborDaysText.textContent = `공수 : `;
  divLaborDaysText.className = `text-xs text-blue-700`;
  let divLaborDaysNum = document.createElement('div');
  divLaborDaysNum.id = `laborDays`;
  divLaborDaysNum.textContent = `${totalLaborDays}일`;
  divLaborDaysNum.className = 'text-xs text-blue-700 text-right';

  divIncomes.append(
    divIncomesText,
    divIncome,
    divExpensesText,
    divExpense,
    divLaborDaysText,
    divLaborDaysNum
  );
  headerLeft.append(divIncomes);
};

/**
 * 장비의 매출 Income 저장 후 Calendar Event 추가
 * @param data
 */
const callbackIncomeOrExpenseSaved = (worklogType, data) => {
  let prefixId, title, start, backgroundColor, sortIdx, classNames;
  if (worklogType === WORKLOG_TYPE.INCOME) {
    prefixId = WORKLOG_TYPE.INCOME;
    title = data.income;
    start = data.incomeDate;
    backgroundColor = WORKLOG_COLOR.BLUE_500;
    sortIdx = sortIncomeIdx++;
    classNames = data.paymentDate ? 'text-xs text-right line-through' : 'text-xs text-right';
    totalIncomes += data.income;
    totalLaborDays += data.laborDay;
    totalLaborDays = parseFloat(totalLaborDays.toFixed(1));
  } else if (worklogType === WORKLOG_TYPE.EXPENSE) {
    prefixId = WORKLOG_TYPE.EXPENSE;
    title = data.expense;
    start = data.expenseDate;
    backgroundColor = WORKLOG_COLOR.RED_500;
    sortIdx = sortExpenseIdx++;
    classNames = 'text-xs text-right';
    totalExpenses += data.expense;
  }

  let eventById = calendar.getEventById(`${prefixId}_${data.id}`);
  if (eventById) {
    if (worklogType === WORKLOG_TYPE.INCOME) {
      totalIncomes -= eventById.extendedProps.customData.income;
      totalLaborDays -= eventById.extendedProps.customData.laborDay;
      totalLaborDays = parseFloat(totalLaborDays.toFixed(1));
    } else if (worklogType === WORKLOG_TYPE.EXPENSE) {
      totalExpenses -= eventById.extendedProps.customData.expense;
    }
    calendar.getEventById(`${prefixId}_${data.id}`).remove();
  }

  if (worklogType === WORKLOG_TYPE.INCOME) {
    calendar.addEvent({
      id: `${prefixId}_${data.id}`,
      title: title.toLocaleString(),
      customData: {
        income: data.income,
        laborDay: data.laborDay,
      },
      start: start,
      classNames: classNames,
      backgroundColor: backgroundColor,
      sortIdx: sortIdx,
    });
  } else if (worklogType === WORKLOG_TYPE.EXPENSE) {
    calendar.addEvent({
      id: `${prefixId}_${data.id}`,
      title: title.toLocaleString(),
      customData: {
        expense: data.expense,
      },
      start: start,
      classNames: classNames,
      backgroundColor: backgroundColor,
      sortIdx: sortIdx,
    });
  }

  document.getElementById('income').textContent = totalIncomes.toLocaleString();
  document.getElementById('expense').textContent = totalExpenses.toLocaleString();
  document.getElementById('laborDays').textContent = `${totalLaborDays}일`;
};

/**
 * 장비의 매출 Income 삭제 후 Calendar Event 삭제
 * @param data
 */
const callbackIncomeOrExpenseDeleted = (worklogType, data) => {
  let prefixId;
  if (worklogType === WORKLOG_TYPE.INCOME) {
    prefixId = WORKLOG_TYPE.INCOME;
    totalIncomes -= data.income;
    totalLaborDays -= data.laborDay;
    totalLaborDays = parseFloat(totalLaborDays.toFixed(1));
  } else {
    prefixId = WORKLOG_TYPE.EXPENSE;
    totalExpenses -= data.expense;
  }
  calendar.getEventById(`${prefixId}_${data.id}`)?.remove();
  document.getElementById('income').textContent = totalIncomes.toLocaleString();
  document.getElementById('expense').textContent = totalExpenses.toLocaleString();
  document.getElementById('laborDays').textContent = `${totalLaborDays}일`;
};

export function Logs({ worklogProfile }) {
  const { setValue, getValues } = useFormContext();
  const [activeTab, setActiveTab] = useState('Income');

  /**
   * Calendar Event 클릭시 Modal Open
   * @param data
   */
  const callbackCalendarDateClick = (info) => {
    document.getElementById('modal-title').innerText = info.dateStr.replace(/-/g, '.');
    setActiveTab('Income');
    setValue('Income.id', '');
    setValue('Income.worklogEquipment.id', worklogProfile.worklogEquipments[0]?.id);
    setValue(
      'Income.income',
      worklogProfile.worklogEquipments[0] === undefined
        ? ''
        : parseInt(worklogProfile.worklogEquipments[0]?.laborWage)
    );
    setValue('Income.worklogCompany.id', worklogProfile.worklogCompanies[0]?.id);
    let clickedDate = new Date(info.dateStr);
    let nextMonth = clickedDate.setMonth(clickedDate.getMonth() + 1);
    setValue('Income.collectionDate', formatDate(new Date(nextMonth), '.'));
    setValue('Income.paymentDate', '');
    setValue('Income.laborDay', '1');
    setValue('Income.remarks', '');
    setValue('Expense.id', '');
    setValue('Expense.worklogEquipment.id', worklogProfile.worklogEquipments[0]?.id);
    setValue('Expense.remarks', '');
    setValue('Expense.name', '');
    setValue('Expense.expense', '');
    document.getElementById('modal').showModal();
  };
  /**
   * Calendar Event 클릭시 Modal Open
   * @param data
   */
  const callbackCalendarEventClick = (info) => {
    let splitId = info.event.id.split('_');
    let worklogType = splitId[0];
    let id = splitId[1];
    let url;

    switch (worklogType) {
      case WORKLOG_TYPE.INCOME:
        url = `/worklog/equipments/incomes/${id}`;
        break;
      case WORKLOG_TYPE.EXPENSE:
        url = `/worklog/equipments/expenses/${id}`;
        break;
    }

    fetchGet(url)
      .then((response) => response.json())
      .then((data) => {
        switch (worklogType) {
          case WORKLOG_TYPE.INCOME:
            document.getElementById('modal-title').innerText = data.incomeDate.replace(/-/g, '.');
            setActiveTab('Income');
            setValue('Income.id', data.id);
            setValue('Income.worklogEquipment.id', data.worklogEquipment.id);
            setValue('Income.income', parseInt(data.income));
            setValue('Income.worklogCompany.id', data.worklogCompany.id);
            setValue('Income.collectionDate', formatDate(new Date(data.collectionDate), '.'));
            setValue(
              'Income.paymentDate',
              data.paymentDate ? formatDate(new Date(data.paymentDate), '.') : ''
            );
            setValue('Income.laborDay', data.laborDay);
            setValue('Income.remarks', data.remarks);
            break;
          case WORKLOG_TYPE.EXPENSE:
            document.getElementById('modal-title').innerText = data.expenseDate.replace(/-/g, '.');
            setActiveTab('Expense');
            setValue('Expense.id', data.id);
            setValue('Expense.worklogEquipment.id', data.worklogEquipment.id);
            setValue('Expense.expense', parseInt(data.expense));
            setValue('Expense.name', data.name);
            setValue('Expense.remarks', data.remarks);
            break;
        }
      })
      .catch((error) => {
        console.error(error);
        alert(`오류가 발생했습니다.\n${error}`);
      });

    document.getElementById('modal').showModal();
  };

  useEffect(() => {
    calendar = worklogsCalendar('calendar', callbackCalendarDateClick, callbackCalendarEventClick);
    factoryIncomesAndExpense(calendar, new Date().toJSON().slice(0, 10).replace(/-/g, '-'));
    document.querySelector('.fc-prev-button').addEventListener('click', (e) => {
      let strDate = `${document.querySelector('.fc-toolbar-title').innerText}`.replace(' ', '');
      let parts = strDate.split('.');
      let year = parts[0];
      let month = parts[1].trim().padStart(2, '0'); // 월을 두 자리로 맞춤
      factoryIncomesAndExpense(calendar, `${year}-${month}-10`);
    });
    document.querySelector('.fc-next-button').addEventListener('click', (e) => {
      let strDate = `${document.querySelector('.fc-toolbar-title').innerText}`.replace(' ', '');
      let parts = strDate.split('.');
      let year = parts[0];
      let month = parts[1].trim().padStart(2, '0'); // 월을 두 자리로 맞춤
      factoryIncomesAndExpense(calendar, `${year}-${month}-10`);
    });
  }, []);

  return (
    <WorklogsModal
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      worklogProfile={worklogProfile}
      callbackIncomeOrExpenseSaved={callbackIncomeOrExpenseSaved}
      callbackIncomeOrExpenseDeleted={callbackIncomeOrExpenseDeleted}
    />
  );
}
