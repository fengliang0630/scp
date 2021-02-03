import axios from "axios";
import config from '@/config';

const axiosClient = axios.create({
    timeout: config.timeout,
    url: `${config.url}`
});

axiosClient.interceptors.request.use(_config => {
    return _config;
});

axiosClient.interceptors.response.use(
    response => {
      const data = JSON.parse(JSON.stringify(response.data));
      if (data.retCode !== 0) {
        window.$msg.error('接口报错，报错信息');
        return Promise.reject(`接口报错，报错信息`);
      }
      return Promise.resolve(data.result);
    },
    error => {
      alert('请求错误，请您联系管理员，请求错误码');
      return Promise.reject(error);
    }
);

export default {
    post: (_apiUrl, _params) => {
        return axiosClient.post(`${axiosClient.defaults.url}/${_apiUrl}`, _params);
    },
    get: (_apiUrl) => axiosClient.get(`${axiosClient.defaults.url}/${_apiUrl}`)
}



