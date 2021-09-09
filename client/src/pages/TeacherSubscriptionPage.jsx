import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { disciplines, schools, courses } from '../commondata/commondata'

import CreateUpdateUserForm from '../components/CreateUpdateUserForm';

import { createTeacher } from '../helpers/apiCalls';

const TeacherSubscriptionPage = () => {
  const teacherInfoDefault = { 
    TaxCode: '',
    Name: '',
    Surname: '',
    City: '',
    Address: '',
    MobilePhone: '',
    Email: '',
    BirthPlace: '',
    Discipline: disciplines[0].discipline,
    Course: courses[0].course,
    School: schools[0].school,
    RegistrationDate: null,
    CertificateExpirationDate: null,
    DOB: null,
    GreenPassExpirationDate: null,
  }

  const [newTaxCode, setNewTaxCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newSurname, setNewSurname] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newMobilePhone, setNewMobilePhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newBirthPlace, setNewBirthPlace] = useState('');
  const [newDiscipline, setNewDiscipline] = useState(disciplines[0].discipline);
  const [newCourse, setNewCourse] = useState(courses[0].course);
  const [newSchool, setNewSchool] = useState(schools[0].school);
  const [newRegistrationDate, setNewRegistrationDate] = useState(null);
  const [newCertificateExpirationDate, setNewCertificateExpirationDate] = useState(null);
  const [newDOB, setNewDOB] = useState(null);
  const [newGreenPassExpirationDate, setNewGreenPassExpirationDate] = useState(null);

  const resetForm = () => {
    setNewTaxCode('');
    setNewName('');
    setNewSurname('');
    setNewCity('');
    setNewAddress('');
    setNewMobilePhone('');
    setNewEmail('');
    setNewBirthPlace('');
    setNewDiscipline(disciplines[0].discipline);
    setNewCourse(courses[0].course);
    setNewSchool(schools[0].school);
    setNewRegistrationDate(null);
    setNewCertificateExpirationDate(null);
    setNewDOB(null);
    setNewGreenPassExpirationDate(null);

    // Reset UI Values
  }

  return (
    <>
      <ToastContainer />
      <div className="form-wrapper subscription-form">
        <div className="user-form">
          <CreateUpdateUserForm
            personInfo={teacherInfoDefault}
            personType={'Teacher'}
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
          />
        </div>
        
        <div className="subscription-form-buttons">
          <Button variant="success" onClick={async () => {
              const newTeacher = {
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
                GreenPassExpirationDate: newGreenPassExpirationDate
              };
              await createTeacher(newTeacher);
              window.location.reload()
          }}>
            Crea Insegnante
          </Button>
          <Button variant="secondary" id="buttonResetForm" onClick={() => window.location.reload()}>
            Reset Form
          </Button>  
        </div>
      </div>
    </>
  );
}

export default TeacherSubscriptionPage;
