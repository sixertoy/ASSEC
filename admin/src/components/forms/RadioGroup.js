import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

const getkey = (name, index) => `radio::${name}::${index}`;

const RadioGroup = ({
  name, label, provider, ...rest
}) => (
  <p>
    <label htmlFor={name}>
      <span>{label}</span>
      {provider &&
        provider.map((obj, index) => (
          <span key={getkey(name, index)}>
            <Field {...rest} name={name} type="radio" component="input" />
            <span>{obj.name}</span>
          </span>
        ))}
    </label>
  </p>
);

RadioGroup.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  provider: PropTypes.array.isRequired,
};

export default RadioGroup;
