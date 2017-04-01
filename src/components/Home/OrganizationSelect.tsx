import * as React from 'react';

export namespace OrganizationSelect {
  export interface Props {
    organizations: any[];
    loading: boolean;

    onOrganizationChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  }

  export interface State { }
}

export default class OrganizationSelect extends React.Component<OrganizationSelect.Props, OrganizationSelect.State> {
  render() {
    return (
      <select className="form-control mr-2"
        disabled={ this.props.loading }
        onChange={ (e) => this.props.onOrganizationChange(e) }>
        <option value="">{ this.props.loading ? 'Loading...' : 'Select organization...' }</option>
        { this.props.organizations.map(org =>
          <option key={ org.id } value={ org.id }>{ org.displayName }</option>
        ) }
      </select>
    );
  }
}
