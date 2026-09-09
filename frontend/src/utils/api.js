const BASE_URL = "https://api-around.allisons.org";

function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }

  return res.json().then((data) => {
    return Promise.reject(data.message || `Error: ${res.status}`);
  });
}

function request(endpoint, options = {}) {
  // Mantenemos tu token exactamente como está.
  const token = "ff0984c5-e569-4c67-a9c9-6db7ea5e5c0e";

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = token;
  }

  return fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  }).then(checkResponse);
}

const api = {
  getCards() {
    return request("/cards");
  },

  getUserInfo() {
    return request("/users/me");
  },

  createCard({ name, link }) {
    return request("/cards", {
      method: "POST",
      body: JSON.stringify({
        name,
        link,
      }),
    });
  },

  deleteCard(cardId) {
    return request(`/cards/${cardId}`, {
      method: "DELETE",
    });
  },

  likeCard(cardId) {
    return request(`/cards/${cardId}/likes`, {
      method: "PUT",
    });
  },

  dislikeCard(cardId) {
    return request(`/cards/${cardId}/likes`, {
      method: "DELETE",
    });
  },

  updateProfile({ name, about }) {
    return request("/users/me", {
      method: "PATCH",
      body: JSON.stringify({
        name,
        about,
      }),
    });
  },

  updateAvatar(avatar) {
    return request("/users/me/avatar", {
      method: "PATCH",
      body: JSON.stringify({
        avatar,
      }),
    });
  },
};

export default api;
