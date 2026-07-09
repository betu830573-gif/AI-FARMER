// ============================================
//  KrishiMitra AI - Frontend App (Static)
//  All API calls happen directly from browser
// ============================================

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

// ---- Get API Keys from localStorage ----
function getGeminiKey() { return localStorage.getItem("GEMINI_API_KEY") || ""; }
function getWeatherKey() { return localStorage.getItem("WEATHER_API_KEY") || ""; }

// ---- Call Gemini API ----
async function callGemini(prompt) {
  const key = getGeminiKey();
  if (!key) {
    alert("Gemini API Key nahi hai! Settings page par jaao aur key add karo.");
    throw new Error("No API Key");
  }
  const res = await fetch(`${GEMINI_API_URL}?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });
  if (!res.ok) throw new Error("Gemini API Error: " + res.statusText);
  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}

// ---- Call Weather API ----
async function callWeather(city) {
  const key = getWeatherKey();
  if (!key) {
    alert("Weather API Key nahi hai! Settings page par jaao aur key add karo.");
    throw new Error("No API Key");
  }
  const res = await fetch(`${WEATHER_API_URL}?q=${encodeURIComponent(city)}&appid=${key}&units=metric`);
  if (!res.ok) throw new Error("Weather API Error");
  return await res.json();
}

// ---- Crop Advisor ----
async function cropAdvisor(crop, location, season) {
  const prompt = `Act as an expert agricultural advisor for Indian farmers. The farmer is growing ${crop} in ${location} during ${season} season. Provide actionable advice on sowing tips, irrigation schedule, and harvesting guidance. Keep it simple and clear. Format with clear headings.`;
  return await callGemini(prompt);
}

// ---- Disease Detection (Text-based since file upload needs backend) ----
async function detectDisease(description) {
  const prompt = `Act as an expert plant pathologist. A farmer describes their plant problem: "${description}". Identify the likely plant disease, its cause, treatment and prevention tips. Format clearly.`;
  return await callGemini(prompt);
}

// ---- Fertilizer Recommendation ----
async function fertilizerRecommend(crop, soilType) {
  const prompt = `Act as an expert agronomist. A farmer is growing ${crop} in ${soilType} soil in India. Provide specific fertilizer recommendations (organic and synthetic) and ideal application timing. Format clearly.`;
  return await callGemini(prompt);
}

// ---- Government Schemes ----
async function governmentSchemes(state, category) {
  const prompt = `Act as an agricultural expert in India. List relevant central and state government agricultural schemes, subsidies and benefits for a ${category} farmer in ${state}. Include PM-KISAN, PMFBY and others. Include benefits and required documents. Format clearly.`;
  return await callGemini(prompt);
}

// ---- Chat ----
async function chatWithAI(message) {
  const prompt = `You are KrishiMitra, an AI assistant for Indian farmers. Answer the following question in Hindi. Keep it brief, encouraging and easy to understand: "${message}"`;
  return await callGemini(prompt);
}

// ---- UI Helpers ----
function showLoading(loadingId, btnId) {
  document.getElementById(loadingId)?.classList.remove("d-none");
  const btn = document.getElementById(btnId);
  if (btn) btn.disabled = true;
}

function hideLoading(loadingId, btnId) {
  document.getElementById(loadingId)?.classList.add("d-none");
  const btn = document.getElementById(btnId);
  if (btn) btn.disabled = false;
}

function showResult(resultId, responseId, html) {
  const res = document.getElementById(resultId);
  const resp = document.getElementById(responseId);
  if (res) res.classList.remove("d-none");
  if (resp) resp.innerHTML = html;
}

function formatText(text) {
  return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
             .replace(/\*(.*?)\*/g, "<em>$1</em>")
             .replace(/###\s?(.*)/g, "<h5 class='fw-bold mt-3' style='color:#F9A825'>$1</h5>")
             .replace(/##\s?(.*)/g, "<h4 class='fw-bold mt-3'>$1</h4>")
             .replace(/\n/g, "<br>");
}

console.log("KrishiMitra AI - Frontend initialized!");
