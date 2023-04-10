import axios from 'axios';

import { useAuthStore } from '@/stores/auth';
import { useLoaderStore } from '@/stores/loader';
import { t } from '@/i18n/index.js';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

let cachedClient = null;

const get = () => {
  if (cachedClient === null) {
    cachedClient = createClient();
  }

  return cachedClient;
};

const createClient = () => {
  const client = axios.create();
  client.defaults.headers.common.Accept = 'application/json';
  client.defaults.headers.post['Content-Type'] = 'application/json';

  const loaderStore = useLoaderStore();
  const authStore = useAuthStore();
  client.interceptors.request.use((config) => {
    loaderStore.started();

    if (authStore.jwt) {
      config.headers.authorization = `Bearer ${authStore.jwt}`;
    }

    return config;
  }, (err) => {
    console.error(err);
    loaderStore.finished();
    return Promise.reject(err);
  });

  // Any status within 2xx lies here
  client.interceptors.response.use((resp) => {
    loaderStore.finished();
    return resp;
  }, async (err) => {
    const logAndExit = () => {
      console.error(err);
      loaderStore.finished();
      return Promise.reject(err);
    };

    if (err.response.status !== 401) {
      return logAndExit();
    }

    const refreshToken = authStore.refreshToken;
    if (!refreshToken) {
      return logAndExit();
    }

    // Do not use this axios instance for the refresh token
    // If this request fail and we use the same instance,
    // we could be stuck in an infinte loop
    try {
      const response = await axios.post('/api/token/refresh', { refreshToken });
      const tokens = response.data.data;

      authStore.setJWT(tokens);
      err.config.headers.authorization = `Bearer ${tokens.accessToken}`;
      const retryResp = await axios.request(err.config);
      loaderStore.finished();
      return retryResp;
    } catch (retryError) {
      console.warn('Error retrying after refresh token update');
      console.warn(retryError);
      const toast = useToast();
      toast.info(t('auth.sessionExpired'));
      const router = useRouter();
      await router.push({ name: 'HomePage' });
      return await logAndExit();
    }
  });

  return client;
};

export default {
  createClient, // exposed for testing only
  get
};
