import NotificationTypeEnum from "../../data/constant/NotificationTypeEnum";

const getCurrentColorNotif = (notificationType) => {
    switch (notificationType) {
        case NotificationTypeEnum.ADD_ORDER.name:
            return "#eaaa37";
        case NotificationTypeEnum.SENT_ORDER.name:
            return "#4eac6d";
        case NotificationTypeEnum.DELIVERED_ORDER.name:
            return "#212529";
        case NotificationTypeEnum.CANCEL_ORDER.name:
            return "#FF0000";
        case NotificationTypeEnum.RAW_MATERIAL_ADDED.name:
            return "#eaaa37";
        case NotificationTypeEnum.PRICE_RAW_MATERIAL_MODIFIED.name:
            return "#4eac6d";
        case NotificationTypeEnum.FIXED_CHARGE_ADDED.name:
            return "#eaaa37";
        case NotificationTypeEnum.PRICE_FIXED_CHARGE_MODIFIED.name:
            return "#4eac6d";
        case NotificationTypeEnum.VARIABLE_CHARGE_ADDED.name:
            return "#eaaa37";
        case NotificationTypeEnum.PRICE_VARIABLE_CHARGE_MODIFIED.name:
            return "#4eac6d";
        default:
    }
}

export default getCurrentColorNotif;