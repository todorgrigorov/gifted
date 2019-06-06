import * as React from 'react';
import {
    HeaderNavigation,
    ALIGN,
    StyledNavigationItem as NavigationItem,
    StyledNavigationList as NavigationList,
} from 'baseui/header-navigation';
import { StyledLink as Link } from 'baseui/link';
import { Search, Menu, CheckIndeterminate } from 'baseui/icon';
import { StatefulInput } from 'baseui/input';
import { Block } from 'baseui/block';
import { Button } from 'baseui/button';

import http from '../../services/http';
import apiRoutes from '../../config/api-routes';
import eventEmitter from '../../services/event-emitter';
import events from '../../config/events';

const config = {
};

export default class Header extends React.Component {
    state = {
        search: '',
        view: 'single'
    }

    async componentWillMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <HeaderNavigation overrides={{
                Root: {
                    style: ({ $theme }) => ({
                        width: '100%',
                        position: 'fixed',
                        backgroundColor: $theme.colors.mono100
                    })
                }
            }}>
                <NavigationList $align={ALIGN.left}>
                    <NavigationItem>
                        <Link href="/">gifted</Link>
                    </NavigationItem>
                </NavigationList>
                <NavigationList $align={ALIGN.center} />
                <NavigationList $align={ALIGN.right} style={{ paddingRight: 0 }}>
                    <Block
                        width={['200px', '400px', '500px', '600px']}>
                        <NavigationItem>
                            <StatefulInput
                                value={this.state.search}
                                onChange={this.onSearchChange.bind(this)}
                                onBlur={this.onSearchBlur.bind(this)}
                                endEnhancer={<Search size="18px" />}
                                placeholder="Search..."
                            />
                        </NavigationItem>
                    </Block>
                </NavigationList>
                <NavigationList $align={ALIGN.right}>
                    <Block
                        marginRight="scale600">
                        <NavigationItem>
                            <Button
                                onClick={this.onToggleClick.bind(this)}
                                startEnhancer={() => {
                                    return this.state.view === 'single' ?
                                        <Menu size={24} /> :
                                        <CheckIndeterminate size={24} />
                                }}>
                                Toggle view
                                </Button>
                        </NavigationItem>
                    </Block>
                </NavigationList>
            </HeaderNavigation>
        );
    }

    onSearchChange(e) {
        this.setState({
            search: e.target.value
        })
    }

    onToggleClick() {
        const view = this.state.view === 'single' ? 'triple' : 'single';

        this.setState({
            view
        });

        eventEmitter.emit(events.viewToggle, { view });
    }

    onSearchBlur() {
        eventEmitter.emit(events.search, { search: this.state.search });
    }
}