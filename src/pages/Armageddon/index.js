import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Card,
  Tabs,
  Badge,
} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Repo from '@/components/Armageddon/repo';
import * as u from '@/utils/utils';
import * as _ from 'lodash';

import styles from './index.less';

const timeAgo = require('time-ago');

const { TabPane } = Tabs;

@connect(({ loading, armageddon }) => ({
  loading: loading.effects['armageddon/fetch'],
  armageddon,
}))
class Armageddon extends Component {
  constructor(props) {
    super(props);
    u.log('In armageddon constructor');
  }

  state = {
    loading: true,
    tabKey: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'armageddon/fetch',
      });
      this.timeoutId = setTimeout(() => {
        this.setState({
          loading: false,
        });
      }, 600);
    });
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  handleTabChange = key => {
    this.setState({
      tabKey: key,
    });
  };

  render() {
    const { loading: propsLoding } = this.state;
    const { loading: stateLoading, armageddon } = this.props;
    const loading = propsLoding || stateLoading || _.get(this.state, 'armageddon.loading', false);

    const repos = _.get(armageddon, 'repos', []);
    return (
      <GridContent>
        <Card className={styles.armageddon} loading={loading}>
          <Tabs onChange={this.handleTabChange}>
            {repos.map((repo) => (
              <TabPane
                key={repo.repoName}
                tab={
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 style={{ marginBottom: '0' }}>{repo.repoName} {repo.commits.find(c => !c.reviewed) && <Badge status="processing" />}</h3>
                    <span className={styles.lastModified}>Pushed: {timeAgo.ago(+_.get(repo, 'commits[0].timestamp', 0))}</span>
                    {/* <span className={styles.lastModified}>
                      {u.timestampToStr(_.get(repo, 'commits[0].timestamp', 0)).substring(16)}
                    </span>
                    <span className={styles.lastModified}>
                      {u.timestampToStr(_.get(repo, 'commits[0].timestamp', 0)).substring(0, 15)}
                    </span> */}
                  </div>
                }
              >
                <Repo repo={repo} />
              </TabPane>
            ))}
          </Tabs>
        </Card>
      </GridContent>
    );
  }
}

export default Armageddon;
