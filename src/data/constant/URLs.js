const WSLinks = {

    login: "/signin",

    addDailyOrder: "/api/daily/order/add",
    getDailyOrder: "/api/daily/order/findByMonthYear",
    exportDailyOrder: "/api/daily/order/exportById",
    nextStepDailyOrder: "/api/daily/order/next/status",
    cancelDailyOrder: "/api/daily/order/canceled",
    searchDailyOrder: "/api/daily/order/search",

    popularFood: "/api/food/getPopularFood",

    reduction: "/api/report/getReduction",
    turnover: "/api/report/getTurnOver",

    rawMaterialAdd: "/api/rawmaterial/add",
    rawMaterialGet: "/api/rawmaterial/get",
    rawMaterialGetSum: "/api/rawmaterial/getSum",
    rawMaterialUpdate: "/api/rawmaterial/update",

    fixedChargeAdd: "/api/charge/fixed/add",
    fixedChargeGet: "/api/charge/fixed/get",
    fixedChargeGetSum: "/api/charge/fixed/getSum",
    fixedChargeUpdate: "/api/charge/fixed/update",

    variableChargeAdd: "/api/charge/variable/add",
    variableChargeGet: "/api/charge/variable/get",
    variableChargeGetSum: "/api/charge/variable/getSum",
    variableChargeUpdate: "/api/charge/variable/update",

    userNotification: "/api/notification/getUserNotificatoin",
    notificationHistory: "/api/notification/getHistory",
    userNotificationNumber: "/api/notification/getUserNotificatoinNumber"
}

export { WSLinks };