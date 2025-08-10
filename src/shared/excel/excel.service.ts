import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { BufferedFile } from '../minio-client/file.model';
import { TransformDataResultI } from './excel.interface';
import { transformExcelData } from './helpers/transform-excel-data';

@Injectable()
export class ExcelService {
  async generateExcel<T>(
    data: T[],
    workSheetName: string = 'Sheet 1',
    res: Response,
    objetKeys: Object,
  ) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(workSheetName);
    const columns: { header: string; key: string }[] = [];

    if (data.length > 0) {
      const headers: string[] = [];

      Object.keys(data[0]).forEach((key) => {
        const mappedValue = objetKeys[key] || key;

        columns.push({
          header: mappedValue,
          key: key,
        });

        headers.push(mappedValue);
      });
      worksheet.addRow(headers);
    }
    worksheet.columns = columns;

    worksheet.getRow(1).font = { bold: true };

    data.forEach((item) => worksheet.addRow(item));

    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      const columnData = column.values;

      columnData.forEach((value) => {
        if (value) {
          const length = value.toString().length;
          if (length > maxLength) {
            maxLength = length;
          }
        }
      });

      column.width = maxLength + 2;
    });
    const buffer: ExcelJS.Buffer = await workbook.xlsx.writeBuffer();

    res.set({
      'Content-Disposition': 'attachment; filename=tecnicos23.xlsx',
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Access-Control-Expose-Headers': 'Content-Disposition',
    });

    res.send(buffer);
  }

  async readExcel(
    file: BufferedFile,
    sheetNumber: number = 1,
  ): Promise<TransformDataResultI> {
    if (!file) {
      throw new Error('No file provided');
    }

    const workbook = new ExcelJS.Workbook();
    type NewType = Buffer;

    await workbook.xlsx.load(file.buffer as NewType);

    const worksheet = workbook.getWorksheet(sheetNumber);
    const data = [];

    worksheet.eachRow((row, rowNumber) => {
      data.push(row.values);
    });

    return {
      originalName: file.originalname,
      data: transformExcelData(data),
    };
  }
}
