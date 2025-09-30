import { useEffect } from "react";

const YandexAd = () => {
  useEffect(() => {
    if (window.yaContextCb) {
      window.yaContextCb.push(() => {
        window.Ya.Context.AdvManager.render({
          blockId: "R-A-17375623-1",
          renderTo: "yandex_rtb_R-A-17375623-1",
        });
      });
    }
  }, []);

  return <div id="yandex_rtb_R-A-17375623-1"></div>;
};

export default YandexAd;
