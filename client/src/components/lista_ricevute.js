const React = require('react');
const { useState } = require('react');
const { Button } = require('react-mdl');
const { AgGridReact } = require('ag-grid-react');
const pdfMake = require('pdfmake/build/pdfmake.js');
const pdfFonts = require('pdfmake/build/vfs_fonts.js');
const pdfTemplateMaggiorenni = require('../helpers/pdf-template-maggiorenni');
const pdfTemplateMinorenni = require('../helpers/pdf-template-minorenni');

const pdfTemplateQuotaAssociativaMaggiorenni = require('../helpers/pdf-template-quota-associativa-maggiorenni');
const pdfTemplateQuotaAssociativaMinorenni = require('../helpers/pdf-template-quota-associativa-minorenni');

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
  { headerName: 'Numero Ricevuta', field: 'NumeroRicevuta', checkboxSelection: true, editable: true },
  { headerName: 'Tipo Ricevuta', field: 'TipoRicevuta', editable: true },
  { headerName: 'Data Ricevuta', field: 'DataRicevuta', editable: true },
  { headerName: 'Data Inizio Corso', field: 'DataInizioCorso', editable: true, cellRenderer: (params) => (params.value != 'Invalid date') ? params.value : '' },
  { headerName: 'Data Scadenza Corso', field: 'DataScadenzaCorso', editable: true, cellRenderer: (params) => (params.value != 'Invalid date') ? params.value : '' },
  { headerName: 'Somma Euro', field: 'SommaEuro', editable: true },
  { headerName: 'Tipo Pagamento', field: 'TipoPagamento', editable: true },
  { headerName: 'Codice Fiscale', field: 'FK_CodiceFiscale' }
];

const ListaRicevute = ({ ricevute, allievaInfo }) => {
  const [gridOptions /*setGridOptions*/] = useState(gridOptionsDefault);
  const [columnDefs /*setColumnDefs*/] = useState(columnsDefinition);

  const rowData = ricevute;
  console.log(rowData);

  const stampaRicevute = async () => {
    const ricevuteSelezionate = gridOptions.api.getSelectedNodes();
    if (ricevuteSelezionate.length === 0 || ricevuteSelezionate.length > 1) return;

    try {
      let documentDefinition;

      if (allievaInfo.Maggiorenne === 'Maggiorenne' && ricevuteSelezionate[0].data.TipoRicevuta === 'Quota') 
        documentDefinition = await pdfTemplateMaggiorenni.default(allievaInfo, ricevuteSelezionate[0].data);
      else if (allievaInfo.Maggiorenne === 'Maggiorenne' && ricevuteSelezionate[0].data.TipoRicevuta === 'Quota Associativa')
        documentDefinition = await pdfTemplateQuotaAssociativaMaggiorenni.default(allievaInfo, ricevuteSelezionate[0].data);
      else if (allievaInfo.Maggiorenne === 'Minorenne' && ricevuteSelezionate[0].data.TipoRicevuta === 'Quota')
        documentDefinition = await pdfTemplateMinorenni.default(allievaInfo, ricevuteSelezionate[0].data);
      else if (allievaInfo.Maggiorenne === 'Minorenne' && ricevuteSelezionate[0].data.TipoRicevuta === 'Quota Associativa')
        documentDefinition = await pdfTemplateQuotaAssociativaMinorenni.default(allievaInfo, ricevuteSelezionate[0].data);
      

      pdfMake.createPdf(documentDefinition).open();
    } catch (error) {
      console.log(error);
    }
  };

  const eliminaRicevute = async () => {
    const ricevuteSelezionate = gridOptions.api.getSelectedNodes();
    if (ricevuteSelezionate.length === 0) return;

    const idRicevuteSelezionate = ricevuteSelezionate.map(ricevuta => {
      return ricevuta.data.RicevutaID;
    });

    const response = await fetch('/api/eliminaRicevute', {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        RicevuteId: idRicevuteSelezionate
      })
    });
    const responseParsed = await response.json();
    alert(responseParsed.message);
  };

  const modificaRicevuta = async (event) => {
    const updatedRicevuta = event.data;
    const response = await fetch('/api/modificaRicevuta', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        RicevutaID: updatedRicevuta.RicevutaID,
        NumeroRicevuta: updatedRicevuta.NumeroRicevuta,
        TipoRicevuta: updatedRicevuta.TipoRicevuta,
        DataRicevuta: updatedRicevuta.DataRicevuta.split("-").reverse().join("-"),
        DataInizioCorso: updatedRicevuta.DataInizioCorso.split("-").reverse().join("-"),
        DataScadenzaCorso: updatedRicevuta.DataScadenzaCorso.split("-").reverse().join("-"),
        SommaEuro: updatedRicevuta.SommaEuro,
        TipoPagamento: updatedRicevuta.TipoPagamento,
      })
    });
    const responseParsed = await response.json();
    alert(responseParsed.message);
  }

  return (
    <>
      <div
        className="ag-theme-balham"
        id="listaRicevute"
        style={{ marginTop: '2em', height: '20em', width: '90%' }}
      >
        <AgGridReact
          // rowSelection="multiple"
          scrollbarWidth
          rowHeight="45"
          gridOptions={gridOptions}
          columnDefs={columnDefs}
          rowData={rowData}
          onCellValueChanged={modificaRicevuta}
        ></AgGridReact>
      </div>

      <Button raised ripple id="buttonStampaRicevute" onClick={stampaRicevute} style={{ marginTop: '2em' }}>
        Stampa Ricevuta
      </Button>
      <Button
        raised
        ripple
        id="buttonEliminaRicevute"
        onClick={eliminaRicevute}
        style={{ marginTop: '2em', marginLeft: '2em' }}
      >
        Elimina Ricevuta
      </Button>
    </>
  );
};

export default ListaRicevute;