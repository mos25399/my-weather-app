import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [backgroundClass, setBackgroundClass] = useState("bg-default");

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  // 根據天氣狀況改變背景的 useEffect
  useEffect(() => {
    if (!weatherData) {
      setBackgroundClass("bg-default");
      return;
    }
    const weatherId = weatherData.weather[0].id;
    if (weatherId >= 200 && weatherId < 600) setBackgroundClass("bg-rainy"); // 雨天
    else if (weatherId >= 801 && weatherId <= 804) setBackgroundClass("bg-cloudy"); // 多雲
    else if (weatherId === 800) setBackgroundClass("bg-sunny"); // 晴天
    else setBackgroundClass("bg-default"); // 其他
  }, [weatherData]);

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city.trim()) {
      setError("請輸入城市名稱");
      return;
    }
    setLoading(true);
    setWeatherData(null);
    setForecastData([]); // 每次搜尋前都清空舊的預報
    setError("");
    try {
      // --- 同時請求兩個 API ---
      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=zh_tw`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=zh_tw`;

      // 使用 Promise.all 來並行發送請求
      const [currentWeatherResponse, forecastResponse] = await Promise.all([
        axios.get(currentWeatherUrl),
        axios.get(forecastUrl),
      ]);

      setWeatherData(currentWeatherResponse.data);

      // OpenWeatherMap 的 5 日預報 API 會回傳每 3 小時的資料，共 40 筆
      // 我們需要從中篩選出每天中午 12:00 的資料作為代表
      const dailyForecasts = forecastResponse.data.list.filter((item) => item.dt_txt.includes("12:00:00"));
      setForecastData(dailyForecasts);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("找不到這個城市，請檢查拼寫。");
      } else {
        setError("無法取得天氣資訊，請稍後再試。");
      }
      console.error("獲取天氣失敗:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`app-container d-flex justify-content-center align-items-center vh-100 ${backgroundClass}`}>
      <div
        className="card text-center shadow-lg"
        style={{
          width: "100%",
          maxWidth: "500px",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="card-header bg-transparent border-0 pt-4">
          <h1 className="card-title fs-4 fw-bold">天氣查詢 App</h1>
        </div>
        <div className="card-body p-4">
          <form onSubmit={fetchWeather}>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="輸入城市英文名 (例如: Taipei)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? "查詢中..." : "查詢"}
              </button>
            </div>
          </form>

          {/* 條件渲染：根據不同狀態顯示不同內容 */}
          {!weatherData && !loading && !error && <p className="text-muted mt-4">請輸入一個城市來查詢天氣。</p>}

          {loading && (
            <div className="spinner-border text-primary mt-4" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}

          {error && <div className="alert alert-danger mt-4">{error}</div>}

          {weatherData && (
            <div className="weather-info mt-4">
              {/* --- 當前天氣資訊顯示 --- */}
              <h2>
                {weatherData.name}, {weatherData.sys.country}
              </h2>
              <div className="d-flex align-items-center justify-content-center">
                <img
                  src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                  alt={weatherData.weather[0].description}
                />
                <p className="display-4 mb-0 fw-bold">{Math.round(weatherData.main.temp)}°C</p>
              </div>
              <p className="fs-5 text-capitalize">{weatherData.weather[0].description}</p>
              <div className="d-flex justify-content-around mt-3">
                <p>體感溫度: {Math.round(weatherData.main.feels_like)}°C</p>
                <p>濕度: {weatherData.main.humidity}%</p>
              </div>

              {/* --- 未來 5 日天氣預報 --- */}
              <hr />
              <h5 className="mt-4">未來天氣預報</h5>
              <div className="d-flex justify-content-between mt-3">
                {forecastData.map((forecast, index) => (
                  <div key={index} className="text-center">
                    <p className="mb-1 small">
                      {new Date(forecast.dt * 1000).toLocaleDateString("zh-TW", { weekday: "short" })}
                    </p>
                    <img
                      src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                      alt={forecast.weather[0].description}
                    />
                    <p className="fw-bold">{Math.round(forecast.main.temp)}°C</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="card-footer text-muted bg-transparent border-0 pb-3">
          <p className="mb-0 small">Powered by OpenWeatherMap</p>
        </div>
      </div>
    </div>
  );
}

export default App;
