import Chart from 'chart.js/dist/chart.min';

import React, { useEffect } from 'react';

let chart;

export function GraphLaborDay({ canvasId, laborDays }) {
  useEffect(() => {
    chart?.destroy();
    const ctx = document.getElementById(canvasId);
    const labels = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const borderWidth = 2;
    const previousMonth = new Date().getMonth() - 1;
    const previousMonthData = laborDays.slice(0, previousMonth);
    const averageLaborDays =
      previousMonthData.reduce((acc, value) => acc + value, 0) / previousMonthData.length;
    const roundedAverage = parseFloat(averageLaborDays.toFixed(1));
    const data = {
      labels: labels,
      datasets: [
        {
          label: '공수',
          data: laborDays,
          fill: false,
          borderWidth: borderWidth,
          borderColor: 'rgb(0,192,192)',
          tension: 0.1,
        },
      ],
    };

    const horizontalDottedLine = {
      id: 'horizontalDottedLine',
      beforeDatasetDraw(chart, args, options) {
        const {
          ctx,
          chartArea: { top, right, bottom, left, width, height },
          scales: { x, y },
        } = chart;
        ctx.save();

        ctx.strokeStyle = 'rgb(12,144,232)';
        ctx.setLineDash([10, 10]);
        ctx.strokeRect(left, y.getPixelForValue(roundedAverage), width, 0);

        // 레이블 추가
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.textAlign = 'center';
        ctx.fillText(
          `평균 : ${roundedAverage}`,
          left + width / 2,
          y.getPixelForValue(roundedAverage)
        ); // 레이블 위치 조정
        ctx.restore();
      },
    };

    const config = {
      type: 'bar',
      data: data,
      plugins: [horizontalDottedLine],
    };
    chart = new Chart(ctx, config);
  }, [laborDays]);
}
