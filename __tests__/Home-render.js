import 'react-native';
import React from 'react';
import Home from '../src/v/Home';
import renderer from 'react-test-renderer';

jest.mock('../__mock__/permission');

it('renders home page correctly', () => {
  const tree = renderer.create(
    <Home />
  );
});
