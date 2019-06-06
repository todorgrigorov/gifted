import React from 'react'
import { styled } from 'baseui';
import { Block } from 'baseui/block';
import { Spinner } from 'baseui/spinner';

import ImageContainer from './ImageContainer';

export default props => {
    const gridProps = {
        display: "grid",
        justifyItems: "center",
        alignItems: "center",
        gridRowGap: "scale600",
    };

    return (
        <Block {...gridProps}>
            {props.gifs &&
                props.gifs.map(gif =>
                    <ImageContainer
                        key={gif.id}
                        id={gif.id}
                        imageUrl={props.size === 'medium' ? gif.imageUrlMedium : gif.imageUrlSmall}
                        imageWidth={props.size === 'medium' ? gif.imageWidthMedium : gif.imageWidthSmall}
                        imageHeight={props.size === 'medium' ? gif.imageHeightMedium : gif.imageHeightSmall}
                    />
                )}

            {props.showProgress &&
                <Spinner />}
        </Block>
    );
}
