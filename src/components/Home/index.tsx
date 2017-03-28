import './index.scss';

import * as React from 'react';
import * as actions from '../../actions/home';

import { RootState } from '../../reducers/index';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import parseUri from 'uri-sharp';

export namespace Home {
  export interface Props extends RouteComponentProps<void> {
    title: string;
    boards: any[];
    organizations: any[];
    selectedOrgId: string;
    dispatch: any;
  }

  export interface State { }
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

    const { hash }: any = parseUri(window.location.href);

    if (hash.token) {
      this.token = hash.token;
    }
    else if (!this.token) {
      window.location.replace('/login');
    }
  }

  get token() {
    return localStorage.getItem(Home.tokenSettingKey);
  }

  set token(value) {
    localStorage.setItem(Home.tokenSettingKey, value);
  }

  render() {
    return (
      <div>
        <h1 className="color-test">Trellal! { this.props.title }</h1>

        <button className="btn btn-default" onClick={ () => this.props.dispatch(actions.getBoards(this.token)) }>Get Boards</button>
        <button className="btn btn-default" onClick={ () => this.props.dispatch(actions.getOrganizations(this.token)) }>Get Orgs</button>

        <select onChange={ (e) => this.props.dispatch(actions.selectOrganization(e.target.value)) }>
          {this.props.organizations.map(org =>
            <option key={ org.id } value={ org.id }>{ org.name }</option>
          )}
        </select>

        <span>{ this.props.selectedOrgId }</span>

        <button className="btn btn-default" onClick={ () => this.props.dispatch(actions.getBoardsByOrg(this.token, this.props.selectedOrgId)) }>Get Org Boards</button>

        <hr />
        <div>
          { this.props.boards.map(board =>
            <div key={ board.id } className="board" data-id={ board.id } style={ { background: board.prefs.backgroundColor } }>
              <h2>{ board.name }</h2>
              { board.lists.map(list =>
                <div key={ list.id } className="list">
                  { list.name }
                  <ul className="card-container">
                    { list.cards.map(card =>
                      <li key={ card.id } className="card">
                        { card.name }
                        { board.members.filter(bm => card.idMembers.indexOf(bm.id) !== -1).map(member =>
                          <div key={ member.id } className="member">
                            { member.fullName }
                          </div>
                        )}
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
