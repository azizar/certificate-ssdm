import { auth } from 'auth';
import axios from 'axios';
import { getSession } from 'next-auth/react';

// export const fetcherWithToken = async (
//   url: string,
//   method:
//     | "GET"
//     | "HEAD"
//     | "POST"
//     | "PUT"
//     | "DELETE"
//     | "CONNECT"
//     | "OPTIONS"
//     | "TRACE"
//     | "PATCH",
//   token: string,
//   contenType = "application/json",
//   accept = "application/json"
// ) => {
//   const config: RequestInit = {
//     method: method,
//     headers: {
//       Authorization: "Bearer " + token,
//       "Content-Type": contenType,
//     },
//   };
//   // const response = await fetch(url, config);

//   // return new Promise(async (resolve, reject) => {
//   //   if (!response.ok) reject(await response.json());
//   //   resolve(await response.json());
//   // });
// };

// export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const ApiCall = () => {
  const axiosInstance = axios.create({
    baseURL: process.env.API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  axiosInstance.interceptors.request.use(async (request) => {
    try {
      let token = '';
      let session = null;

      if (typeof window == 'undefined') {
        session = await auth();
      } else {
        session = await getSession();
      }

      token = session?.user.access_token ?? '';

      if (token) {
        request.headers.Authorization = `Bearer ${token}`;
      }
      return request;
    } catch (_) {
      console.error('Could not intercept request with authentication');
      return request;
    }
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      return Promise.resolve(response.data);
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  return axiosInstance;
};
