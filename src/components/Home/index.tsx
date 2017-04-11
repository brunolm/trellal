import './index.scss';
import 'jquery';
import 'bootstrap';

import * as $ from 'jquery';
import * as React from 'react';
import * as actions from '../../actions/home';
import * as boardService from '../../services/board';
import * as models from '../../api/models';

import MultiSelect, { MultiSelectComponent } from '../Shared/MultiSelect';

import Board from './Board';
import OrganizationSelect from './OrganizationSelect';
import RefreshButton from './RefreshButton';
import { RootState } from '../../reducers/index';
import { RouteComponentProps } from 'react-router';
import SelectViewMode from './SelectViewMode';
import { connect } from 'react-redux';
import parseUri from 'uri-sharp';

(window as any).jQuery = (window as any).$ = $;

export namespace Home {
  export interface Props extends RouteComponentProps<void> {
    title: string;

    organizations: any[];
    selectedOrgId: string;

    boards: any[];
    filteredBoards: string[];

    filteredBoardLists: string[];
    filteredLists: string[];

    filterMyCards: boolean;

    boardsLoading: boolean;
    organizationsLoading: boolean;

    selectedBoards: MultiSelectComponent.SelectOption[];
    selectedLists: any[];

    selectedViewMode: string;

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
export default class Home extends React.Component<Home.Props, {}> {
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
    const isEditableElement = !/button/i.test(e.target.tagName) && $(e.target).is(':input, [contenteditable]');
    if (!isEditableElement && /q/i.test(e.key)) {
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
    this.props.dispatch(actions.refresh(this.token, this.props.selectedOrgId));
  }

  onSelectBoards = (e) => {
    this.props.dispatch(actions.setSelectedBoards(e));
  }
  onSelectLists = (e) => {
    this.props.dispatch(actions.setSelectedLists(e));
  }

  onViewModeChanged = (value) => {
    this.props.dispatch(actions.changeViewMode(value));
  }

  filterLists(board) {
    return boardService.filterItemsByIds(board.lists, this.props.filteredLists);
  }
  mapList(board, list) {
    return { ...list, user: this.user, boardName: board.name };
  }

  render() {
    const boards = boardService.filterItemsByIds(this.props.boards, this.props.filteredBoards);
    const allFilteredLists = boardService.getBoardsLists(boards);
    const filteredBoardLists = boardService.filterItemsByIds(allFilteredLists, this.props.filteredBoardLists);

    const singleBoard = boardService.getSingleBoard(boards, this.props.selectedLists, {
      filterMyCards: this.props.filterMyCards,
      selectedViewMode: this.props.selectedViewMode,
      user: this.user,
    });

    const filtersVisible = this.props.selectedOrgId && !!this.props.boards.length;

    return (
      <div>
        <div className="filters bg-inverse text-white">
          <div>
            <h1>Trellal <sup>Alpha</sup></h1>
            {
              this.props.boardsLoading &&
              <i className="fa fa-2x fa-circle-o-notch fa-spin ml-2"></i>
            }
          </div>
          <div className="row">
            <div className="col-12 form-inline">
              <OrganizationSelect
                className="mr-1 my-1"
                organizations={ this.props.organizations }
                loading={ this.props.organizationsLoading || this.props.boardsLoading }
                onOrganizationChange={ this.onOrganizationChange }
              />

            {
              filtersVisible &&
                <MultiSelect
                  className="mr-1 my-1"
                  items={ this.props.boards.map((board) => ({ value: board.id, label: board.name })) }
                  label="Boards"
                  selectedItems={ this.props.selectedBoards }
                  onChange={ this.onSelectBoards } />
            }
            {
              filtersVisible &&
                <MultiSelect
                  className="mr-1 my-1"
                  items={ filteredBoardLists.map((board) => ({ value: board.id, label: board.name })) }
                  label="Lists"
                  selectedItems={ this.props.selectedLists }
                  onChange={ this.onSelectLists } />
            }

            {
              filtersVisible &&
              <div className="my-2">
                <SelectViewMode onViewModeChanged={ this.onViewModeChanged } className="mr-2" />

                <RefreshButton
                  refresh={ this.refreshBoards }
                />
              </div>
            }
            </div>
          </div>


        </div>

        {
          singleBoard &&
          <Board { ...{ ...this.props, ...singleBoard, user: this.user } } />
        }

        {
          !singleBoard &&
          <div>
            {
              boards.map((board) =>
                <Board key={ board.id } { ...{ ...this.props, ...board, user: this.user } } />,
              )
            }
          </div>
        }
      </div>
    );
  }
}
