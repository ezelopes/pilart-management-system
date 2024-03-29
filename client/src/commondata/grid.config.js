const gridOptionsDefaultMembershipFee = {
  defaultColDef: {
    resizable: true,
    sortable: true,
    filter: true,
    floatingFilter: true,
    cellStyle: { fontSize: '1.5em' },
    flex: 10, // TODO: This messes up the mobile view
  },
  rowSelection: 'multiple',
  rowMultiSelectWithClick: true,
  rowHeight: 45,
};

const gridOptionsDefaultReceipts = {
  defaultColDef: {
    resizable: true,
    sortable: true,
    filter: true,
    floatingFilter: true,
    cellStyle: { fontSize: '1.5em' },
  },
  rowSelection: 'multiple',
  rowMultiSelectWithClick: true,
  rowHeight: 45,
};

const gridOptionsDefaultStudentReceipts = {
  defaultColDef: {
    resizable: true,
    sortable: true,
    filter: true,
    cellStyle: { fontSize: '1.5em' },
  },
  rowSelection: 'single',
  rowHeight: 45,
  suppressHorizontalScroll: false,
};

const gridOptionsDefaultStudents = {
  defaultColDef: {
    resizable: true,
    sortable: true,
    filter: true,
    cellStyle: { fontSize: '1.5em' },
  },
  rowSelection: 'multiple',
  rowMultiSelectWithClick: true,
  rowHeight: 45,
  suppressHorizontalScroll: false,
};

const gridOptionsFilteredReceipts = {
  defaultColDef: {
    resizable: true,
    sortable: true,
    filter: true,
    floatingFilter: true,
    cellStyle: { fontSize: '1.5em' },
  },
  rowSelection: 'single',
  rowHeight: 45,
};

export {
  gridOptionsDefaultMembershipFee,
  gridOptionsDefaultReceipts,
  gridOptionsDefaultStudentReceipts,
  gridOptionsDefaultStudents,
  gridOptionsFilteredReceipts,
};
