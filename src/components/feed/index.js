import React, { Component } from 'react';
import { styled } from 'baseui';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { Block } from 'baseui/block';
import BottomScrollListener from 'react-bottom-scroll-listener';
import { Spinner } from 'baseui/spinner';
import { Heading, HeadingLevel } from 'baseui/heading';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalButton,
} from 'baseui/modal';

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
        allDataLoaded: false,
        imageModalOpen: false,
        imageModalTitle: '',
        imageModalHeight: 0,
        imageModalWidth: 0,
        imageModalUrl: '',
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
        if (this.state.searchNoDataFound) {
            return (
                <Block display='grid' justifyItems='center' paddingTop='100px'>
                    <HeadingLevel>
                        <Heading styleLevel={4}>No GIFs found for keyword '{this.state.search}'.</Heading>
                    </HeadingLevel>
                </Block>
            )
        } else {
            return this.renderLists();
        }
    }

    renderLists() {
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

        return (
            <Block paddingTop='100px' paddingBottom='100px'>
                {this.renderImageModal()}

                <BottomScrollListener offset={0} debounce={0} onBottom={this.onScrollToBottom.bind(this)} />

                {this.state.gifs && isSingle &&
                    <ImageList onImageClick={this.onImageClick.bind(this)} showProgress={!this.state.allDataLoaded} size='medium' gifs={this.state.gifs} />
                }

                {this.state.gifs && !isSingle &&
                    <FlexGrid
                        flexGridColumnCount={5}
                        flexGridColumnGap="scale800">

                        <FlexGridItem {...itemProps}></FlexGridItem>

                        <FlexGridItem {...narrowItemProps}>
                            <ImageList onImageClick={this.onImageClick.bind(this)} size='small' gifs={this.getListItems(1)} />
                        </FlexGridItem>
                        <FlexGridItem {...narrowItemProps}>
                            <ImageList onImageClick={this.onImageClick.bind(this)} showProgress size='small' gifs={this.getListItems(2)} />
                        </FlexGridItem>
                        <FlexGridItem {...narrowItemProps}>
                            <ImageList onImageClick={this.onImageClick.bind(this)} size='small' gifs={this.getListItems(3)} />
                        </FlexGridItem>

                        <FlexGridItem {...itemProps}></FlexGridItem>

                    </FlexGrid>}
            </Block>
        )
    }

    renderImageModal() {
        return (
            <Modal
                // the modal gets clipped on the right for no reason so add additional 50 pixel
                size={this.getImageModalWidth() + 50}
                onClose={() => this.onImageModalClose()}
                isOpen={this.state.imageModalOpen} >
                <ModalHeader>{this.state.imageModalTitle}</ModalHeader>
                <ModalBody>
                    <img
                        alt={this.state.imageModalTitle}
                        src={this.state.imageModalUrl}
                        height={this.getImageModalHeight()}
                        width={this.getImageModalWidth()}
                    />
                </ModalBody>
            </Modal>
        )
    }

    getImageModalHeight() {
        if (this.state.imageModalHeight <= 450) {
            return this.state.imageModalHeight * 2;
        } else if (this.state.imageModalHeight > window.outerHeight) {
            return window.outerHeight;
        } else {
            return this.imageModalHeight;
        }
    }
    getImageModalWidth() {
        if (this.state.imageModalWidth <= 450) {
            return this.state.imageModalWidth * 2;
        } else if (this.state.imageModalWidth > window.outerWidth) {
            return window.outerWidth;
        } else {
            return this.imageModalWidth;
        }
    }

    async onImageClick(data) {
        this.setState({
            imageModalOpen: true,
            imageModalTitle: data.title,
            imageModalHeight: data.imageHeightOriginal,
            imageModalWidth: data.imageWidthOriginal,
            imageModalUrl: data.imageUrlOriginal
        })
    }

    onImageModalClose() {
        this.setState({
            imageModalOpen: false,
            imageModalTitle: '',
            imageModalHeight: 0,
            imageModalWidth: 0,
            imageModalUrl: ''
        })
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
            return this.mapGifData(g);
        });
    }

    mapGifData(g) {
        return {
            id: g.id,
            title: g.title,
            imageUrlSmall: g.images.fixed_width.url,
            imageUrlMedium: g.images.downsized.url,
            imageUrlOriginal: g.images.original.url,
            imageHeightOriginal: g.images.original.height,
            imageWidthOriginal: g.images.original.width,
            imageHeightSmall: g.images.fixed_width.height,
            imageWidthSmall: g.images.fixed_width.width,
            imageWidthMedium: config.DEFAULT_IMAGE_SIZE,
            imageHeightMedium: config.DEFAULT_IMAGE_SIZE - Math.abs(g.images.downsized.height - g.images.downsized.width)
        }
    }
}