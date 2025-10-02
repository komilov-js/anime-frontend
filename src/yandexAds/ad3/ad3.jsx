import { useEffect } from "react";

const YandexAd3 = () => {
  useEffect(() => {
    if (!window.yaContextCb) window.yaContextCb = [];
    window.yaContextCb.push(() => {
      window.Ya.Context.AdvManager.render({
        blockId: "R-A-17375623-3",
        renderTo: "yandex_rtb_R-A-17375623-3",
      });
    });
  }, []);

  return <div id="yandex_rtb_R-A-17375623-3"></div>;
};

export default YandexAd3;
