import useAxios from '../../common/hooks/axios';
import { useAuthHeader } from '../../constraint/factory/WSAuthorization';
import { WSLinks } from '../../data/constant/URLs';
import config from '../../common/config/WSConfig';

const { getAxios, putAxios, postAxios, deleteAxios, postAxiosWSBinary, getAxiosWSBinary } = useAxios();

const headerConfig = async () => {
    const result = await useAuthHeader();
    return result;
}

const popularFoodURL = config.backendBaseURL + WSLinks.popularFood;

const getPopularFood = (pageNo, pageSize) =>
    new Promise(async (success, error) => {
        const response = await getAxios(
            `${popularFoodURL}?pageNo=${pageNo}&pageSize=${pageSize}`,
            await headerConfig()
        ).catch((exception) => error(exception))
        response && success(response)
    })

export {
    getPopularFood
}