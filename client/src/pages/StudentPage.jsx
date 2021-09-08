import React from 'react';
import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';

import NotFoundPage from './NotFoundPage';
import CreateUpdateUserForm from '../components/CreateUpdateUserForm';
import StudentReceiptsList from '../components/StudentReceiptsList';
import CreateReceiptForm from '../components/CreateReceiptForm';
import { updateStudent, updateRegistrationDate, deleteStudent } from '../helpers/apiCalls';

const RegistrationFormTemplate = require('../pdfTemplates/RegistrationFormTemplate');

pdfMake.vfs = pdfFonts.pdfMake.vfs;

require('ag-grid-community/dist/styles/ag-grid.css');
require('ag-grid-community/dist/styles/ag-theme-balham.css');


const StudentPage = ({ match }) => {

  const [studentInfo, setStudentInfo] = useState({});
  const [studentReceipts, setStudentReceipts] = useState([]);

  const [newIsAdult, setNewIsAdult] = useState('');
  const [newTaxCode, setNewTaxCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newSurname, setNewSurname] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newMobilePhone, setNewMobilePhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newBirthPlace, setNewBirthPlace] = useState('');
  const [newDiscipline, setNewDiscipline] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [newSchool, setNewSchool] = useState('');
  const [newRegistrationDate, setNewRegistrationDate] = useState('');
  const [newCertificateExpirationDate, setNewCertificateExpirationDate] = useState('');
  const [newDOB, setNewDOB] = useState('');
  const [newGreenPassExpirationDate, setNewGreenPassExpirationDate] = useState('');
  const [newParentTaxCode, setNewParentTaxCode] = useState('');
  const [newParentName, setNewParentName] = useState('');
  const [newParentSurname, setNewParentSurname] = useState('');
  
  const [showUpdateStudentModal, setShowUpdateStudentModal] = useState(false);
  const [showRegistrationDateModal, setShowRegistrationDateModal] = useState(false);
  const [showDeleteStudentModal, setShowDeleteStudentModal] = useState(false);

  const setFormData = (studentInfo) => {
    setNewIsAdult(studentInfo.IsAdult);
    setNewTaxCode(studentInfo.TaxCode);
    setNewName(studentInfo.Name);
    setNewSurname(studentInfo.Surname);
    setNewCity(studentInfo.City);
    setNewAddress(studentInfo.Address);
    setNewMobilePhone(studentInfo.MobilePhone);
    setNewEmail(studentInfo.Email);
    setNewBirthPlace(studentInfo.BirthPlace);
    setNewDiscipline(studentInfo.Discipline);
    setNewCourse(studentInfo.Course);
    setNewSchool(studentInfo.School);
    setNewRegistrationDate(studentInfo.RegistrationDate);
    setNewCertificateExpirationDate(studentInfo.CertificateExpirationDate);
    setNewDOB(studentInfo.DOB);
    setNewGreenPassExpirationDate(studentInfo.GreenPassExpirationDate);
    setNewParentTaxCode(studentInfo.ParentTaxCode);
    setNewParentName(studentInfo.ParentName);
    setNewParentSurname(studentInfo.ParentSurname);
  }

  const handleUpdateStudentModal = () => {
    setFormData(studentInfo); // if closed without saving
    setShowUpdateStudentModal(false);
  }


  const printRegistrationForm = async () => {
    try {
      const documentDefinition = await RegistrationFormTemplate.default(studentInfo);
      pdfMake.createPdf(documentDefinition).open();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // TODO: Reduce this to one endpoint call!
    const fetchData = async () => {
      const getSingleStudentResult = await fetch(`/api/student/getSingleStudent/${match.params.TaxCode}`);
      const singleStudent = await getSingleStudentResult.json();
      setStudentInfo(singleStudent);
      setFormData(singleStudent);
      setNewRegistrationDate(singleStudent.RegistrationDate)

      const getReceiptsOfStudentResult = await fetch(`/api/receipt/getStudentReceipts/${match.params.TaxCode}`);
      const receipts = await getReceiptsOfStudentResult.json();
      setStudentReceipts(receipts);
    };
    fetchData();

  }, []);

  if (!studentInfo) return <NotFoundPage />;

  return (
    <>
      <div className="page-body">
        <div className="student-name-title">
          {studentInfo.Name} {studentInfo.Surname}
        </div>

        <div className="buttons-container">
          <Button onClick={printRegistrationForm}>
            <span role='img' aria-label='module'>💾</span> MODULO ISCRIZIONE
          </Button>
          
          <Button variant="warning" onClick={ () => setShowUpdateStudentModal(true) }>
            <span role='img' aria-label='update'>🔄</span> AGGIORNA ALLIEVA
          </Button>

          <Button variant="warning" onClick={ () => setShowRegistrationDateModal(true) }>
            <span role='img' aria-label='update'>🔄</span> AGGIORNA DATA ISCRIZIONE
          </Button>

          <Button variant='danger' onClick={ () => setShowDeleteStudentModal(true) }>
            <span role='img' aria-label='bin'>🗑️</span> ELIMINA ALLIEVA
          </Button>

          <Button variant="secondary" onClick={ () => window.location.assign('/paginaallieve') }>
            <span role='img' aria-label='back'>🔙</span> INDIETRO
          </Button>
        </div>

        <StudentReceiptsList receipts={studentReceipts} studentInfo={studentInfo} />
        <div style={{ marginTop: '2em' }}>
          <div className="form-wrapper" style={{ width: '80vw', marginLeft: '0vw' }}>
              <CreateReceiptForm TaxCode={match.params.TaxCode} StudentID={studentInfo.StudentID} isForCreating={true} />
          </div>
        </div>
      </div>

      <Modal show={showRegistrationDateModal} onHide={ () => setShowRegistrationDateModal(false) } centered>
        <Modal.Header closeButton>
          <Modal.Title> Aggiorna Data Iscrizione </Modal.Title>
        </Modal.Header>
        <Modal.Body className="update-registration-date">
            <input type="date" defaultValue={ studentInfo?.RegistrationDate } onChange={({ target }) => setNewRegistrationDate(target.value)} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={async () => { await updateRegistrationDate(studentInfo.StudentID, newRegistrationDate); setShowRegistrationDateModal(false); } }>
            AGGIORNA
          </Button>
          <Button variant="secondary" onClick={() => { setShowRegistrationDateModal(false) } }>
            CHIUDI
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Modal show={showDeleteStudentModal} onHide={ () => setShowDeleteStudentModal(false) } centered>
        <Modal.Header closeButton>
          <Modal.Title> Elimina Allieva </Modal.Title>
        </Modal.Header>
        <Modal.Body className="delete-student-teacher-modal-body">
            Sei sicura di voler eliminare {studentInfo.Name} {studentInfo.Surname}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={async () => { await deleteStudent(studentInfo.StudentID); setShowDeleteStudentModal(false); } }>
            ELIMINA
          </Button>
          <Button variant="secondary" onClick={() => { setShowDeleteStudentModal(false) } }>
            CHIUDI
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateStudentModal} onHide={() => handleUpdateStudentModal()} dialogClassName="update-student-modal" centered>
        <Modal.Header closeButton>
          <Modal.Title> Aggiorna Allieva </Modal.Title>
        </Modal.Header>
        <Modal.Body className="update-student-modal-body">
            <div className="user-form">
              <CreateUpdateUserForm 
                personInfo={studentInfo}
                personType={'Student'}
                newIsAdult={newIsAdult}
                setNewIsAdult={setNewIsAdult}
                setNewTaxCode={setNewTaxCode}
                setNewName={setNewName}
                setNewSurname={setNewSurname}
                setNewCity={setNewCity}
                setNewAddress={setNewAddress}
                setNewMobilePhone={setNewMobilePhone}
                setNewEmail={setNewEmail}
                setNewBirthPlace={setNewBirthPlace}
                setNewDiscipline={setNewDiscipline}
                setNewCourse={setNewCourse}
                setNewSchool={setNewSchool}
                setNewRegistrationDate={setNewRegistrationDate}
                setNewCertificateExpirationDate={setNewCertificateExpirationDate}
                setNewDOB={setNewDOB}
                setNewGreenPassExpirationDate={setNewGreenPassExpirationDate}
                setNewParentTaxCode={setNewParentTaxCode}
                setNewParentName={setNewParentName}
                setNewParentSurname={setNewParentSurname}
              />
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={async () => {
            const updatedStudentInfo = { 
              StudentID: studentInfo.StudentID,
              IsAdult: newIsAdult,
              TaxCode: newTaxCode,
              Name: newName,
              Surname: newSurname,
              City: newCity,
              Address: newAddress,
              MobilePhone: newMobilePhone,
              Email: newEmail,
              BirthPlace: newBirthPlace,
              Discipline: newDiscipline,
              Course: newCourse,
              School: newSchool,
              RegistrationDate: newRegistrationDate,
              CertificateExpirationDate: newCertificateExpirationDate,
              DOB: newDOB,
              GreenPassExpirationDate: newGreenPassExpirationDate,
              ParentTaxCode: newParentTaxCode,
              ParentName: newParentName,
              ParentSurname: newParentSurname 
            };
            await updateStudent(updatedStudentInfo);
          } }>
            AGGIORNA
          </Button>
          <Button variant="secondary" onClick={() => { handleUpdateStudentModal() } }>
            CHIUDI
          </Button>
        </Modal.Footer>
      </Modal>
      

    </>
  );
}

export default StudentPage;
