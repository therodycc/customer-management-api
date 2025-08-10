export const transformExcelData = (data: any): Array<Record<string, any>> => {
  const [headersRow, ...dataRows] = data;

  const headers = headersRow.slice(1);

  const transformedData = dataRows.map((row) => {
    const rowData = row.slice(1);
    const obj: Record<string, any> = {};

    headers.forEach((header, index) => {
      obj[header] = rowData[index];
    });

    return obj;
  });

  return transformedData;
};
