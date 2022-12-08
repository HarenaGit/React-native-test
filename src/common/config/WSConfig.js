
const WS_GCP_URL = "https://madameals.uc.r.appspot.com/madameals";
const WS_LOCAL_URL = "http://192.168.43.26:8080/socle";

const wsURL = WS_GCP_URL;

const config = {
    backendBaseURL: `${wsURL}`,
    previewImageURL: `${wsURL}/preview/image`
}

export default config;