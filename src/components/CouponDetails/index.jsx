import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, CheckBox, Icon, InputSelect } from '@edx/paragon';

import H3 from '../H3';

import TableContainer from '../../containers/TableContainer';
import DownloadCsvButton from '../../containers/DownloadCsvButton';
import StatusAlert from '../StatusAlert';

import EcommerceApiService from '../../data/services/EcommerceApiService';

import './CouponDetails.scss';

class CouponDetails extends React.Component {
  constructor(props) {
    super(props);

    this.tableColumns = [
      {
        label: <CheckBox />,
        key: 'select',
      },
      {
        label: 'Assigned To',
        key: 'assigned_to',
      },
      {
        label: 'Redemptions',
        key: 'redemptions',
      },
      {
        label: 'Code',
        key: 'title',
      },
      {
        label: 'Actions',
        key: 'actions',
      },
    ];

    this.state = {
      selectedFilter: null,
    };

    this.formatCouponData = this.formatCouponData.bind(this);
  }

  setSelectedFilter(selectedFilter) {
    this.setState({
      selectedFilter,
    });
  }

  getActionButton(code) {
    const { assigned_to: assignedTo, redemptions } = code;

    if (redemptions.used === redemptions.available) {
      return null;
    }

    const button = {
      label: 'Assign',
      onClick: () => {},
    };

    if (assignedTo) {
      button.label = 'Revoke';
      button.onClick = () => {};
    }

    return (
      <Button
        className={['btn-link', 'btn-sm', 'pl-0']}
        label={button.label}
        onClick={button.onClick}
      />
    );
  }

  isTableLoading() {
    const { couponDetailsTable } = this.props;
    return couponDetailsTable && couponDetailsTable.loading;
  }

  hasStatusAlert() {
    // The following are the scenarios where a status alert will be shown. Note, the coupon
    // details table must be finished loading for status alert to show:
    //  - Coupon has an error
    //  - Code selection status (e.g., "8 codes selected"). Note that the selection logic is not
    //      currently implemented, but the logic for when the code selection alert is displayed
    //      should go here as well.

    const { hasError } = this.props;
    return !this.isTableLoading() && [hasError].some(item => item);
  }

  formatCouponData(data) {
    return data.map(code => ({
      ...code,
      assigned_to: code.error ? (
        <span className="text-danger">
          <Icon className={['fa', 'fa-exclamation-circle', 'mr-2']} screenReaderText="Error" />
          {code.error}
        </span>
      ) : code.assigned_to,
      redemptions: `${code.redemptions.used} of ${code.redemptions.available}`,
      actions: this.getActionButton(code),
      select: <CheckBox />,
    }));
  }

  renderErrorMessage() {
    return (
      <StatusAlert
        alertType="danger"
        iconClassNames={['fa', 'fa-times-circle']}
        message="One or more codes below have an error."
      />
    );
  }

  render() {
    const { selectedFilter } = this.state;
    const { id, hasError, expanded } = this.props;

    return (
      <div
        id={`coupon-details-${id}`}
        className={classNames([
          'coupon-details row no-gutters px-2 my-3',
          {
            'd-none': !expanded,
          },
        ])}
      >
        <div className="col">
          {expanded &&
            <React.Fragment>
              <div className="details-header row no-gutters mb-3">
                <div className="col-12 col-md-6 mb-2 mb-md-0">
                  <H3>Coupon Details</H3>
                </div>
                <div className="col-12 col-md-6 mb-2 mb-md-0 text-md-right">
                  <DownloadCsvButton
                    id="coupon-details"
                    fetchMethod={() => {}}
                    disabled={this.isTableLoading()}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="filters col-12 col-md-8">
                  <div className="row">
                    <div className="col">
                      <div className="mb-1">Filter:</div>
                      <Button
                        className={['btn-sm', 'mr-2']}
                        buttonType={selectedFilter === 'not-assigned' ? 'primary' : 'outline-primary'}
                        label="Not Assigned"
                        onClick={() => this.setSelectedFilter('not-assigned')}
                        disabled={this.isTableLoading()}
                      />
                      <Button
                        className={['btn-sm']}
                        buttonType={selectedFilter === 'not-redeemed' ? 'primary' : 'outline-primary'}
                        label="Not Redeemed"
                        onClick={() => this.setSelectedFilter('not-redeemed')}
                        disabled={this.isTableLoading()}
                      />
                      {selectedFilter &&
                        <Button
                          className={['btn-sm', 'ml-2']}
                          buttonType="outline-secondary"
                          label={
                            <React.Fragment>
                              <Icon className={['fa', 'fa-close', 'mr-1']} />
                              Clear filters
                            </React.Fragment>
                          }
                          onClick={() => this.setSelectedFilter(null)}
                        />
                      }
                    </div>
                  </div>
                </div>
                <div className="bulk-actions col-12 col-md-4 text-md-right mt-3 m-md-0">
                  <InputSelect
                    className={['mt-1']}
                    name="bulk-action"
                    label="Bulk Action:"
                    value="assign"
                    options={[
                      { label: 'Assign', value: 'assign' },
                      { label: 'Remind', value: 'remind' },
                      { label: 'Revoke', value: 'revoke' },
                    ]}
                    disabled={this.isTableLoading()}
                  />
                  <Button
                    className={['ml-2']}
                    buttonType="primary"
                    label="Go"
                    onClick={() => {}}
                    disabled={this.isTableLoading()}
                  />
                </div>
              </div>
              {this.hasStatusAlert() &&
                <div className="row mb-3">
                  <div className="col">
                    {hasError && this.renderErrorMessage()}
                  </div>
                </div>
              }
              <TableContainer
                id="coupon-details"
                className="coupon-details-table"
                fetchMethod={() => EcommerceApiService.fetchCouponDetails(id)}
                columns={this.tableColumns}
                formatData={this.formatCouponData}
              />
            </React.Fragment>
          }
        </div>
      </div>
    );
  }
}

CouponDetails.defaultProps = {
  expanded: false,
  hasError: false,
  couponDetailsTable: {},
};

CouponDetails.propTypes = {
  id: PropTypes.number.isRequired,
  expanded: PropTypes.bool,
  hasError: PropTypes.bool,
  couponDetailsTable: PropTypes.shape({}),
};

export default CouponDetails;
