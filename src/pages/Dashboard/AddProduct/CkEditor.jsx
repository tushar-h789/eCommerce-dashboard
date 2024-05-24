import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const CkEditor = () => {
  return (
    <div className="my-6 w-[800px] ">
        <CKEditor
      editor={ClassicEditor}
      data="<p>Hello from CKEditor&nbsp;5!</p>"
      onReady={(editor) => {
        // You can store the "editor" and use when it is needed.
        console.log("Editor is ready to use!", editor);
      }}
      onChange={(event, editor) => {
        const data = editor.getData()
        console.log(data);
      }}
      onBlur={(event, editor) => {
        console.log("Blur.", editor);
      }}
      onFocus={(event, editor) => {
        console.log("Focus.", editor);
      }}
    />
    </div>
  );
};

export default CkEditor;
