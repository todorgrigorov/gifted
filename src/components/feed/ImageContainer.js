import React from 'react'
import { styled } from 'baseui';

export default props => {
    const Container = styled('div', ({ $theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: $theme.lighting.shadow500,
        cursor: 'pointer'
    }));

    return (
        <Container onClick={async () => await props.onImageClick(props)} width={props.imageWidth} height={props.imageHeight}>
            <img
                alt={props.id}
                src={props.imageUrl}
                height={props.imageHeight}
                width={props.imageWidth}
            />
        </Container>
    );
}
