import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AgGridReact } from 'ag-grid-react';
import { Button } from 'react-bootstrap';

import FilterReceiptsForm from '../FilterReceiptsForm';
import PrintExpiringReceiptsForm from '../PrintExpiringReceiptsForm';

import Translation from '../../common/Translation';
import { printSelectedReceipts } from '../../../helpers/printPDF';
import { gridOptionsDefaultReceipts as gridOptions } from '../../../commondata/grid.config';
import DeleteReceiptsButton from './DeleteReceiptsButton';

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

const ReceiptsList = ({ receipts }) => {
  const [currentReceipts, setCurrentReceipts] = useState(receipts);

  const [selectedReceipts, setSelectedReceipts] = useState([]);

  const onReceiptSelectionChanged = () => {
    const selectedNodes = gridOptions.api.getSelectedNodes();

    const receiptsData = selectedNodes.map(({ data }) => data);

    return setSelectedReceipts(receiptsData);
  };

  const receiptIDs = selectedReceipts.map((receipt) => receipt.ReceiptID);

  const onDelete = async () => {
    const updatedList = currentReceipts.filter((r) => !receiptIDs.includes(r.ReceiptID));

    setCurrentReceipts(updatedList);

    gridOptions.api.setRowData(updatedList);
  };

  return (
    <>
      <div className="container-fluid">
        <FilterReceiptsForm allReceipts={receipts} setCurrentReceipts={setCurrentReceipts} />
        <div className="ag-theme-alpine ag-grid-custom">
          <AgGridReact
            reactNext
            gridOptions={gridOptions}
            columnDefs={columnsDefinition}
            rowData={currentReceipts}
            onSelectionChanged={onReceiptSelectionChanged}
          />
        </div>

        <div className="buttons-container">
          <Button
            variant="success"
            onClick={() => printSelectedReceipts(selectedReceipts)}
            disabled={selectedReceipts.length < 1}
          >
            <span role="img" aria-label="print-selected">
              🖨️ <Translation value="buttons.receipt.printSelectedReceipts" />
            </span>
          </Button>

          <DeleteReceiptsButton receiptIDs={receiptIDs} onDelete={onDelete} />
        </div>
      </div>

      <PrintExpiringReceiptsForm receipts={receipts} />
    </>
  );
};

ReceiptsList.propTypes = {
  /**
   * List of all receipts.
   */
  receipts: PropTypes.array.isRequired,
};

export default ReceiptsList;
