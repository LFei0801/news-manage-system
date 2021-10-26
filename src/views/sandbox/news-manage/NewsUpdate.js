import React, { useEffect, useState } from "react";
import NewsForm from "../../../components/NewsForm";
import axios from "axios";

export default function NewsUpdate({ history, match }) {
  const [newsInfo, setNewsInfo] = useState(null);

  useEffect(() => {
    const getPreviewData = async () => {
      try {
        const res = await axios.get(
          `/news/${match.params.id}?_expand=category&_expand=role`
        );
        setNewsInfo(() => res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getPreviewData();
  }, [match.params.id]);

  return (
    <div>
      <NewsForm isUpdate={true} history={history} newsInfo={newsInfo} />
    </div>
  );
}
