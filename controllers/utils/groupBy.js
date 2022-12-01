const groupBy = (arr, groupKey) => {
    const groupKeyValuesWithDuplicates = arr
        .map(obj => obj[groupKey]);
    const groupKeyValues = groupKeyValuesWithDuplicates
        .filter((value, index) => groupKeyValuesWithDuplicates.indexOf(value) === index);
    const out = groupKeyValues.reduce((prev, cur) => ({ ...prev, [cur]: [] }), {});
    groupKeyValues
        .forEach(value => arr
            .forEach(element => element[groupKey] === value && out[value].push(element)));
    return out;
};

module.exports = groupBy;