<!-- Licensed to the Apache Software Foundation (ASF) under one or more
contributor license agreements.  See the NOTICE file distributed with
this work for additional information regarding copyright ownership.
The ASF licenses this file to You under the Apache License, Version 2.0
(the "License"); you may not use this file except in compliance with
the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. -->

<template>
  <div class="rk-profile-header">
    <div>
      <a class="rk-new-task-btn r" @click="showDialogTask">
        <span class="mr-5 vm">{{ this.$t('newTask') }}</span>
      </a>
      <a class="rk-profile-header-btn bg-blue r mr-10" @click="searchTask">
        <svg class="icon mr-5 vm">
          <use xlink:href="#search"></use>
        </svg>
        <span class="vm">{{ this.$t('search') }}</span>
      </a>
      <div class="flex-h">
        <TraceSelect
          :hasSearch="true"
          :title="this.$t('service')"
          :value="headerSource.currentService"
          @input="chooseService"
          :data="headerSource.serviceSource"
        />
        <div class="mr-10" style="padding: 3px 15px 0">
          <div class="sm grey">{{ this.$t('endpointName') }}</div>
          <input type="text" v-model="endpointName" class="rk-profile-header-input" />
        </div>
      </div>
      <rk-sidebox class="profile-task-box" width="600px" :title="this.$t('newTask')" :show.sync="dialogVisible">
        <ProfileTask :taskFieldSource="taskFieldSource" :newTaskFields="newTaskFields" @closeSidebox="closeSidebox" />
      </rk-sidebox>
    </div>
  </div>
</template>

<script lang="ts">
  import { Duration, Option } from '@/types/global';
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { Mutation } from 'vuex-class';
  import TraceSelect from '../common/trace-select.vue';
  import ProfileTask from './profile-task.vue';

  @Component({ components: { TraceSelect, ProfileTask } })
  export default class ProfileHeader extends Vue {
    @Prop() private headerSource: any;
    @Prop() private newTaskFields: any;
    @Prop() private taskFieldSource: any;
    @Mutation('profileStore/SET_HEADER_SOURCE') private SET_HEADER_SOURCE: any;

    private endpointName: string = '';
    private dialogVisible = false;
    private serviceOpt: any;

    private dateFormat(date: Date, step: string) {
      const year = date.getFullYear();
      const monthTemp = date.getMonth() + 1;
      let month: string = `${monthTemp}`;
      if (monthTemp < 10) {
        month = `0${monthTemp}`;
      }
      if (step === 'MONTH') {
        return `${year}-${month}`;
      }
      const dayTemp = date.getDate();
      let day: string = `${dayTemp}`;
      if (dayTemp < 10) {
        day = `0${dayTemp}`;
      }
      if (step === 'DAY') {
        return `${year}-${month}-${day}`;
      }
      const hourTemp = date.getHours();
      let hour: string = `${hourTemp}`;
      if (hourTemp < 10) {
        hour = `0${hourTemp}`;
      }
      if (step === 'HOUR') {
        return `${year}-${month}-${day} ${hour}`;
      }
      const minuteTemp = date.getMinutes();
      let minute: string = `${minuteTemp}`;
      if (minuteTemp < 10) {
        minute = `0${minuteTemp}`;
      }
      if (step === 'MINUTE') {
        return `${year}-${month}-${day} ${hour}${minute}`;
      }
    }

    private globalTimeFormat(time: Date[]) {
      return {
        start: time[0].getTime(),
        end: time[1].getTime(),
      };
    }

    private chooseService(item: { key: string; label: string }) {
      this.SET_HEADER_SOURCE({ currentService: item });
    }

    private searchTask() {
      this.SET_HEADER_SOURCE({ endpointName: this.endpointName });
      this.$store.dispatch('profileStore/GET_TASK_LIST');
    }

    private created() {
      this.SET_HEADER_SOURCE({ endpointName: this.endpointName });
    }

    private showDialogTask() {
      this.dialogVisible = true;
    }

    private closeSidebox() {
      this.dialogVisible = false;
    }
  }
</script>

<style lang="scss">
  .rk-profile-header {
    flex-shrink: 0;
    background-color: #333840;
    color: #eee;
    width: 100%;
    padding: 3px 15px 8px;
  }

  .rk-profile-header-input {
    border-style: unset;
    outline: 0;
    padding: 2px 5px;
    border-radius: 3px;
  }

  .rk-profile-header-range,
  .rk-auto-select {
    border-radius: 3px;
    background-color: #fff;
    padding: 1px;
    border-radius: 3px;

    input {
      width: 38px;
      border-style: unset;
      outline: 0;
    }
  }

  .rk-profile-header-btn {
    padding: 3px 9px;
    background-color: #484b55;
    border-radius: 4px;
    margin-top: 12px;

    &.bg-blue {
      background-color: #448dfe;
    }
  }

  .rk-new-task-btn {
    padding: 3px 9px;
    background-color: #484b55;
    border-radius: 4px;
    margin-top: 12px;

    &.bg-warning {
      background-color: #fbb03b;
    }
  }
  .profile-task-box {
    color: #333840;
  }
</style>
