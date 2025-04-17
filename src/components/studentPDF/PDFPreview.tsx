import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import StudentPDF from './StudentPDF';
import { FormData } from '../../interface';

interface Props {
  expediente: FormData;
}

const PDFPreview: React.FC<Props> = ({ expediente }) => {
  return (
    <div style={{ height: '100vh' }}>
      <PDFViewer width="100%" height="100%">
        <StudentPDF student={expediente} />
      </PDFViewer>
    </div>
  );
};

export default PDFPreview;
