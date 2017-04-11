import './index.scss';

import * as React from 'react';
import * as classNames from 'classnames';
import * as fuzzy from 'fuzzy';

export namespace MultiSelectComponent {
  export interface Props {
    className?: string;
    items: SelectOption[];
    label?: string;
    selectedItems: SelectOption[];

    onChange: (option: SelectOption[]) => any;
  }

  export interface State {
    search: string;
    hidden: boolean;
  }

  export interface SelectOption {
    value: any;
    label: any;
  }
}

export default class MultiSelect extends React.Component<MultiSelectComponent.Props, MultiSelectComponent.State> {
  constructor(props) {
    super(props);

    this.state = {
      hidden: true,
      search: '',
    };
  }

  onChange = (item: MultiSelectComponent.SelectOption) => {
    const selectedItems = [ ...this.props.selectedItems ];

    const index = selectedItems.findIndex((element) => element.value === item.value);

    if (index !== -1) {
      selectedItems.splice(index, 1);
    }
    else {
      selectedItems.push(item);
    }

    this.props.onChange(selectedItems);
  }

  onSearchChange(e) {
    this.setState({
      search: e.target.value,
    });
  }

  search() {
    return !this.state.search
      ? this.props.items
      : fuzzy.filter(this.state.search, this.props.items, { extract: (e) => e.label }).map((e) => e.original);
  }

  toggle() {
    this.setState({
      hidden: !this.state.hidden,
    });
  }

  resetSearch = (e) => {
    this.setState({ search: '' });

    this.setState({
      hidden: true,
    });
  }

  show = (e) => this.setState({ hidden: false });
  hide = (e) => {
    let node = e.target;

    do {
      if (/dropdown/.test(node.className)) {
        return;
      }
    } while ((node = node.parentNode));

    this.setState({ hidden: true });
  }

  componentDidMount() {
    document.addEventListener('click', this.hide);
    document.addEventListener('focusin', this.hide);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.hide);
    document.removeEventListener('focusin', this.hide);
  }

  render() {
    const selectText = this.props.selectedItems.length ? `${this.props.label}: ${this.props.selectedItems.length} selected` : this.props.label;

    const items = this.search();
    const noItems = items.length ? undefined : (<div className="dropdown-item">No results</div>);

    return (
      <div className={ classNames('dropdown multiselect', this.props.className) }>
        <div>
          <div className="input-group">
            <input type="search" className="dropdown-toggle form-control" placeholder={ selectText }
              value={ this.state.search }
              onFocus={ this.show }
              onChange={ (e) => this.onSearchChange(e) }
            />

            <button className="input-group-addon btn btn-secondary" onClick={ this.resetSearch } tabIndex={ -1 }><i className="fa fa-close" aria-hidden="true"></i></button>
          </div>
        </div>

        <div className="dropdown-menu" style={ { display: this.state.hidden ? 'none' : 'block' } }>
          {
            this.search().map((item) =>
              <button key={ item.value } className="dropdown-item" tabIndex={ 0 } onClick={ () => this.onChange(item) }>
                <input type="checkbox" className="form-check-input ml-0 mr-2" tabIndex={ -1 }
                  onChange={ Number }
                  checked={ this.props.selectedItems.some((si) => si.value === item.value) }
                />
                { item.label }
              </button>,
            )
          }
          { noItems }
        </div>
      </div>
    );
  }
}
