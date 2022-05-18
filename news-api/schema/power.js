const Joi=require('joi')

const character_name=Joi.string().required()
const character_key=Joi.string().pattern(new RegExp('^[a-zA-Z]{3,30}$')).required()
const description=Joi.string().allow('')

exports.character_base_schema={
    query:{
        name:character_name,
        key:character_key,
        description
    }
}