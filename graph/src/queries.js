import pick from 'lodash.pick';
// import omit from 'lodash.omit';
import {
  // SUOModel,
  ZoneModel,
  BlockModel,
  Departement,
  Restriction,
  QuestionModel,
  SubscriberModel,
} from './drivers/mongodb';

export const Query = {
  /* -----------------------------------

  SINGLES QUERIES

  ----------------------------------- */

  block: (_, { id }) => (id && BlockModel.findById(id).exec()) || null,

  department: (_, { id }) =>
    (id &&
      Departement.findById(id)
        .populate('usages')
        .populate('origines')
        .populate('situations')
        .exec()) ||
    null,

  zone: (_, { id }) =>
    (id &&
      ZoneModel.findById(id)
        .populate('alerte.situation')
        .exec()) ||
    null,

  question: (_, { id }) => (id && QuestionModel.findById(id).exec()) || null,

  restriction: (_, { id }) => (id && Restriction.findById(id).exec()) || null,

  /* -----------------------------------

  BULKS QUERIES

  ----------------------------------- */

  departments: () =>
    Departement.find()
      .populate('usages')
      .populate('origines')
      .populate('situations')
      .exec(),

  departmentRestrictions: (_, { department }) => {
    if (!department) return [];
    return Restriction.find({ department })
      .populate('usages')
      .populate('origines')
      .populate('situations')
      .exec();
  },

  departmentSUOs: (_, { department }) =>
    Departement.findById(department)
      .populate('usages')
      .populate('origines')
      .populate('situations')
      .exec()
      .then(doc => pick(doc, ['usages', 'origines', 'situations'])),

  departmentSituations: (_, { department }) =>
    Departement.findById(department)
      .populate('situations')
      .exec()
      .then(doc => doc.situations),

  departmentZones: (_, { department }) =>
    (department &&
      ZoneModel.find({ department })
        .populate('alerte.situation')
        .exec()) ||
    null,

  departmentQuestions: (_, { department }) =>
    QuestionModel.find({ department }).exec() || null,

  blocks: () => BlockModel.find().exec() || null,

  departmentSubscribers: (_, { department }) =>
    (department && SubscriberModel.find({ department }).exec()) || null,

  /* -----------------------------------

  FRONTEND QUERIES

  ----------------------------------- */

  findRestictionByCriteria: (_, { zones, usages, origines }) =>
    ZoneModel.findById(zones).then((found) => {
      const { situation: situations } = found.alerte;
      return Restriction.find({
        usages: { $in: [usages] },
        origines: { $in: [origines] },
        situations: { $in: [situations] },
      });
    }),
  retrieveBlocks: () => BlockModel.find(),

  hydrateWidgetDepartment: (_, { code }) =>
    Departement.findOne({ code })
      .populate('usages')
      .populate('origines')
      .populate('situations')
      .exec()
      .then(doc =>
        QuestionModel.find({ department: doc.id }).then(questions =>
          questions.map((quest) => {
            console.log('quest.type', quest.type);
            const rez = { ...quest.toObject(), values: doc[quest.type] || {} };
            console.log('rez', rez);
            return rez;
          }))),
  //   Promise.all([
  //     Promise.resolve(doc),
  //     ZoneModel.find({ department: doc.id })
  //       .populate('alerte.situation')
  //       .exec(),
  //     QuestionModel.find({ department: doc.id }),
  //   ]))
  // .then(([{ usages, origines, situations }, zones, questions]) => ({
  //   zones,
  //   usages,
  //   origines,
  //   questions,
  //   situations,
  // })),
};

export default Query;
