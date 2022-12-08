import useAxios from '../../common/hooks/axios';
import { useAuthHeader } from '../../constraint/factory/WSAuthorization';
import { WSLinks } from '../../data/constant/URLs';
import config from '../../common/config/WSConfig';

const { getAxios, putAxios, postAxios, deleteAxios, postAxiosWSBinary, getAxiosWSBinary } = useAxios();

const headerConfig = async () => {
    const result = await useAuthHeader();
    return result;
}

const turnOverURL = config.backendBaseURL + WSLinks.turnover;
const reductionURL = config.backendBaseURL + WSLinks.reduction;

const getTurnOver = (month, year) =>
    new Promise(async (success, error) => {
        const response = await getAxios(
            `${turnOverURL}?month=${month}&year=${year}`,
            await headerConfig()
        ).catch((exception) => error(exception))
        response && success(response)
    });

const getReduction = (month, year) =>
    new Promise(async (success, error) => {
        const response = await getAxios(
            `${reductionURL}?month=${month}&year=${year}`,
            await headerConfig()
        ).catch((exception) => error(exception))
        response && success(response)
    });

export {
    getTurnOver,
    getReduction
}