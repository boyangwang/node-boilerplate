import { stringify } from 'qs';
import request from '@/utils/request';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import * as u from '@/utils/utils';

export const graphqlClient = new ApolloClient({
  uri: `//${window.location.hostname}:4200/`,
});

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  // return request('/api/notices');
  return graphqlClient.query({
    query: gql`{
      notices {
        id
        avatar
        title
        description
        extra
        status
        type
        datetime
        read
      }
    }`,
  }).catch((err) => {
    u.log("Failed: queryNotices graphql", err);
    return {
      data: [],
      loading: false,
      stale: false,
      err,
    };
  });
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

export async function getArmageddon() {
  // return graphqlClient.query({
  //   query: gql`{
  //     repos {
  //       name
  //       remotes {
  //         name
  //         url
  //       }
  //       commits {
  //         reviewed
  //         hash
  //         timestamp
  //         author
  //         message
  //       }
  //     }
  //   }`,
  return request('http://localhost:4200/graphql', {
    method: 'POST'
  }).catch((err) => {
    u.log("Failed: getArmageddon graphql", err);
    return {
      data: [],
      loading: false,
      stale: false,
      err,
    };
  });
}

export async function reviewCommit(reviewRepoName, commits) {
  request('http://localhost:4200/graphql/review', {
    method: 'POST',
    body: {
      reviewRepoName, reviewCommits: commits
    }
  }).catch((err) => {
    u.log("Failed: reviewCommit graphql", err);
    return {
      data: [],
      loading: false,
      stale: false,
      err,
    };
  });
  // return Promise.resolve({
  //   networkStatus: 7
  // });
}
