const Joi=require('joi')

const username=Joi.string().alphanum().min(3).max(30).required()
const password=Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
const email=Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).allow('')
const sex=Joi.string().allow('')
const character_id=Joi.number().required()
const id=Joi.required()



exports.user_schema={
    body:{
        username,
        password
    }
}

exports.userinfo_schema={
    body:{
        username,
        email,
        sex,
    }
}

exports.adduser_schema={
    body:{
        username,
        password,
        email,
        sex,
        character_id
    }
}

exports.updateuser_schema={
    body:{
        id,
        character_id
    }
}

