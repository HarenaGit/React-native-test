import React from 'react';
import { View } from 'react-native';
import Header from '../../../presentation/layouts/header';
import IconButton from '../../../presentation/components/IconButton';
import Typography from '../../../presentation/components/Typography';


const BasicHeader = ({
    onLeftButtonPress,
    onRightButtonPress,
    title,
    LeftIcon = () => (<></>),
    RightIcon = () => (<></>),
    leftStyle = {},
    rightStyle = {},
    includeSearch = false,
    SearchIcon = () => (<></>),
    onSearch = () => { },
    searchStyle = {},
    rightBadge
}) => {
    return (
        <Header
            LeftComponent={() => (
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                    <IconButton style={leftStyle} onPress={onLeftButtonPress}>
                        <LeftIcon />
                    </IconButton>
                    <Typography style={{ marginLeft: 20 }} numberOfLines={1} variant="title">{title}</Typography>
                </View>
            )}

            RightComponent={() => (
                <View style={{ flexDirection: "row" }}>
                    {includeSearch && <IconButton style={[{ marginRight: 10 }, searchStyle]} onPress={onSearch} ><SearchIcon /></IconButton>}
                    <IconButton style={rightStyle} badge={rightBadge} onPress={onRightButtonPress}>
                        <RightIcon />
                    </IconButton>
                </View>
            )}
        />
    )
}

export default BasicHeader;