import { getHistory } from '../../business_delegate/Notification.bdl';

const useHistoric = () => {
    return {
        getHistory: (pageNo, pageSize) =>
            new Promise(async (success, error) => {
                const response = await getHistory(pageNo, pageSize)
                    .catch((exception) => error(exception));
                response && success(response);
            })
    }
}

export default useHistoric;