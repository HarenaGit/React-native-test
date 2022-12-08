import { useFonts } from "expo-font";

const loadFonts = () => {
    return useFonts({
        "Nunito-Bold": require('../../../../assets/fonts/Nunito-Bold.ttf'),
        "Nunito-regular": require("../../../../assets/fonts/Nunito-Light.ttf")
    });
}

export default loadFonts;