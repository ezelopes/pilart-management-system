const pdfMake = require('pdfmake/build/pdfmake.js');
const pdfFonts = require('pdfmake/build/vfs_fonts.js');
const getBase64ImageFromURL = require('../helpers/get-base64-image');

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const pdfTemplateModuloIscrizione = async allievaInfo => {
  // print only if allievaInfo fields are not empty and DataCertificato does not expire any soon
  const label_logo = await getBase64ImageFromURL('../images/PILATES_LOGO.png');
  const BLANK_SPACE = '________________________________________';

  const docDefinition = {
    info: {
      title: `${allievaInfo.Nome}_${allievaInfo.Cognome}_Modulo_Iscrizione`,
      author: 'Roxana Carro',
      subject: `Modulo Iscrizione di ${allievaInfo.Nome} ${allievaInfo.Cognome}`
    },
    pageMargins: [40, 40, 40, 0],
    content: [
      {
        image: label_logo,
        fit: [100, 100]
      },
      {
        text: `Data ______/______/________`,
        alignment: 'right',
        lineHeight: 1.5,
        fontSize: 10,
        margin: [0, 0, 0, 12]
      },
      {
        text: 'DOMANDA DI ISCRIZIONE A SOCIO / ATLETA',
        alignment: 'center',
        lineHeight: 1.5,
        fontSize: 10,
        margin: [0, 0, 0, 12],
        bold: true
      },
      {
        text: [
          'Il sottoscritto/a ',
          { text: `${allievaInfo.Nome || BLANK_SPACE } ${allievaInfo.Cognome || BLANK_SPACE }`, bold: true },
          ' nato/a a ',
          { text: `${allievaInfo.LuogoNascita || BLANK_SPACE }`, bold: true },
          ' il ',
          { text: `${ 
            (allievaInfo.DataNascita === 'Invalid date' || !allievaInfo.DataNascita) 
              ? '______/______/________'
              : allievaInfo.DataNascita
          }`, bold: true },
          ' C.F. ',
          { text: `${allievaInfo.CodiceFiscale || BLANK_SPACE }`, bold: true },
          '. Residente in ',
          { text: `${allievaInfo.Indirizzo || BLANK_SPACE }`, bold: true },
          ' a ',
          { text: `${allievaInfo.Citta || BLANK_SPACE }`, bold: true },
          '. Cellulare: ',
          { text: `${allievaInfo.Cellulare || BLANK_SPACE }`, bold: true },
          ' Email: ',
          { text: `${allievaInfo.Email || BLANK_SPACE }`, bold: true }
        ],
        alignment: 'left',
        lineHeight: 1.5,
        fontSize: 10,
        margin: [0, 0, 0, 12]
      },
      {
        text:
          'richiede la tessere associativa alla A.S.D PIL ART sito a STEZZANO, Via CESARE BATTISTI n. 9/A',
        alignment: 'center',
        lineHeight: 1.5,
        fontSize: 10,
        margin: [0, 0, 0, 12],
        bold: true
      },

      {
        text: [
          {
            text:
              '1-Dichiaro di conoscere lo Statuto, di accettarlo integralmente, si impegna a fare quanto nelle sue possibilità per il raggiungimento degli scopi sociali e ad osservare le deliberazioni degli organi sociali, di conoscere le condizioni delle polizze assicurative presenti sul sito www.acsi.it. 2-Informativa GDPR UE 679/16: La scrivente Associazione dichiara che, tutti i dati sensibili personali saranno utilizzati solo per scopi sportivi. La parte cartacea sarà archiviata presso la sede sociale di VIA C. BATTISTI 9/A e/o presso lo studio commerciale PROGGETTO IMPRESA SRL, la parte in formato digitale sarà custodita dal Presidente e/o il Segretario della stessa ASD. I dati per i tesseramenti saranno inseriti nella piattaforma nazionale di ACSI (ente di promozione sportiva).',
            lineHeight: 1.5,
              fontSize: 10
          },
          {
            text:
              ' 3-Autorizzo ad effettuare ed utilizzare riprese fotografiche e video per poter propagandare le attività sociali sui canali ufficiali dell’Associazione (sitoweb/facebook/ecc...), ',
            bold: true,
            lineHeight: 1.5,
            fontSize: 10
          },
          { 
            text: ' delle voci 1, 2, 3 ', 
            fontSize: 10
          },
          {
            text: 'ACCETTO',
            bold: true,
            lineHeight: 1.5,
            fontSize: 10
          }
        ],
        alignment: 'left',
        lineHeight: 1.5,
        fontSize: 10,
        margin: [0, 0, 0, 12]
      },
      {
        text: [
          'La disciplina sportiva svolta nella ASD PIL ART è ',
          { text: `${allievaInfo.Disciplina || BLANK_SPACE }`, bold: true },
          ' per cui il socio ci consegna un certificato medico di idoneità sportiva con scadenza ',
          { text: `${ '______/______/________' }`, bold: true },
          ' del tipo:'
        ],
        alignment: 'left',
        lineHeight: 1.5,
        fontSize: 10,
        margin: [0, 0, 0, 10]
      },
      {
        text: [
          {
            text: [
              '___ ',
              { text: 'AGONISTICA', bold: true },
              '\t\t\t  - certificato di idoneità agonistica sportiva \n'
            ]
          },
          {
            text: [
              '___ ',
              { text: 'NON AGONISTICA', bold: true },
              '\t- certificato di idoneità per attività sportive non agonistiche'
            ]
          }
        ],
        alignment: 'left',
        lineHeight: 1.5,
        fontSize: 10,
        margin: [0, 0, 0, 12]
      },
      {
        text: 'La copertura assicurativa proposta è (barrare la copertura scelta)',
        alignment: 'left',
        lineHeight: 1.5,
        fontSize: 10,
        margin: [0, 0, 0, 12]
      },
      {
        text: '___ Base \t\t\t  ___ Integrativa \t\t\t ___ Superintegrativa',
        alignment: 'left',
        lineHeight: 1.5,
        fontSize: 10,
        margin: [0, 0, 0, 12]
      },
      {
        text: 'N. Tessera ACSI assegnato __________________',
        alignment: 'left',
        lineHeight: 1.5,
        fontSize: 10,
        margin: [0, 0, 0, 12]
      },
      {
        text: 'Firma __________________________',
        alignment: 'right',
        lineHeight: 1.5,
        fontSize: 10,
        margin: [0, 0, 0, 25]
      },
      {
        canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1 }],
        margin: [0, 0, 0, 25]
      },
      {
        // bold
        text: 'PER I MINORI',
        alignment: 'left',
        lineHeight: 1.5,
        fontSize: 10,
        bold: true,
        margin: [0, 0, 0, 12]
      },
      {
        text: `Figlio fiscalmente a carico del genitore: ${allievaInfo.NomeGenitore || BLANK_SPACE } ${allievaInfo.CognomeGenitore || '' }`,
        alignment: 'left',
        lineHeight: 1.5,
        fontSize: 10,
        margin: [0, 0, 0, 12]
      },
      {
        text: `Codice Fiscale di chi firma: ${allievaInfo.CodiceFiscaleGenitore || BLANK_SPACE }`,
        alignment: 'left',
        lineHeight: 1.5,
        fontSize: 10,
        margin: [0, 0, 0, 12]
      },
      {
        text: 'Firma del genitore ______________________________',
        alignment: 'left',
        lineHeight: 1.5,
        fontSize: 10,
        margin: [0, 0, 0, 10]
      }
    ]
  };

  return docDefinition;
};

export default pdfTemplateModuloIscrizione;
