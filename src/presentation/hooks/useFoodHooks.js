import { ToastAndroid } from 'react-native';
import { useDispatch } from 'react-redux';
import useFood from '../../service/applicable/food.sa/Food.sa';
import {
    setIsLoadingPopularFood,
    setPopularFood
} from '../../service/applicable/food.sa/Food.redux.sa';

const useFoodHooks = () => {
    const dispatch = useDispatch();
    const { getPopularFood } = useFood();

    const getFood = (_callback = () => { }) => {
        dispatch(setIsLoadingPopularFood(true));
        getPopularFood(0, 10)
            .then((result) => {
                dispatch(setPopularFood(result?.data || []));
                dispatch(setIsLoadingPopularFood(false));
                _callback();
            })
            .catch((error) => {
                dispatch(setPopularFood([]));
                dispatch(setIsLoadingPopularFood(false));
                ToastAndroid.show("Error while getting popular food from server, please try again :(", ToastAndroid.LONG);
            })
    }
    return { getFood };
}

export default useFoodHooks;