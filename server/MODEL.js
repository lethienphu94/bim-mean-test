const listNameModel = [
    'LOD',
    'BIM'
];

exports = module.exports = function (app, mongoose) {
   app.schemas = {};
   listNameModel.forEach(function (nameModel) {
      require('./SCHEMA/' + nameModel)(app, mongoose);
   });
};
