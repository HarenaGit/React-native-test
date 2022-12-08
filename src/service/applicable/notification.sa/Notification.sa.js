import { getUserNotification, getHistory, getUserNotificationNumber } from '../../business_delegate/Notification.bdl';

const useNotification = () => {
    return {
        getUserNotification: (pageNo, pageSize) =>
            new Promise(async (success, error) => {
                const response = await getUserNotification(pageNo, pageSize)
                    .catch((exception) => error(exception));
                response && success(response);
            }),
        getUserNotificationNumber: () =>
            new Promise(async (success, error) => {
                const response = await getUserNotificationNumber()
                    .catch((exception) => error(exception));
                response && success(response);
            }),
    }
}

export default useNotification;