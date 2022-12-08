import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import IconButton from '../../components/IconButton';
import SearchInput from '../../components/Input/SearchInput';

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 10,
        marginVertical: 30
    },
    noBorder: {
        borderWidth: 0,
        width: 50,
        height: 50,
    }
})

const SearchHeader = ({ onChange = () => { }, startLoading = () => { }, placeholder = "Search" }) => {
    const navigation = useNavigation();

    const goBack = () => {
        navigation.goBack();
    }

    useEffect(() => {
    }, [])

    return (
        <View style={styles.header} >
            <IconButton style={styles.noBorder} onPress={goBack}>
                <Ionicons
                    name="arrow-back"
                    size={25}
                    color={'rgba(0,0,0,0.8)'}
                />
            </IconButton>
            <SearchInput autoFocus={true} onChangeText={onChange} debounceTime={1000} startLoading={startLoading} style={{ fontSize: 17, fontFamily: "Nunito-Bold", flex: 1 }} placeholder={placeholder} />
        </View>
    )
}

export default SearchHeader;