import Script from "next/script";
import {useEffect, useRef, useState} from "react";

export default function Home() {
  const videoRef = useRef(null);
  const tabloRef = useRef(null);

  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await fetch("/config/playlist.json");
      if (!response.ok) return;

      const newPlaylist = await response.json();
      const paths = newPlaylist.map(obj => obj.path);

      let isPlaylistDifferent = false;

      if (playlist.length !== paths.length) {
        isPlaylistDifferent = true;
      } else {
        for (let i = 0; i < playlist.length; i++) {
          if (playlist[i] !== paths[i]) {
            isPlaylistDifferent = true;
            break;
          }
        }
      }

      if (isPlaylistDifferent) {
        setPlaylist(paths);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [playlist]); // теперь эффект пересоздаётся при обновлении

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  useEffect(async () => {
    console.log("Словили смену плейлиста");

    const video = videoRef.current;
    if (!video || playlist.length === 0) return;

    let index = 0;

    const onEnded = async () => {
      if (index % 2 === 0) {
        console.log("showing tablo");
        tabloRef.current.classList.remove("hidden");
        await sleep(10000);
        tabloRef.current.classList.add("hidden");
        console.log("removing tablo");
      }

      // Переход к следующему видео
      if (index === playlist.length - 1) {
        index = 0;
      } else {
        index++;
      }

      console.log("Следующее видео:", playlist[index]);
      video.src = playlist[index];
      video.play();
    };

    // Ставим первое видео
    video.src = playlist[index];
    sleep(5000).then(() => video.play());


    // Подписка на событие
    video.addEventListener("ended", onEnded);

    // Удаляем обработчик при размонтировании или новом эффекте
    return () => {
      video.removeEventListener("ended", onEnded);
    };
  }, [playlist]);


  return (
    <>
      <div ref={tabloRef} className="tablo hidden">
        <div className="container">
          <div className="header">
            <span>✈️</span>
            <span>Ushyp ketýler</span>
          </div>
          <div id="content">
            <div className="loading">Загрузка данных...</div>
          </div>
        </div>
      </div>
      <div className="led-screen" id="ledScreen">
        <div className="video-wrapper">
          <video ref={videoRef} id="videoPlayer" autoPlay muted></video>
        </div>
        <div className="widget image1">
          <img
            src="/image/image 552x552.png"
          />
        </div>
        <div className="widget navigation-widget">
          <div className="nav-image-container">
            <img
              src="/Navigation/nav.png"
              alt="Изображение навигации"
            />
          </div>
        </div>
        <div className="widget weather-widget">
          <div className="weather-time" id="weather-time">--:--</div>
          <div className="weather-date" id="weather-date">Пятница, 1 января</div>
          <div className="weather-main">
            <div className="weather-icon-main" id="weather-icon-main">--</div>
            <div className="weather-temp-main" id="weather-temp-main">--°</div>
          </div>
        </div>
        <div className="widget currency-widget">
          <div className="currency-header">Курсы валют</div>
          <div className="currency-list">
            <div className="currency-item">
              <div className="currency-info">
                <img
                  src="https://flagcdn.com/w40/us.png"
                  alt="USD"
                  className="flag-circle"
                />
                <span className="currency-code">KZT/USD</span>
              </div>
              <span className="currency-value" id="usd-rate">---</span>
            </div>
            <div className="currency-item">
              <div className="currency-info">
                <img
                  src="https://flagcdn.com/w40/ru.png"
                  alt="RUB"
                  className="flag-circle"
                />
                <span className="currency-code">KZT/RUB</span>
              </div>
              <span className="currency-value" id="rub-rate">---</span>
            </div>
            <div className="currency-item">
              <div className="currency-info">
                <img
                  src="https://flagcdn.com/w40/cn.png"
                  alt="CNY"
                  className="flag-circle"
                />
                <span className="currency-code">KZT/CNY</span>
              </div>
              <span className="currency-value" id="cny-rate">---</span>
            </div>
          </div>
        </div>
      </div>

      <Script
        src="/script.js"
        strategy="lazyOnload" // или "afterInteractive", "beforeInteractive"
        onLoad={() => {
          console.log('Скрипт загружен!')
        }}
      />
      <Script
        src="/tablo_script.js"
        strategy="lazyOnload" // или "afterInteractive", "beforeInteractive"
        onLoad={() => {
          console.log('Скрипт загружен!')
        }}
      />

    </>
  );
}
