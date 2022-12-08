import { getPopularFood } from '../../business_delegate/Food.bdl';

const useFood = () => {
    return {
        getPopularFood: (pageNo, pageSize) =>
            new Promise(async (success, error) => {
                const response = await getPopularFood(pageNo, pageSize)
                    .catch((exception) => error(exception))
                response && success(response);
            })
    }
}

export default useFood;