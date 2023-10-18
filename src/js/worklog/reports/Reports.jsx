import React, { useState } from 'react';
import { GraphTotalLine } from '@/js/worklog/reports/GraphTotalLine';
import { GraphTotalStack } from '@/js/worklog/reports/GraphTotalStack';
import { GraphTotalStackCollection } from '@/js/worklog/reports/GraphTotalStackCollection';
import { GraphLaborDay } from '@/js/worklog/reports/GraphLaborDay';

export function Reports({ worklogProfile }) {
  const [selecteYears, setSelecteYears] = useState(
    [
      ...new Set(
        worklogProfile.worklogEquipments[0].worklogIncomes.map((income) =>
          new Date(income.incomeDate).getFullYear()
        )
      ),
    ].sort((a, b) => b - a)
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(
    worklogProfile.worklogEquipments[0].id
  );

  let laborDays = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 공수(작업일수) 합계
  let incomes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 매출합계
  let incomesCollection = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 매출합계 collectionDate
  let payments = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 수금 : 지급합계
  let paymentsCollection = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 수금 : 지급합계 collectionDate
  let yetPayments = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 미수금 : 지급합계
  let yetPaymentsCollection = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 미수금 : 수금일기준
  let expenses = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 지출합계

  worklogProfile.worklogEquipments.forEach((equipment) => {
    if (equipment.id == selectedEquipmentId) {
      equipment.worklogIncomes.forEach((income) => {
        if (income.incomeDate?.indexOf(selectedYear) === 0) {
          incomes[parseInt(income.incomeDate.slice(5, 7)) - 1] += parseInt(income.income);
          laborDays[parseInt(income.incomeDate.slice(5, 7)) - 1] += income.laborDay;
        }
        if (income.collectionDate?.indexOf(selectedYear) === 0) {
          // 수금일
          incomesCollection[parseInt(income.collectionDate.slice(5, 7)) - 1] += parseInt(
            income.income
          );
        }
        if (income.paymentDate?.indexOf(selectedYear) === 0) {
          payments[parseInt(income.incomeDate.slice(5, 7)) - 1] += parseInt(income.income);
        }
        if (income.paymentDate?.indexOf(selectedYear) === 0) {
          // 지급 완료.
          paymentsCollection[parseInt(income.paymentDate.slice(5, 7)) - 1] += parseInt(
            income.income
          );
        }
        if (income.paymentDate === null) {
          // 미지급
          yetPaymentsCollection[parseInt(income.collectionDate.slice(5, 7)) - 1] += parseInt(
            income.income
          );
        }
      });

      equipment.worklogExpenses.forEach((expense) => {
        if (expense.expenseDate?.indexOf(selectedYear) === 0) {
          expenses[parseInt(expense.expenseDate.slice(5, 7)) - 1] += parseInt(expense.expense);
        }
      });
    }
  });

  for (let i = 0; i < yetPayments.length; i++) {
    yetPayments[i] = incomes[i] - payments[i];
  }

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleEquipmentChange = (event) => {
    setSelectedEquipmentId(event.target.value);
  };

  return (
    <>
      <div className="flex justify-end items-center mb-2">
        <span className="text-xs">년도 :</span>&nbsp;
        <select
          className="select select-primary select-xs max-w-xs bg-white text-black"
          onChange={handleYearChange}
        >
          {selecteYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        &nbsp;&nbsp;&nbsp;<span className="text-xs">장비 :</span>&nbsp;
        <select
          className="select select-primary select-xs max-w-xs bg-white text-black"
          onChange={handleEquipmentChange}
        >
          {worklogProfile.worklogEquipments.map((worklogEquipment) => (
            <option key={worklogEquipment.id} value={worklogEquipment.id}>
              {worklogEquipment.name}
            </option>
          ))}
        </select>
      </div>
      <div className="text-base-content glass rounded-box grid gap-4 bg-opacity-60 xl:pb-0">
        <div className="p-2">
          <div className="mx-2 flex-1 justify-center px-2">
            <span className="text-lg font-bold">종합</span>
          </div>
          <canvas id="totalLine" className="p-2" style={{ width: '100%' }}>
            <GraphTotalLine
              canvasId={'totalLine'}
              incomes={incomes}
              payments={payments}
              yetPayments={yetPayments}
              expenses={expenses}
            />
          </canvas>
        </div>
      </div>
      <div className="text-base-content glass rounded-box grid gap-4 bg-opacity-60 xl:pb-0 mt-4">
        <div className="p-2">
          <div className="mx-2 flex-1 justify-center px-2">
            <span className="text-lg font-bold">매출</span>
          </div>
          <canvas id="totalBar" className="p-2" style={{ width: '100%' }}>
            <GraphTotalStack
              canvasId={'totalBar'}
              incomes={incomes}
              payments={payments}
              yetPayments={yetPayments}
              expenses={expenses}
            />
          </canvas>
        </div>
      </div>
      <div className="text-base-content glass rounded-box grid gap-4 bg-opacity-60 xl:pb-0 mt-4">
        <div className="p-2">
          <div className="mx-2 flex-1 justify-center px-2">
            <span className="text-lg font-bold">수익</span>
          </div>
          <canvas id="totalBarCollection" className="p-2" style={{ width: '100%' }}>
            <GraphTotalStackCollection
              canvasId={'totalBarCollection'}
              incomesCollection={incomesCollection}
              paymentsCollection={paymentsCollection}
              yetPaymentsCollection={yetPaymentsCollection}
              expenses={expenses}
            />
          </canvas>
        </div>
      </div>
      <div className="text-base-content glass rounded-box grid gap-4 bg-opacity-60 xl:pb-0 mt-4">
        <div className="p-2">
          <div className="mx-2 flex-1 justify-center px-2">
            <span className="text-lg font-bold">공수(작업일수) 합계</span>
          </div>
          <canvas id="laborDay" className="p-2" style={{ width: '100%' }}>
            <GraphLaborDay canvasId={'laborDay'} laborDays={laborDays} />
          </canvas>
        </div>
      </div>
    </>
  );
}
