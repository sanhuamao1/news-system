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
    },
    c_state:{
        "1":"草稿",
        "2":"正在审核...",
        "3":"已通过",
        "4":"未通过"
    },
    c_color:{
        "1":"#f50",
        "2":"#2db7f5",
        "3":"#87d068",
        "4":"#f50",
    },
    p_state:{
        "1":"正在编辑...",
        "2":"待发布",
        "3":"已发布",
        "4":"已下线",
    },
    
    p_color:{
        "1":"red",
        "2":"blue",
        "3":"green",
        "4":"red",
    },
},{

})

export default NewsStore
