const pool = require('./pool');
const { getFormattedDate } = require('./helpers/index')

const receiptType = [
  { "type": "Quota" },
  { "type": "Quota Associativa" }
]

const mappingReceipt = (rows) => {
  const receipts = rows.map(row => {
    return {
      ReceiptID: row.RicevutaID,
      ReceiptType: row.TipoRicevuta,
      ReceiptDate: getFormattedDate(row.DataRicevuta),
      CourseStartDate: getFormattedDate(row.DataInizioCorso),
      CourseEndDate: getFormattedDate(row.DataScadenzaCorso),
      ReceiptNumber: row.NumeroRicevuta,
      AmountPaid: row.SommaEuro,
      FK_StudentID: row.FK_AllievaID,
      PaymentMethod: row.TipoPagamento,
      Archived: row.Archiviata
    };
  });
  return receipts;
}
  
const mappingAllReceipts = (rows) => {
  const receipts = rows.map(row => {
    return {
      IsAdult: row.Maggiorenne,
      TaxCode: row.CodiceFiscale,
      Name: row.Nome,
      Surname: row.Cognome,
      City: row.Citta,
      Address: row.Indirizzo,
      MobilePhone: row.Cellulare,
      Email: row.Email,
      RegistrationDate: getFormattedDate(row.DataIscrizione),
      CertificateExpirationDate: getFormattedDate(row.DataCertificato),
      DOB: getFormattedDate(row.DataNascita),
      BirthPlace: row.LuogoNascita,
      Discipline: row.Disciplina,
      Course: row.Corso,
      School: row.Scuola,
      ParentName: row.NomeGenitore,
      ParentSurname: row.CognomeGenitore,
      ParentTaxCode: row.CodiceFiscaleGenitore,

      ReceiptNumber: row.NumeroRicevuta,
      AmountPaid: row.SommaEuro,
      PaymentMethod: row.TipoPagamento,
      ReceiptType: row.TipoRicevuta,
      ReceiptDate: getFormattedDate(row.DataRicevuta),
      CourseStartDate: getFormattedDate(row.DataInizioCorso),
      CourseEndDate: getFormattedDate(row.DataScadenzaCorso),
    };
  });
  return receipts;
}

const getStudentReceipts = async (TaxCode) => {
  const [rows] = await pool.execute('SELECT * FROM Ricevuta WHERE FK_CodiceFiscale = ?', [TaxCode]);
  const receipts = mappingReceipt(rows);
  
  return receipts;
}

const getAllReceipts = async () => {
  const [rows] = await pool.execute(
    'SELECT * \
    FROM ricevuta \
    INNER JOIN allieva \
    ON ricevuta.FK_AllievaID = allieva.AllievaID;'
  );
  const receipts = mappingAllReceipts(rows);
  
  return receipts;
}

const createReceipt = async ({
  ReceiptNumber,
  ReceiptDate,
  CourseStartDate,
  CourseEndDate,
  AmountPaid,
  PaymentMethod,
  ReceiptType,
  TaxCode,
  StudentID,
  RegistrationDate
}) => {
  try {
    // TODO: Reduce this code
    const ReceiptDateFormatted = getFormattedDate(ReceiptDate);
    const CourseStartDateFormatted = getFormattedDate(CourseStartDate);
    const CourseEndDateFormatted = getFormattedDate(CourseEndDate);

    if (ReceiptType == receiptType[1].type) {
      const [rows] = await pool.execute(
        'INSERT INTO Ricevuta (NumeroRicevuta, TipoPagamento, TipoRicevuta, DataRicevuta, SommaEuro, FK_CodiceFiscale, FK_AllievaID, Archiviata) \
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
        [ReceiptNumber, PaymentMethod, ReceiptType, ReceiptDateFormatted, AmountPaid, TaxCode, StudentID, false]
      );
      return { ReceiptID: rows.insertId, message: 'Ricevuta Inserita Correttamente!' };
    }
  
    const [rows] = await pool.execute(
      'INSERT INTO Ricevuta (NumeroRicevuta, TipoPagamento, TipoRicevuta, DataRicevuta, DataInizioCorso, DataScadenzaCorso, SommaEuro, FK_CodiceFiscale, FK_AllievaID, Archiviata) \
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
      [ReceiptNumber, PaymentMethod, ReceiptType, ReceiptDateFormatted, CourseStartDateFormatted, CourseEndDateFormatted, AmountPaid, TaxCode, StudentID, false]
    );

    if (RegistrationDate === true) {
      await pool.execute(
        `UPDATE Allieva SET DataIscrizione=? WHERE AllievaID=?;`,
        [CourseStartDateFormatted, StudentID]
      );
    }

    return { ReceiptID: rows.insertId, message: 'Ricevuta Inserita Correttamente!' };
  } catch (error) {
    console.log(error);
    return { message: 'Errore nel creare la Ricevuta!' };
  }
}
  
const updateReceipt = async({
  ReceiptID,
  ReceiptNumber,
  PaymentMethod,
  ReceiptType,
  ReceiptDate,
  CourseStartDate,
  CourseEndDate,
  AmountPaid,
}) => {
  try {
    // TODO: Reduce this code
    const ReceiptDateFormatted = getFormattedDate(ReceiptDate);
    const CourseStartDateFormatted = getFormattedDate(CourseStartDate);
    const CourseEndDateFormatted = getFormattedDate(CourseEndDate);

    if (ReceiptType.toUpperCase() == 'QUOTA ASSOCIATIVA') {
      await pool.execute(
        'UPDATE ricevuta SET NumeroRicevuta=?, TipoPagamento=?, TipoRicevuta=?, DataRicevuta=?, DataInizioCorso=?, DataScadenzaCorso=?, SommaEuro=? WHERE RicevutaID=?;', 
        [ReceiptNumber, PaymentMethod, ReceiptType, ReceiptDateFormatted, null, null, AmountPaid, ReceiptID]
      );
      return { message: 'Ricevuta Aggiornata Correttamente!' };
    }
  
    await pool.execute(
      `UPDATE ricevuta SET NumeroRicevuta=?, TipoPagamento=?, TipoRicevuta=?, DataRicevuta=?, DataInizioCorso=?, DataScadenzaCorso=?, SommaEuro=? WHERE RicevutaID=?;`,
      [ReceiptNumber, PaymentMethod, ReceiptType, ReceiptDateFormatted, CourseStartDateFormatted, CourseEndDateFormatted, AmountPaid, ReceiptID]
    );
    return { message: 'Ricevuta Aggiornata Correttamente!' };
  } catch (error) {
    console.log(error);
    return { message: `Errore nell'aggiornare Ricevuta!` };
  }
} 

const deleteReceipt = async (ReceiptID) => {
  try {
    await pool.execute('DELETE FROM Ricevuta WHERE RicevutaID=?;', [ReceiptID])

    return { message: 'Ricevuta Eliminata Correttamente!' };
  } catch (error) {
    console.log(error);
    return { message: `Errore nell'eliminare Ricevute!` };
  }
}

module.exports = {
  getStudentReceipts,
  getAllReceipts,
  createReceipt,
  updateReceipt,
  deleteReceipt
};
