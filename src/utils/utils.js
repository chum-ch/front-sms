import { read, utils, write, writeFile } from 'xlsx'
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
    const arrObjCheckBox = Object.keys(obj).map((item) => ({ Value: item.replace('*', '') }))
    return arrObjCheckBox
  },
  // This function is prepare and return array object then passed to component for download excel. [ { Name: 'A', Floor: 2 }]
  getDataForDownload(arrObjOriginal, arrObjCheckBox) {
    const data = []
    for (const objField of arrObjOriginal) {
      const result = {}
      for (const item of arrObjCheckBox) {
        const key = item.field
        const hasPropertyWithStart = Object.prototype.hasOwnProperty.call(objField, `${key}*`)
        if (hasPropertyWithStart && objField[`${key}*`]) {
          result[`${key}*`] = objField[`${key}*`]
        } else if (objField[key]) {
          result[key] = objField[key]
        }
      }
      if (Object.keys(result).length > 0) {
        data.push(result)
      }
    }
    return data
  },
  exportToExcel(data, noted = [[]]) {
    const workbook = utils.book_new()

    // Define the data to be saved
    // const data = {
    //   section1: [
    //     {
    //       A: "Unknown column.",
    //       B: "Unknown column.",
    //       C: "Unknown column.",
    //       D: "Unknown column.",
    //     }
    //   ],
    //   section2: [
    //     {
    //       RowNumber: 8,
    //       Floor: "Cell required value."
    //     },
    //     {
    //       RowNumber: 10,
    //       Name: "Cell required value."
    //     },
    //     {
    //       RowNumber: 11,
    //       Floor: "Cell required value."
    //     },
    //     {
    //       RowNumber: 13,
    //       Name: "Cell required value."
    //     },
    //     {
    //       RowNumber: 15,
    //       Floor: "Cell required value."
    //     }
    //   ]
    // };

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
      console.log(headers.length)
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
      columnWidths[col] = maxLength
    }
    // Apply the column widths
    worksheet['!cols'] = columnWidths.map((width) => ({ wch: width }))
    // Add the worksheet to the workbook
    const sheetName = 'ErrorData'
    utils.book_append_sheet(workbook, worksheet, sheetName)

    // Define the output file path

    // Write the workbook to an Excel file
    writeFile(workbook, `${this.generateFileName()}.xlsx`)
  }
}
