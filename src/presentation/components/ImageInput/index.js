import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, Modal, Image, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ImageView from "react-native-image-viewing";
import * as ImagePicker from 'expo-image-picker';
import { ImageBrowser } from 'expo-image-picker-multiple';
import Typography from '../Typography';
import IconButton from '../IconButton';

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
        marginTop: 10
    },
    imageButtonContainer: {
        flexDirection: "row",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 70,
        marginHorizontal: 10
    },
    countBadge: {
        paddingHorizontal: 8.6,
        paddingVertical: 5,
        borderRadius: 50,
        position: 'absolute',
        right: 3,
        bottom: 3,
        justifyContent: 'center',
        backgroundColor: '#4eac6d'
    },
    countBadgeText: {
        fontWeight: 'bold',
        alignSelf: 'center',
        padding: 'auto',
        color: '#ffffff'
    }
})

const ImageInput = ({ onChange = () => { }, imagesData = [] }) => {

    const [showImagePicker, setShowImagePicker] = useState(false);

    const [images, setImages] = useState([]);

    const [cameraImages, setCameraImages] = useState([]);

    const [onSubmit, setOnSubmit] = useState(() => { });

    const [pickedCount, setPickedCount] = useState(0);

    const [imagePreview, setImagePreview] = useState({
        visible: false,
        currentIndex: 0
    });

    const pickFromCamera = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Error", "You've refused to allow this appp to access your camera!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync();

        if (!result.cancelled) {
            const newCameraImages = [
                ...cameraImages,
                result
            ]
            setCameraImages(newCameraImages);
            onChange([...newCameraImages, ...images]);
        }
    }

    const pickFromGallery = async () => {
        setShowImagePicker(true);
    }

    const onClose = () => {
        setShowImagePicker(false);
    }

    const onDeleteImage = (item, index) => {
        let newImages = (images || []).filter((val, idx) => val.uri !== item.uri);
        let newCameraImages = (cameraImages || []).filter((val, idx) => val.uri !== item.uri);
        setImages(newImages);
        setCameraImages(newCameraImages);
        onChange([...newCameraImages, ...newImages]);
    }

    const renderSelectedComponent = (number) => (
        <View style={styles.countBadge}>
            <Typography style={styles.countBadgeText}>{number}</Typography>
        </View>
    );

    const onPickedImages = (callback) => {
        callback.then((photos) => {
            let cPhotos = [];
            for (let photo of photos) {
                cPhotos.push(photo);
            }
            setImages(cPhotos);
            onChange([...cameraImages, ...cPhotos]);
        }).catch((e) => { });
    };

    const onImageChange = (count, submit) => {
        setPickedCount(count);
        setOnSubmit(submit);
    }

    const onSave = () => {
        onSubmit();
        setShowImagePicker(false)
    }

    const onPreview = (index) => {
        setImagePreview({
            visible: true,
            currentIndex: index
        });
    }

    return (
        <View style={styles.container}>

            <ImageView
                images={imagesData}
                imageIndex={imagePreview.currentIndex}
                visible={imagePreview.visible}
                onRequestClose={() => { setImagePreview({ ...imagePreview, visible: false }) }}
            />

            <Modal visible={showImagePicker}>
                <View style={styles.header}>
                    <Typography>Pick some images</Typography>
                    <IconButton onPress={onClose} >
                        <FontAwesome
                            name="close"
                            size={17}
                            color={'gray'}
                        ></FontAwesome>
                    </IconButton>
                </View>
                <ImageBrowser
                    onChange={onImageChange}
                    callback={onPickedImages}
                    renderSelectedComponent={renderSelectedComponent}
                />
            </Modal>
            <View style={styles.imageButtonContainer}>
                <TouchableOpacity style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center" }} onPress={pickFromCamera}>
                    <Typography variant="title" style={{ fontSize: 16, color: "rgba(0,0,0,0.3)" }} >
                        <Ionicons
                            name="camera"
                            size={35}
                            color={'#4eac6d'}
                        ></Ionicons>
                    </Typography>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center", marginLeft: 20 }} onPress={pickFromGallery}>
                    <Typography variant="title" style={{ fontSize: 16, color: "rgba(0,0,0,0.3)" }} >
                        <Ionicons
                            name="image"
                            size={35}
                            color={'#4eac6d'}
                        ></Ionicons>
                    </Typography>
                </TouchableOpacity>

            </View>
            <View style={{ marginTop: 20, flex: 1 }}>
                <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={imagesData}
                    keyExtractor={(item, index) => `indexImages-${index}`}
                    renderItem={({ item, index }) => (
                        <View style={{ position: "relative" }} >
                            <TouchableOpacity style={{
                                position: "absolute", zIndex: 3, width: 30, height: 30,
                                justifyContent: "center", alignItems: "center", backgroundColor: "#4eac6d"
                            }}
                                onPress={() => { onDeleteImage(item, index) }}>
                                <Ionicons
                                    name="close"
                                    size={25}
                                    color={'white'}
                                ></Ionicons>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { onPreview(index) }} >
                                <Image source={{ uri: item.uri }} style={{ width: 100, height: 100, resizeMode: 'cover' }} />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
        </View>
    )
}

export default ImageInput;