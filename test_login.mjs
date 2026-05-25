const BASE = "https://api.edrtimpharmacie.com";

const candidates = [
  `${BASE}/api/v1/auth/token/`,
  `${BASE}/api/v1/auth/jwt/create/`,
  `${BASE}/api/v1/token/`,
  `${BASE}/api/token/`,
  `${BASE}/api/v1/auth/login/`,
  `${BASE}/api/v1/admin/login/`,
  `${BASE}/api/v1/login/`,
];

const res = await fetch(`${BASE}/api/v1/token/`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "test@test.com", password: "test" }),
});
console.log("Status:", res.status);
try {
  const json = await res.json();
  console.log("JSON response:", json);
} catch (e) {
  console.log("Not JSON or empty");
}

