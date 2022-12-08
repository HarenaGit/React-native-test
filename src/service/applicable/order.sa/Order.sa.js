import { addDailyOrder, getDailyOrder, exportDailyOrder, nextStepDailyOrder, cancelDailyOrder, searchDailyOrder } from '../../business_delegate/Order.bdl'
import dailyOrderEnum from '../../../data/constant/DailyOrderEnum';

const useDailyOrder = () => {
    return {
        add: (data) =>
            new Promise(async (success, error) => {
                const pdfBinary = await addDailyOrder(data)
                    .catch((exception) => error(exception));
                pdfBinary && success(pdfBinary);
            }),
        get: (pageNo, pageSize, filter) =>
            new Promise(async (success, error) => {
                let status = null;
                if (filter?.status !== dailyOrderEnum.ALL.name) {
                    status = filter.status;
                }
                const dailyOrders = await getDailyOrder(pageNo, pageSize, { statusFilter: status })
                    .catch((exception) => error(exception));
                dailyOrders && success(dailyOrders);
            }),
        exportOrder: (id) =>
            new Promise(async (success, error) => {
                const pdfBinary = await exportDailyOrder(id)
                    .catch((exception) => error(exception));
                pdfBinary && success(pdfBinary);
            }),

        nextStepOrder: (id) =>
            new Promise(async (success, error) => {
                const response = await nextStepDailyOrder(id)
                    .catch((exception) => error(exception));
                response && success(response)
            }),
        cancelOrder: (id) =>
            new Promise(async (success, error) => {
                const response = await cancelDailyOrder(id)
                    .catch((exception) => error(exception));
                response && success(response)
            }),

        searchOrder: (pageNo, pageSize, search) =>
            new Promise(async (success, error) => {
                const response = await searchDailyOrder(search, pageNo, pageSize)
                    .catch((exception) => error(exception));
                response && success(response)
            })
    }
};

export default useDailyOrder;