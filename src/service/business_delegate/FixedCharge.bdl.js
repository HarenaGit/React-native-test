import useAxios from '../../common/hooks/axios';
import { useAuthHeader } from '../../constraint/factory/WSAuthorization';
import { WSLinks } from '../../data/constant/URLs';
import config from '../../common/config/WSConfig';
import ImageFormData from '../../common/utils/ImageFormData/ToFormaData';

const { getAxios, putAxios, postAxios, deleteAxios, postAxiosWSBinary, getAxiosWSBinary } = useAxios();

const headerConfig = async () => {
    const result = await useAuthHeader();
    return result;
}

const addURL = config.backendBaseURL + WSLinks.fixedChargeAdd;
const getURL = config.backendBaseURL + WSLinks.fixedChargeGet;
const getSumURL = config.backendBaseURL + WSLinks.fixedChargeGetSum;
const updateURL = config.backendBaseURL + WSLinks.fixedChargeUpdate;

const add = (data) =>
    new Promise(async (success, error) => {
        let i = 0;
        let formData = new FormData();
        for (const currentData of data) {
            for (const p of currentData.photos) {
                localUri = p.uri;
                let filename = localUri.split('/').pop();
                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;
                formData.append(`fixedCharges[${i}].files`, { uri: localUri, name: filename, type });
            }
            formData.append(`fixedCharges[${i}].loadNature`, currentData.loadNature);
            formData.append(`fixedCharges[${i}].price`, currentData.price);
            i++;
        }
        let header = await headerConfig();
        header = header.headers;
        header = {
            headers: {
                ...header,
                "Content-Type": "multipart/form-data"
            }
        }
        const response = await postAxios(
            addURL,
            formData,
            header
        ).catch((exception) => {
            console.log(exception);
            error(exception)
        });
        response && success(response);
    })

const get = (pageNo, pageSize, month, year) =>
    new Promise(async (success, error) => {
        const response = await getAxios(
            `${getURL}?pageNo=${pageNo}&pageSize=${pageSize}&month=${month}&year=${year}`,
            await headerConfig()
        ).catch((exception) => error(exception));
        response && success(response)
    })

const getSum = (month, year) =>
    new Promise(async (success, error) => {
        const response = await getAxios(
            `${getSumURL}?month=${month}&year=${year}`,
            await headerConfig()
        ).catch((exception) => error(exception));
        response && success(response);
    })

const update = (id, price) =>
    new Promise(async (success, error) => {
        const response = await putAxios(
            `${updateURL}?id=${id}&price=${price}`,
            {},
            await headerConfig()
        ).catch((exception) => error(exception));
        response && success(response)
    })

export {
    add,
    get,
    getSum,
    update
};