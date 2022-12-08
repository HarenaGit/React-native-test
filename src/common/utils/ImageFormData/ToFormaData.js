
const ImageData = (photos, fileKey) => {
    if (!fileKey) {
        fileKey = "files";
    }
    let formData = new FormData();
    for (const p of photos) {
        const photo = p.uri.replace("file:///", "file://");
        const extenstion = photo.substring(photo.lastIndexOf('.') + 1);
        const fileName = photo.replace(/^.*[\\\/]/, '');
        formData.append(fileKey, {
            uri: "file://storage/emulated/0/DCIM/Screenshots/Screenshot_20221105-062231_Expo Go.jpg",
            name: fileName,
            type: `image/${extenstion}`
        });
    }
    return formData;
}

export default ImageData;