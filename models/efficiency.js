const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const efficiencySchema = new Schema({
    employeeId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Employee'
    },
    date: {
        type: String,
        required: true
    },
    attendenceTime: {
        type: String,
        required: true
    },
    leaveTime: {
        type: String,
        required: true
    },
    endBreakTime:{
        type: String,
        required: true
    },
    dailyNetTime:{
        type: String,
        required: true
    },
    dailyEfficiency:{
        type: String,
        required: true
    },
    workingHours: {
        type: Number,
        required: true
    }


});

module.exports = mongoose.model('Efficiency',efficiencySchema);