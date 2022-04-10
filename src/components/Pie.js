import React, { useEffect, useState } from "react";
import * as echarts from "echarts";
import _ from "lodash";

export default function Pie({ news }) {
  const [chart, setChart] = useState(null);

  useEffect(() => {
    renderPieView();
  });

  const renderPieView = () => {
    let myChart;
    if (!chart) {
      myChart = echarts.init(document.getElementById("pie"));
      setChart(() => myChart);
    } else {
      myChart = chart;
    }

    const data = _.groupBy(news, item => item.category.title);
    const newsList = [];
    for (let key in data) {
      newsList.push({ name: key, value: data[key].length });
    }

    let option = {
      title: {
        text: "当前用户撰写新闻数量展示",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "数量",
          type: "pie",
          radius: "50%",
          data: newsList,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
    myChart.setOption(option);
  };
  return <div id="pie" style={{ width: "100%", height: 400, marginTop: 40 }} />;
}
