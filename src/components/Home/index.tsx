import './index.scss';
import 'jquery';
import 'bootstrap';

import * as $ from 'jquery';
import * as React from 'react';
import * as actions from '../../actions/home';

import MultiSelect, { MultiSelectComponent } from '../Shared/MultiSelect';

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

    boardsLoading: boolean;
    organizationsLoading: boolean;

    selectedBoards: MultiSelectComponent.SelectOption[];
    selectedLists: any[];

    dispatch: any;
  }

  export interface State {
    hiddenBoards: string[];
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    ...state.home,
  } as Home.State;
};

@(connect as any)(mapStateToProps)
export default class Home extends React.Component<Home.Props, Home.State> {
  static tokenSettingKey = 'token';

  constructor(props) {
    super(props);

    this.state = {
      hiddenBoards: [],
    };

    const { hash }: any = parseUri(window.location.href);

    if (hash.token) {
      this.token = hash.token;
    }
    else if (!this.token) {
      window.location.replace('/login');
    }

    if (this.token) {
      this.props.dispatch(actions.getOrganizations(this.token));
    }
  }

  get token() {
    return localStorage.getItem(Home.tokenSettingKey);
  }

  set token(value) {
    localStorage.setItem(Home.tokenSettingKey, value);
  }

  hideBoard(boardId) {
    const { hiddenBoards } = this.state;

    const index = hiddenBoards.indexOf(boardId);

    if (index === -1) {
      hiddenBoards.push(boardId);
    }
    else {
      hiddenBoards.splice(index, 1);
    }

    this.setState({
      hiddenBoards,
    });
  }

  onOrganizationChange = e => {
    this.props.dispatch(actions.getBoardsByOrg(this.token, e.target.value));
  }

  refreshBoards = () => {
    this.props.dispatch(actions.getBoardsByOrg(this.token, this.props.selectedOrgId));
  }

  onSelectBoards = e => {
    this.props.dispatch(actions.setSelectedBoards(e));
  }
  onSelectLists = e => {
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
                    items={ this.props.boards.map(board => ({ value: board.id, label: board.name })) }
                    label="Boards"
                    selectedItems={ this.props.selectedBoards }
                    onChange={ this.onSelectBoards } />
                </div>
                <div className="col-12 col-sm-4 col-xl-3">
                  <MultiSelect
                    items={ this.props.filteredBoardLists.map(board => ({ value: board.id, label: board.name })) }
                    label="Lists"
                    selectedItems={ this.props.selectedLists }
                    onChange={ this.onSelectLists } />
                </div>
              </div>
            </div>
          }
        </div>

        <div>
          { this.props.filteredBoards.map(board =>
            <div key={ board.id } className="board" data-id={ board.id } style={ { background: board.prefs.backgroundColor } }>
              <h2 onClick={ () => this.hideBoard(board.id) } className="board-name">{ board.name }</h2>
              <div className="board-canvas" hidden={ this.state.hiddenBoards.indexOf(board.id) !== -1 }>

                { board.lists.filter(list => this.props.filteredLists.map(fl => fl.id).indexOf(list.id) !== -1).map(list =>
                  <div key={ list.id } className="list">
                    <span>{ list.name }</span>

                    <ul className="card-container">
                      { list.cards.map(card =>
                        <li key={ card.id } className="card">
                          { card.name }
                          <div className="members">
                            { board.members.filter(bm => card.idMembers.indexOf(bm.id) !== -1).map(member =>
                              <img key={ member.id } alt={ member.initials } title={ member.fullName } src={ `http://trello-avatars.s3.amazonaws.com/${member.avatarHash}/30.png` } />
                            ) }
                          </div>
                        </li>
                      ) }
                    </ul>

                  </div>
                ) }

              </div>
            </div>
          ) }
        </div>
      </div>
    );
  }
}
