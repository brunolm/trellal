import * as React from 'react';

export namespace RefreshButton {
  export interface Props {
    loading: boolean;

    refresh: (e: React.MouseEvent<HTMLButtonElement>) => void;
  }
}

export default class OrganizationSelect extends React.Component<RefreshButton.Props, { }> {
  render() {
    return (
      <span>
        <button className="btn btn-primary mr-2" onClick={ (e) => this.props.refresh(e) }>
          <i className="fa fa-refresh" aria-hidden="true"></i>
        </button>
        {
          this.props.loading &&
          <i className="fa fa-spinner fa-spin ml-2"></i>
        }
      </span>
    );
  }
}
