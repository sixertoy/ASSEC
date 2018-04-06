import React from 'react';
import PropTypes from 'prop-types';

// application
class AppPage extends React.PureComponent {
  render () {
    const {
      header, footer, children, path, name, icon,
    } = this.props;
    return (
      <div id={`${path}-page`} className="page-content">
        <h1 id="page-title" className="mb20 pb12 bb">
          {icon && <i className={`icon icon-${icon}`} />}
          <span>{name}</span>
        </h1>
        {header && (
          <div id="page-column-header" className="col100">
            {header()}
          </div>
        )}
        <div id="page-column-content" className="flex-columns">
          {children}
        </div>
        {footer && (
          <div id="page-column-footer" className="col100">
            {header()}
          </div>
        )}
      </div>
    );
  }
}

AppPage.defaultProps = {
  footer: null,
  header: null,
};

AppPage.propTypes = {
  footer: PropTypes.func,
  header: PropTypes.func,
  path: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default AppPage;
