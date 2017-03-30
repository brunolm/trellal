import './index.scss';
import 'jquery';
import 'bootstrap';

import * as $ from 'jquery';
import * as React from 'react';
import * as Select from 'react-select';
import * as actions from '../../actions/home';

import { RootState } from '../../reducers/index';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import parseUri from 'uri-sharp';

(window as any).jQuery = (window as any).$ = $;

export namespace Home {
  export interface Props extends RouteComponentProps<void> {
    title: string;
    boards: any[];
    organizations: any[];
    selectedOrgId: string;
    dispatch: any;
    boardsLoading: boolean;
    organizationsLoading: boolean;
    selectedBoards: any[];
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

  onOrganizationChange(e) {
    this.props.dispatch(actions.getBoardsByOrg(this.token, e.target.value));
  }

  refreshBoards() {
    this.props.dispatch(actions.getBoardsByOrg(this.token, this.props.selectedOrgId));
  }

  onSelectBoards(e) {
    this.props.dispatch(actions.setSelectedBoards(e));
  }

  render() {
    const filteredBoards = this.props.boards.filter(board => this.props.selectedBoards.map(sb => sb.value).indexOf(board.id) !== -1);

    return (
      <div>
        <div className="filters">
          <div className="row">
            <div className="col-12 col-sm-6 form-inline">
              <select className="form-control mr-2"
                disabled={ this.props.organizationsLoading || this.props.boardsLoading }
                onChange={ (e) => this.onOrganizationChange(e) }>
                <option value="">{ this.props.organizationsLoading ? 'Loading...' : 'Select organization...' }</option>
                { this.props.organizations.map(org =>
                  <option key={ org.id } value={ org.id }>{ org.displayName }</option>
                ) }
              </select>
              <button className="btn btn-primary mr-2" onClick={ () => this.refreshBoards() }>
                <i className="fa fa-refresh" aria-hidden="true"></i>
              </button>
              { this.props.boardsLoading &&
                <i className="fa fa-spinner fa-spin ml-2"></i>
              }
            </div>
          </div>

          { this.props.selectedOrgId && !!this.props.boards.length &&
            <div>
              Boards

              <div className="row">
                <div className="col-12">
                  <Select
                    options={ this.props.boards.map(board => ({ value: board.id, label: board.name })) }
                    multi
                    value={ this.props.selectedBoards }
                    onChange={ (e) => this.onSelectBoards(e) }
                  />
                </div>
              </div>
            </div>
          }
        </div>
        <div>
          { filteredBoards.map(board =>
            <div key={ board.id } className="board" data-id={ board.id } style={ { background: board.prefs.backgroundColor } }>
              <h2 onClick={ () => this.hideBoard(board.id) } className="board-name">{ board.name }</h2>
              <div className="board-canvas" hidden={ this.state.hiddenBoards.indexOf(board.id) !== -1 }>
                { board.lists.map(list =>
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
