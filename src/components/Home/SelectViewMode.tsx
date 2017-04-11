import * as React from 'react';
import * as classNames from 'classnames';

export namespace SelectViewMode {
  export interface Props {
    className?: string;
    onViewModeChanged: (value) => any;
  }
}

export default class SelectViewMode extends React.Component<SelectViewMode.Props, { }> {
  onViewModeChanged = (value) => {
    this.props.onViewModeChanged(value);
  }

  render() {
    return (
      <div className={ classNames('btn-group', this.props.className) } data-toggle="buttons">
        <button className="btn btn-primary active" onClick={ () => this.onViewModeChanged(undefined) }>
          <input type="radio" name="options" /> <i className="fa fa-trello" aria-hidden></i>
        </button>
        <button className="btn btn-primary" onClick={ (e) => this.onViewModeChanged('all') }>
          <input type="radio" name="options" /> <i className="fa fa-list" aria-hidden></i>
        </button>
      </div>
    );
  }
}
