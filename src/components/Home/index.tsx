import './index.scss';
import 'jquery';
import 'bootstrap';

import * as $ from 'jquery';
import * as React from 'react';
import * as actions from '../../actions/home';
import * as models from '../../api/models';

import MultiSelect, { MultiSelectComponent } from '../Shared/MultiSelect';

import Board from './Board';
import OrganizationSelect from './OrganizationSelect';
import RefreshButton from './RefreshButton';
import { RootState } from '../../reducers/index';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import parseUri from 'uri-sharp';

(window as any).jQuery = (window as any).$ = $;

export namespace Home {
  export interface Props extends RouteComponentProps<void> {
    title: string;

    organizations: any[];
    selectedOrgId: string;

    boards: any[];
    filteredBoards: any[];

    filteredBoardLists: any[];
    filteredLists: any[];

    filterMyCards: boolean;

    boardsLoading: boolean;
    organizationsLoading: boolean;

    selectedBoards: MultiSelectComponent.SelectOption[];
    selectedLists: any[];

    user: models.User;

    dispatch: any;
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    ...state.home,
  };
};

@(connect as any)(mapStateToProps)
export default class Home extends React.Component<Home.Props, { }> {
  static tokenSettingKey = 'token';
  static userSettingKey = 'user';

  constructor(props) {
    super(props);

    const { hash }: any = parseUri(window.location.href);

    if (hash.token) {
      this.token = hash.token;
    }
    else if (!this.token) {
      window.location.replace('/login');
    }

    if (this.token) {
      this.props.dispatch(actions.getOrganizations(this.token));

      if (!this.user) {
        this.props.dispatch(actions.getUser(this.token));
      }
    }
  }

  filterMyCards = (e) => {
    if (/q/i.test(e.key)) {
      this.props.dispatch(actions.toggleUser(this.token));
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.filterMyCards);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.filterMyCards);
  }

  componentWillReceiveProps(nextProps) {
    this.user = nextProps.user;
  }

  get token() {
    return localStorage.getItem(Home.tokenSettingKey);
  }

  set token(value) {
    localStorage.setItem(Home.tokenSettingKey, value);
  }

  get user() {
    const value = localStorage.getItem(Home.userSettingKey);
    return value ? JSON.parse(value) : undefined;
  }

  set user(value) {
    if (value) {
      localStorage.setItem(Home.userSettingKey, JSON.stringify(value));
    }
  }

  onOrganizationChange = (e) => {
    this.props.dispatch(actions.getBoardsByOrg(this.token, e.target.value));
  }

  refreshBoards = () => {
    this.props.dispatch(actions.getBoardsByOrg(this.token, this.props.selectedOrgId));
  }

  onSelectBoards = (e) => {
    this.props.dispatch(actions.setSelectedBoards(e));
  }
  onSelectLists = (e) => {
    this.props.dispatch(actions.setSelectedLists(e));
  }

  render() {
    return (
      <div>
        <div className="filters bg-inverse text-white">
          <div className="row">
            <div className="col-12 col-sm-6 form-inline">
              <OrganizationSelect
                organizations={ this.props.organizations }
                loading={ this.props.organizationsLoading || this.props.boardsLoading }
                onOrganizationChange={ this.onOrganizationChange }
              />

              <RefreshButton
                loading={ this.props.boardsLoading }
                refresh={ this.refreshBoards }
              />
            </div>
          </div>

          { this.props.selectedOrgId && !!this.props.boards.length &&
            <div>
              <div className="row">
                <div className="col-12 col-sm-4 col-xl-3">
                  <MultiSelect
                    items={ this.props.boards.map((board) => ({ value: board.id, label: board.name })) }
                    label="Boards"
                    selectedItems={ this.props.selectedBoards }
                    onChange={ this.onSelectBoards } />
                </div>
                <div className="col-12 col-sm-4 col-xl-3">
                  <MultiSelect
                    items={ this.props.filteredBoardLists.map((board) => ({ value: board.id, label: board.name })) }
                    label="Lists"
                    selectedItems={ this.props.selectedLists }
                    onChange={ this.onSelectLists } />
                </div>
              </div>
            </div>
          }
        </div>

        <div>
          {
            this.props.filteredBoards.map((board) =>
              <Board key={ board.id } { ...{ ...board, ...this.props } } />,
            )
          }
        </div>
      </div>
    );
  }
}
