import { observable,configure} from "mobx"

configure({
    enforceAction:'always'
})

const NewsStore=observable({
    sortList:{
        "1":"时事新闻",
        "2":"环球经济",
        "3":"科学技术",
        "4":"军事世界",
        "5":"世界体育",
        "6":"生活理财",
        "7":"人文历史",
    },
    sortColor:{
        "1":"geekblue",
        "2":"red",
        "3":"purple",
        "4":"#D8AD87",
        "5":"#818BD7",
        "6":"#D47799",
        "7":"#DEBD98",
    }
},{

})

export default NewsStore
