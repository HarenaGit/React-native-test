import useAxios from '../../common/hooks/axios';
import { useAuthHeader } from '../../constraint/factory/WSAuthorization';
import { WSLinks } from '../../data/constant/URLs';
import config from '../../common/config/WSConfig';

const { getAxios, putAxios, postAxios, deleteAxios, postAxiosWSBinary, getAxiosWSBinary } = useAxios();

const headerConfig = async () => {
    const result = await useAuthHeader();
    return result;
}

const addURL = config.backendBaseURL + WSLinks.rawMaterialAdd;
const getURL = config.backendBaseURL + WSLinks.rawMaterialGet;
const getSumURL = config.backendBaseURL + WSLinks.rawMaterialGetSum;
const updateURL = config.backendBaseURL + WSLinks.rawMaterialUpdate;

const add = (data) =>
    new Promise(async (success, error) => {
        const response = await postAxios(
            addURL,
            data,
            await headerConfig()
        ).catch((exception) => error(exception));
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