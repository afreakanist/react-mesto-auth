export const BASE_URL = "http://localhost:5500";

const getResponseData = (res) => {
  return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
};

export const register = (password, email) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Origin": "http://localhost:3000",
      "Host": "http://localhost:5500",
    },
    body: JSON.stringify({ password, email }),
  }).then((res) => res.json());
};

export const authorize = (password, email) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Origin": "http://localhost:3000",
      "Host": "http://localhost:5500",
    },
    body: JSON.stringify({ password, email }),
  }).then((res) => getResponseData(res));
};

export const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Origin": "http://localhost:3000",
      "Host": "localhost:5500",
      "Authorization": `Bearer ${token}`,
    },
  }).then((res) => getResponseData(res));
};
