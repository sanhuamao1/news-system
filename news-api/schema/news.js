const Joi=require('joi')

const id=Joi.number().required()
const title=Joi.string().required()
const content=Joi.string().required()
const sort_id=Joi.number().required()
const check_state=Joi.number().required()
const create_time=Joi.string().required()
const update_time=Joi.string().required()



const latest_check_id=Joi.number().required()
const check_time=Joi.string().required()
const check_person=Joi.string().required()
const check_comment=Joi.string().required()



exports.createnews_schema={
    body:{
        title,
        content,
        sort_id,
        check_state,
        create_time,
        update_time
    }
}


exports.editnews_schema={
    body:{
        id,
        title,
        content,
        sort_id,
        check_state,
        update_time
    }
}

exports.check_schema={
    body:{
        id,
        latest_check_id,
        check_comment,
    }
}
