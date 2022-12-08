import axios from 'axios';

const getConfig = (headerConfig) => {
    return headerConfig;
}

const withBlobConfig = (headerConfig) => {
    return {
        ...headerConfig,
        responseType: "blob"
    }
}

const handleException = (exception, error) => {
    if (exception.response && exception.response.data) {
        error(exception.response.data);
    } else {
        error(exception);
    }
}

const useAxios = () => {

    const postAxios = (
        url,
        data,
        headerConfig
    ) =>
        new Promise(async (success, error) => {
            const response = await axios
                .post(url, data, getConfig(headerConfig))
                .catch((exception) => handleException(exception, error));
            response && success(response.data)
        });

    const postAxiosWSBinary = (
        url,
        data,
        headerConfig
    ) => {
        return new Promise(async (success, error) => {

            const response = await axios
                .post(url, data, withBlobConfig(headerConfig))
                .catch((exception) => handleException(exception, error));
            if (response) {
                const contentDisposition = response.headers['content-disposition'];
                let fileName = contentDisposition.split("filename=");
                if (fileName.length > 0) {

                    success(
                        {
                            blob: response.data,
                            filename: fileName[1],
                            contentType: response.headers['content-type']
                        }
                    )
                }

            }
        });
    }
    const putAxios = (
        url,
        data,
        headerConfig
    ) =>
        new Promise(async (success, error) => {
            const response = await axios
                .put(url, data, getConfig(headerConfig))
                .catch((exception) => handleException(exception, error));
            response && success(response.data)
        })

    const getAxios = (
        url,
        headerConfig
    ) =>
        new Promise(async (success, error) => {
            axios
                .get(url, getConfig(headerConfig))
                .then((response) => success(response.data))
                .catch((exception) => handleException(exception, error))
        });

    const getAxiosWSBinary = (
        url,
        headerConfig
    ) =>
        new Promise(async (success, error) => {
            axios
                .get(url, withBlobConfig(headerConfig))
                .then((response) => {
                    if (response) {
                        const contentDisposition = response.headers['content-disposition'];
                        const contentType = response.headers['content-type'];
                        let fileName = contentDisposition.split("filename=");
                        if (fileName.length > 0) {
                            success(
                                {
                                    blob: response.data,
                                    filename: fileName[1],
                                    contentType: contentType
                                }
                            )
                        }

                    }
                })
                .catch((exception) => handleException(exception, error))
        });

    const deleteAxios = (
        url,
        headerConfig
    ) =>
        new Promise(async (success, error) => {
            const response = await axios
                .delete(url, getConfig(configInput))
                .catch((exception) => handleException(exception, error));
            response && success(response.data);
        });

    return {
        postAxios,
        postAxiosWSBinary,
        putAxios,
        getAxios,
        getAxiosWSBinary,
        deleteAxios
    }
}

export default useAxios;