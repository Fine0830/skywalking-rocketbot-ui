/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Vue from 'vue';
import moment from 'dayjs';
import clickout from '@/utils/clickout';
import tooltip from '@/utils/tooltip';
import zh from '@/assets/lang/zh';
import en from '@/assets/lang/en';
import VueI18n from 'vue-i18n';
import eventBus from './event-bus';
import App from './App.vue';
import router from './router';
import store from './store';
import components from './components';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/graph';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/scatter';
import 'echarts/lib/chart/heatmap';
import 'echarts/lib/chart/sankey';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import VModal from 'vue-js-modal';
import { queryOAPTimeInfo } from './utils/localtime';
import ClientMonitor from '../node_modules/skywalking-client-js/src/index';
import './assets';

Vue.use(eventBus);
Vue.use(VueI18n);
Vue.use(components);
Vue.use(VModal, { dialog: true });
Vue.directive('clickout', clickout);
Vue.directive('tooltip', tooltip);

Vue.filter('dateformat', (dataStr: any, pattern: string = 'YYYY-MM-DD HH:mm:ss') => moment(dataStr).format(pattern));

const savedLanguage = window.localStorage.getItem('lang');
let language = navigator.language.split('-')[0];
if (!savedLanguage) {
  window.localStorage.setItem('lang', language);
}
language = savedLanguage ? savedLanguage : language;

const i18n = new VueI18n({
  locale: language,
  messages: {
    zh,
    en,
  },
});

if (!window.Promise) {
  window.Promise = Promise;
}

Vue.config.productionTip = false;

ClientMonitor.register({
  collector: 'http://hz.zhangwei.asia:32800',
  service: 'rocketbot-ui',
  pagePath: '/dasboard',
  serviceVersion: 'v1.0.0',
  autoTracePerf: false,
});

// fetch('/graphql', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({
//     query: "query queryServices($duration: Duration!,$keyword: String!) {\n    services: getAllServices(duration: $duration, group: $keyword) {\n      key: id\n      label: name\n      group\n    }\n  }",
//     variables: {"duration":{"start":"2020-12-23 1503","end":"2020-12-23 1603","step":"MINUTE"},"keyword":""},
//   })
// }).then((data) => {
//   console.log(data);
// })

queryOAPTimeInfo().then(() => {
  new Vue({
    i18n,
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app');
});
