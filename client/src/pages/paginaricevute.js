import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

// nome cognome numeroricevuta somma datainiziocorso e datascadenzacorso
// filtra per anno -> ricevuta 001/19 , 001/20, 001/21 ...
const columnsDefinition = [
  { headerName: 'Nome Allieva', field: 'Nome' },
  { headerName: 'Cognome Allieva', field: 'Cognome' },
  { headerName: 'Numero Ricevuta', field: 'NumeroRicevuta' },
  { headerName: 'Data Inizio Corso', field: 'DataInizioCorso', cellRenderer: (params) => (params.value !== 'Invalid date') ? params.value : '' },
  { headerName: 'Data Scadenza Corso', field: 'DataScadenzaCorso', cellRenderer: (params) => (params.value !== 'Invalid date') ? params.value : '' },
  { headerName: 'Somma Euro', field: 'SommaEuro' }
];

const gridOptionsDefault = {
  masterDetail: true,
  defaultColDef: {
    resizable: true,
    sortable: true,
    filter: true,
    cellStyle: { fontSize: '1.5em' }
  },
  rowSelection: 'single'
};

function PaginaAllieve() {
  const [gridOptions /*setGridOptions*/] = useState(gridOptionsDefault);
  const [columnDefs /*setColumnDefs*/] = useState(columnsDefinition);
  const [rowData, setRowData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch('/api/getAllRicevute');
      const body = await result.json();
      setRowData(body);
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="page-body">
        <div className="ag-theme-balham" style={{ height: '40em', width: '100%' }}>
          <AgGridReact
            reactNext={true}
            rowSelection="multiple"
            scrollbarWidth
            rowHeight="45"
            gridOptions={gridOptions}
            columnDefs={columnDefs}
            rowData={rowData}
          ></AgGridReact>
        </div>
      </div>
    </>
  );
}

export default PaginaAllieve;
