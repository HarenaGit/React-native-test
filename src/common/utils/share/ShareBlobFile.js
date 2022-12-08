
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const ShareBlobFile = async (blob, filename, _callBack, isSharing = true) => {
    const file = new FileReader(blob);
    file.onload = async () => {
        const fileURI = `${FileSystem.documentDirectory}/${filename}`;
        await FileSystem.writeAsStringAsync(fileURI, file.result.split(',')[1], { encoding: FileSystem.EncodingType.Base64 });
        if (isSharing) {
            await Sharing.shareAsync(fileURI);
        }
        _callBack();
    }
    file.readAsDataURL(blob);
}

export default ShareBlobFile;