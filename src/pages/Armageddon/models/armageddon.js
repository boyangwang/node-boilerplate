import * as api from '@/services/api';
import * as u from '@/utils/utils';

export default {
  namespace: 'armageddon',

  state: {
    repos: [],
    loading: false,
    stale: false,
    networkStatus: -1,
    err: null,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(api.getArmageddon);
      yield put({
        type: 'saveArmageddon',
        payload: response,
      });
    },
    *review({ payload }, { call, put }) {
      const { repo, commits } = payload;
      const response = yield call(api.reviewCommit, repo.repoName, commits);
      u.log('review', response)
      yield put({
        type: 'reviewCommit',
        payload: {
          repo,
          commits,
        }
      });
    },
  },

  reducers: {
    saveArmageddon(state, action) {
      return {
        ...state,
        repos: action.payload,
      };
    },
    reviewCommit(state, action) {
      const { commits, repo } = action.payload;
      const newState = { ...state };
      const newRepo = { ...repo };
      const repoIdx = newState.repos.findIndex(r => r.name === newRepo.name);
      newState.repos[repoIdx] = newRepo;

      const newCommits = [...newRepo.commits];
      commits.forEach(cA => {
        const newCommit = Object.assign({}, cA, { reviewed: !cA.reviewed });
        const idx = newCommits.findIndex(cB => cB.hash === cA.hash);
        newCommits[idx] = newCommit;
      });
      newRepo.commits = newCommits;
      return newState;
    }
  },
};
