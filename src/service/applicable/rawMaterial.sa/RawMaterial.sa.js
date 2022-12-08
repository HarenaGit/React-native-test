import { add, get, getSum, update } from '../../business_delegate/RawMaterial.bdl';

const useRawMaterial = () => {
    return {
        addRawMaterial: (data) =>
            new Promise(async (success, error) => {
                const response = await add(data)
                    .catch((exception) => error(exception));
                response && success(response);
            }),
        getRawMaterial: (pageNo, pageSize, month, year) =>
            new Promise(async (success, error) => {
                const response = await get(pageNo, pageSize, month, year)
                    .catch((exception) => error(exception));
                response && success(response);
            }),
        getSumRawMaterial: (month, year) =>
            new Promise(async (success, error) => {
                const response = await getSum(month, year)
                    .catch((exception) => error(exception));
                response && success(response);
            }),
        updateRawMaterial: (id, price) =>
            new Promise(async (success, error) => {
                const response = await update(id, price)
                    .catch((exception) => error(exception));
                response && success(response);
            })
    }
}

export default useRawMaterial;