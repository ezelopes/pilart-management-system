import React from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';
import { useMutation } from 'react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { isFunction } from 'is-what';

import Translation from '../../common/Translation';
import UserFormFields from '../../user/UserFormFields/UserFormFields';
import { updateStorageStudent } from '../../../helpers/sessionStorage';
import toastConfig from '../../../commondata/toast.config';
import endpoints from '../../../commondata/endpoints.config';

const UpdateStudentModal = ({ defaultValues, isOpen, onClose, onUpdate }) => {
  const form = useForm({ defaultValues });

  const { handleSubmit, reset } = form;

  const { mutateAsync, isLoading } = useMutation(async (data) => axios.post(endpoints.student.update, data), {
    onSuccess: (response, variables) => {
      updateStorageStudent(variables);

      if (isFunction(onUpdate)) {
        onUpdate(variables);
      }

      onClose();

      toast.success(response.data.message, toastConfig);
    },
    onError: (err) => toast.error(err.message, toastConfig),
  });

  const handleOnClose = () => {
    reset();

    onClose();
  };

  return (
    <Modal show={isOpen} onHide={handleOnClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <Translation value="modalsContent.updateStudentHeader" />
        </Modal.Title>
      </Modal.Header>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(mutateAsync)}>
          <Modal.Body className="update-student-form">
            <UserFormFields idPrefix="update-student-form" defaultValues={defaultValues} isStudent />
          </Modal.Body>
          <Modal.Footer>
            {/* TODO: Create button component that handles spinner or update bootstrap version */}
            <Button type="submit" variant="success" disabled={isLoading}>
              {isLoading ? (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              ) : (
                <Translation value="buttons.student.updateStudent" />
              )}
            </Button>
            <Button variant="secondary" onClick={handleOnClose}>
              <Translation value="buttons.close" />
            </Button>
          </Modal.Footer>
        </form>
      </FormProvider>
    </Modal>
  );
};

UpdateStudentModal.propTypes = {
  defaultValues: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UpdateStudentModal;
