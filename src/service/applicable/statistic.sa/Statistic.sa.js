import { getTurnOver, getReduction } from '../../business_delegate/Statistic.bdl';

const useStatistic = () => {
    return {
        getTurnOver: (month, year) =>
            new Promise(async (success, error) => {
                const response = await getTurnOver(month, year)
                    .catch((exception) => error(exception))
                response && success(response)
            }),
        getReduction: (month, year) =>
            new Promise(async (success, error) => {
                const response = await getReduction(month, year)
                    .catch((exception) => error(exception))
                response && success(response)
            })
    }
}

export default useStatistic;