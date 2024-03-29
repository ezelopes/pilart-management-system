import { formatDate } from '../helpers/dates';
import { BLANK_DATE } from '../commondata';

export const StudentsExpiringCourseTemplate = (studentsReceiptsListByMonth, labelLogo) => {
  const allTablesWithTitle = [];

  Object.keys(studentsReceiptsListByMonth).forEach((month) => {
    const tableTitle = {
      text: `LISTA ALLIEVE CON CORSO IN SCADENZA A ${month.toUpperCase()}`,
      lineHeight: 1.5,
      fontSize: 16,
      margin: [0, 0, 0, 10],
      bold: true,
    };

    const tableBody = [
      [
        { text: 'Allieva', bold: true },
        { text: 'Data Scadenza Corso', bold: true },
      ],
    ];

    studentsReceiptsListByMonth[month].map(({ Name, Surname, CourseEndDate }) =>
      tableBody.push([
        `${Name.toUpperCase()} ${Surname.toUpperCase()}`,
        CourseEndDate ? formatDate(new Date(CourseEndDate)) : BLANK_DATE,
      ])
    );

    const table = {
      margin: [0, 0, 0, 0],
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
        widths: ['50%', '50%'],
        body: tableBody,
      },
      pageBreak: 'after',
    };

    allTablesWithTitle.push(tableTitle, table);
  });

  const content = [
    {
      image: labelLogo,
      alignment: 'right',
      fit: [100, 100],
      margin: [0, 0, 0, 10],
    },
    {
      text: `LISTA ALLIEVE IN SCADENZA`,
      lineHeight: 1.5,
      fontSize: 16,
      margin: [0, 0, 0, 10],
      bold: true,
    },
  ];

  allTablesWithTitle.forEach((currentContent) => content.push(currentContent));

  const docDefinition = {
    info: {
      title: `Informazioni Allieve Cui Corso Sta Scadendo`,
      author: 'Roxana Carro',
      subject: `Dati Allieve`,
    },
    pageMargins: [40, 40, 40, 40],
    content,
  };

  return docDefinition;
};
