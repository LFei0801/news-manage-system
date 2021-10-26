import React, { useEffect, useState } from "react";
import * as echarts from "echarts";
import axios from "axios";
import _ from "lodash";

export default function Bar() {
  const [chart, setChart] = useState(null);
  // 初始化数据
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category").then((res) => {
      renderBarView(_.groupBy(res.data, (item) => item.category.title));
    });
    return () => {
      window.onresize = null;
    };
  }, []);

  //初始化
  const renderBarView = (dataOBJ) => {
    let myChart;
    if (!chart) {
      myChart = echarts.init(document.getElementById("bar"));
      setChart(() => myChart);
    } else {
      myChart = chart;
    }
    let option = {
      title: {
        text: "新闻分类图示",
      },
      tooltip: {},
      legend: {
        data: ["数量"],
      },
      xAxis: {
        data: Object.keys(dataOBJ),
        axisLabel: {
          rotate: 60,
          interval: 0,
        },
      },
      yAxis: {
        minInterval: 1,
      },
      series: [
        {
          name: "数量",
          type: "bar",
          data: Object.values(dataOBJ).map((item) => item.length),
        },
      ],
    };
    myChart.setOption(option);
    window.onresize = () => {
      myChart.resize();
    };
  };

  return (
    <div id="bar" style={{ marginTop: 100, width: "90%", height: 400 }}></div>
  );
}
