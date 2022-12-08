import React, { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Alert, ToastAndroid, ActivityIndicator, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import ImageView from "react-native-image-viewing";
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

import useStatistic from '../../../service/applicable/statistic.sa/Statistic.sa';
import useRawMaterial from '../../../service/applicable/rawMaterial.sa/RawMaterial.sa';
import useFixedCharge from '../../../service/applicable/fixedCharge.sa/FixedCharge.sa';
import useVariableCharge from '../../../service/applicable/variableCharge.sa/VariableCharge.sa';

import Typography from '../../components/Typography';
import Cart from '../../components/Cart';
import formatter from '../../../common/utils/formatMoney/FormatMoneyToAED';
import WSConfig from '../../../common/config/WSConfig';

import ChargeDetail from './ChargeDetail';
import Input from '../../components/Input';
import IconButton from '../../components/IconButton';

const styles = StyleSheet.create({
    shadow: {
        borderColor: "rgba(0,0,0,0.2)",
        borderWidth: 1,
        borderStyle: "solid"
    }
})

const FixedChargeDetailListItem = ({ item, index, month, year, setFixedChargeUpdate, onUpdateFixedCharge, FixedChargeUpdate }) => {

    const [imagePreview, setImagePreview] = useState({
        visible: false,
        currentIndex: 0,
        images: []
    });

    const onPreview = () => {
        const images = item?.fixedChargeImages;
        let currentImages = []
        for (const img of images) {
            currentImages.push({
                uri: `${WSConfig.previewImageURL}/${img?.filename}`
            });
        }
        setImagePreview({
            ...imagePreview,
            images: currentImages,
            visible: true
        });
    }

    return (
        <View style={[styles.shadow, { height: 250, borderRadius: 10, marginBottom: 20, position: "relative", overflow: "visible" }]}>
            <ImageView
                images={imagePreview.images}
                imageIndex={imagePreview.currentIndex}
                visible={imagePreview.visible}
                onRequestClose={() => { setImagePreview({ ...imagePreview, visible: false }) }}
            />
            <IconButton style={{ backgroundColor: "#4eac6d", position: "absolute", right: 0, top: 0, zIndex: 10 }} onPress={onPreview}>
                <Ionicons
                    name="image"
                    size={25}
                    color={'white'}
                ></Ionicons>
            </IconButton>
            <View style={{ marginLeft: 20, marginRight: 20, marginVertical: 20 }} >
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row" }}>
                        <Typography style={{ fontSize: 14 }}  >Load Nature : </Typography>
                        <Typography style={{ fontSize: 14 }} variant="subTitle" numberOfLines={2} >{item?.loadNature}</Typography>
                    </View>
                </View>
                <View style={{ flexDirection: "row", marginTop: 20 }}>
                    <Typography style={{ fontSize: 14 }}  >Payement Date : </Typography>
                    <Typography style={{ fontSize: 14 }} variant="subTitle" numberOfLines={2} >{item?.payementDate}</Typography>
                </View>
                <View style={{ flexDirection: "row", marginTop: 20 }}>
                    <Typography style={{ fontSize: 14 }}  >Number of photos : </Typography>
                    <Typography style={{ fontSize: 14 }} variant="subTitle" numberOfLines={2} >{item?.fixedChargeImages?.length}</Typography>
                </View>
                <View style={{ flexDirection: "row", marginTop: 20, marginBottom: 10 }}>
                    <Typography style={{ fontSize: 14 }}  >Creator : </Typography>
                    <Typography style={{ fontSize: 14 }} variant="subTitle" numberOfLines={2} >{item?.creator?.firstName} {" "} {item?.creator?.name}</Typography>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    {FixedChargeUpdate.isLoading ? <>
                        <View style={{ flex: 1, marginTop: 20, alignItems: "center" }}>
                            <ActivityIndicator size="small" color="#4eac6d" />
                        </View>
                    </> : <>
                        <Input label="Price : " onChangeText={(e) => {

                            setFixedChargeUpdate({
                                id: item?.id,
                                price: e
                            });
                        }} defaultValue={`${item?.price}`} style={{ height: 75, flex: 1 }} keyboardType="numeric" />
                        <TouchableOpacity style={{ width: 50, height: 50, marginLeft: 20, justifyContent: "center", alignItems: "center" }} onPress={() => onUpdateFixedCharge(item?.id, month, year)}>
                            <FontAwesome5
                                name={"pen"}
                                size={17}
                                color={"#4eac6d"}
                            ></FontAwesome5>
                        </TouchableOpacity>
                    </>}
                </View>
            </View>
        </View>
    )
}


const Statistic = ({ isActive = false }) => {

    const { getTurnOver, getReduction } = useStatistic();
    const { addRawMaterial, getRawMaterial, getSumRawMaterial, updateRawMaterial } = useRawMaterial();
    const { addFixedCharge, getFixedCharge, getSumFixedCharge, updateFixedCharge } = useFixedCharge();
    const { addVariableCharge, getSumVariableCharge, getVariableCharge, updateVariableCharge } = useVariableCharge();

    const [turnOver, setTurnOver] = useState(0);
    const [reduction, setReduction] = useState(0);
    const [rawMaterial, setRawMaterial] = useState(0);
    const [fixedCharge, setFixedCharge] = useState(0);
    const [variableCharge, setVariableCharge] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [currentTurnOverDate, setCurrentTurnOverDate] = useState({
        month: moment().month() + 1,
        year: moment().year(),
    });
    const [currentReductionDate, setCurrentReductionDate] = useState({
        month: moment().month() + 1,
        year: moment().year(),
    });
    const [currentRawMaterialDate, setCurrentRawMaterialDate] = useState({
        month: moment().month() + 1,
        year: moment().year(),
    });
    const [isLoadingTurnOver, setIsLoadingTurnOver] = useState(false);
    const [isLoadingReduction, setIsLoadingReduction] = useState(false);
    const [isLoadingRawMaterial, setIsLoadingRawMaterial] = useState(false);

    const [isVisibleRawMaterial, setIsVisibleRawMaterial] = useState(false);

    const [addRawMaterialInfo, setAddRawMaterialInfo] = useState({
        isLoading: false,
        isReset: false,
    });

    const [rawMaterialList, setRawMaterialList] = useState({
        data: [],
        isLoading: false,
        totalElements: 0,
        pageNo: 0
    })

    const [rawMaterialUpdate, setRawMaterialUpdate] = useState({
        id: 0,
        price: 0,
        isLoading: false
    })

    const [currentFixedChargeDate, setCurrentFixedChargeDate] = useState({
        month: moment().month() + 1,
        year: moment().year(),
    });

    const [isLoadingFixedCharge, setIsLoadingFixedCharge] = useState(false);

    const [isVisibleFixedCharge, setIsVisibleFixedCharge] = useState(false);

    const [addFixedChargeInfo, setAddFixedChargeInfo] = useState({
        isLoading: false,
        isReset: false,
    });

    const [FixedChargeList, setFixedChargeList] = useState({
        data: [],
        isLoading: false,
        totalElements: 0,
        pageNo: 0
    })

    const [FixedChargeUpdate, setFixedChargeUpdate] = useState({
        id: 0,
        price: 0,
        isLoading: false
    })

    const [currentVariableChargeDate, setCurrentVariableChargeDate] = useState({
        month: moment().month() + 1,
        year: moment().year(),
    });

    const [isLoadingVariableCharge, setIsLoadingVariableCharge] = useState(false);

    const [isVisibleVariableCharge, setIsVisibleVariableCharge] = useState(false);

    const [addVariableChargeInfo, setAddVariableChargeInfo] = useState({
        isLoading: false,
        isReset: false,
    });

    const [VariableChargeList, setVariableChargeList] = useState({
        data: [],
        isLoading: false,
        totalElements: 0,
        pageNo: 0
    })

    const [VariableChargeUpdate, setVariableChargeUpdate] = useState({
        id: 0,
        price: 0,
        isLoading: false
    })

    const getTurnOverValue = (month, year) => {
        setIsLoadingTurnOver(true);
        getTurnOver(month, year)
            .then((result) => {
                setIsLoadingTurnOver(false);
                setTurnOver(result?.data?.turnOver || 0);
            })
            .catch((error) => {
                setIsLoadingTurnOver(false);
                ToastAndroid.show("Error while getting turnover from server, please try again :(", ToastAndroid.LONG);
            })
    }

    const getReductionValue = (month, year) => {
        setIsLoadingReduction(true);
        getReduction(month, year)
            .then((result) => {
                setIsLoadingReduction(false);
                setReduction(result?.data?.turnOver || 0);
            })
            .catch((error) => {
                setIsLoadingReduction(false);
                ToastAndroid.show("Error while getting reduction from server, please try again :(", ToastAndroid.LONG);
            })
    }

    const getRawMaterialValue = (month, year) => {
        setIsLoadingRawMaterial(true);
        getSumRawMaterial(month, year)
            .then((result) => {
                setIsLoadingRawMaterial(false);
                setRawMaterial(result?.data?.rawMaterialSum || 0);
            })
            .catch((error) => {

                setIsLoadingRawMaterial(false);
                ToastAndroid.show("Error while getting raw material from server, please try again :(", ToastAndroid.LONG);
            })
    }

    const getFixedChargeValue = (month, year) => {
        setIsLoadingFixedCharge(true);
        getSumFixedCharge(month, year)
            .then((result) => {
                setIsLoadingFixedCharge(false);
                setFixedCharge(result?.data?.fixedChargeSum || 0);
            })
            .catch((error) => {
                setIsLoadingFixedCharge(false);
                ToastAndroid.show("Error while getting fixed charge from server, please try again :(", ToastAndroid.LONG);
            })
    }

    const getVariableChargeValue = (month, year) => {
        setIsLoadingVariableCharge(true);
        getSumVariableCharge(month, year)
            .then((result) => {
                setIsLoadingVariableCharge(false);
                setVariableCharge(result?.data?.variableChargeSum || 0);
            })
            .catch((error) => {
                setIsLoadingVariableCharge(false);
                ToastAndroid.show("Error while getting variable charge from server, please try again :(", ToastAndroid.LONG);
            })
    }


    const monthIndex = [
        { label: "January", value: 1 }, { label: "February", value: 2 }, { label: "March", value: 3 }, { label: "April", value: 4 },
        { label: "May", value: 5 }, { label: "June", value: 6 }, { label: "July", value: 7 }, { label: "August", value: 8 },
        { label: "September", value: 9 }, { label: "October", value: 10 }, { label: "November", value: 11 }, { label: "December", value: 12 },
    ];

    const onSelectTurnOverChange = (item, index) => {
        setCurrentTurnOverDate({
            ...currentTurnOverDate,
            month: item
        });
        getTurnOverValue(item, currentTurnOverDate.year);
    }


    const onSelectReductionChange = (item, index) => {
        setCurrentReductionDate({
            ...currentReductionDate,
            month: item
        });
        getReductionValue(item, currentReductionDate.year);
    }

    const onSelectRawMaterialChange = (item, index) => {
        setCurrentRawMaterialDate({
            ...currentRawMaterialDate,
            month: item
        });
        getRawMaterialValue(item, currentRawMaterialDate.year);
    }

    const onSelectVariableChargeChange = (item, index) => {
        setCurrentVariableChargeDate({
            ...currentVariableChargeDate,
            month: item
        });
        getVariableChargeValue(item, currentVariableChargeDate.year);
    }

    const onSelectFixedChargeChange = (item, index) => {
        setCurrentFixedChargeDate({
            ...currentFixedChargeDate,
            month: item
        });
        getFixedChargeValue(item, currentFixedChargeDate.year);
    }

    const onRawMaterialDetail = () => {
        setIsVisibleRawMaterial(true);
        setAddRawMaterialInfo({
            ...addRawMaterialInfo,
            isReset: false
        });
        onGetRawMaterialData(currentRawMaterialDate.month, currentRawMaterialDate.year);
    }


    const onAddRawMaterial = (data) => {

        setAddRawMaterialInfo({
            ...addRawMaterialInfo,
            isLoading: true
        });
        addRawMaterial(data)
            .then((result) => {
                setAddRawMaterialInfo({
                    ...addRawMaterialInfo,
                    isLoading: false,
                    isReset: true
                });
                setIsVisibleRawMaterial(false);
                ToastAndroid.show("Raw materials Successfully added! :)", ToastAndroid.SHORT);
                getRawMaterialValue(currentRawMaterialDate.month, currentRawMaterialDate.year);
            })
            .catch((error) => {
                setAddRawMaterialInfo({
                    ...addRawMaterialInfo,
                    isLoading: false
                });
                ToastAndroid.show("Could not add new raw materials info to the server, please try again :(", ToastAndroid.LONG);
            })
    }

    const onGetRawMaterialData = (month, year) => {
        setRawMaterialList({
            ...rawMaterialList,
            isLoading: true
        });
        getRawMaterial(0, pageSize, month, year)
            .then((result) => {
                setRawMaterialList({
                    ...rawMaterialList,
                    data: result?.data || [],
                    isLoading: false,
                    totalElements: result?.paginationInfo?.totalElements,
                    pageNo: 0
                });
            })
            .catch((error) => {
                setRawMaterialList({
                    ...rawMaterialList,
                    isLoading: false
                });
                ToastAndroid.show("Could not get raw material list to the server, please try again :(", ToastAndroid.LONG);
            })
    }

    const onGetOlderRawMaterialData = (month, year) => {
        getRawMaterial(rawMaterialList.pageNo + 1, pageSize, month, year)
            .then((result) => {
                setRawMaterialList({
                    ...rawMaterialList,
                    data: [
                        ...rawMaterialList.data,
                        ...result?.data
                    ],
                    totalElements: result?.paginationInfo?.totalElements,
                    pageNo: rawMaterialList.pageNo + 1
                });
            })
            .catch((error) => {
                ToastAndroid.show("Could not get raw material list to the server, please try again :(", ToastAndroid.LONG);
            })
    }

    const onUpdateRawMaterial = (id, month, year) => {
        if (id === rawMaterialUpdate.id) {
            setRawMaterialUpdate({
                ...rawMaterialUpdate,
                isLoading: true
            });
            updateRawMaterial(rawMaterialUpdate.id, rawMaterialUpdate.price)
                .then((result) => {
                    setRawMaterialUpdate({
                        ...rawMaterialUpdate,
                        isLoading: false
                    });
                    getRawMaterialValue(currentRawMaterialDate.month, currentRawMaterialDate.year);
                    onGetRawMaterialData(month, year);
                    ToastAndroid.show("Successfully updated :)", ToastAndroid.SHORT);
                })
                .catch((error) => {
                    setRawMaterialUpdate({
                        ...rawMaterialUpdate,
                        isLoading: false
                    });
                    ToastAndroid.show("Could not update price value, please try again :(", ToastAndroid.LONG);
                })
            return;
        }
        Alert.alert("Warning", "Please update the price value before saving");
        return;
    }

    const onFixedChargeDetail = () => {
        setIsVisibleFixedCharge(true);
        setAddFixedChargeInfo({
            ...addFixedChargeInfo,
            isReset: false
        });
        onGetFixedChargeData(currentFixedChargeDate.month, currentFixedChargeDate.year);
    }

    const onAddFixedCharge = (data) => {
        setAddFixedChargeInfo({
            ...addFixedChargeInfo,
            isLoading: true
        });
        addFixedCharge(data)
            .then((result) => {
                setAddFixedChargeInfo({
                    ...addFixedChargeInfo,
                    isLoading: false,
                    isReset: true
                });
                setIsVisibleFixedCharge(false);
                ToastAndroid.show("fixed charges Successfully added! :)", ToastAndroid.SHORT);
                getFixedChargeValue(currentFixedChargeDate.month, currentFixedChargeDate.year);
            })
            .catch((error) => {
                setAddFixedChargeInfo({
                    ...addFixedChargeInfo,
                    isLoading: false
                });
                ToastAndroid.show("Could not add new fixed charges info to the server, please try again :(", ToastAndroid.LONG);
            })
    }

    const onGetFixedChargeData = (month, year) => {
        setFixedChargeList({
            ...FixedChargeList,
            isLoading: true
        });
        getFixedCharge(0, pageSize, month, year)
            .then((result) => {
                setFixedChargeList({
                    ...FixedChargeList,
                    data: result?.data || [],
                    isLoading: false,
                    totalElements: result?.paginationInfo?.totalElements,
                    pageNo: 0
                });
            })
            .catch((error) => {
                setFixedChargeList({
                    ...FixedChargeList,
                    isLoading: false
                });
                ToastAndroid.show("Could not get fixed charge list to the server, please try again :(", ToastAndroid.LONG);
            })
    }

    const onGetOlderFixedChargeData = (month, year) => {
        getFixedCharge(FixedChargeList.pageNo + 1, pageSize, month, year)
            .then((result) => {
                setFixedChargeList({
                    ...FixedChargeList,
                    data: [
                        ...FixedChargeList.data,
                        ...result?.data
                    ],
                    totalElements: result?.paginationInfo?.totalElements,
                    pageNo: FixedChargeList.pageNo + 1
                });
            })
            .catch((error) => {
                ToastAndroid.show("Could not get fixed charge list to the server, please try again :(", ToastAndroid.LONG);
            })
    }

    const onUpdateFixedCharge = (id, month, year) => {
        if (id === FixedChargeUpdate.id) {
            setFixedChargeUpdate({
                ...FixedChargeUpdate,
                isLoading: true
            });
            updateFixedCharge(FixedChargeUpdate.id, FixedChargeUpdate.price)
                .then((result) => {
                    setFixedChargeUpdate({
                        ...FixedChargeUpdate,
                        isLoading: false
                    });
                    getFixedChargeValue(currentFixedChargeDate.month, currentFixedChargeDate.year);
                    onGetFixedChargeData(month, year)
                    ToastAndroid.show("Successfully updated :)", ToastAndroid.SHORT);
                })
                .catch((error) => {
                    setFixedChargeUpdate({
                        ...FixedChargeUpdate,
                        isLoading: false
                    });
                    ToastAndroid.show("Could not update price value, please try again :(", ToastAndroid.LONG);
                })
            return;
        }
        Alert.alert("Warning", "Please update the price value before saving");
        return;
    }

    const onVariableChargeDetail = () => {
        setIsVisibleVariableCharge(true);
        setAddVariableChargeInfo({
            ...addVariableChargeInfo,
            isReset: false
        });
        onGetVariableChargeData(currentVariableChargeDate.month, currentVariableChargeDate.year);
    }

    const onAddVariableCharge = (data) => {
        setAddVariableChargeInfo({
            ...addVariableChargeInfo,
            isLoading: true
        });
        addVariableCharge(data)
            .then((result) => {
                setAddVariableChargeInfo({
                    ...addVariableChargeInfo,
                    isLoading: false,
                    isReset: true
                });
                setIsVisibleVariableCharge(false);
                ToastAndroid.show("variable charges Successfully added! :)", ToastAndroid.SHORT);
                getVariableChargeValue(currentVariableChargeDate.month, currentVariableChargeDate.year);
            })
            .catch((error) => {
                setAddVariableChargeInfo({
                    ...addVariableChargeInfo,
                    isLoading: false
                });
                ToastAndroid.show("Could not add new variable charges info to the server, please try again :(", ToastAndroid.LONG);
            })
    }

    const onGetVariableChargeData = (month, year) => {
        setVariableChargeList({
            ...VariableChargeList,
            isLoading: true
        });
        getVariableCharge(0, pageSize, month, year)
            .then((result) => {
                setVariableChargeList({
                    ...VariableChargeList,
                    data: result?.data || [],
                    isLoading: false,
                    totalElements: result?.paginationInfo?.totalElements,
                    pageNo: 0
                });
            })
            .catch((error) => {
                setVariableChargeList({
                    ...VariableChargeList,
                    isLoading: false
                });
                ToastAndroid.show("Could not get variable charge list to the server, please try again :(", ToastAndroid.LONG);
            })
    }

    const onGetOlderVariableChargeData = (month, year) => {
        getVariableCharge(VariableChargeList.pageNo + 1, pageSize, month, year)
            .then((result) => {
                setVariableChargeList({
                    ...VariableChargeList,
                    data: [
                        ...VariableChargeList.data,
                        ...result?.data
                    ],
                    totalElements: result?.paginationInfo?.totalElements,
                    pageNo: VariableChargeList.pageNo + 1
                });
            })
            .catch((error) => {
                ToastAndroid.show("Could not get variable charge list to the server, please try again :(", ToastAndroid.LONG);
            })
    }

    const onUpdateVariableCharge = (id, month, year) => {
        if (id === VariableChargeUpdate.id) {
            setVariableChargeUpdate({
                ...VariableChargeUpdate,
                isLoading: true
            });
            updateVariableCharge(VariableChargeUpdate.id, VariableChargeUpdate.price)
                .then((result) => {
                    setVariableChargeUpdate({
                        ...VariableChargeUpdate,
                        isLoading: false
                    });
                    getVariableChargeValue(currentVariableChargeDate.month, currentVariableChargeDate.year);
                    onGetVariableChargeData(month, year);
                    ToastAndroid.show("Successfully updated :)", ToastAndroid.SHORT);
                })
                .catch((error) => {
                    setVariableChargeUpdate({
                        ...VariableChargeUpdate,
                        isLoading: false
                    });
                    ToastAndroid.show("Could not update price value, please try again :(", ToastAndroid.LONG);
                })
            return;
        }
        Alert.alert("Warning", "Please update the price value before saving");
        return;
    }

    useEffect(() => {
        if (isActive) {
            setCurrentTurnOverDate({
                year: moment().year(),
                month: moment().month() + 1
            });
            setCurrentReductionDate({
                year: moment().year(),
                month: moment().month() + 1
            });
            setCurrentRawMaterialDate({
                year: moment().year(),
                month: moment().month() + 1
            });
            setCurrentFixedChargeDate({
                year: moment().year(),
                month: moment().month() + 1
            });
            setCurrentVariableChargeDate({
                year: moment().year(),
                month: moment().month() + 1
            });
            getTurnOverValue(currentTurnOverDate.month, currentTurnOverDate.year);
            getReductionValue(currentReductionDate.month, currentReductionDate.year);
            getRawMaterialValue(currentRawMaterialDate.month, currentRawMaterialDate.year);
            getFixedChargeValue(currentFixedChargeDate.month, currentFixedChargeDate.year);
            getVariableChargeValue(currentVariableChargeDate.month, currentVariableChargeDate.year);
        }
    }, [isActive])

    return (
        <React.Fragment>
            <Modal visible={isVisibleRawMaterial} >
                <ChargeDetail
                    title={"Raw Material Detail"}
                    onClose={() => setIsVisibleRawMaterial(false)}
                    addKey={[
                        { label: "Raw Material Designation", value: "rawMaterial" },
                        { label: "Price", value: "price", keyboardType: "numeric" },
                        { label: "Weight", value: "weight", keyboardType: "numeric" },
                        { label: "Unit", value: "unit" }
                    ]}
                    onAdd={onAddRawMaterial}
                    isLoadingAdd={addRawMaterialInfo.isLoading}
                    isResetAddData={addRawMaterialInfo.isReset}
                    dataList={rawMaterialList.data}
                    isLoadingDataList={rawMaterialList.isLoading}
                    getData={onGetRawMaterialData}
                    totalElements={rawMaterialList.totalElements}
                    onScrollEnd={onGetOlderRawMaterialData}
                    renderDataListItem={({ item, index, month, year }) => {
                        return (
                            <View style={[styles.shadow, { height: 220, borderRadius: 10, marginBottom: 20 }]}>
                                <View style={{ marginLeft: 20, marginRight: 20, marginVertical: 20 }} >
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <View style={{ flexDirection: "row" }}>
                                            <Typography style={{ fontSize: 14 }}  >Raw Material : </Typography>
                                            <Typography style={{ fontSize: 14 }} variant="subTitle" numberOfLines={2} >{item?.rawMaterial}</Typography>
                                        </View>
                                        <View style={{ flexDirection: "row", marginLeft: 10 }}>
                                            <Typography style={{ fontSize: 14 }}  >Weight : </Typography>
                                            <Typography style={{ fontSize: 14, }} variant="subTitle" numberOfLines={2} >{item?.weight}{" "}{item?.unit}</Typography>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: "row", marginTop: 20 }}>
                                        <Typography style={{ fontSize: 14 }}  >Payement Date : </Typography>
                                        <Typography style={{ fontSize: 14 }} variant="subTitle" numberOfLines={2} >{item?.payementDate}</Typography>
                                    </View>
                                    <View style={{ flexDirection: "row", marginTop: 20, marginBottom: 10 }}>
                                        <Typography style={{ fontSize: 14 }}  >Creator : </Typography>
                                        <Typography style={{ fontSize: 14 }} variant="subTitle" numberOfLines={2} >{item?.creator?.firstName} {" "} {item?.creator?.name}</Typography>
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                        {rawMaterialUpdate.isLoading ? <>
                                            <View style={{ flex: 1, marginTop: 20, alignItems: "center" }}>
                                                <ActivityIndicator size="small" color="#4eac6d" />
                                            </View>
                                        </> : <>
                                            <Input label="Price : " onChangeText={(e) => {

                                                setRawMaterialUpdate({
                                                    id: item?.id,
                                                    price: e
                                                });
                                            }} defaultValue={`${item?.price}`} style={{ height: 75, flex: 1 }} keyboardType="numeric" />
                                            <TouchableOpacity style={{ width: 50, height: 50, marginLeft: 20, justifyContent: "center", alignItems: "center" }} onPress={() => onUpdateRawMaterial(item?.id, month, year)}>
                                                <FontAwesome5
                                                    name={"pen"}
                                                    size={17}
                                                    color={"#4eac6d"}
                                                ></FontAwesome5>
                                            </TouchableOpacity>
                                        </>}
                                    </View>
                                </View>
                            </View>
                        )
                    }}
                    onChargeUpdate={(id, price) => { }}
                    isLoadingUpdate={false}
                    currentDate={currentRawMaterialDate}
                    pageSize={pageSize}
                />
            </Modal>
            <Modal visible={isVisibleFixedCharge} >
                <ChargeDetail
                    title={"Fixed Charge Detail"}
                    onClose={() => setIsVisibleFixedCharge(false)}
                    addKey={[
                        { label: "Load Nature", value: "loadNature" },
                        { label: "Price", value: "price", keyboardType: "numeric" },
                    ]}
                    onAdd={onAddFixedCharge}
                    isLoadingAdd={addFixedChargeInfo.isLoading}
                    isResetAddData={addFixedChargeInfo.isReset}
                    dataList={FixedChargeList.data}
                    isLoadingDataList={FixedChargeList.isLoading}
                    getData={onGetFixedChargeData}
                    totalElements={FixedChargeList.totalElements}
                    onScrollEnd={onGetOlderFixedChargeData}
                    renderDataListItem={
                        ({ item, index, month, year }) =>
                        (<FixedChargeDetailListItem
                            item={item} index={index}
                            month={month} year={year}
                            setFixedChargeUpdate={setFixedChargeUpdate}
                            onUpdateFixedCharge={onUpdateFixedCharge}
                            FixedChargeUpdate={FixedChargeUpdate} />)}
                    onChargeUpdate={(id, price) => { }}
                    isLoadingUpdate={false}
                    currentDate={currentFixedChargeDate}
                    pageSize={pageSize}
                />
            </Modal>
            <Modal visible={isVisibleVariableCharge} >
                <ChargeDetail
                    title={"Variable Charge Detail"}
                    onClose={() => setIsVisibleVariableCharge(false)}
                    addKey={[
                        { label: "Load Nature", value: "loadNature" },
                        { label: "Price", value: "price", keyboardType: "numeric" },
                    ]}
                    onAdd={onAddVariableCharge}
                    isLoadingAdd={addVariableChargeInfo.isLoading}
                    isResetAddData={addVariableChargeInfo.isReset}
                    dataList={VariableChargeList.data}
                    isLoadingDataList={VariableChargeList.isLoading}
                    getData={onGetVariableChargeData}
                    totalElements={VariableChargeList.totalElements}
                    onScrollEnd={onGetOlderVariableChargeData}
                    renderDataListItem={({ item, index, month, year }) => {
                        return (
                            <View style={[styles.shadow, { height: 220, borderRadius: 10, marginBottom: 20 }]}>
                                <View style={{ marginLeft: 20, marginRight: 20, marginVertical: 20 }} >
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <View style={{ flexDirection: "row" }}>
                                            <Typography style={{ fontSize: 14 }}  >Load Nature : </Typography>
                                            <Typography style={{ fontSize: 14 }} variant="subTitle" numberOfLines={2} >{item?.loadNature}</Typography>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: "row", marginTop: 20 }}>
                                        <Typography style={{ fontSize: 14 }}  >Payement Date : </Typography>
                                        <Typography style={{ fontSize: 14 }} variant="subTitle" numberOfLines={2} >{item?.payementDate}</Typography>
                                    </View>
                                    <View style={{ flexDirection: "row", marginTop: 20, marginBottom: 10 }}>
                                        <Typography style={{ fontSize: 14 }}  >Creator : </Typography>
                                        <Typography style={{ fontSize: 14 }} variant="subTitle" numberOfLines={2} >{item?.creator?.firstName} {" "} {item?.creator?.name}</Typography>
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                        {VariableChargeUpdate.isLoading ? <>
                                            <View style={{ flex: 1, marginTop: 20, alignItems: "center" }}>
                                                <ActivityIndicator size="small" color="#4eac6d" />
                                            </View>
                                        </> : <>
                                            <Input label="Price : " onChangeText={(e) => {

                                                setVariableChargeUpdate({
                                                    id: item?.id,
                                                    price: e
                                                });
                                            }} defaultValue={`${item?.price}`} style={{ height: 75, flex: 1 }} keyboardType="numeric" />
                                            <TouchableOpacity style={{ width: 50, height: 50, marginLeft: 20, justifyContent: "center", alignItems: "center" }} onPress={() => onUpdateVariableCharge(item?.id, month, year)}>
                                                <FontAwesome5
                                                    name={"pen"}
                                                    size={17}
                                                    color={"#4eac6d"}
                                                ></FontAwesome5>
                                            </TouchableOpacity>
                                        </>}
                                    </View>
                                </View>
                            </View>
                        )
                    }}
                    onChargeUpdate={(id, price) => { }}
                    isLoadingUpdate={false}
                    currentDate={currentVariableChargeDate}
                    pageSize={pageSize}
                />
            </Modal>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 21 }}>
                <Typography variant="title" style={{ fontSize: 20 }} >Turnover</Typography>
                <Typography variant="title" style={{ fontSize: 16, color: "rgba(0,0,0,1)" }} >.....</Typography>
            </View>
            <View style={{ marginVertical: 20, marginHorizontal: 20 }}>
                <Cart isLoading={isLoadingTurnOver}
                    value={`aed ${formatter(turnOver)}`} title={
                        <View style={{ flexDirection: "row" }} >
                            <View style={{ flex: 1 }}>
                                <Picker

                                    selectedValue={`${currentTurnOverDate.month}`}
                                    onValueChange={onSelectTurnOverChange}
                                    style={{ color: "#ffffff" }}
                                    dropdownIconColor="#ffffff"
                                >
                                    {monthIndex.map((value, index) => {
                                        return <Picker.Item key={`index-month-${index}`} label={`${value.label}`} value={`${value.value}`} />
                                    })}
                                </Picker>
                            </View>
                            <View style={{ flex: 1, marginLeft: 30 }}>
                                <Picker

                                    selectedValue={`${currentTurnOverDate.year}`}
                                    onValueChange={(item, value) => { }}
                                    style={{ color: "#ffffff" }}
                                    dropdownIconColor="#ffffff"
                                >
                                    <Picker.Item label={`${currentTurnOverDate.year}`} value={`${currentTurnOverDate.year}`} />
                                </Picker>
                            </View>
                        </View>
                    } />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 21 }}>
                <Typography variant="title" style={{ fontSize: 20 }} >Reduction</Typography>
                <Typography variant="title" style={{ fontSize: 16, color: "rgba(0,0,0,1)" }} >.....</Typography>
            </View>
            <View style={{ marginVertical: 20, marginHorizontal: 20 }}>
                <Cart theme="light" isLoading={isLoadingReduction} value={`aed ${formatter(reduction)}`} title={
                    <View style={{ flexDirection: "row" }} >
                        <View style={{ flex: 1 }}>
                            <Picker

                                selectedValue={`${currentReductionDate.month}`}
                                onValueChange={onSelectReductionChange}
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

                                selectedValue={`${currentReductionDate.year}`}
                                onValueChange={(item, value) => { }}
                                style={{ color: "#000000" }}
                                dropdownIconColor="#000000"
                            >
                                <Picker.Item label={`${currentReductionDate.year}`} value={`${currentReductionDate.year}`} />
                            </Picker>
                        </View>
                    </View>
                } />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 21 }}>
                <Typography variant="title" style={{ fontSize: 20 }} >Raw Material</Typography>
                <Typography variant="title" style={{ fontSize: 16, color: "rgba(0,0,0,1)" }} >.....</Typography>
            </View>
            <View style={{ marginVertical: 20, marginHorizontal: 20 }}>
                <Cart theme="light" isLoading={isLoadingRawMaterial} value={`aed ${formatter(rawMaterial)}`} onDetail={onRawMaterialDetail} title={
                    <View style={{ flexDirection: "row" }} >
                        <View style={{ flex: 1 }}>
                            <Picker

                                selectedValue={`${currentRawMaterialDate.month}`}
                                onValueChange={onSelectRawMaterialChange}
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

                                selectedValue={`${currentRawMaterialDate.year}`}
                                onValueChange={(item, value) => { }}
                                style={{ color: "#000000" }}
                                dropdownIconColor="#000000"
                            >
                                <Picker.Item label={`${currentRawMaterialDate.year}`} value={`${currentRawMaterialDate.year}`} />
                            </Picker>
                        </View>
                    </View>
                } />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 21 }}>
                <Typography variant="title" style={{ fontSize: 20 }} >Fixed Charge</Typography>
                <Typography variant="title" style={{ fontSize: 16, color: "rgba(0,0,0,1)" }} >.....</Typography>
            </View>
            <View style={{ marginVertical: 20, marginHorizontal: 20 }}>
                <Cart theme="light" isLoading={isLoadingFixedCharge} value={`aed ${formatter(fixedCharge)}`} onDetail={onFixedChargeDetail} title={
                    <View style={{ flexDirection: "row" }} >
                        <View style={{ flex: 1 }}>
                            <Picker

                                selectedValue={`${currentFixedChargeDate.month}`}
                                onValueChange={onSelectFixedChargeChange}
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

                                selectedValue={`${currentFixedChargeDate.year}`}
                                onValueChange={(item, value) => { }}
                                style={{ color: "#000000" }}
                                dropdownIconColor="#000000"
                            >
                                <Picker.Item label={`${currentFixedChargeDate.year}`} value={`${currentFixedChargeDate.year}`} />
                            </Picker>
                        </View>
                    </View>
                } />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 21 }}>
                <Typography variant="title" style={{ fontSize: 20 }} >Variable Charge</Typography>
                <Typography variant="title" style={{ fontSize: 16, color: "rgba(0,0,0,1)" }} >.....</Typography>
            </View>
            <View style={{ marginVertical: 20, marginHorizontal: 20 }}>
                <Cart theme="light" isLoading={isLoadingVariableCharge} value={`aed ${formatter(variableCharge)}`} onDetail={onVariableChargeDetail} title={
                    <View style={{ flexDirection: "row" }} >
                        <View style={{ flex: 1 }}>
                            <Picker

                                selectedValue={`${currentVariableChargeDate.month}`}
                                onValueChange={onSelectVariableChargeChange}
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

                                selectedValue={`${currentVariableChargeDate.year}`}
                                onValueChange={(item, value) => { }}
                                style={{ color: "#000000" }}
                                dropdownIconColor="#000000"
                            >
                                <Picker.Item label={`${currentVariableChargeDate.year}`} value={`${currentVariableChargeDate.year}`} />
                            </Picker>
                        </View>
                    </View>
                } />
            </View>
        </React.Fragment>
    )

}

export default Statistic;