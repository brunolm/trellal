import * as React from 'react';
import * as models from '../../api/models';

import DragScroll from '../Shared/DragScroll';
import List from './List';

export namespace BoardComponent {
  export interface Props extends models.Board {
    filteredLists: models.List[];
    filterMyCards: boolean;
    hiddenBoards: string[];
    selectedViewMode: string;
    user: any;
  }

  export interface State {
    hiddenBoards: string[];
  }
}

export default class Board extends React.Component<BoardComponent.Props, BoardComponent.State> {
  constructor(props) {
    super(props);

    this.state = {
      hiddenBoards: [],
    };
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

  render() {
    const {
      filteredLists,
      filterMyCards,
      id,
      lists,
      name,
      prefs,
      selectedViewMode,
      user,
    } = this.props;

    return (
      <DragScroll>
        <div className="board" data-id={ id } style={ { background: prefs.backgroundColor } } title={ name }>
          <h2 onClick={ () => this.hideBoard(id) } className="board-name">{ name }</h2>
          <div className="board-canvas" hidden={ this.state.hiddenBoards.indexOf(id) !== -1 }>

            {
              lists.filter((list) => filteredLists.map((fl) => fl.id).indexOf(list.id) !== -1).map((list) =>
                <List key={ list.id } { ...{ ...list, user, filterMyCards, selectedViewMode, board: this.props } } />,
              )
            }

          </div>
        </div>
      </DragScroll>
    );
  }
}
