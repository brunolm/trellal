import * as React from 'react';
import * as models from '../../api/models';

export namespace CardComponent {
  export interface Props extends models.Card {
    board: models.Board;
    boardName?: string;
  }
}

export default class Card extends React.Component<CardComponent.Props, {}> {
  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; ++i) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  intToRGB(i) {
    const c = (i & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
  }

  getColor(id) {
    return this.intToRGB(this.hashCode(id));
  }

  render() {
    const style = this.props.boardName ? {
      borderLeftColor: this.getColor(this.props.boardName || '0'),
      borderLeftStyle: 'solid',
      borderLeftWidth: 10,
    } : { };

    return (
      <li className="card-item" title={ `#${this.props.idShort}` } style={ style }>
        <div>
          {
            this.props.labels.map((label) =>
              <span key={ label.id } className={ `card-label card-label-${label.color}` }>{ label.name || ' ' }</span>,
            )
          }
        </div>
        <span className="text-muted pull-right">#{ this.props.idShort }</span>
        <div className="text-muted mr-1">{ this.props.boardName }</div>
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
