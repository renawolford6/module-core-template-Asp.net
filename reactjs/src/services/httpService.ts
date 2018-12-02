import axios from 'axios';
import AppConsts from './../lib/appconst';
import { Modal } from 'antd';
import { L } from 'src/lib/abpUtility';

const http = axios.create({
  baseURL: AppConsts.remoteServiceBaseUrl,
  timeout: 30000,
});

http.interceptors.request.use(
  function(config) {
    if (!!abp.auth.getToken()) {
      config.headers.common['Authorization'] = 'Bearer ' + abp.auth.getToken();
    }

    config.headers.common['.AspNetCore.Culture'] = abp.utils.getCookieValue('Abp.Localization.CultureName');
    config.headers.common['Abp.TenantId'] = abp.multiTenancy.getTenantIdCookie();

    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (!!error.response && !!error.response.data.error && !!error.response.data.error.message && error.response.data.error.details) {
      Modal.error({
        title: error.response.data.error.message,
        content: error.response.data.error.details,
      });
    } else if (!!error.response && !!error.response.data.error && !!error.response.data.error.message) {
      Modal.error({
        title: L('LoginFailed'),
        content: error.response.data.error.message,
      });
      console.log(`title: Login Failed content:$`);
    } else if (!error.response) {
      Modal.error({ content: L('UnknownError') });
    }
    setTimeout(() => {
      // Modal.destroy();
    }, 1000);
    return Promise.reject(error);
  }
);

export default http;
