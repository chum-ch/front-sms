import { read, utils, write, writeFile } from 'xlsx'
import moment from 'moment';
export default {
  setDataLs(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
  },
  getDataLs(key) {
    const data = JSON.parse(window.localStorage.getItem(key))
    return data
  },
  sectionViewInfo(arrayItem, objInfo) {
    let items = arrayItem
    if (Array.isArray(items)) {
      items.forEach((key) => {
        let val = objInfo[key.key]
        if (!val) {
          val = '-'
        }
        key.value = val
      })
      return items
    } else {
      return `Parameter ${arrayItem} must be array.`
    }
  },
  getValueNestedObject(arrayObjectPathItem, objInfo) {
    let items = arrayObjectPathItem
    if (Array.isArray(items)) {
      items.forEach((objItem) => {
        let valueMatchPath = objItem.path
          ? objItem.path.split('.').reduce((obj, key) => obj[key], objInfo)
          : undefined
        if (!valueMatchPath) {
          valueMatchPath = '-'
        }
        objItem.value = valueMatchPath
      })
      return items
    } else {
      return `Parameter ${arrayObjectPathItem} must be array.`
    }
  },
  // This function is generation file name with current date and code e.g: 2023-09-09(AB12).
  generateFileName() {
    // Generate random combination of two letters and two numbers.
    const randomLetters = [...Array(2)].map(() =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    )
    const randomNumbers = [...Array(2)].map(() => Math.floor(Math.random() * 10))
    const currentDate = new Date()
    const [date] = currentDate.toISOString().split('T')
    const fileName = `${date}(${randomLetters.join('') + randomNumbers.join('')})`
    return fileName
  },
  // This function is prepare and return array object then passed to component check box e.g: [ { Value: 7}].
  getArrObjForCheckBox(obj) {
    const result = {
      ColAutoSelected: [],
      CustomCol: [],
      AllColumns: []
    }
    const { ColumnHeader } = obj
    let concatenatedLabel = ''
    for (const [key, objData] of Object.entries(ColumnHeader)) {
      const { Rules } = objData
      const isRequired = Rules.some((item) => item.Required)
      if (isRequired && objData.Value && objData.Label) {
        result.ColAutoSelected.push({
          [`${key}*`]: objData.Value,
          Label: objData.Label,
          field: `${key}*`
        })
        result.AllColumns.push({ [`${key}*`]: objData.Value })
        concatenatedLabel += objData.Label + ', '
      } else {
        result.AllColumns.push({ [key]: objData.Value })
        result.CustomCol.push({ [key]: objData.Value, Label: objData.Label, field: key })
      }
    }
    // Remove the trailing comma and space
    if (result.ColAutoSelected.length > 0) {
      concatenatedLabel = concatenatedLabel.slice(0, -2)
      result.AutoSelectLabel = concatenatedLabel
    }
    if (result.AllColumns.length > 0 ){
      const mergedObject = result.AllColumns.reduce((result, currentObj) => {
        return { ...result, ...currentObj };
      }, {});
      result.AllColumns = [mergedObject]
    }
    return result
  },
  // This function is prepare and return array object then passed to component for download excel. [ { Name: 'A', Floor: 2 }]
  getDataForDownload(arrObjOriginal, arrObjField) {
    const extractedData = arrObjOriginal.map((item) => {
      const extractedItem = {};
      arrObjField.forEach((definition) => {
        const fields = definition.field.split('.');
        let value = item;
        let key = fields[0];
        fields.forEach((field) => {
          if (value && value.hasOwnProperty(field)) {
            value = value[field];
          } else {
            value = undefined;
          }
        });
        extractedItem[key] = value;
      });
      return extractedItem;
    });
    return extractedData;
  },
  exportToExcel(data, noted = [[]]) {
    if (Object.keys(data).length > 0) {
      const workbook = utils.book_new()
      // Create a new worksheet
      const worksheet = utils.json_to_sheet([])
      let rowNumber = 1
      let numberToMerge = 0
      for (const [index, [key, objData]] of Object.entries(data).entries()) {
        // Extract headers
        const headers = Array.from(new Set(objData.flatMap(Object.keys)))
        const sectionData = objData.map((item) => {
          return headers.map((header) => item[header] || '')
        })
        numberToMerge = headers.length - 1
        // Calculate the starting row for each section
        const origin = index === 0 ? 'A1' : `A${rowNumber + 4}`
        rowNumber = objData.map(Object.values).length
        // Create a new worksheet

        utils.sheet_add_aoa(worksheet, [...noted, [], [], headers, ...sectionData], {
          origin: origin
        })
      }

      // fine the merge range
      for (let index = 0; index < noted.length; index++) {
        const mergeRange = {
          s: { r: index, c: 0 }, // Starting cell (column A, first row) s: start, e: end r: row, c: column,
          e: { r: index, c: numberToMerge } // Ending cell (last column, last row)
        }
        // Merge cells vertically in the column
        worksheet['!merges'] = [...(worksheet['!merges'] || []), mergeRange]
      }

      // Set column widths to fit the content
      const columnWidths = []
      const range = utils.decode_range(worksheet['!ref'])
      for (let col = range.s.c; col <= range.e.c; col++) {
        let maxLength = 0
        for (let row = range.s.r; row <= range.e.r; row++) {
          const cellAddress = utils.encode_cell({ r: row, c: col })
          if (worksheet[cellAddress]) {
            const cellValue = worksheet[cellAddress].v
            const cellTextLength = cellValue ? cellValue.toString().length : 0
            if (cellTextLength > maxLength) {
              maxLength = cellTextLength
            }
          }
        }
        columnWidths[col] = maxLength + 1
      }
      // Apply the column widths
      worksheet['!cols'] = columnWidths.map((width) => ({ wch: width }))
      // Add the worksheet to the workbook
      const sheetName = 'Sheet1'
      utils.book_append_sheet(workbook, worksheet, sheetName)
      // Write the workbook to an Excel file
      writeFile(workbook, `${this.generateFileName()}.xlsx`)
    }
  },
  getDateFormatYYMMDD(date) {
    return moment(date).format('YYYY-MM-DD');
  }
}

