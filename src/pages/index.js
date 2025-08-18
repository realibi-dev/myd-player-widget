import Script from "next/script";
import {useEffect, useRef, useState} from "react";

export default function Home() {
  const videoRef = useRef(null);

  const [playlist, setPlaylist] = useState([]);

  const getPlaylsit = async () => {
    const DEVICE_UUID = "00000000-deb9-097a-a3ce-b8db23db5b2f";
    const FOLDER = "/videos";
    const response = await fetch(`http://192.168.20.99:8000/api/v2/playlist?uuid=${DEVICE_UUID}`);
    const data = await response.json();
    const newPlaylist = data.playlist[0].mediafiles.map(media => `${FOLDER}/${media.uuid}.mp4`);
    setPlaylist(newPlaylist);
    console.log("Установили новый плейлист", newPlaylist);
  }

  useEffect(() => {
    getPlaylsit();
  }, []);

  useEffect(() => {
    console.log("Словили смену плейлиста");
    if (videoRef.current) {
      console.log("Videoref current ok");
      let index = 0;
      if (playlist.length) {
        videoRef.current.src = playlist[index];
        videoRef.current.load();
      }

      videoRef.current.addEventListener("ended", () => {
        if (index === playlist.length - 1) {
          index = 0;
        } else {
          index++;
        }
        videoRef.current.src = playlist[index];
        videoRef.current.load();
      });
    }
  }, [videoRef, playlist]);

  return (
    <>
      <div className="led-screen" id="ledScreen">
        <div className="video-wrapper">
          <video ref={videoRef} id="videoPlayer" autoPlay muted></video>
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
      </>
    );
  }
