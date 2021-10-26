import { useState, useEffect } from "react";
import axios from "axios";

export default function useNewsRanking(type) {
  const [data, setData] = useState([]);
  // 初始化数据
  useEffect(() => {
    const getViewList = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/news?publishState=2&_expand=category&_sort=${type}&_order=desc&_limit=10`
        );
        setData(data);
      } catch (error) {
        console.log(error);
      }
    };
    getViewList();
  }, [type]);

  return data;
}
