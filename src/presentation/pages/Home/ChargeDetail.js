import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, FlatList, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';

import isCloseToBottom from '../../../common/utils/IsScrollViewCloseReachedEnd';

import IconButton from '../../components/IconButton';
import Typography from '../../components/Typography';
import Button from '../../components/Button';
import Input from '../../components/Input';
import ImageInput from '../../components/ImageInput';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 20,
        marginTop: 10
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 50
    },
    clientInfo: {

    }
})

const ChargeDetail = ({
    title = "",
    onClose = () => { },
    addKey = [],
    onAdd = (data) => { },
    isLoadingAdd = false,
    dataList = [],
    isLoadingDataList = false,
    renderDataListItem = ({ item, index }) => (<></>),
    onChargeUpdate = (id, price) => { },
    isLoadingUpdate = false,
    onScrollEnd = (month, year) => { },
    currentDate = {
        month: moment().month() + 1,
        year: moment().year(),
    },
    getData = (month, year) => { },
    totalElements = 0,
    pageSize = 0,
    isResetAddData = false
}) => {

    const createAddData = () => {
        let d = {
            photos: []
        }
        for (let i = 0; i < addKey.length; i++) {
            d = {
                ...d,
                [addKey[i].value]: ""
            }
        }
        return d
    }

    const [addData, setAddData] = useState([{
        ...createAddData()
    }])

    const [viewList, setViewList] = useState(true);

    const [currentDateState, setCurrentDateState] = useState(currentDate);

    const onAddButtonPressed = () => {
        setAddData([
            {
                ...createAddData()
            },
            ...addData
        ])
    }

    const onSave = () => {
        onAdd(addData);
    }

    const onSelectChange = (item, value) => {
        setCurrentDateState({
            ...currentDateState,
            month: item
        })
        getData(item, currentDate.year);
    }

    const onAddChange = (e, index, name) => {
        setAddData((addData || []).map((value, idx) => {
            if (index === idx) {
                value[name] = e;
            }
            return value;
        }));
    }

    const onDeleteAdd = (index) => {
        if (addData.length <= 1) {
            Alert.alert("Warning", "You can't perform this action since you have only one input list");
            return;
        }
        setAddData((addData || []).filter((value, idx) => index !== idx))
    }

    const monthIndex = [
        { label: "January", value: 1 }, { label: "February", value: 2 }, { label: "March", value: 3 }, { label: "April", value: 4 },
        { label: "May", value: 5 }, { label: "June", value: 6 }, { label: "July", value: 7 }, { label: "August", value: 8 },
        { label: "September", value: 9 }, { label: "October", value: 10 }, { label: "November", value: 11 }, { label: "December", value: 12 },
    ];

    const onChangeImage = (index, photos) => {
        setAddData((addData || []).map((value, idx) => {
            if (index === idx) {
                value.photos = photos;
            }
            return value;
        }));
    }


    useEffect(() => {
        setCurrentDateState(currentDate);
    }, [currentDate])


    useEffect(() => {
        if (isResetAddData) {
            setAddData([
                {
                    ...createAddData()
                }
            ])
        }
    }, [isResetAddData])

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Typography>{title}</Typography>
                <IconButton onPress={onClose} >
                    <FontAwesome
                        name="close"
                        size={17}
                        color={'gray'}
                    ></FontAwesome>
                </IconButton>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20, marginBottom: 20 }}>

                {!viewList && !isLoadingAdd ? (<IconButton style={{ backgroundColor: "#4eac6d" }} onPress={onAddButtonPressed}>
                    <FontAwesome5
                        name={"plus"}
                        size={17}
                        color={"white"}
                    ></FontAwesome5>
                </IconButton>) : (<>
                    <View style={{ flex: 1 }}>
                        <Picker

                            selectedValue={`${currentDateState.month}`}
                            onValueChange={onSelectChange}
                            style={{ color: "#000000" }}
                            dropdownIconColor="#000000"
                        >
                            {monthIndex.map((value, index) => {
                                return <Picker.Item key={`index-month-${index}`} label={`${value.label}`} value={`${value.value}`} />
                            })}
                        </Picker>
                    </View>
                    <View style={{ flex: 1, marginLeft: 30 }}>
                        <Picker

                            selectedValue={`${currentDateState.year}`}
                            onValueChange={(item, value) => { }}
                            style={{ color: "#000000" }}
                            dropdownIconColor="#000000"
                        >
                            <Picker.Item label={`${currentDateState.year}`} value={`${currentDateState.year}`} />
                        </Picker>
                    </View>
                </>)}

                <IconButton style={{ backgroundColor: "#4eac6d" }} onPress={() => {

                    setViewList(!viewList)
                }}>

                    <FontAwesome5
                        name={!viewList ? "arrow-left" : "arrow-right"}
                        size={17}
                        color={"white"}
                    ></FontAwesome5>
                </IconButton>

            </View>
            {viewList && (<>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
                    <Typography variant="title" style={{ fontSize: 20 }} >Total elements : {totalElements}</Typography>
                    <Typography variant="title" style={{ fontSize: 16, color: "rgba(0,0,0,1)" }} ></Typography>
                </View>
            </>)}
            {viewList && (<>
                {isLoadingDataList ? <View style={{ flex: 1, marginTop: 20, alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#4eac6d" />
                </View> : <>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ marginBottom: 20 }}
                        data={[...dataList, { plusLoader: true }]}
                        onScroll={({ nativeEvent }) => {
                            if (isCloseToBottom(nativeEvent)) {
                                if (dataList.length < totalElements) {
                                    onScrollEnd(currentDate.month, currentDate.year)
                                }
                            }
                        }}
                        keyExtractor={(item, index) => { return `indexOrderScreen-${item?.id}` }}
                        renderItem={({ index, item }) => {
                            if (item.plusLoader) {
                                return <>
                                    {index < (totalElements - pageSize) ?
                                        <View style={{ marginTop: 20, marginBottom: 20, alignItems: "center" }}>
                                            <ActivityIndicator size="large" color="#4eac6d" />
                                        </View> : <></>}</>
                            }
                            return renderDataListItem({ item: item, index: index, month: currentDateState.month, year: currentDateState.year });
                        }
                        } />
                </>}
            </>)}
            {isLoadingAdd ? <>
                <View style={{ flex: 1, marginTop: 20, alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#4eac6d" />
                </View>
            </> : <>
                {!viewList && (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps='always'
                    >
                        {(addData || []).map((val, index) => {
                            return (
                                <View key={`index-add-raw-material${index}`} >
                                    <View style={{ flex: 1 }} >
                                        <ImageInput key={`images-${index}`} imagesData={val.photos} onChange={(photos) => { onChangeImage(index, photos) }} />
                                        {(addKey || []).map((value, idx) => {
                                            return (
                                                <View key={`index-add-raw-material-input${index}${idx}`} >
                                                    <Input label={`${value?.label}`} keyboardType={`${value?.keyboardType || "default"}`} onChangeText={(e) => onAddChange(e, index, `${value?.value}`)} value={val[`${value.value}`]} style={{ marginLeft: 10 }} />
                                                </View>
                                            )
                                        })}
                                    </View>
                                    <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "flex-end" }} >
                                        <TouchableOpacity style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center" }} onPress={() => onDeleteAdd(index)}>
                                            <FontAwesome5
                                                name={"trash"}
                                                size={17}
                                                color={"black"}
                                            ></FontAwesome5>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        })}
                    </ScrollView>
                )}
                {!viewList && (<Button title="Save" onPress={onSave} icon="save" style={{ marginTop: 20, marginBottom: 20 }} />)}
            </>}

        </View >
    )
}

export default ChargeDetail;