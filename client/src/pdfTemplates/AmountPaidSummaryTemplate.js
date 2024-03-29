import { formatDate } from '../helpers/dates';
import { BLANK_DATE } from '../commondata';

export const AmountPaidSummaryTemplate = (
  receiptList,
  filteredAmountPaid,
  filteredPaymentMethod,
  fromDate,
  toDate,
  labelLogo
) => {
  const tableBody = [
    [
      { text: 'Numero Ricevuta', bold: true },
      { text: 'Data Ricevuta', bold: true },
      { text: 'Importo in €', bold: true },
      { text: 'Include Quota Associativa', bold: true },
    ],
  ];

  let totalMembershipFee = 0;

  receiptList.forEach((receipt) => {
    if (receipt.IncludeMembershipFee) {
      totalMembershipFee += 10;
    }

    tableBody.push([
      receipt.ReceiptNumber,
      receipt.ReceiptDate ? formatDate(new Date(receipt.ReceiptDate)) : BLANK_DATE,
      receipt.AmountPaid,
      receipt.IncludeMembershipFee ? '√' : '',
    ]);
  });

  const content = [
    {
      image: labelLogo,
      alignment: 'right',
      fit: [100, 100],
      margin: [0, 0, 0, 10],
    },
    {
      text: `RIEPILOGO IMPORTI PAGATI`,
      lineHeight: 1.5,
      fontSize: 16,
      margin: [0, 0, 0, 10],
      bold: true,
    },
    {
      text: [
        {
          text: 'Metodo Pagamento: ',
        },
        {
          text: `${filteredPaymentMethod ? filteredPaymentMethod.toUpperCase() : 'Assegno, Bonifico e Contanti'}`,
          bold: true,
        },
      ],
      lineHeight: 1.5,
      fontSize: 12,
      margin: [0, 0, 0, 10],
    },
    {
      text: [
        {
          text: 'Periodo dal ',
        },
        {
          text: `${fromDate || BLANK_DATE}`,
          bold: true,
        },
        {
          text: ' al ',
        },
        {
          text: `${toDate || BLANK_DATE}`,
          bold: true,
        },
      ],
      lineHeight: 1.5,
      fontSize: 12,
      margin: [0, 0, 0, 10],
    },
    {
      text: [
        {
          text: 'Totale: ',
        },
        {
          text: `${filteredAmountPaid}€`,
          bold: true,
        },
      ],
      lineHeight: 1.5,
      fontSize: 12,
      margin: [0, 0, 0, 10],
    },
    {
      text: [
        {
          text: 'Totale quote associative: ',
        },
        {
          text: `${totalMembershipFee}€`,
          bold: true,
        },
      ],
      lineHeight: 1.5,
      fontSize: 12,
      margin: [0, 0, 0, 10],
    },
    {
      text: [
        {
          text: 'Totale senza quote associative: ',
        },
        {
          text: `${filteredAmountPaid - totalMembershipFee}€`,
          bold: true,
        },
      ],
      lineHeight: 1.5,
      fontSize: 12,
      margin: [0, 0, 0, 0],
    },
    {
      margin: [0, 20, 0, 20],
      layout: {
        defaultBorder: true,
        paddingLeft() {
          return 5;
        },
        paddingRight() {
          return 5;
        },
        paddingTop() {
          return 5;
        },
        paddingBottom() {
          return 5;
        },
      },
      table: {
        headerRows: 1,
        widths: ['25%', '25%', '25%', '25%'],

        body: tableBody,
      },
    },
  ];

  const docDefinition = {
    info: {
      title: `Riepilogo Importo pagato tramite ${filteredPaymentMethod} dal ${fromDate || BLANK_DATE} al ${toDate || BLANK_DATE}`,
      author: 'Roxana Carro',
      subject: `Riepilogo Importo`,
    },
    pageMargins: [40, 40, 40, 40],
    content,
  };

  return docDefinition;
};
