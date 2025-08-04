# React Weather App (天氣查詢應用)

**[➡️ Live Demo - 線上預覽網站](https://mos25399.github.io/my-weather-app/)**

這是一個使用 React 和 Vite 建立的天氣查詢應用程式。使用者可以輸入城市名稱，透過串接 **OpenWeatherMap API**，獲取並顯示該城市的即時天氣資訊。此專案主要用於展示串接第三方 RESTful API、處理非同步資料流，以及根據 API 回應動態變更 UI 的能力。

---

## ✨ 核心功能 (Features)

* **即時天氣查詢**：可輸入全球任何城市名稱（英文），獲取當前的天氣狀況。
* **豐富的資料顯示**：顯示溫度、體感溫度、濕度、天氣描述以及對應的動態天氣圖示。
* **動態背景**：應用程式的背景會根據查詢到的天氣（晴天、雨天、多雲等）自動更換，提升視覺體驗。
* **完整的狀態處理**：包含了載入中 (Loading)、查無城市 (Not Found)、以及其他 API 錯誤的友善提示。

---

## 🛠️ 使用技術 (Technology Stack)

* **核心框架**: `React`
* **狀態管理**: `React Hooks` (`useState`, `useEffect`)
* **API 串接**: `Axios`
* **建置工具**: `Vite`
* **樣式**: `Bootstrap 5`, `SCSS`
* **外部服務**: `OpenWeatherMap API`

---

## 🚀 如何在本地端運行 (Getting Started)

### 1. 取得 API 金鑰
本專案需要使用 OpenWeatherMap 的 API 金鑰。請前往 [OpenWeatherMap](https://openweathermap.org/home/sign_up) 網站免費註冊並取得您的 API Key。

### 2. 設定環境變數
在專案的根目錄下，建立一個 `.env` 檔案，並填入以下內容：
VITE_OPENWEATHER_API_KEY=您從OpenWeatherMap取得的API金鑰

### 3. 安裝與啟動
```bash
# Clone 專案
git clone [https://github.com/mos25399/my-weather-app.git](https://github.com/mos25399/my-weather-app.git)

# 進入專案目錄
cd my-weather-app

# 安裝依賴套件
npm install

# 啟動開發伺服器
npm run dev