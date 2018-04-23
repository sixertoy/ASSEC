import { reset } from 'redux-form';

// application
// import zones from './../datas/zones';
import questions from './../datas/questions.json';
import alerts from './../datas/alerts-83.json';
// import schema from './../datas/schemas-83.json';
// import DecisionTree from './../core/decision-tree';
import { capitalize } from './../core/utils/capitalize';
import {
  HYDRATE_DEPARTMENT,
  FIND_RESTRICTION_BY_CRITERIAS,
} from './../apolloql';
import {
  FORM_NAME,
  FORM_RESET,
  FORM_SUBMIT,
  FIELDS_LOADED,
} from './../constants';

const MOCK_DEPARTEMENT_ID = '5ad84a9f73150f000eeaf0d0';

// generate decision schema
// const decision = 'alerte';
// const parameters = ['canal', 'nomcanal', 'usage', 'origine'];
// const dtree = new DecisionTree(schema, decision, parameters);

export const formSubmit = (client, values) => (dispatch, getstate) => {
  const choices = Object.keys(values).reduce(
    (acc, key) => Object.assign({}, acc, { [key]: values[key].choice }),
    { dpt: MOCK_DEPARTEMENT_ID },
  );
  client
    .query({
      query: FIND_RESTRICTION_BY_CRITERIAS,
      variables: choices,
    })
    .then(({ data: { findRestictionByCriteria: result } }) => {
      console.log('findRestictionByCriteria', result);
      // dispatch({
      //   type: FORM_SUBMIT,
      //   submitted: { result, submitted },
      // });
    });
  // const { steppedform } = getstate();
  // const submitted = Object.assign({}, values);
  // const prediction = Object.assign({}, steppedform.defaults, choices);
  // const alertindex = dtree.predict(prediction);
  // const result = steppedform.alerts[alertindex];
};

export const loadForm = client => (dispatch) => {
  client
    .query({
      query: HYDRATE_DEPARTMENT,
      variables: { dpt: '5ad84a9f73150f000eeaf0d0' },
    })
    .then(({ data: { hydrateDepartment } }) => {
      const fields = questions
        .map((question) => {
          if (!hydrateDepartment[question.id]) return false;
          const values =
            hydrateDepartment[question.id].map(value => ({
              id: value.id,
              order: value.order || 0,
              // FIXME -> doit pas etre capitalized ici
              // mais depuis la base de donnees ou l'input user
              name: capitalize(value.name.trim()),
              // FIXME -> doit pas etre parse en JSON ici
              // mais depuis la base de donnees
              geojson: (value.geojson && JSON.parse(value.geojson)) || false,
            })) || [];
          return { ...question, values };
        })
        .filter(v => v);
      dispatch({ type: FIELDS_LOADED, fields, alerts });
    });
};

export const formReset = () => (dispatch) => {
  dispatch(reset(FORM_NAME));
  dispatch({ type: FORM_RESET });
};
