import React from 'react';
import PropTypes from 'prop-types';

const SubmitButton = ({ label, pristine, invalid }) => (
  <p className="flex-columns flex-end submit-button">
    <button type="submit" className="big super" disabled={pristine || invalid}>
      <span>{label}</span>
      <i className="icon icon-floppy" />
    </button>
  </p>
);

SubmitButton.defaultProps = {
  label: 'Enregistrer',
};

SubmitButton.propTypes = {
  label: PropTypes.string,
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
};

export default SubmitButton;
