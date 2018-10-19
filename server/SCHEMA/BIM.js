

exports = module.exports = function (app, mongoose) {
    var Schema = mongoose.Schema;
    var dataSchema = new mongoose.Schema({
        name: { type: String, default: 'Unknown name' },
        designerCode: { type: String, default: '' },
        cenkrosCode: { type: String, default: '' },
        // Category
        // Revision
        description: { type: String, default: '' },
        lodLevels: [{ type: Schema.Types.ObjectId, ref: 'LOD' }],
        parameters: { type: Object, default: { unit: '', sucategory_id: { term: '' } } },
        updateAt: { type: Date, default: Date.now() },
        createAt: { type: Date, default: Date.now() }
    });
    app.db.model('BIM', dataSchema);
}