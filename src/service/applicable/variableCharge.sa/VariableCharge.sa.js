import { add, get, getSum, update } from '../../business_delegate/VariableCharge.bdl';

const useVariableCharge = () => {
    return {
        addVariableCharge: (data) =>
            new Promise(async (success, error) => {
                const response = await add(data)
                    .catch((exception) => error(exception));
                response && success(response);
            }),
        getVariableCharge: (pageNo, pageSize, month, year) =>
            new Promise(async (success, error) => {
                const response = await get(pageNo, pageSize, month, year)
                    .catch((exception) => error(exception));
                response && success(response);
            }),
        getSumVariableCharge: (month, year) =>
            new Promise(async (success, error) => {
                const response = await getSum(month, year)
                    .catch((exception) => error(exception));
                response && success(response);
            }),
        updateVariableCharge: (id, price) =>
            new Promise(async (success, error) => {
                const response = await update(id, price)
                    .catch((exception) => error(exception));
                response && success(response);
            })
    }
}

export default useVariableCharge;