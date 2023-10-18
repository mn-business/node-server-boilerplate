import Chart from 'chart.js/dist/chart.min';

import React, { useEffect } from 'react';

let chart;

export function GraphTotalStack({ canvasId, incomes, payments, yetPayments }) {
  useEffect(() => {
    chart?.destroy();
    const ctx = document.getElementById(canvasId);
    const labels = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const data = {
      labels: labels,
      datasets: [
        {
          label: '매출',
          data: incomes,
          backgroundColor: 'rgb(0,192,192)',
          stack: 'stack 0',
        },
        {
          label: '수금',
          data: payments,
          backgroundColor: 'rgb(12,144,232)',
          stack: 'stack 1',
        },
        {
          label: '미수금',
          data: yetPayments,
          backgroundColor: 'rgb(252,24,72)',
          stack: 'stack 1',
        },
      ],
    };
    const config = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      },
    };
    chart = new Chart(ctx, config);
  }, [incomes, payments, yetPayments]);
}
