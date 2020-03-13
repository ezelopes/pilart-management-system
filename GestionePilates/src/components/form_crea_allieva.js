import React from 'react';
import { Button } from 'react-mdl';
import 'react-widgets/dist/css/react-widgets.css';
import simpleNumberLocalizer from 'react-widgets-simple-number';
import { Combobox } from 'react-widgets';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import formatDate from '../helpers/format-date-for-input-date';

moment.locale('es');
momentLocalizer();

simpleNumberLocalizer();

const FormCreaAllieva = () => {
  const today = formatDate(new Date(), true);

  let eta = [
    { id: 0, eta: 'Maggiorenne' },
    { id: 1, eta: 'Minorenne' }
  ];

  let discipline = [
    { id: 0, disciplina: 'Fitness' },
    { id: 1, disciplina: 'Danza Sportiva' }
  ];

  let corsi = [
    { id: 0, corso: '' },
    { id: 1, corso: 'Giocodanza I' },
    { id: 2, corso: 'Giocodanza II' },
    { id: 3, corso: 'Tecnica Propedeutica I' },
    { id: 4, corso: 'Tecnica Propedeutica II' },
    { id: 5, corso: 'I Corso Danza Classica' },
    { id: 6, corso: 'Corso Pre-Accademico' },
    { id: 7, corso: 'I Corso Accademico' },
    { id: 8, corso: 'Propedeutica Danza Moderna' },
    { id: 9, corso: 'Danza Moderna Principianti' },
    { id: 10, corso: 'Danza Moderna Intermedio' },
    { id: 11, corso: 'Danza Moderna Avanzato' },
    { id: 12, corso: 'Hip Hop Break Baby' },
    { id: 13, corso: 'Hip Hop Break Children' },
    { id: 14, corso: 'Hip Hop Principianti' },
    { id: 15, corso: 'Hip Hop Intermedio' },
    { id: 16, corso: 'Hip Hop Avanzato' },
    { id: 17, corso: 'Cheerleader Senior' },
    { id: 18, corso: 'Cheerleader Peewe' },
    { id: 19, corso: 'Cheerleader Mini' },
    { id: 20, corso: 'Musical Children' },
    { id: 21, corso: 'Musiscal Teens' }
  ];

  const creaAllieva = async () => {
    // AGGIUNGI CONTROLLI SU DATA, SOMMA, TIPO.
    if (document.getElementById('textCodiceFiscale').value === '') {
      document.getElementById('textCodiceFiscale').style.borderColor = 'red';
      return;
    }

    const response = await fetch('/api/creaAllieva', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        // Authorization: 'Bearer ' + idToken
      },
      body: JSON.stringify({
        CodiceFiscale: document.getElementById('textCodiceFiscale').value,
        Maggiorenne: document.getElementById('comboboxEta_input').value, // Maggiorenne,
        Nome: document.getElementById('textNomeAllieva').value,
        Cognome: document.getElementById('textCognomeAllieva').value,
        Citta: document.getElementById('textCitta').value,
        Indirizzo: document.getElementById('textIndirizzo').value,
        Cellulare: document.getElementById('textCellulare').value,
        Email: document.getElementById('textEmail').value,
        DataIscrizione: document.getElementById('dtpDataIscrizione').value,
        DataCertificato: document.getElementById('dtpDataCertificato').value,
        DataNascita: document.getElementById('dtpDataNascita').value,
        LuogoNascita: document.getElementById('textLuogoNascita').value,
        Disciplina: document.getElementById('comboboxDisciplina_input').value,
        Corso: document.getElementById('comboboxCorso_input').value,
        CodiceFiscaleGenitore: document.getElementById('textCodiceFiscaleGenitore').value,
        NomeGenitore: document.getElementById('textNomeGenitore').value,
        CognomeGenitore: document.getElementById('textCognomeGenitore').value
      })
    });
    const responseParsed = await response.json();
    alert(responseParsed.message);
    resetForm();
  };

  const resetForm = () => {
    document.getElementById('comboboxEta_input').defaultValue = eta[0].eta;
    document.getElementById('comboboxDisciplina_input').defaultValue = discipline[0].disciplina;
    document.getElementById('comboboxCorso_input').defaultValue = corsi[0].corso;
    document.getElementById('formCreaAllieva').reset();
  };

  return (
    <>
      <div className="formWrapper">
        <form className="formCreaRicevuta" id="formCreaAllieva">
          <label id="labelEta"> Età </label>
          <Combobox
            id="comboboxEta"
            data={eta}
            defaultValue={eta[0]}
            valueField="id"
            textField="eta"
            caseSensitive={false}
            filter="contains"
          />

          <label id="labelCodiceFiscale"> Codice Fiscale </label>
          <input type="text" id="textCodiceFiscale" placeholder="Inserisci Codice Fiscale..." />

          <label id="labelNomeAllieva"> Nome Allieva </label>
          <input type="text" id="textNomeAllieva" placeholder="Inserisci Nome Allieva..." />

          <label id="labelCognomeAllieva"> Cognome Allieva </label>
          <input type="text" id="textCognomeAllieva" placeholder="Inserisci Cognome Allieva..." />

          <label id="labelCitta"> Citta </label>
          <input type="text" id="textCitta" placeholder="Inserisci Citta..." />

          <label id="labelIndirizzo"> Indirizzo </label>
          <input type="text" id="textIndirizzo" placeholder="Inserisci Indirizzo..." />

          <label id="labelCellulare"> Cellulare </label>
          <input type="text" id="textCellulare" placeholder="Inserisci Cellulare..." />

          <label id="labelEmail"> Email </label>
          <input type="text" id="textEmail" placeholder="Inserisci Email..." />

          <label id="labelLuogoNascita"> Luogo Nascita </label>
          <input type="text" id="textLuogoNascita" placeholder="Inserisci LuogoNascita..." />

          <label id="labelDisciplina"> Disciplina </label>
          <Combobox
            id="comboboxDisciplina"
            data={discipline}
            defaultValue={discipline[0]}
            valueField="id"
            textField="disciplina"
            caseSensitive={false}
            filter="contains"
          />

          <label id="labelCorso"> Corso </label>
          <Combobox
            id="comboboxCorso"
            data={corsi}
            defaultValue={corsi[0]}
            valueField="id"
            textField="corso"
            caseSensitive={false}
            filter="contains"
            placeholder="Seleziona Corso..."
          />

          <label id="labelDataIscrizione"> Data Iscrizione </label>
          <input id="dtpDataIscrizione" type="date" defaultValue={today} />

          <label id="labelDataCertificato"> Data Certificato </label>
          <input id="dtpDataCertificato" type="date" defaultValue={today} />

          <label id="labelDataNascita"> Data Nascita </label>
          <input id="dtpDataNascita" type="date" defaultValue={today} />

          <label id="labelCodiceFiscaleGenitore"> Codice Fiscale Genitore </label>
          <input
            type="text"
            id="textCodiceFiscaleGenitore"
            placeholder="Inserisci Codice Fiscale Genitore..."
          />

          <label id="labelNomeGenitore"> Nome Genitore </label>
          <input type="text" id="textNomeGenitore" placeholder="Inserisci Nome Genitore..." />

          <label id="labelCognomeGenitore"> Cognome Genitore </label>
          <input type="text" id="textCognomeGenitore" placeholder="Inserisci Cognome Genitore..." />
        </form>
        <Button raised ripple id="buttonCreaAllieva" onClick={creaAllieva}>
          Crea Allieva
        </Button>
        <Button raised ripple id="buttonResetForm" onClick={resetForm}>
          Reset Form
        </Button>
      </div>
    </>
  );
};

export default FormCreaAllieva;
