import { memo, useState, useCallback, useEffect } from 'react';
import './FormValidation.css';
import { InputValidate, Button } from '@components';
import {
  BUTTON_VARIANTS,
  MESSAGES,
  ACTION_TYPES,
  GENDER_TYPES,
} from '@constants';
import { Validation } from '@helpers';
import { createCustomerService, updateCustomerService } from '@services';
import { useCustomerContext } from '@hooks';
import { actionReducerCustomer } from '@stores';

const FormValidation = ({
  onToggleForm,
  selectedCustomer,
  setSelectedCustomer,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    mail: '',
    phoneNumber: '',
    description: '',
    address: '',
    gender: GENDER_TYPES.MALE,
  });
  const [errors, setErrors] = useState({
    name: '',
    avatar: '',
    mail: '',
    phoneNumber: '',
    description: '',
    address: '',
  });
  const [isFormValid, setIsFormValid] = useState(true);
  const { dispatch, showToastInfo } = useCustomerContext();

  // Set value for form data
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    },
    [setFormData]
  );

  // Check validate input when click outside
  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;
      const errorMessage = Validation(name, value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMessage,
      }));
    },
    [setErrors, errors]
  );

  // Reset form value
  const resetForm = () => {
    setFormData({
      name: '',
      avatar: '',
      mail: '',
      phoneNumber: '',
      description: '',
      address: '',
      gender: GENDER_TYPES.MALE,
    });
    setErrors({
      name: '',
      avatar: '',
      mail: '',
      phoneNumber: '',
      description: '',
      address: '',
    });
  };

  // Set data to input field
  useEffect(() => {
    if (selectedCustomer && selectedCustomer.id) {
      const { name, avatar, mail, phoneNumber, description, address, gender } =
        selectedCustomer;
      setFormData({
        name: name,
        avatar: avatar,
        mail: mail,
        phoneNumber: phoneNumber,
        description: description,
        address: address,
        gender: gender,
      });
    }
  }, [selectedCustomer]);

  useEffect(() => {
    const isFormEmpty = Object.values(formData).some((value) => value === '');
    setIsFormValid(!isFormEmpty);
  }, [formData]);

  // Submit form
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const type = selectedCustomer ? 'UPDATE' : 'ADD';
    let response = null;
    let toastMessage = '';
    if (selectedCustomer) {
      response = await updateCustomerService(selectedCustomer.id, formData);
    } else {
      response = await createCustomerService(formData);
    }

    const { data, error } = response;
    if (error) {
      toastMessage = MESSAGES[type].FAIL;
    } else {
      toastMessage = MESSAGES[type].SUCCESS;
      dispatch(actionReducerCustomer(ACTION_TYPES[type], data));
      selectedCustomer && setSelectedCustomer(data)
    }

    resetForm();
    onToggleForm(); // To close form
    showToastInfo(toastMessage);
  });

  return (
    <div className='form__background'>
      <form className='form__validation' onSubmit={handleSubmit}>
        <p className='form__title'>
          {selectedCustomer ? 'Update customer' : 'Add customer'}
        </p>
        <div className='form__row'>
          <div className='col-6'>
            <InputValidate
              label='Full name'
              value={formData.name}
              errorMessage={errors.name}
              onChange={handleChange}
              onBlur={handleBlur}
              name='name'
            />
          </div>
          <div className='col-6'>
            <InputValidate
              label='Avatar'
              value={formData.avatar}
              placeholder='Enter avatar URL'
              errorMessage={errors.avatar}
              onChange={handleChange}
              onBlur={handleBlur}
              name='avatar'
            />
          </div>
        </div>
        <div className='form__row'>
          <div className='col-6'>
            <InputValidate
              label='Email'
              value={formData.mail}
              placeholder='example@gmail.com'
              errorMessage={errors.mail}
              onChange={handleChange}
              onBlur={handleBlur}
              name='mail'
            />
          </div>
          <div className='col-6'>
            <InputValidate
              label='Phone number'
              value={formData.phoneNumber}
              placeholder='Vietnamese phone number'
              errorMessage={errors.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              name='phoneNumber'
            />
          </div>
        </div>
        <div className='form__row'>
          <div className='col-6'>
            <InputValidate
              label='Job'
              value={formData.description}
              errorMessage={errors.description}
              onChange={handleChange}
              onBlur={handleBlur}
              name='description'
            />
          </div>
          <div className='col-6'>
            <label className='input__label'>Gender</label>
            <div className='input__row'>
              <InputValidate
                type='radio'
                placeholder=''
                genderType={GENDER_TYPES.MALE}
                onChange={handleChange}
                name={GENDER_TYPES.NAME}
                value={GENDER_TYPES.MALE}
                errorMessage=''
                checked={formData.gender === GENDER_TYPES.MALE}
              />
              <InputValidate
                type='radio'
                placeholder=''
                genderType={GENDER_TYPES.FEMALE}
                onChange={handleChange}
                name={GENDER_TYPES.NAME}
                value={GENDER_TYPES.FEMALE}
                errorMessage=''
                checked={formData.gender === GENDER_TYPES.FEMALE}
              />
            </div>
          </div>
        </div>
        <InputValidate
          label='Address'
          value={formData.address}
          errorMessage={errors.address}
          onChange={handleChange}
          onBlur={handleBlur}
          name='address'
        />

        <div className='form__button'>
          <Button variant={BUTTON_VARIANTS.TOGGLE} onClick={onToggleForm}>
            Cancel
          </Button>
          <Button
            type='submit'
            variant={BUTTON_VARIANTS.SECONDARY}
            disabled={!isFormValid}
          >
            {selectedCustomer ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default memo(FormValidation);
