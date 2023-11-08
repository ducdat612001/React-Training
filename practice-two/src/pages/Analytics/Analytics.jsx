// Library
import React, { useState, useCallback } from 'react';
import useSWR from 'swr';

// Import style for Analytics component
import './Analytics.css';

// Import service to call API
import { getAllCustomerService, deleteCustomerService } from '@services';

// Import images or icons
import { plusIcon, loadingData } from '@assets/images';

// Import components
import {
  Button,
  SortData,
  CustomerItem,
  FormValidation,
  ConfirmPopup,
} from '@components';

// Import constant
import {
  BUTTON_VARIANTS,
  BASE_URL,
  PATH,
  MESSAGES,
  ACTION_TYPES_CUSTOMER,
  TOAST_TYPES,
} from '@constants';

// Import list data for Expand component
import { sortTitles } from '@mocks';

// Import layout
import { ProfileInfo } from '@layouts';

// Custom hook
import { useCustomerContext } from '@hooks';

// Import Store
import { actionReducerCustomer } from '@stores';

const Analytics = ({ onShowToast }) => {
  // State variables
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isShowProfileInfo, setIsShowProfileInfo] = useState(false);
  const [isShowContextMenu, setIsShowContextMenu] = useState(false);
  const [isShowConfirmDelete, setIsShowConfirmDelete] = useState(false);
  const [isShowForm, setIsShowForm] = useState(false);
  const { state, dispatch } = useCustomerContext();
  const { customers } = state;

  // Open or Close form
  const handleToggleForm = useCallback(() => {
    setIsShowForm(!isShowForm);
  }, [isShowForm]);

  // Open create customer form
  const handleShowCreateForm = useCallback(() => {
    setSelectedCustomer(null); // Clear the selected customer data
    handleToggleForm();
  }, []);

  // Open or close delete popup
  const handleToggleDeletePopup = useCallback(() => {
    setIsShowConfirmDelete(!isShowConfirmDelete);
  }, [isShowConfirmDelete]);

  // Handle delete customer
  const handleDeleteCustomer = useCallback(async () => {
    let toastMessage = MESSAGES.DELETE.SUCCESS;
    let toastType = TOAST_TYPES.SUCCESS;
    const response = await deleteCustomerService(selectedCustomer.id);
    if (response.error) {
      toastMessage = MESSAGES.DELETE.FAIL;
      toastType = TOAST_TYPES.FAIL;
    } else {
      dispatch(
        actionReducerCustomer(ACTION_TYPES_CUSTOMER.DELETE, response.data)
      );
      setSelectedCustomer(null);
    }
    handleToggleDeletePopup(); // To close delete popup
    onShowToast(toastMessage, toastType);
  }, [selectedCustomer, handleToggleDeletePopup]);

  // Event handler for clicking a customer
  const handleShowProfileInfo = useCallback(
    (customer) => {
      // If clicked on the same customer that is already selected, toggle the profile show
      if (selectedCustomer && selectedCustomer.id === customer.id) {
        setIsShowProfileInfo(!isShowProfileInfo);
      } else {
        // If clicked on a different customer, select the new customer and show the new profile
        setSelectedCustomer(customer);
        setIsShowProfileInfo(true);
      }
    },
    [selectedCustomer, isShowProfileInfo]
  );

  // Event handler for showing context menu
  const handleShowContextMenu = useCallback(
    (e, customer) => {
      e.stopPropagation();
      // If clicked on the same customer that is already selected, toggle the context menu show
      if (selectedCustomer && selectedCustomer.id === customer.id) {
        setIsShowContextMenu(!isShowContextMenu);
      } else {
        // If clicked on a different customer, select the new customer and show the new context menu
        setSelectedCustomer(customer);
        setIsShowContextMenu(true);
      }
    },
    [selectedCustomer, isShowContextMenu]
  );

  const { error: isError, isLoading } = useSWR(
    `${BASE_URL}/${PATH}`,
    getAllCustomerService,
    {
      shouldRetryOnError: false, // avoiding call API continuously when occur error
      onSuccess: (data) => {
        dispatch(actionReducerCustomer(ACTION_TYPES_CUSTOMER.GET_LIST, data));
      },
    }
  );

  // Render the list of customers
  const renderCustomerList = useCallback(() => {
    return (
      <ul className='customer__list'>
        {customers.map((customer) => (
          <CustomerItem
            key={customer.id + customer.name}
            customer={customer}
            selectedCustomer={selectedCustomer}
            isShowContextMenu={isShowContextMenu}
            onShowContextMenu={handleShowContextMenu}
            onShowProfileInfo={handleShowProfileInfo}
            onToggleForm={handleToggleForm}
            onToggleDeletePopup={handleToggleDeletePopup}
          />
        ))}
      </ul>
    );
  }, [customers, selectedCustomer, isShowContextMenu]);

  return (
    <>
      <div className='analytics'>
        <div className='analytics__header'>
          <h2 className='title__page'>Customer List</h2>
          <Button
            btnName='Add Customer'
            variant={BUTTON_VARIANTS.SECONDARY}
            icon={plusIcon}
            onClick={handleShowCreateForm}
          />
        </div>
        {isLoading ? (
          // Check loading status
          <div className='customer__loading'>
            <img
              src={loadingData}
              className='loading__scene'
              alt='loading-data...'
              width='200px'
              height='200px'
            />
          </div>
        ) : customers.length ? (
          <div className='customer__table'>
            {/* Start sort title */}
            <div className='customer__sort'>
              {sortTitles.map((sortTitle) => (
                <div
                  className='sort__item col-3'
                  key={sortTitle.id + sortTitle.title}
                >
                  <SortData name={sortTitle.title} />
                </div>
              ))}
            </div>
            {renderCustomerList()}
          </div>
        ) : (
          // Show message when list is empty
          <p className='empty__message'>{MESSAGES.EMPTY_LIST}</p>
        )}
        {isError && onShowToast(MESSAGES.GET.FAIL, TOAST_TYPES.FAIL)}
      </div>

      {/* Show information of selected customer */}
      {selectedCustomer && isShowProfileInfo && (
        <ProfileInfo selectedCustomer={selectedCustomer} />
      )}

      {/* Show form to create customer */}
      {isShowForm && (
        <FormValidation
          onToggleForm={handleToggleForm}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          onShowToast={onShowToast}
        />
      )}

      {/* Show delete popup */}
      {isShowConfirmDelete && (
        <ConfirmPopup
          questionConfirm='Are you sure to delete customer?'
          onTogglePopup={handleToggleDeletePopup}
          onConfirm={handleDeleteCustomer}
        />
      )}
    </>
  );
};

export default Analytics;
