import React,{useState,useEffect} from 'react'
import RichTextEditor from 'react-rte';
export default function EditBox(props) {
    const [editorState, setEditorState] = useState(RichTextEditor.createEmptyValue());
    useEffect(() => {
        if(props.content!==""){
            setEditorState(RichTextEditor.createValueFromString(props.content, 'html'))
        }else{
            setEditorState(RichTextEditor.createEmptyValue())
        }
    }, [props.content]);
    return (
        <div>
            <RichTextEditor
                value={editorState}
                placeholder="请输入内容..."
                onChange={(editorState)=>{setEditorState(editorState)}}
                onBlur={()=>{props.done(editorState.toString('html'))}}
            />
        </div>
    )
}