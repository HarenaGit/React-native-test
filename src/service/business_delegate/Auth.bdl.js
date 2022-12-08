import useAxios from '../../common/hooks/axios';
import { WSLinks } from '../../data/constant/URLs';
import config from '../../common/config/WSConfig';

const { getAxios, putAxios, postAxios, deleteAxios, postAxiosWSBinary, getAxiosWSBinary } = useAxios();


const loginURL = config.backendBaseURL + WSLinks.login;

const login = (email, password) =>
    new Promise(async (success, error) => {
        const response = await postAxios(
            `${loginURL}`,
            {
                pseudo: email,
                password: password
            }
        ).catch((exception) => error(exception));
        response && success(response)
    });

export {
    login
};