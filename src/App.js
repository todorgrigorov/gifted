import React from 'react';
import { Block } from 'baseui/block';

import Header from './components/header';
import Feed from './components/feed';

export default class App extends React.Component {
  state = {
  }

  render() {
    return (
      <Block>
        <Header />
        <Feed />
      </Block>
    );
  }
}
