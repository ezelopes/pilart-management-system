import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Button } from 'react-bootstrap';

import { useReceipt } from '../ReceiptContext';
import FilterReceiptsForm from '../FilterReceiptsForm';
import PrintExpiringReceiptsForm from '../PrintExpiringReceiptsForm';

import Translation from '../../common/Translation';
import { printSelectedReceipts } from '../../../helpers/printPDF';
import { gridOptionsDefaultReceipts } from '../../../commondata/grid.config';

const columnsDefinition = [
  { headerName: 'N° Ricevuta', field: 'ReceiptNumber', checkboxSelection: true, headerCheckboxSelection: true },
  { headerName: 'Nome', field: 'Name' },
  { headerName: 'Cognome', field: 'Surname' },
  {
    headerName: 'Data Ricevuta',
    field: 'ReceiptDate',
    cellRenderer: (params) => (params.value ? new Date(params.value).toLocaleDateString() : ''),
  },
  {
    headerName: 'Inizio Corso',
    field: 'CourseStartDate',
    cellRenderer: (params) => (params.value ? new Date(params.value).toLocaleDateString() : ''),
  },
  {
    headerName: 'Scadenza Corso',
    field: 'CourseEndDate',
    cellRenderer: (params) => (params.value ? new Date(params.value).toLocaleDateString() : ''),
  },
  { headerName: 'Somma Euro', field: 'AmountPaid' },
  { headerName: 'Tipo Pagamento', field: 'PaymentMethod' },
  {
    headerName: 'Include Quota Associativa',
    field: 'IncludeMembershipFee',
    cellRenderer: (params) => (params.value ? '✅' : ''),
    cellClass: 'ag-grid-cell-centered',
  },
];

const ReceiptsList = () => {
  const { allReceipts, currentReceipts, setCurrentReceipts } = useReceipt();

  const [gridOptions] = useState(gridOptionsDefaultReceipts);

  const [receiptsForAmountSummary, setReceiptsForAmountSummary] = useState([]);

  const [selectedReceipts, setSelectedReceipts] = useState([]);

  const onReceiptSelectionChanged = () => {
    const selectedNodes = gridOptions.api.getSelectedNodes();
    if (selectedNodes.length === 0) {
      return setSelectedReceipts([]);
    }

    const receipts = [];
    selectedNodes.forEach((node) => {
      receipts.push(node.data);
    });

    return setSelectedReceipts(receipts);
  };

  useEffect(() => {
    setSelectedReceipts([]);
    setReceiptsForAmountSummary([]);
  }, [currentReceipts]);

  return (
    <>
      <div className="container-fluid">
        <FilterReceiptsForm
          allReceipts={allReceipts}
          receiptsForAmountSummary={receiptsForAmountSummary}
          setCurrentReceipts={setCurrentReceipts}
          setReceiptsForAmountSummary={setReceiptsForAmountSummary}
          gridOptions={gridOptions}
        />
        <div className="ag-theme-alpine ag-grid-custom">
          <AgGridReact
            reactNext
            gridOptions={gridOptions}
            columnDefs={columnsDefinition}
            rowData={currentReceipts}
            onSelectionChanged={onReceiptSelectionChanged}
          />
        </div>

        <Button variant="success" onClick={() => printSelectedReceipts(selectedReceipts)} style={{ marginTop: '1em' }}>
          <span role="img" aria-label="print-selected">
            🖨️ <Translation value="buttons.receipt.printSelectedReceipts" />
          </span>
        </Button>
      </div>

      <PrintExpiringReceiptsForm />
    </>
  );
};

export default ReceiptsList;
