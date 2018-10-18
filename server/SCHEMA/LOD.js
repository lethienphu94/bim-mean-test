function validatorValue(value) {
    value = value << 0;
    return value > 0;
};

exports = module.exports = function (app, mongoose) {
    var dataSchema = new mongoose.Schema({
        name: { type: String, default: 'Unknown name' },
        value: { type: Number,required: true,validate: [validatorValue, 'Value must be greater than 0 !!!'] },
        fileName: { type: String, default: '' },
        updateAt: { type: Date, default: Date.now() },
        createAt: { type: Date, default: Date.now() }
    });
    app.db.model('LOD', dataSchema);
}