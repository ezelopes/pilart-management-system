import React from 'react';
import { Button } from 'react-mdl';
import 'react-widgets/dist/css/react-widgets.css';
import simpleNumberLocalizer from 'react-widgets-simple-number';
import { Combobox, DateTimePicker } from 'react-widgets';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import formatDate from '../helpers/format-date-for-input-date';

moment.locale('es');
momentLocalizer();

simpleNumberLocalizer();

const FormCreaRicevuta = ({ CodiceFiscale }) => {
  const today = formatDate(new Date(), true);
  let tipoPagamento = [
    { id: 0, tipo: 'Contanti' },
    { id: 1, tipo: 'Carta di Credito' },
    { id: 2, tipo: 'Bonifico' }
  ];
  let sommaEuro = [
    { id: 0, somma: '90' },
    { id: 1, somma: '120' },
    { id: 2, somma: '150' }
  ];

  const creaRicevuta = async () => {
    // AGGIUNGI CONTROLLI SU DATA, SOMMA, TIPO.
    if (document.getElementById('textNumeroRicevuta').value === '') {
      document.getElementById('textNumeroRicevuta').style.borderColor = 'red';
      return;
    }
    const response = await fetch('/api/creaRicevuta', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        // Authorization: 'Bearer ' + idToken
      },
      body: JSON.stringify({
        NumeroRicevuta: document.getElementById('textNumeroRicevuta').value,
        DataInizio: document.getElementById('dtpDataInizio').value,
        DataScadenza: document.getElementById('dtpDataScadenza').value,
        SommaEuro: document.getElementById('comboboxSommaEuro_input').value,
        TipoPagamento: document.getElementById('comboboxTipoPagamento_input').value,
        CodiceFiscale: CodiceFiscale
      })
    });
    const responseParsed = await response.json();
    alert(responseParsed.message);
  };

  return (
    <div className="formWrapper">
      <form className="formCreaRicevuta">
        <label id="labelNumRicevuta"> Numero Ricevuta </label>
        <input type="text" id="textNumeroRicevuta" placeholder="Inserisci Numero Ricevuta..." />
        <label id="labelPagamento"> Tipo Pagamento </label>
        <Combobox
          id="comboboxTipoPagamento"
          data={tipoPagamento}
          defaultValue={tipoPagamento[0]}
          valueField="id"
          textField="tipo"
          caseSensitive={false}
          filter="contains"
        />
        <label id="labelSomma"> Somma Euro </label>
        <Combobox
          id="comboboxSommaEuro"
          data={sommaEuro}
          defaultValue={sommaEuro[0]}
          valueField="id"
          textField="somma"
          caseSensitive={false}
          filter="contains"
        />
        <label id="labelDataInizio"> Data Inizio </label>
        <input id="dtpDataInizio" type="date" defaultValue={today} />
        {/* <DateTimePicker id="dtpDataInizio" defaultValue={new Date()} format="MM/DD/YYYY" time={false} /> */}
        <label id="labelDataScadenza"> Data Scadenza </label>
        <input id="dtpDataScadenza" type="date" defaultValue={today} />
        {/* <DateTimePicker id="dtpDataScadenza" defaultValue={new Date()} format="MM/DD/YYYY" time={false} /> */}
      </form>
      <Button raised ripple id="buttonCreaRicevuta" onClick={creaRicevuta}>
        Crea Ricevuta
      </Button>
    </div>
  );
};

export default FormCreaRicevuta;
