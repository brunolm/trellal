import * as React from 'react';

export namespace DragScrollComponent {
  export interface State {
    clicking: boolean;
    element: HTMLElement;
    initialScrollX: number;
    initialScrollY: number;
    initialX: number;
    initialY: number;
  }
}

export default class DragScroll extends React.Component<{ }, DragScrollComponent.State> {
  constructor(props) {
    super(props);

    this.state = {
      clicking: false,
      element: undefined,
      initialScrollX: 0,
      initialScrollY: 0,
      initialX: 0,
      initialY: 0,
    };
  }

  getElement(e) {
    return $(e.target).closest('._drag-scroll').find(':first').get(0);
  }

  onMouseDown = (e) => {
    const element = this.getElement(e);

    if (!element) {
      return;
    }

    this.setState({
      clicking: true,
      element,
      initialScrollX: element.scrollLeft,
      initialScrollY: element.scrollTop,
      initialX: e.pageX,
      initialY: e.pageY,
    });
  }

  onMouseMove = (e) => {
    if (this.state.clicking) {
      const moveX = this.state.initialX - e.pageX;
      const moveY = this.state.initialY - e.pageY;
      const element = this.state.element;
      element.scrollLeft = this.state.initialScrollX + moveX;
      element.scrollTop = this.state.initialScrollY + moveY;
    }
  }

  onMouseUp = (e) => {
    this.setState({
      clicking: false,
    });
  }

  render() {
    return (
      <div className="_drag-scroll"
        style={ { userSelect: 'none' } }
        onMouseDown={ this.onMouseDown } onMouseMove={ this.onMouseMove } onMouseUp={ this.onMouseUp }
      >
        { this.props.children }
      </div>
    );
  }
}
