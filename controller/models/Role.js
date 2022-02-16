const mongoose = require("mongoose")

const RoleSchema = mongoose.Schema({
    value: {
        type: String,
        unique: true,
        default: "USER"
    }
})

const Role = module.exports = mongoose.model("Role", RoleSchema);
