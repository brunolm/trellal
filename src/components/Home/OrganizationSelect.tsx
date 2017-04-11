import * as React from 'react';
import * as classNames from 'classnames';

export namespace OrganizationSelect {
  export interface Props {
    className?: string;
    organizations: any[];
    loading: boolean;

    onOrganizationChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  }
}

export default class OrganizationSelect extends React.Component<OrganizationSelect.Props, { }> {
  render() {
    return (
      <select className={ classNames('form-control', this.props.className) }
        disabled={ this.props.loading }
        onChange={ (e) => this.props.onOrganizationChange(e) }>
        <option value="">{ this.props.loading ? 'Loading...' : 'Select organization...' }</option>
        {
          this.props.organizations.map((org) =>
            <option key={ org.id } value={ org.id }>{ org.displayName }</option>,
          )
        }
      </select>
    );
  }
}
