import { ToastAndroid, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
    setHistorics,
    setPageNo, setIsLoadingHistoric,
    setTotalElements, addHistorics, setIsLoadingOlderHistoric
} from '../../service/applicable/historic.sa/Historic.redux.sa';
import useHistoric from '../../service/applicable/historic.sa/Historic.sa';

const useHistoricHooks = () => {
    const dispatch = useDispatch();
    const { pageNo, pageSize } = useSelector((state) => {
        return {
            pageNo: state.actionHistoric.pageNo,
            pageSize: state.actionHistoric.pageSize
        }
    }
    );

    const { getHistory } = useHistoric();


    const getOlderHistorics = () => {
        dispatch(setIsLoadingOlderHistoric(true));
        getHistory(pageNo + 1, pageSize)
            .then((result) => {
                dispatch(addHistorics(result?.data || []));
                dispatch(setPageNo(pageNo + 1));
                dispatch(setIsLoadingOlderHistoric(false));
            })
            .catch((error) => {
                dispatch(setIsLoadingOlderHistoric(false));
                ToastAndroid.show("Error while getting historics from server, please try again :(", ToastAndroid.LONG);
            })
    }


    const getHistorics = () => {
        dispatch(setIsLoadingHistoric(true));
        getHistory(0, pageSize)
            .then((result) => {
                dispatch(setHistorics(result?.data || []));
                dispatch(setIsLoadingHistoric(false));
                dispatch(setTotalElements(result?.paginationInfo?.totalElements || 0));
            })
            .catch((error) => {
                dispatch(setIsLoadingHistoric(false));
                ToastAndroid.show("Error while getting historics from server, please try again :(", ToastAndroid.LONG);
            })
    }


    return { getHistorics, getOlderHistorics }

}

export default useHistoricHooks;