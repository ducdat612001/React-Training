// Library
import React, { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useSWR from 'swr';

// Import style for Analytics component
import './Analytics.css';

// Import service to call API
import { getAllCustomerService } from '@services';

// Import images or icons
import { plusIcon, loadingData } from '@assets/images';

// Import components
import {
  Button,
  SortData,
  CustomerItem,
  Toast,
  FormValidation,
} from '@components';

// Import constant
import { BUTTON_VARIANTS, BASE_URL, PATH, MESSAGES, ACTION_TYPES } from '@constants';

// Import list data for Expand component
import { SORT_TITLES } from '@data';

// Import layout
import { ProfileInfo } from '@layouts';

// Custom hook
import { useCustomerContext } from '@hooks';
import { actionReducerCustomer } from '@stores';

const Analytics = () => {
  // State variables
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isShowProfileInfo, setIsShowProfileInfo] = useState(false);
  const [isShowContextMenu, setIsShowContextMenu] = useState(false);
  const [isShowForm, setIsShowForm] = useState(false);
  const { state, dispatch, showToastInfo } = useCustomerContext();
  const { customers } = state;

  const handleToggleForm = useCallback(() => {
    setIsShowForm(!isShowForm);
  }, [isShowForm]);

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
        dispatch(actionReducerCustomer(ACTION_TYPES.GET_LIST, data));
      },
    }
  );

  const handleShowCustomerForm = () => {
    handleToggleForm(selectedCustomer);
  };

  // Render the list of customers
  const renderCustomerList = () => {
    return (
      <ul className='customer__list'>
        {customers.map((customer) => (
          <CustomerItem
            key={uuidv4()}
            customer={customer}
            selectedCustomer={selectedCustomer}
            isShowContextMenu={isShowContextMenu}
            handleShowContextMenu={handleShowContextMenu}
            handleShowProfileInfo={handleShowProfileInfo}
            handleShowCustomerForm={handleShowCustomerForm}
          />
        ))}
      </ul>
    );
  };

  return (
    <>
      <div
        className={`analytics ${isShowProfileInfo ? 'analytics--profile' : ''}`}
      >
        <div className='analytics__header'>
          <h2 className='title__page'>Customer List</h2>
          <Button
            variant={BUTTON_VARIANTS.SECONDARY}
            icon={plusIcon}
            onClick={handleToggleForm}
          >
            Add Customer
          </Button>
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
              {SORT_TITLES.map((SORT_TITLE) => (
                <div
                  className='sort__item col-3'
                  key={SORT_TITLE.id + SORT_TITLE.title}
                >
                  <SortData name={SORT_TITLE.title} />
                </div>
              ))}
            </div>
            {renderCustomerList()}
          </div>
        ) : (
          // Show message when list is empty
          <p className='empty__message'>{MESSAGES.GET.EMPTY_LIST}</p>
        )}
        {isError && showToastInfo(MESSAGES.GET.ERRORS.API_FAILED)}
      </div>

      {/* Show information of selected customer */}
      {selectedCustomer && isShowProfileInfo && (
        <ProfileInfo selectedCustomer={selectedCustomer} />
      )}

      {/* Show form to create customer */}
      {isShowForm && (
        <FormValidation
          handleToggleForm={handleToggleForm}
          selectedCustomer={selectedCustomer}
        />
      )}
    </>
  );
};

export default Analytics;
