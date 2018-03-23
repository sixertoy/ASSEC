import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// application
import './form-navigation.css';
import Constants from './../../../constants';
import {
  stepReset,
  stepForward,
  stepBackward,
} from './../../../actions/navigation';

const FormNavigation = ({
  dispatch,
  laststep,
  disabled,
  resetstep,
  activestep,
  userchoicecount,
}) => (
  <div id="form-navigation" className="flex-columns flex-end">
    {/* {!resetstep && (
      <button onClick={() => dispatch(stepBackward())}
        disabled={disabled || activestep === 0}>
        <i className="icon icon-left-open-big" />
        <span>Précédent</span>
      </button>
    )} */}
    {!resetstep && (
      <button onClick={() => dispatch(stepForward())}
        disabled={disabled || activestep >= userchoicecount}>
        <span>Suivant</span>
        <i className="icon icon-right-open-big" />
      </button>
    )}
    {/* {laststep && (
      <button onClick={() => {}}
        className="last-step"
        disabled={disabled || activestep >= completedcount}>
        <i className="icon icon-adjust" />
        <span>Résultats</span>
        <i className="icon icon-right-open-big" />
      </button>
    )} */}
    {resetstep && (
      <button onClick={() => dispatch(stepReset())} disabled={disabled}>
        <span>reset</span>
      </button>
    )}
  </div>
);
FormNavigation.propTypes = {
  disabled: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  laststep: PropTypes.bool.isRequired,
  resetstep: PropTypes.bool.isRequired,
  activestep: PropTypes.number.isRequired,
  userchoicecount: PropTypes.number.isRequired,
};

const mapStateToProps = ({
  form, fields, activestep, disabledfields,
}) => {
  const { values } = form[Constants.FORM_NAME];
  const disabledcount = disabledfields.length;
  const completedcount = (values && Object.keys(values).length) || 0;
  const userchoicecount = completedcount + disabledcount;
  return {
    activestep,
    userchoicecount,
    resetstep: activestep >= fields.length,
    laststep: activestep === fields.length - 1,
    disabled: activestep === userchoicecount && !completedcount,
  };
};

export default connect(mapStateToProps)(FormNavigation);
