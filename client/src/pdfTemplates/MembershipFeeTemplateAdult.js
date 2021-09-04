const pdfMake = require('pdfmake/build/pdfmake.js');
const pdfFonts = require('pdfmake/build/vfs_fonts.js');
const getBase64ImageFromURL = require('../helpers/getBase64ImageFromURL');
const convertNumberIntoWord = require('../helpers/convertNumberIntoWord');

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const MembershipFeeTemplateAdult = async (studentInfo, receiptInfo) => {
  const label_logo = await getBase64ImageFromURL('../images/PILATES_LOGO.png');
  const signature = await getBase64ImageFromURL('../images/Signature.png');
  const stamp = await getBase64ImageFromURL('../images/Stamp.png');
  const BLANK_SPACE = '___________________________';

  const totalAmount = receiptInfo.AmountPaid.replace('.', ',');
  const euroAndCents = totalAmount.split(',');
  const euro = euroAndCents[0];
  const cents = euroAndCents[1];

  const eurosInLetters = convertNumberIntoWord(euro);
  const centsInLetters = (cents !== '00' && cents !== '0' && cents !== undefined) 
    ? ` e ${convertNumberIntoWord(cents)} Centesimi`
    : ''

  const docDefinition = {
    info: {
      title: `${receiptInfo.ReceiptNumber}_${studentInfo.Name}_${studentInfo.Surname}_Ricevuta`,
      author: 'Roxana Carro',
      subject: `Ricevuta ${receiptInfo.ReceiptNumber} di ${studentInfo.Name} ${studentInfo.Surname}`
    },
    pageMargins: [40, 20, 40, 0],
    content: [
      {
        image: label_logo,
        fit: [100, 100]
      },
      {
        text: `Ricevuta n° ${receiptInfo.ReceiptNumber || BLANK_SPACE}`,
        alignment: 'right',
        lineHeight: 1.5,
        fontSize: 10,
        margin: [0, 0, 0, 10]
      },
      {
        text:
          'L’associazione sportiva dilettantistica PIL-ART con sede legale a Stezzano in Via C. Battisti 9°, C.F. 95229530167',
        alignment: 'center',
        lineHeight: 1.5,
        fontSize: 10,
        margin: [0, 0, 0, 10]
      },
      {
        text: 'DICHIARA',
        bold: true,
        alignment: 'center',
        lineHeight: 1.5,
        fontSize: 10,
        margin: [0, 0, 0, 10]
      },
      {
        text: `di aver ricevuto dal/dalla Sig./Sig.Ra ${
            studentInfo.Name || BLANK_SPACE
        } ${
            studentInfo.Surname || BLANK_SPACE
        } , C.F. ${
            studentInfo.TaxCode || BLANK_SPACE
        }, nato/a a ${
            studentInfo.BirthPlace || BLANK_SPACE
        }, il ${ 
          (studentInfo.DOB === 'Invalid date' || !studentInfo.DOB) 
            ? '______/______/________'
            : studentInfo.DOB
        } residente in ${
            studentInfo.Address || BLANK_SPACE
        }, ${
            studentInfo.City || BLANK_SPACE
        }, il pagamento effetuato${(receiptInfo.PaymentType.toUpperCase() !== 'CONTANTI' ? ` tramite ${receiptInfo.PaymentType.toUpperCase()}` : '' )} equilavente alla somma di ${
            receiptInfo.AmountPaid || BLANK_SPACE
        }€ (${
            eurosInLetters.toUpperCase() || BLANK_SPACE
        } EURO${
            centsInLetters.toUpperCase()
        }) per il contributo relativo alla quota associativa della durata di un anno.`,
        alignment: 'center',
        lineHeight: 1.5,
        fontSize: 10,
        margin: [0, 0, 0, 10]
      },
      {
        text: `Stezzano, ${ 
          (receiptInfo.ReceiptDate === 'Invalid date' || !receiptInfo.ReceiptDate) 
            ? '______/______/________'
            : receiptInfo.ReceiptDate
        }`,
        alignment: 'left',
        fontSize: 10,
        margin: [0, 0, 0, 2]
      },
      {
        text: 'Il Presidente',
        alignment: 'right',
        fontSize: 10,
        margin: [0, 0, 0, 2]
      },
      {
        text: 'Roxana Carro',
        alignment: 'right',
        lineHeight: 1.5,
        fontSize: 10,
        margin: [0, 0, 0, 0]
      },
      {
        margin: [0, 0, 0, 2],
        columnGap: 5,
        columns: [{
            text: 'Firma ',
            alignment: 'left',
            width: 50,
            height: 70,
            margin: [0, 20, 0, 10]
        }, {
            image: signature,
            width: 80,
            height: 40,
            margin: [-15, -5, 0, 10]
        }, {
          image: stamp,
          width: 80,
          height: 40,
          margin: [15, -5, 0, 10]
        }]
      },
      {
        text: 'Pil Art è affiliata all’ACSI e regolarmente iscritta sul registro del CONI',
        alignment: 'left',
        lineHeight: 1.5,
        fontSize: 8,
        margin: [0, 0, 0, 5]
      },
      {
        canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1 }],
        margin: [0, 0, 0, 10]
      },
    ]
  };

  return docDefinition;
};

export default MembershipFeeTemplateAdult;