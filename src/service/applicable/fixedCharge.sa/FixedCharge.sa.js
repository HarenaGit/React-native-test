import { add, get, getSum, update } from '../../business_delegate/FixedCharge.bdl';

const useFixedCharge = () => {
    return {
        addFixedCharge: (data) =>
            new Promise(async (success, error) => {
                const response = await add(data)
                    .catch((exception) => error(exception));
                response && success(response);
            }),
        getFixedCharge: (pageNo, pageSize, month, year) =>
            new Promise(async (success, error) => {
                const response = await get(pageNo, pageSize, month, year)
                    .catch((exception) => error(exception));
                response && success(response);
            }),
        getSumFixedCharge: (month, year) =>
            new Promise(async (success, error) => {
                const response = await getSum(month, year)
                    .catch((exception) => error(exception));
                response && success(response);
            }),
        updateFixedCharge: (id, price) =>
            new Promise(async (success, error) => {
                const response = await update(id, price)
                    .catch((exception) => error(exception));
                response && success(response);
            })
    }
}

export default useFixedCharge;