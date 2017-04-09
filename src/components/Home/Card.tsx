import * as React from 'react';
import * as models from '../../api/models';

export namespace CardComponent {
  export interface Props extends models.Card {
    board: models.Board;
  }
}

export default class Card extends React.Component<CardComponent.Props, {}> {
  render() {
    return (
      <li className="card-item" title={ `#${this.props.idShort}` }>
        <div>
          {
            this.props.labels.map((label) =>
              <span key={ label.id } className={ `card-label card-label-${label.color}` }>{ label.name || ' ' }</span>,
            )
          }
        </div>
        { this.props.name }
        <div className="card-members">
          {
            this.props.board.members.filter((bm) => this.props.idMembers.indexOf(bm.id) !== -1).map((member) =>
              <img key={ member.id } alt={ member.initials } title={ member.fullName }
                src={ `http://trello-avatars.s3.amazonaws.com/${member.avatarHash}/30.png` } />,
            )
          }
        </div>
      </li>
    );
  }
}
