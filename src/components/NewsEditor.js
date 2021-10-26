import React, { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function NewsEditor({ getContent, content }) {
  const [editorState, setEditState] = useState(EditorState.createEmpty());

  useEffect(() => {
    if (content === undefined) {
      return;
    }
    const html = content;
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditState(() => editorState);
    }
  }, [content]);

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={(editorState) => setEditState(editorState)}
      onBlur={() =>
        getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
      }
    />
  );
}
