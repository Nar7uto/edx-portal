import React from 'react';
import PropTypes from 'prop-types';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import Header from './index';
import EdxLogo from '../../images/edx-logo.png';

const mockStore = configureMockStore([thunk]);

const HeaderWrapper = props => (
  <MemoryRouter>
    <Header
      store={props.store}
      {...props}
    />
  </MemoryRouter>
);

HeaderWrapper.propTypes = {
  store: PropTypes.shape({}).isRequired,
};

describe('<Header />', () => {
  let store;
  let tree;

  it('renders enterprise logo correctly', () => {
    store = mockStore({
      portalConfiguration: {
        enterpriseName: 'Test Enterprise',
        enterpriseSlug: 'test-enterprise',
        enterpriseLogo: 'https://test.url/image/1.png',
      },
      authentication: {
        email: 'test@example.com',
      },
      userProfile: {
        profile: null,
      },
    });

    tree = renderer
      .create((
        <HeaderWrapper store={store} />
      ))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders edX logo correctly', () => {
    store = mockStore({
      portalConfiguration: {},
      authentication: {},
      userProfile: {},
    });
    tree = renderer
      .create((
        <HeaderWrapper store={store} />
      ))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders profile image correctly', () => {
    store = mockStore({
      portalConfiguration: {},
      authentication: {
        email: 'staff@example.com',
        username: 'staff',
      },
      userProfile: {
        profile: {
          profile_image: {
            has_image: true,
            image_url_medium: EdxLogo,
          },
        },
      },
    });
    tree = renderer
      .create((
        <HeaderWrapper store={store} />
      ))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders default profile image correctly', () => {
    store = mockStore({
      portalConfiguration: {},
      authentication: {
        email: 'staff@example.com',
        username: 'staff',
      },
      userProfile: {
        profile: {
          profile_image: {
            has_image: false,
          },
        },
      },
    });
    tree = renderer
      .create((
        <HeaderWrapper store={store} />
      ))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
