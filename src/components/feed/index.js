import React, { Component } from 'react';
import { styled } from 'baseui';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { Block } from 'baseui/block';
import BottomScrollListener from 'react-bottom-scroll-listener';
import { Spinner } from 'baseui/spinner';
import { Heading, HeadingLevel } from 'baseui/heading';

import ImageList from './ImageList';
import http from '../../services/http';
import apiRoutes from '../../config/api-routes';
import envConfig from '../../config/env-config';
import events from '../../config/events';
import urlBuilder from '../../services/url-builder';
import eventEmitter from '../../services/event-emitter';

const config = {
    PAGE_LIMIT: 15,
    DEFAULT_IMAGE_SIZE: 500
};

export default class Feed extends Component {
    state = {
        gifs: [],
        pageOffset: 0,
        search: '',
        view: 'single',
        searchNoDataFound: false,
        allDataLoaded: false
    }

    async componentWillMount() {
        eventEmitter.addListener(events.search, async data => {
            if (this.state.search !== data.search) {
                this.setState({
                    search: data.search,
                    pageOffset: 0,
                    gifs: []
                }, this.loadData.bind(this));
            }
        });

        eventEmitter.addListener(events.viewToggle, data => {
            window.scrollTo(0, 0);

            this.setState({
                view: data.view
            });
        });

        await this.loadData();
    }

    render() {
        const isSingle = this.state.view === 'single';

        const itemProps = {
            display: 'flex',
            alignItems: 'start',
            justifyContent: 'center',
        };

        const narrowItemProps = {
            ...itemProps,
            overrides: {
                Block: {
                    style: ({ $theme }) => ({
                        width: $theme.sizing.scale4800,
                        flexGrow: 0,
                    }),
                },
            },
        };

        if (this.state.searchNoDataFound) {
            return (
                <Block display='grid' justifyItems='center' paddingTop='100px'>
                    <HeadingLevel>
                        <Heading styleLevel={4}>No GIFs found for keyword '{this.state.search}'.</Heading>
                    </HeadingLevel>
                </Block>
            )
        } else {
            return (
                <Block paddingTop='100px' paddingBottom='100px'>
                    <BottomScrollListener offset={0} debounce={0} onBottom={this.onScrollToBottom.bind(this)} />

                    {this.state.gifs && isSingle &&
                        <ImageList showProgress={!this.state.allDataLoaded} size='medium' gifs={this.state.gifs} />
                    }

                    {this.state.gifs && !isSingle &&
                        <FlexGrid
                            flexGridColumnCount={5}
                            flexGridColumnGap="scale800">

                            <FlexGridItem {...itemProps}></FlexGridItem>

                            <FlexGridItem {...narrowItemProps}>
                                <ImageList size='small' gifs={this.getListItems(1)} />
                            </FlexGridItem>
                            <FlexGridItem {...narrowItemProps}>
                                <ImageList showProgress size='small' gifs={this.getListItems(2)} />
                            </FlexGridItem>
                            <FlexGridItem {...narrowItemProps}>
                                <ImageList size='small' gifs={this.getListItems(3)} />
                            </FlexGridItem>

                            <FlexGridItem {...itemProps}></FlexGridItem>

                        </FlexGrid>}
                </Block>
            )
        }
    }

    getListItems(listIndex) {
        const result = [];
        for (let i = listIndex - 1; i < this.state.gifs.length; i += 3) {
            result.push(this.state.gifs[i]);
        }
        return result;
    }

    async loadData() {
        if (this.state.search) {
            await this.requestData(apiRoutes.SEARCH);
        } else {
            await this.requestData(apiRoutes.TRENDING);
        }

        this.setState(old => {
            return {
                pageOffset: old.pageOffset + config.PAGE_LIMIT
            }
        });
    }

    async onScrollToBottom() {
        if (this.state.gifs.length > 0) {
            await this.loadData();
        }
    }

    async requestData(endpoint) {
        const request = {
            'api_key': envConfig.api.key,
            'limit': config.PAGE_LIMIT,
            'offset': this.state.pageOffset
        };

        if (this.state.search) {
            request.q = this.state.search;
        }

        const url = urlBuilder.build(`${apiRoutes.GIFS}${endpoint}`, request);
        const result = await http.request(url);
        if (result && result.isOkay) {
            if (result.data.data.length > 0) {
                this.setState(old => {
                    const gifs = old.gifs.concat(this.mapGifsData(result.data.data));
                    return {
                        allDataLoaded: result.data.pagination.total_count === gifs.length,
                        searchNoDataFound: false,
                        gifs
                    }
                });
            } else if (this.state.search && this.state.gifs.length === 0) {
                this.setState({ searchNoDataFound: true });
            }
        } else {
            // TODO: failed request -- show error message 
        }
    }

    mapGifsData(data) {
        return data.map(g => {
            return {
                id: g.id,
                imageUrlSmall: g.images.fixed_width.url,
                imageUrlMedium: g.images.downsized.url,
                imageHeightSmall: g.images.fixed_width.height,
                imageWidthSmall: g.images.fixed_width.width,
                imageWidthMedium: config.DEFAULT_IMAGE_SIZE,
                imageHeightMedium: config.DEFAULT_IMAGE_SIZE - Math.abs(g.images.downsized.height - g.images.downsized.width)
            }
        });
    }
}