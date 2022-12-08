const formatBadge = (numberForBadge) => {
    if (`${numberForBadge}`.length >= 3) return "99+";
    return `${numberForBadge}`;
}

export default formatBadge;