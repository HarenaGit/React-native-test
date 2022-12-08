import useAxios from '../../common/hooks/axios';
import { useAuthHeader } from '../../constraint/factory/WSAuthorization';
import { WSLinks } from '../../data/constant/URLs';
import config from '../../common/config/WSConfig';

const { getAxios, putAxios, postAxios, deleteAxios, postAxiosWSBinary, getAxiosWSBinary } = useAxios();

const headerConfig = async () => {
    const result = await useAuthHeader();
    return result;
}

const addDailyOrderURL = config.backendBaseURL + WSLinks.addDailyOrder;
const getDailyOrderURL = config.backendBaseURL + WSLinks.getDailyOrder;
const exportDailyOrderURL = config.backendBaseURL + WSLinks.exportDailyOrder;
const nextStepDailyOrderURL = config.backendBaseURL + WSLinks.nextStepDailyOrder;
const cancelDailyOrderURL = config.backendBaseURL + WSLinks.cancelDailyOrder;
const searchDailyOrderURL = config.backendBaseURL + WSLinks.searchDailyOrder;

const addDailyOrder = (data) =>
    new Promise(async (success, error) => {
        const pdfBinary = await postAxiosWSBinary(
            addDailyOrderURL,
            data,
            await headerConfig()
        ).catch((exception) => error(exception));
        pdfBinary && success(pdfBinary);
    });

const getDailyOrder = (pageNo, pageSize, filter) =>
    new Promise(async (success, error) => {
        statusFilter = "";
        if (filter?.statusFilter) {
            statusFilter = `&status=${filter?.statusFilter}`
        }
        const dailyOrders = await getAxios(
            `${getDailyOrderURL}?pageNo=${pageNo}&pageSize=${pageSize}${statusFilter}`,
            await headerConfig()
        ).catch((exception) => error(exception));
        dailyOrders && success(dailyOrders)
    });

const exportDailyOrder = (id) =>
    new Promise(async (success, error) => {
        const pdfBinary = await getAxiosWSBinary(
            `${exportDailyOrderURL}?id=${id}`,
            await headerConfig()
        ).catch((exception) => error(exception))
        pdfBinary && success(pdfBinary);
    })

const nextStepDailyOrder = (id) =>
    new Promise(async (success, error) => {
        const response = await putAxios(
            `${nextStepDailyOrderURL}?id=${id}`,
            {},
            await headerConfig()
        ).catch((exception) => error(exception))
        response && success(response)
    })

const cancelDailyOrder = (id) =>
    new Promise(async (success, error) => {
        const response = await putAxios(
            `${cancelDailyOrderURL}?id=${id}`,
            {},
            await headerConfig()
        ).catch((exception) => error(exception))
        response && success(response)
    })

const searchDailyOrder = (search, pageNo, pageSize) =>
    new Promise(async (success, error) => {
        const response = await getAxios(
            `${searchDailyOrderURL}?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`,
            await headerConfig()
        ).catch((exception) => error(exception))
        response && success(response)
    })

export {
    addDailyOrder,
    getDailyOrder,
    exportDailyOrder,
    nextStepDailyOrder,
    cancelDailyOrder,
    searchDailyOrder
};
