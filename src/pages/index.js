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
    setTimeout(() => {
      getPlaylsit();
    }, 1000 * 5 * 60)
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
        <div class="widgets-container">
          <div class="widget navigation-widget">
            <h2>Навигация</h2>
            <p>• К туалетам</p>
            <p>• К гейтам</p>
            <p>• К зоне регистрации</p>
          </div>
          <div class="widgets-group-f2">
            <div class="widget weather-widget">
              <div class="weather-header">Сегодняшняя погода</div>
              <div class="weather-main">
                <div class="weather-temp">23°</div>
                <div class="weather-icon">⛅</div>
              </div>
              <div class="weather-date">Четверг, 25 апреля</div>
              <div class="weather-details">
                <div class="weather-item">
                  <span>💧</span>
                  <span>45%</span>
                </div>
                <div class="weather-item">
                  <span>💨</span>
                  <span>12%</span>
                </div>
                <div class="weather-item">
                  <span>🌪️</span>
                  <span>8 км/ч</span>
                </div>
              </div>
            </div>

            <div class="widget currency-widget">
              <div class="currency-header">Курсы валют</div>
              <div class="currency-list">
                <div class="currency-item">
                  <span class="currency-code">KZT/USD</span>
                  <span class="currency-value" id="usd-rate">---</span>
                </div>
                <div class="currency-item">
                  <span class="currency-code">KZT/RUB</span>
                  <span class="currency-value" id="rub-rate">---</span>
                </div>
                <div class="currency-item">
                  <span class="currency-code">KZT/CNY</span>
                  <span class="currency-value" id="cny-rate">---</span>
                </div>
              </div>
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
