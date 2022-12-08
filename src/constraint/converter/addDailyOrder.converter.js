
const useAddDailyOrderConverter = {

    toPostDAO: (dataDTO) => {
        let dao = {
            client: {
                adress: "",
                contact: "",
                firstname: "",
                name: ""
            },
            order: []
        };
        dao['client']['adress'] = dataDTO['client']['adress'];
        dao['client']['contact'] = dataDTO['client']['contact'];
        dao['client']['firstname'] = dataDTO['client']['firstname'];
        dao['client']['name'] = dataDTO['client']['name'];
        dataDTO.order.map((dto, index) => {
            dao.order.push({
                food: {
                    label: dto['label']
                },
                free: dto['free'],
                price: dto['price'],
                quantity: dto['quantity'],
                totalPrice: dto['totalPrice']
            });
        });
        return dao;
    }
}


export default useAddDailyOrderConverter;