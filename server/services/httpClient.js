import axios, {CreateAxiosDefaults} from "axios";
import {ProxyAgent} from 'proxy-agent';
import * as HttpsProxyAgent from "https-proxy-agent";

export default ({strapi}) => ({
  getHttpClient() {
    const config = strapi.config.get('plugin::strapi-plugin-sso');

    /**
     * @type CreateAxiosDefaults
     */
    const options = {};
    if (config['HTTP_PROXY']) {
      options.httpAgent = new ProxyAgent(config['HTTP_PROXY']);
    }

    if (config['HTTPS_PROXY']) {
      const Agent = HttpsProxyAgent.HttpsProxyAgent;
      options.httpsAgent = new Agent(config['HTTPS_PROXY'])
    }
    return axios.create(options);
  }
});
