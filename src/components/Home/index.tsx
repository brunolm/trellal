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

  onViewModeChanged = (e) => {
    this.props.dispatch(actions.changeViewMode(e.target.value));
  }

  filterLists(board) {
    return board.lists.filter((list) => this.props.filteredLists.find((fl) => fl.id === list.id));
  }
  mapList(board, list) {
    return { ...list, user: this.user, boardName: board.name };
  }

  render() {
    let singleBoard;

    if (this.props.selectedViewMode === 'grouped') {
      singleBoard = this.props.filteredBoards.reduce((board, next) => {
        board.names.push(next.name);

        board.lists = board.lists
          .concat(this.filterLists(next).map((list) => this.mapList(next, list)));
        board.filterMyCards = this.props.filterMyCards;

        board.members = board.members.concat(next.members.filter((member) => !board.members.find((bm) => bm.id === member.id)));

        board.user = this.props.user;

        if (!board.prefs) {
          board.prefs = next.prefs;
        }
        return board;
      }, { name: '', names: [ ], lists: [ ], members: [ ], prefs: undefined });

      singleBoard.name = singleBoard.names.join(', ');

      const lists = singleBoard.lists.reduce((list, next) => {
        const name = next.name.replace(/\s[\(\[].*?[\)\]]/g, '');
        const hashName = name.toLowerCase();
        const mapBoardName = (card) => ({ ...card, boardName: next.boardName });

        list[hashName] = {
          ...next,
          name,
          cards: list[hashName]
            ? list[hashName].cards.concat(next.cards.map(mapBoardName))
            : next.cards.map(mapBoardName),
        };
        return list;
      }, { });

      singleBoard.lists = Object.keys(lists).reduce((list, next) => {
        list.push(lists[next]);
        return list;
      }, [ ]);
      singleBoard.filteredLists = singleBoard.lists;
    }

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

          {
            this.props.selectedOrgId && !!this.props.boards.length &&
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
                <div className="col-12 col-sm-4 col-xl-3">
                  <label data-toggle="tooltip" data-placement="bottom">View mode</label>
                  <select className="form-control" onChange={ this.onViewModeChanged } value={ this.props.selectedViewMode }>
                    <option value="">All</option>
                    <option value="grouped">Grouped</option>
                  </select>
                </div>
              </div>
            </div>
          }
        </div>

        {
          singleBoard &&
          <Board { ...{ ...singleBoard, ...this.props, user: this.user } } />
        }

        {
          !singleBoard &&
          <div>
            {
              this.props.filteredBoards.map((board) =>
                <Board key={ board.id } { ...{ ...board, ...this.props, user: this.user } } />,
              )
            }
          </div>
        }
      </div>
    );
  }
}
