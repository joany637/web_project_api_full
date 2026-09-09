const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:3000"
    : "https://api-around.allisons.org");

function request(url, options) {
  return fetch(url, options).catch(() => {
    throw new Error(
      "No se pudo conectar con la API. Revisa VITE_API_URL y que el backend esté activo.",
    );
  });
}

function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  // ✅ Leemos el mensaje de error real del servidor
  return res.json().then((err) => Promise.reject(err));
}

export function register({ email, password, name, about, avatar }) {
  // ✅ Validaciones ANTES de enviar
  if (!email || !email.includes("@")) {
    return Promise.reject({
      message: "El correo debe tener formato válido (ej: nombre@dominio.com)",
    });
  }
  if (!password || password.length < 8) {
    return Promise.reject({
      message: "La contraseña debe tener al menos 8 caracteres",
    });
  }

  // ✅ Enviamos SOLO los campos que la API espera
  return request(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      name,
      about,
      avatar,
    }),
  }).then(checkResponse);
}

export function authorize({ email, password }) {
  if (!email || !email.includes("@")) {
    return Promise.reject({ message: "El correo debe tener formato válido" });
  }
  if (!password || password.length < 8) {
    return Promise.reject({
      message: "La contraseña debe tener al menos 8 caracteres",
    });
  }

  return request(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then(checkResponse);
}

export function checkToken(token) {
  if (!token) {
    return Promise.reject({ message: "Token no proporcionado" });
  }

  return request(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(checkResponse);
}
