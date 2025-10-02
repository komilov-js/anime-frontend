import { useEffect } from "react";

const YandexAd2 = () => {
  useEffect(() => {
    if (!window.yaContextCb) window.yaContextCb = [];
    window.yaContextCb.push(() => {
      window.Ya.Context.AdvManager.render({
        blockId: "R-A-17375623-2",
        renderTo: "yandex_rtb_R-A-17375623-2",
      });
    });
  }, []);

  return <div id="yandex_rtb_R-A-17375623-2"></div>;
};

export default YandexAd2;
