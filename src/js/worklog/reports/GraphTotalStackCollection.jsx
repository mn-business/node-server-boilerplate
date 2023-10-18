import Chart from 'chart.js/dist/chart.min';

import React, { useEffect } from 'react';

let chart;

export function GraphTotalStackCollection({ canvasId, incomesCollection, paymentsCollection, yetPaymentsCollection }) {
  useEffect(() => {
    chart?.destroy();
    const ctx = document.getElementById(canvasId);
    const labels = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const data = {
      labels: labels,
      datasets: [
        {
          label: '수익',
          data: incomesCollection,
          backgroundColor: 'rgb(0,192,192)',
          stack: 'stack 0',
        },
        {
          label: '수금',
          data: paymentsCollection,
          backgroundColor: 'rgb(12,144,232)',
          stack: 'stack 1',
        },
        {
          label: '미수금',
          data: yetPaymentsCollection,
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
  }, [incomesCollection, paymentsCollection, yetPaymentsCollection]);
}
