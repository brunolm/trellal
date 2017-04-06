import './index.scss';
import 'jquery';
import 'bootstrap';

import * as $ from 'jquery';
import * as React from 'react';
import * as actions from '../../actions/home';

import MultiSelect, { MultiSelectComponent } from '../Shared/MultiSelect';

import DragScroll from '../Shared/DragScroll';
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

    user: any;

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
  static userSettingKey = 'user';

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

      if (!this.user) {
        this.props.dispatch(actions.getUser(this.token));
      }
    }
  }

  filterMyCards = e => {
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
          {
            this.props.filteredBoards.map(board =>
              <DragScroll key={ board.id }>
                <div className="board" data-id={ board.id } style={ { background: board.prefs.backgroundColor } }>
                  <h2 onClick={ () => this.hideBoard(board.id) } className="board-name">{ board.name }</h2>
                  <div className="board-canvas" hidden={ this.state.hiddenBoards.indexOf(board.id) !== -1 }>

                    {
                      board.lists.filter(list => this.props.filteredLists.map(fl => fl.id).indexOf(list.id) !== -1).map(list =>
                        <div key={ list.id } className="list">
                          <strong>{ list.name }</strong>

                          <ul className="card-container">
                            {
                              list.cards
                                .filter(card => !this.user || !this.props.filterMyCards || (this.props.filterMyCards && card.idMembers.indexOf(this.user.id) !== -1))
                                .map(card =>
                                <li key={ card.id } className="card-item">
                                  <div>
                                    {
                                      card.labels.map(label =>
                                        <span key={ label.id } className={ `card-label card-label-${label.color}` }>{ label.name || ' ' }</span>,
                                      )
                                    }
                                  </div>
                                  { card.name }
                                  <div className="card-members">
                                    {
                                      board.members.filter(bm => card.idMembers.indexOf(bm.id) !== -1).map(member =>
                                        <img key={ member.id } alt={ member.initials } title={ member.fullName }
                                          src={ `http://trello-avatars.s3.amazonaws.com/${member.avatarHash}/30.png` } />,
                                      )
                                    }
                                  </div>
                                </li>,
                              )
                            }
                          </ul>

                        </div>,
                      )
                    }

                  </div>
                </div>
              </DragScroll>,
            )
          }
        </div>
      </div>
    );
  }
}
