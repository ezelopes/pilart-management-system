import React, { useState, useEffect, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { AgGridReact } from 'ag-grid-react';
import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';
import FilteredReceiptsModal from '../components/FilteredReceiptsModal'
import formatDate from '../helpers/formatDateForInputDate';
import orderReceiptsBasedOnReceiptNumber from '../helpers/orderReceiptsBasedOnReceiptNumber';
import reverseDate from '../helpers/reverseDateForInputDate';

const ReceiptTemplateAdultd = require('../pdfTemplates/ReceiptTemplateAdult');
const ReceiptTemplateUnderAge = require('../pdfTemplates/ReceiptTemplateUnderAge');

const MembershipFeeTemplateAdult = require('../pdfTemplates/MembershipFeeTemplateAdult');
const MembershipFeeTemplateUnderAge = require('../pdfTemplates/MembershipFeeTemplateUnderAge');

pdfMake.vfs = pdfFonts.pdfMake.vfs;

require('ag-grid-community/dist/styles/ag-grid.css');
require('ag-grid-community/dist/styles/ag-theme-balham.css');

const columnsDefinition = [
  { headerName: 'N° Ricevuta', field: 'ReceiptNumber', checkboxSelection: true },
  { headerName: 'Nome', field: 'Name' },
  { headerName: 'Cognome', field: 'Surname' },
  { headerName: 'Data Ricevuta', field: 'ReceiptDate', cellRenderer: (params) => (params.value !== 'Invalid date') ? params.value : '' },
  { headerName: 'Inizio Corso', field: 'CourseStartDate', cellRenderer: (params) => (params.value !== 'Invalid date') ? params.value : '' },
  { headerName: 'Scadenza Corso', field: 'CourseEndDate', cellRenderer: (params) => (params.value !== 'Invalid date') ? params.value : '' },
  { headerName: 'Somma Euro', field: 'AmountPaid' },
  { headerName: 'Tipo Pagamento', field: 'PaymentType' }
];

const gridOptionsDefault = {
  masterDetail: true,
  defaultColDef: {
    resizable: true,
    sortable: true,
    filter: true,
    floatingFilter: true,
    cellStyle: { fontSize: '1.5em' },
    flex: 10
  },
  rowSelection: 'single'
};

const paymentMethods = [ null, 'Contanti', 'Bonifico', 'Assegno' ];

const ReceiptsPage = () => {
  const today = formatDate(new Date(), true);

  const [gridOptions] = useState(gridOptionsDefault);
  const [columnDefs] = useState(columnsDefinition);
  const [allReceipts, setAllReceipts] = useState([]);
  const [currentReceipts, setCurrentReceipts] = useState([]);
  const [filteredReceipts, setFilteredReceipts] = useState([]);
  const [selectedReceipts, setSelectedReceipts] = useState([]);
  const [filteredTotalAmount, setFilteredTotalAmount] = useState(0);
  const [showFilteredAmountModal, setShowFilteredAmountModal] = useState(false);
  const [filteredPaymentMethod, setFilteredPaymentMethod] = useState(null);
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);

  const selectPaymentMethodRef = useRef();
  const fromDateRef = useRef();
  const toDateRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch('/api/receipt/getAllReceipts');
      const body = await result.json();
      
      const orderedReceipts = orderReceiptsBasedOnReceiptNumber(body)

      setAllReceipts(orderedReceipts);
      setCurrentReceipts(orderedReceipts);
    };
    fetchData();
    gridOptions.api.sizeColumnsToFit();

    window.addEventListener('resize', () => { gridOptions.api.sizeColumnsToFit(); })

  }, []);

  const onReceiptSelectionChanged = () => {
    const selectedNodes = gridOptions.api.getSelectedNodes();
    if (selectedNodes.length === 0) return setSelectedReceipts([]);

    const receipts = []
    selectedNodes.forEach(node => {
      receipts.push(node.data)
    });

    setSelectedReceipts(receipts);
  }

  const printReceipts = async () => {    
    try {
      if (selectedReceipts.length === 0) return alert('Seleziona Ricevute per Stamparle');

      const finalDocumentDefinition = { 
        info: { author: "Roxana Carro", subject: "Ricevute", title: "Ricevute Multiple" }, 
        pageMargins: [40, 5, 40, 0], 
        content: [],
      }

      for (const [index, data] of selectedReceipts.entries()) {
        let documentDefinition;

        const studentInfo = {
          IsAdult: data.IsAdult,
          TaxCode: data.TaxCode,
          Name: data.Name,
          Surname: data.Surname,
          City: data.City,
          Address: data.Address,
          MobilePhone: data.MobilePhone,
          Email: data.Email,
          RegistrationDate: data.RegistrationDate,
          CertificateExpirationDate: data.CertificateExpirationDate,
          DOB: data.DOB,
          BirthPlace: data.BirthPlace,
          Discipline: data.Discipline,
          Course: data.Course,
          School: data.School,
          ParentName: data.ParentName,
          ParentSurname: data.ParentSurname,
          ParentTaxCode: data.ParentTaxCode
        }
        
        const receiptInfo = {
          ReceiptNumber: data.ReceiptNumber,
          AmountPaid: data.AmountPaid,
          PaymentType: data.PaymentType,
          ReceiptType: data.ReceiptType,
          ReceiptDate: data.ReceiptDate,
          CourseStartDate: data.CourseStartDate,
          CourseEndDate: data.CourseEndDate
        }

        if (studentInfo.IsAdult === 'Maggiorenne' && receiptInfo.ReceiptType === 'Quota') 
          documentDefinition = await ReceiptTemplateAdultd.default(studentInfo, receiptInfo);
        else if (studentInfo.IsAdult === 'Maggiorenne' && receiptInfo.ReceiptType.toUpperCase() === 'QUOTA ASSOCIATIVA')
          documentDefinition = await MembershipFeeTemplateAdult.default(studentInfo, receiptInfo);
        else if (studentInfo.IsAdult === 'Minorenne' && receiptInfo.ReceiptType === 'Quota')
          documentDefinition = await ReceiptTemplateUnderAge.default(studentInfo, receiptInfo);
        else if (studentInfo.IsAdult === 'Minorenne' && receiptInfo.ReceiptType.toUpperCase() === 'QUOTA ASSOCIATIVA')
          documentDefinition = await MembershipFeeTemplateUnderAge.default(studentInfo, receiptInfo);

        if (index % 2 == 1) {
          documentDefinition.content[documentDefinition.content.length - 1].pageBreak = "after"
          documentDefinition.content[documentDefinition.content.length - 1].canvas = []
        }
        Array.prototype.push.apply(finalDocumentDefinition.content, documentDefinition.content);
      }

      pdfMake.createPdf(finalDocumentDefinition).open();
    } catch (error) {
      console.log(error);
    }
  };

  const filterReceipts = () => {
    const fromDateFormatted = new Date(fromDate)
    const toDateFormatted = new Date(toDate)

    const receiptsWithDateFilter = allReceipts.filter(({ ReceiptDate }) =>
      fromDateFormatted <= new Date(reverseDate(ReceiptDate)) && 
      toDateFormatted >= new Date(reverseDate(ReceiptDate))
    )

    if (!filteredPaymentMethod) {
      return setCurrentReceipts(receiptsWithDateFilter)
    }

    const receiptsWithPaymentAndDateFilters = receiptsWithDateFilter.filter(({ PaymentType }) =>
       PaymentType.includes(filteredPaymentMethod)
    )    

    setCurrentReceipts(receiptsWithPaymentAndDateFilters)
  }

  const clearFilters = () => {
    const PaymentMethodFilterComponent = gridOptions.api.getFilterInstance('PaymentType');
    
    PaymentMethodFilterComponent.setModel(null);
    gridOptions.api.onFilterChanged();

    // set default values in other components
    selectPaymentMethodRef.current.value = null;
    fromDateRef.current.value = today
    toDateRef.current.value = today

    setCurrentReceipts(allReceipts)
  }

  const calculateAmountBetweenDates = () => {
    if (!filteredPaymentMethod) return alert("Seleziona Tipo di Pagamento!")

    const fromDateFormatted = new Date(fromDate)
    const toDateFormatted = new Date(toDate)

    const receipts = allReceipts.filter(({ ReceiptDate, PaymentType }) =>
      fromDateFormatted <= new Date(reverseDate(ReceiptDate)) && 
      toDateFormatted >= new Date(reverseDate(ReceiptDate)) &&
      PaymentType.includes(filteredPaymentMethod)
    )

    const filteredAmount = receipts.reduce((accumulator, { AmountPaid }) => {
      return accumulator +  parseFloat(AmountPaid);
    }, 0);
    
    const copy = [...receipts]
    const orderedReceipts = orderReceiptsBasedOnReceiptNumber(copy)

    setFilteredReceipts(orderedReceipts)
    setFilteredTotalAmount(filteredAmount)
    setShowFilteredAmountModal(true)
  }

  const orderReceipts = () => {
    const copy = [...currentReceipts]
    const orderedReceipts = orderReceiptsBasedOnReceiptNumber(copy)

    setCurrentReceipts(orderedReceipts)
  }

  return (
    <>
      <div className="page-body">
          <div className="filter-form">
            <Form.Group>
              <Form.Label> Seleziona Tipo Pagamento: </Form.Label>
              <Form.Control ref={selectPaymentMethodRef} as="select" onChange={({ target }) => setFilteredPaymentMethod(target.value)}>
                { paymentMethods.map(method => <option key={`select_${method}`} value={method}> {method} </option>) }
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label> Da: </Form.Label> <br />
              <input ref={fromDateRef} type="date" defaultValue={today} onChange={({ target }) => setFromDate(target.value)} />
            </Form.Group>

            <Form.Group>
              <Form.Label> A: </Form.Label> <br />
              <input ref={toDateRef} type="date" defaultValue={today} onChange={({ target }) => setToDate(target.value)} />
            </Form.Group>
          </div>
          
          <div className="buttons-container">
            <Button variant="success" onClick={calculateAmountBetweenDates}>
              Calcola Importo Totale
            </Button>
            
            <Button variant="primary" onClick={filterReceipts}>
              Filtra
            </Button>
            
            <Button variant="primary" onClick={orderReceipts}>
              Ordina per Numero Ricevuta
            </Button>

            <Button variant="danger" onClick={clearFilters}>
              Rimuovi Filtri
            </Button>
          </div>

        <div className="ag-theme-balham" style={{ height: '40em', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', marginTop: '2em' }}>
          <AgGridReact
            reactNext={true}
            rowSelection="multiple"
            scrollbarWidth
            rowHeight="45"
            gridOptions={gridOptions}
            columnDefs={columnDefs}
            rowData={currentReceipts}
            onSelectionChanged={onReceiptSelectionChanged}
          ></AgGridReact>
        </div>
        
        <div className="buttons-container">
          <Button variant="success" onClick={printReceipts}>
            Stampa Ricevute Selezionate
          </Button>
        </div>
      </div>

      <FilteredReceiptsModal 
        showFilteredAmountModal={showFilteredAmountModal}
        setShowFilteredAmountModal={setShowFilteredAmountModal}
        filteredTotalAmount={filteredTotalAmount}
        filteredReceipts={filteredReceipts}
        fromDate={fromDate}
        toDate={toDate}
        filteredPaymentMethod={filteredPaymentMethod}
      />
    </>
  );
}

export default ReceiptsPage;