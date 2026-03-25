const BASE = "https://e-doctorpharma.onrender.com";

const candidates = [
  `${BASE}/api/v1/auth/token/`,
  `${BASE}/api/v1/auth/jwt/create/`,
  `${BASE}/api/v1/token/`,
  `${BASE}/api/token/`,
  `${BASE}/api/v1/auth/login/`,
  `${BASE}/api/v1/admin/login/`,
];

for (const url of candidates) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "test@test.com", password: "test" }),
    signal: AbortSignal.timeout(8000),
  });
  const icon = res.status === 404 ? "❌ 404" : `✅ ${res.status}`;
  console.log(`${icon}  ${url}`);
}
