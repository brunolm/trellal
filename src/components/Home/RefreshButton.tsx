import * as React from 'react';

export namespace RefreshButton {
  export interface Props {
    refresh: (e: React.MouseEvent<HTMLButtonElement>) => void;
  }
}

export default class RefreshButton extends React.Component<RefreshButton.Props, { }> {
  render() {
    return (
      <span>
        <button className="btn btn-primary mr-2" onClick={ (e) => this.props.refresh(e) }>
          <i className="fa fa-refresh" aria-hidden="true"></i>
        </button>
      </span>
    );
  }
}
