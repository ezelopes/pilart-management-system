import React, { useEffect } from 'react';
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { AgGridReact } from 'ag-grid-react';
import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { ToastContainer, toast } from 'react-toastify';

import CreateUpdateReceiptForm from './CreateUpdateReceiptForm';
import { updateReceipt, deleteReceipt } from '../helpers/apiCalls';
import toastConfig from '../helpers/toast.config';
import { ages, receiptType } from '../commondata/commondata'

import 'react-toastify/dist/ReactToastify.css';
import { useStudent } from './StudentContext';

const ReceiptTemplateAdult = require('../pdfTemplates/ReceiptTemplateAdult');
const ReceiptTemplateUnderAge = require('../pdfTemplates/ReceiptTemplateUnderAge');

const MembershipFeeTemplateAdult = require('../pdfTemplates/MembershipFeeTemplateAdult');
const MembershipFeeTemplateUnderAge = require('../pdfTemplates/MembershipFeeTemplateUnderAge');

pdfMake.vfs = pdfFonts.pdfMake.vfs;

require('ag-grid-community/dist/styles/ag-grid.css');
require('ag-grid-community/dist/styles/ag-theme-balham.css');

const gridOptionsDefault = {
  masterDetail: true,
  defaultColDef: {
    resizable: true,
    sortable: true,
    filter: true,
    cellStyle: { fontSize: '1.5em' }
  }
};

const columnsDefinition = [
  { headerName: 'Numero Ricevuta', field: 'ReceiptNumber', checkboxSelection: true },
  { headerName: 'Tipo Ricevuta', field: 'ReceiptType' },
  { headerName: 'Data Ricevuta', field: 'ReceiptDate', cellRenderer: (params) => params.value ? (new Date(params.value)).toLocaleDateString() : '' },
  { headerName: 'Data Inizio Corso', field: 'CourseStartDate', cellRenderer: (params) => params.value ? (new Date(params.value)).toLocaleDateString() : '' },
  { headerName: 'Data Scadenza Corso', field: 'CourseEndDate', cellRenderer: (params) => params.value ? (new Date(params.value)).toLocaleDateString() : '' },
  { headerName: 'Somma Euro', field: 'AmountPaid' },
  { headerName: 'Tipo Pagamento', field: 'PaymentMethod' }
];

const StudentReceiptsList = () => {
  const { studentInfo, studentReceipts, setStudentReceipts } = useStudent()

  const [gridOptions] = useState(gridOptionsDefault);
  const [columnDefs] = useState(columnsDefinition);
  const [rowData, setRowData] = useState(studentReceipts)

  const [selectedReceipt, setSelectedReceipt] = useState();
  const [showDeleteReceiptModal, setShowDeleteReceiptModal] = useState(false);
  const [showUpdateReceiptModal, setShowUpdateReceiptModal] = useState(false);

  useEffect(() => {
    setRowData(studentReceipts)
  }, [studentReceipts])


  const onGridReady = (params) => {
    try{
      params.api.sizeColumnsToFit();
      window.addEventListener('resize', () => { params.api.sizeColumnsToFit(); })
    } catch (err) {
      console.log(err);
    }
  }

  const printReceipt = async () => {    
    try {
      if (!selectedReceipt) return toast.error('Seleziona Ricevuta per Stamparla', toastConfig);
      let documentDefinition;

      if (studentInfo.IsAdult === ages[0].age && selectedReceipt.ReceiptType === receiptType[0].type) 
        documentDefinition = await ReceiptTemplateAdult.default(studentInfo, selectedReceipt);
      else if (studentInfo.IsAdult === ages[0].age && selectedReceipt.ReceiptType === receiptType[1].type)
        documentDefinition = await MembershipFeeTemplateAdult.default(studentInfo, selectedReceipt);
      else if (studentInfo.IsAdult === ages[1].age && selectedReceipt.ReceiptType === receiptType[0].type)
        documentDefinition = await ReceiptTemplateUnderAge.default(studentInfo, selectedReceipt);
      else if (studentInfo.IsAdult === ages[1].age && selectedReceipt.ReceiptType === receiptType[1].type)
        documentDefinition = await MembershipFeeTemplateUnderAge.default(studentInfo, selectedReceipt);

      pdfMake.createPdf(documentDefinition).open();
    } catch (error) {
      console.log(error);
    }
  };

  const onReceiptSelectionChanged = () => {
    const selectedNode = gridOptions.api.getSelectedNodes();
    if (selectedNode.length === 0) return setSelectedReceipt(null);

    setSelectedReceipt(selectedNode[0].data);
  }

  const handleDeleteReceipt = async () => {
    const response = await deleteReceipt(selectedReceipt.ReceiptID);

    const updatedStudentReceipts = [...studentReceipts]
    const receiptIndex = studentReceipts.findIndex((receipt => receipt.ReceiptID == selectedReceipt.ReceiptID))

    updatedStudentReceipts.splice(receiptIndex, 1);

    response.status === 200 
      ? toast.success(response.message, toastConfig)
      : toast.error(response.message, toastConfig)

    setStudentReceipts(updatedStudentReceipts)
    setShowDeleteReceiptModal(false); 
  } 

  return (
    <>
      <ToastContainer />

      <div className="ag-theme-balham student-receipt-list">
        <AgGridReact
          scrollbarWidth
          rowHeight="45"
          rowSelection="single"
          gridOptions={gridOptions}
          columnDefs={columnDefs}
          rowData={rowData}
          onSelectionChanged={onReceiptSelectionChanged}
          onGridReady={onGridReady}
        ></AgGridReact>
      </div>

      <div className="buttons-container">
        <Button onClick={ async () => await printReceipt() }>
          <span role='img' aria-label='receipt'>🧾</span> STAMPA RICEVUTA
        </Button>
        
        <Button variant='warning' onClick={ () => { 
          if (!selectedReceipt) return toast.error('Seleziona Ricevuta per Aggiornarla', toastConfig);
          setShowUpdateReceiptModal(true)} 
        }>
          <span role='img' aria-label='update'>🔄</span> AGGIORNA RICEVUTA
        </Button>

        <Button variant='danger' onClick={ () => { 
          if (!selectedReceipt) return toast.error('Seleziona Ricevuta per Eliminarla', toastConfig); 
          setShowDeleteReceiptModal(true)} 
        }>
          <span role='img' aria-label='bin'>🗑️</span> ELIMINA RICEVUTA
        </Button>
      </div>

      <Modal show={showUpdateReceiptModal} onHide={() => setShowUpdateReceiptModal(false) } dialogClassName="update-student-modal" centered>
        <Modal.Header closeButton>
          <Modal.Title> Aggiorna Ricevuta </Modal.Title>
        </Modal.Header>
        <Modal.Body className="update-student-modal-body">
            <CreateUpdateReceiptForm receiptInfo={selectedReceipt} callback={updateReceipt} handleModal={setShowUpdateReceiptModal} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowUpdateReceiptModal(false) } }>
            CHIUDI
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteReceiptModal} onHide={ () => setShowDeleteReceiptModal(false) } centered>
        <Modal.Header closeButton>
          <Modal.Title> Elimina Ricevuta </Modal.Title>
        </Modal.Header>
        <Modal.Body className="filtered-receipt-modal">
            Sei sicura di voler eliminare la ricevuta selezionata?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDeleteReceipt}>
            ELIMINA
          </Button>
          <Button variant="secondary" onClick={() => { setShowDeleteReceiptModal(false) } }>
            CHIUDI
          </Button>
        </Modal.Footer>
      </Modal>
      
    </>
  );
};

export default StudentReceiptsList;
