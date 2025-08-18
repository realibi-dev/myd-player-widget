import Script from "next/script";
import { useEffect, useRef, useState } from "react";

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
      <div class="led-screen" id="ledScreen">
        <div class="video-wrapper">
          <video ref={videoRef} id="videoPlayer" autoPlay muted></video>
        </div>
              <div class="widget navigation-widget>
                  <div class="nav-image-container>
                  <img
                      src="C:\Yernur\MYD\integration\project\nav.png"
                      alt="Изображение навигации"
                  />
                  </div>
              </div>
              <div class="widget weather-widget">
                  <div class="weather-time" id="weather-time">--:--</div>
                  <div class="weather-date" id="weather-date">Пятница, 1 января</div>
                  <div class="weather-main">
                      <div class="weather-icon-main" id="weather-icon-main">--</div>
                      <div class="weather-temp-main" id="weather-temp-main">--°</div>
                  </div>
              </div>
              <div class="widget currency-widget">
                  <div class="currency-header">Курсы валют</div>
                  <div class="currency-list">
                      <div class="currency-item">
                          <div class="currency-info">
                          <img
                              src="https://flagcdn.com/w40/us.png"
                              alt="USD"
                              class="flag-circle"
                          />
                                  <span class="currency-code">KZT/USD</span>
                          </div>
                          <span class="currency-value" id="usd-rate">---</span>
                      </div>
                      <div class="currency-item">
                          <div class="currency-info">
                          <img
                              src="https://flagcdn.com/w40/ru.png"
                              alt="RUB"
                              class="flag-circle"
                          />
                                  <span class="currency-code">KZT/RUB</span>
                          </div>
                          <span class="currency-value" id="rub-rate">---</span>
                      </div>
                      <div class="currency-item">
                          <div class="currency-info">
                          <img
                              src="https://flagcdn.com/w40/cn.png"
                              alt="CNY"
                              class="flag-circle"
                          />
                                  <span class="currency-code">KZT/CNY</span>
                          </div>
                          <span class="currency-value" id="cny-rate">---</span>
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
