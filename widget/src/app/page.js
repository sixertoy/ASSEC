import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { reduxForm, Form } from 'redux-form';

// application
import { usedebug } from './core/utils/usedebug';
import { LOAD_DEPARTMENT_WIDGET } from './queries';
import WidgetHeader from './components/WidgetHeader';
import WidgetSummary from './components/WidgetSummary';

// inputs
import MapInput from './components/forms/MapInput';
import ListInput from './components/forms/ListInput';
import ChoiceInput from './components/forms/ChoiceInput';

class PageComponent extends React.Component {
  constructor (props) {
    super(props);
    this.state = { code: null };
  }

  componentWillMount () {
    const parsed = queryString.parse(document.location.search);
    this.setState({ code: parsed.department || null });
  }

  // componentWillReceiveProps ({ stepskeys, choiceskeys }) {
  //   if (deepequal(stepskeys, this.props.stepskeys)) {
  //     // si le fil d'ariane contient les même éléments
  //     return;
  //   }
  //   const filtered = choiceskeys.filter(key => !stepskeys.includes(key));
  //   if (!filtered.length) return;
  //   // Supprime les entrees du formulaire
  //   // dont l'input n'est pas present dans le fil d'ariane
  //   // utile dans le cas de stepBackward/stepFormard
  //   this.actions.clearFields(FORM_NAME, false, false, filtered);
  // }

  render () {
    const { step } = this.props;
    const { code } = this.state;
    if (!code) return <p>Error le code est manquant :(</p>;
    return (
      <Query query={LOAD_DEPARTMENT_WIDGET} variables={{ code }}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error graphql :(</p>;
          const widget = (data && data.widget) || null;
          const questions = (widget && widget.questions) || null;
          const question = (questions && questions[step]) || null;
          const map = (widget && widget.map) || null;
          const total = questions.length;
          return (
            <React.Fragment>
              <Helmet>
                <body className={`current-step-${step}`} />
                <title>Assec{usedebug() ? ' | Development' : ''}</title>
              </Helmet>
              <div id="assec-widget" className="flex-rows">
                <WidgetHeader total={total} />
                <WidgetSummary questions={questions} />
                <div id="assec-widget-survey">
                  <Form onSubmit={() => {}}>
                    {question &&
                      question.display === 'list' && (
                      <ListInput {...question} />
                    )}
                    {question &&
                      question.display === 'choice' && (
                      <ChoiceInput {...question} />
                    )}
                    {question &&
                      question.display === 'zones' && (
                      <MapInput {...question} {...map} />
                    )}
                  </Form>
                </div>
              </div>
            </React.Fragment>
          );
        }}
      </Query>
    );
  }
}

PageComponent.propTypes = {
  step: PropTypes.number.isRequired,
};

const connected = connect(state => ({
  step: state.step,
}))(PageComponent);

export default reduxForm({
  initialValues: {
    usage: { choice: null },
    origine: { choice: null },
    situation: { choice: null },
  },
  form: 'ASSEC_WIDGET_FORM',
})(connected);
