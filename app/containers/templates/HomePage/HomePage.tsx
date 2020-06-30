import React from 'react';
import get from 'lodash/get';
import enhance from '../../../lib/dynamicStore';
import initialActions from './HomePage.actions';
import saga from './HomePage.saga';
import reducer, { HomePageReducerType } from './HomePage.reducer';
import HomePageComponent from '../../../components/templates/HomePage';
import { MapStateToProps } from 'react-redux';
import { NextPage } from 'next';

type ReduxState = {
  homePage: {
    layout: HomePageReducerType;
  };
};

type OwnProps = {};

type StateProps = {
  seoData: {
    description: string;
    title: string;
  };
  editorialData: {
    title: string;
    subTitle: string;
  };
};

type Props = OwnProps & StateProps;

const HomePage: React.FC<Props> = props => <HomePageComponent {...props} />;

const mapStateToProps: MapStateToProps<StateProps, Props, ReduxState> = (
  state: ReduxState
): StateProps => ({
  editorialData: get(state, ['homePage', 'layout', 'editorialData']),
  seoData: get(state, ['homePage', 'layout', 'seoData']),
});

export default enhance(HomePage as NextPage, {
  mapStateToProps,
  saga,
  reducer,
  key: 'homePage',
  initialActions,
});
