import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';

import Translation from '../../common/Translation';
import { printAssemblyBook, printStudentsBasedOnRegistrationDate } from '../../../helpers/printPDF';

import { months, years } from '../../../commondata';

import './print-students-form.css';

const PrintStudentsForm = ({ students }) => {
  const [selectedMonth, setselectedMonth] = useState(new Date().getMonth());

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  return (
    <div className="form-wrapper">
      <Form.Text as="h5">
        <Translation value="common.printStudentsFormTitle" />
      </Form.Text>
      <div className="print-students-form">
        <Form.Group>
          <Form.Label>
            <Translation value="common.month" />
          </Form.Label>
          <Form.Control
            as="select"
            defaultValue={selectedMonth}
            onChange={({ target }) => {
              setselectedMonth(parseInt(target.value, 10));
            }}
          >
            {months.map((month) => (
              <option key={`select_${month.id}`} value={month.id}>
                {month.month}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>
            <Translation value="common.year" />
          </Form.Label>
          <Form.Control
            as="select"
            defaultValue={selectedYear}
            onChange={({ target }) => {
              setSelectedYear(parseInt(target.value, 10));
            }}
          >
            {years.map((year) => (
              <option key={`select_${year.id}`} value={year.id}>
                {year.year}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="success" onClick={() => printStudentsBasedOnRegistrationDate(students, selectedMonth, selectedYear)}>
          🖨️ <Translation value="buttons.student.printBasedOnRegistrationDate" />
        </Button>
        <Button variant="success" onClick={() => printAssemblyBook(students, selectedMonth, selectedYear)}>
          🖨️ <Translation value="buttons.student.printAssemblyBook" />
        </Button>
      </div>
    </div>
  );
};

PrintStudentsForm.propTypes = {
  students: PropTypes.array.isRequired,
};

export default PrintStudentsForm;
