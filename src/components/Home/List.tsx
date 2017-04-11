import * as React from 'react';
import * as classNames from 'classnames';
import * as models from '../../api/models';

import Card from './Card';

export namespace ListComponent {
  export interface Props extends models.List {
    board: models.Board;
    user: any;
    filterMyCards: boolean;
    selectedViewMode: string;
  }
}

export default class List extends React.Component<ListComponent.Props, {}> {
  render() {
    const { user, filterMyCards, board } = this.props;

    return (
      <div className={ classNames('list', { double: !this.props.selectedViewMode }) }>
        <strong>{ this.props.name }</strong>

        <ul className="card-container">
          {
            this.props.cards
              .filter((card) => !user || !filterMyCards || (filterMyCards && card.idMembers.indexOf(user.id) !== -1))
              .map((card) =>
                <Card key={ card.id } { ...{ ...card, board } } />,
              )
          }
        </ul>

      </div>
    );
  }
}
