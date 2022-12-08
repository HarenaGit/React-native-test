import useAxios from '../../common/hooks/axios';
import { useAuthHeader } from '../../constraint/factory/WSAuthorization';
import { WSLinks } from '../../data/constant/URLs';
import config from '../../common/config/WSConfig';

const { getAxios, putAxios, postAxios, deleteAxios, postAxiosWSBinary, getAxiosWSBinary } = useAxios();

const headerConfig = async () => {
    const result = await useAuthHeader();
    return result;
}

const userNotificationURL = config.backendBaseURL + WSLinks.userNotification;
const notificationHistoryURL = config.backendBaseURL + WSLinks.notificationHistory;
const userNotificationNumberURL = config.backendBaseURL + WSLinks.userNotificationNumber;

const getUserNotification = (pageNo, pageSize) =>
    new Promise(async (success, error) => {
        const response = await getAxios(
            `${userNotificationURL}?pageNo=${pageNo}&pageSize=${pageSize}`,
            await headerConfig()
        ).catch((exception) => error(exception))
        response && success(response)
    })

const getHistory = (pageNo, pageSize) =>
    new Promise(async (success, error) => {
        const response = await getAxios(
            `${notificationHistoryURL}?pageNo=${pageNo}&pageSize=${pageSize}`,
            await headerConfig()
        ).catch((exception) => error(exception))
        response && success(response)
    })

const getUserNotificationNumber = () =>
    new Promise(async (success, error) => {
        const response = await getAxios(
            `${userNotificationNumberURL}`,
            await headerConfig()
        ).catch((exception) => error(exception))
        response && success(response)
    })

export {
    getUserNotification,
    getHistory,
    getUserNotificationNumber
}