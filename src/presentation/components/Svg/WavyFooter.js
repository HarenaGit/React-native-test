import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const WavyFooter = ({
    style,
    height,
    bottom,
    bgColor,
    wavePattern
}) => {
    return (
        <View style={style}>
            <View style={{ height: height }}>
                <Svg
                    height="100%"
                    width="100%"
                    viewBox="0 0 1440 320"
                    style={{ position: 'absolute', bottom: bottom }}
                >
                    <Path fill={bgColor} d={wavePattern} />
                </Svg>
            </View>
        </View>
    );
}

export default WavyFooter;