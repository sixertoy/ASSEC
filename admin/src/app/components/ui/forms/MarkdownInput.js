import React from 'react';
import omit from 'lodash.omit';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

// application
import MarkdownEditor from './adpaters/MarkdownEditor';

const MarkdownInput = ({ name, label, ...rest }) => (
  <div className={rest.className || ''}>
    <Field {...omit(rest, ['className'])}
      id={name}
      name={name}
      label={label}
      component={MarkdownEditor} />
  </div>
);

MarkdownInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default MarkdownInput;
