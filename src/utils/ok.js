import XLSX from 'xlsx';

export default {
  methods: {
    exportToExcel() {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet([]);

      // Define the data to be saved
      const data = {
        section1: [
          {
            A: "Unknown column.",
            B: "Unknown column."
          }
        ],
        section2: [
          {
            RowNumber: 8,
            Floor: "Cell required value."
          },
          {
            RowNumber: 10,
            Name: "Cell required value."
          },
          {
            RowNumber: 11,
            Floor: "Cell required value."
          },
          {
            RowNumber: 13,
            Name: "Cell required value."
          },
          {
            RowNumber: 15,
            Floor: "Cell required value."
          }
        ]
      };

      // Add section 1 data to the worksheet with headers
      const section1Headers = Object.keys(data.section1[0]);
      const section1Data = data.section1.map(Object.values);
      XLSX.utils.sheet_add_aoa(worksheet, [section1Headers, ...section1Data], {
        origin: 'A1'
      });

      // Calculate the starting row for section 2
      const section2StartRow = section1Data.length + 3;

      // Add section 2 data to the worksheet with headers
      const section2Headers = Array.from(
        new Set(data.section2.flatMap(Object.keys))
      );
      const section2Data = data.section2.map(item => {
        return section2Headers.map(header => item[header] || "");
      });
      XLSX.utils.sheet_add_aoa(worksheet, [section2Headers, ...section2Data], {
        origin: `A${section2StartRow}`
      });

      // Add the worksheet to the workbook
      const sheetName = 'Data';
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      // Define the output file path
      const outputPath = 'path/to/output.xlsx';

      // Write the workbook to an Excel file
      XLSX.writeFile(workbook, outputPath);

      // Display a success message
      console.log(`Excel file saved to: ${outputPath}`);
    }
  }
};