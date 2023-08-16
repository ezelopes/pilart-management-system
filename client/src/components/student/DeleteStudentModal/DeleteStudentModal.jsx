import React from 'react';
import PropTypes from 'prop-types';

import { useMutation } from 'react-query';
import axios from 'axios';
import { isFunction } from 'is-what';
import { toast } from 'react-toastify';
import { Modal, Button, Spinner } from 'react-bootstrap';

import { useStudent } from '../StudentContext';

import Translation from '../../common/Translation';
import toastConfig from '../../../commondata/toast.config';

const STUDENT_LIST_KEY = 'studentsList';

const DeleteStudentModal = ({ id, isOpen, onClose, onDelete }) => {
  const { studentInfo } = useStudent();

  const { mutateAsync, isLoading } = useMutation(
    async () => axios.delete('/api/student/deleteStudent', { data: { StudentID: id } }),
    {
      onSuccess: (response) => {
        const studentListCached = JSON.parse(sessionStorage.getItem(STUDENT_LIST_KEY));

        const updatedStudentList = studentListCached.filter((student) => student.StudentID !== id);

        sessionStorage.setItem(STUDENT_LIST_KEY, JSON.stringify(updatedStudentList));

        if (isFunction(onDelete)) {
          onDelete();
        }

        onClose();

        toast.success(response.data.message, toastConfig);
      },
      onError: (err) => toast.error(err.message, toastConfig),
    }
  );

  return (
    <Modal show={isOpen} onHide={onClose} dialogClassName="update-modal" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <Translation value="modalsContent.deleteStudentHeader" />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Translation
          value="modalsContent.deleteConfirmationBody"
          replace={{ fullname: `${studentInfo.Name} ${studentInfo.Surname}` }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={mutateAsync}>
          {isLoading ? (
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
          ) : (
            <Translation value="buttons.student.deleteStudent" />
          )}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          <Translation value="buttons.close" />
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

DeleteStudentModal.propTypes = {
  id: PropTypes.number.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};

DeleteStudentModal.defaultProps = {
  onDelete: () => {},
};

export default DeleteStudentModal;
