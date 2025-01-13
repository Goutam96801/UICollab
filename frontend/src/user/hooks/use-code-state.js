import axios from 'axios';
import { useState, useEffect } from 'react';

export function useCodeState(selectedCategory) {
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");

  useEffect(() => {
    axios.post(process.env.REACT_APP_SERVER_DOMAIN + '/get-category', { name: selectedCategory })
      .then(({ data }) => {
        setHtmlCode(data.category.defaultHtmlCode)
        setCssCode(data.category.defaultCssCode)
      }).catch(err => {
        console.log(err)
      })

  }, [selectedCategory]);

  return { htmlCode, cssCode, setHtmlCode, setCssCode };
}

