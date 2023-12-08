export default {
    setDataLs(key, value){
        window.localStorage.setItem(key, JSON.stringify(value));
    },
    getDataLs(key){
        const data = JSON.parse(window.localStorage.getItem(key));
        return data
    },
    sectionViewInfo(arrayItem, objInfo) {
        let items = arrayItem
        if (Array.isArray(items)) {
            items.forEach(key => {
                let val = objInfo[key.key];
                if (!val) {
                    val = "-"
                }
                key.value = val;
            });
            return items
        } else {
            return `Parameter ${arrayItem} must be array.`
        }
    },
    getValueNtestedObject(arrayObjectPahtItem, objInfo) {
        let items = arrayObjectPahtItem
        if (Array.isArray(items)) {
            items.forEach(objItem => {
                let valueMatchPath = objItem.path ? objItem.path.split('.').reduce((obj, key) => obj[key], objInfo) : undefined;
                if (!valueMatchPath) {
                    valueMatchPath = '-';
                }
                objItem.value = valueMatchPath
            });
            return items
        } else {
            return `Parameter ${arrayObjectPahtItem} must be array.`
        }
    }

}
