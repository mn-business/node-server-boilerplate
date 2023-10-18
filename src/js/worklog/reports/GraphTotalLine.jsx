import Chart from 'chart.js/dist/chart.min';

import React, { useEffect } from 'react';

let chart;

export function GraphTotalLine({ canvasId, incomes, payments, yetPayments, expenses }) {
  useEffect(() => {
    chart?.destroy();
    const ctx = document.getElementById(canvasId);
    const labels = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const borderWidth = 2;
    const data = {
      labels: labels,
      datasets: [
        {
          label: '매출',
          data: incomes,
          fill: false,
          borderWidth: borderWidth,
          borderColor: 'rgb(0,192,192)',
          tension: 0.4,
        },
        {
          label: '지출',
          data: expenses,
          fill: false,
          borderWidth: borderWidth,
          borderColor: 'rgb(250,131,13)',
          tension: 0.4,
        },
        {
          label: '수금',
          data: payments,
          fill: false,
          borderWidth: borderWidth,
          borderColor: 'rgb(12,144,232)',
          tension: 0.4,
        },
        {
          label: '미수금',
          data: yetPayments,
          fill: false,
          borderWidth: borderWidth,
          borderColor: 'rgb(252,24,72)',
          tension: 0.4,
        },
      ],
    };
    const config = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
      },
    };
    chart = new Chart(ctx, config);
  }, [incomes, payments, yetPayments, expenses]);
}
