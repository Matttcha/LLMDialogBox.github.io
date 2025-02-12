import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
} from "react";
import { message } from "antd";
import { file as fileUpload } from "../../mock";
import { IFile, IImage } from "../../type";
import { uploadFile } from "../../request/api";


interface IProps {
  onUploadSuccess: (
    file_name: string,
    id: string,
    base64?: string,
    uploadStatus?: string
  ) => void;
  updateFileList: (type: string, file: IFile | IImage) => void;
  updateFileListFail: (type: string) => void;
  accept: string;
}

export default forwardRef((props: IProps, ref) => {
  const { onUploadSuccess, updateFileList, updateFileListFail, accept } = props;
  const fileInputRef = useRef<any>("");
  const [fileName, setFileName] = useState<string>("");
  const [passedParam, setPassedParam] = useState<string | undefined>("");
  console.log('accept',accept)
  
  useImperativeHandle(ref, () => {
    // 把自己内部的方法暴露给调用自己的父组件去使用
    return {
      click: onClickUpload,
    };
  });

  const onClickUpload = () => {
    console.log(123)
    fileInputRef.current.value = "";
    fileInputRef.current.click();
    
  };

  const handleFileToBase64 = async (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result as string);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };

      reader.onerror = () => reject(new Error("File reading error"));

      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    if (e.target.files[0].size > 536870912) {
      return;
    } //文件大小要小于512MB
    console.log(e)
    const fileType = [
      "doc",
      "docx",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
      "pdf",
      "numbers",
      "csv",
      "jpg",
      "jpg2",
      "png",
      "gif",
      "webp",
      "heic",
      "heif",
      "bmp",
      "pcd",
      "tiff",
    ];
    if (fileType.includes(e.target.files[0].name.split(".").slice(-1)[0])) {
    } else {
      message.info("上传失败");
      return;
    }
    const file = e.target.files[0];
    const imageType = ["jpg", "jpg2", "png", "gif"];
    // let fileInput = document.getElementById('fileInput');

    if (imageType.includes(file.name.split(".").slice(-1)[0])) {
      // fileInput ? fileInput.accept = 'image/*' : null;
      setFileName(file.name);
      const newFile: IImage = {
        file_name: file.name,
        id: "",
        base64: "base64",
        status: "上传中",
      };
      updateFileList("img", newFile);
    } else {
      // fileInput ? fileInput.accept = '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.numbers,.csv' : null;
      setFileName(file.name);
      const newFile = {
        file_name: file.name,
        id: "",
        status: "上传中",
      };
      updateFileList("file", newFile);
    }

    try {
      setTimeout(async () => {
        const file = e.target.files[0];
        // console.log("file", file);

        const form_data = new FormData();
        form_data.append("file", file);

        // ````````
        const jsonData = await uploadFile(form_data)
        console.log(jsonData)

        // ````````

        // const jsonData = await fileUpload;
        const code = jsonData.code
        const msg = jsonData.msg
        if (code !== 0) {
          message.error(msg)
          //去除filelist imagelist最后一项
          imageType.includes(file.name.split(".").slice(-1)[0]) ? updateFileListFail("img") : updateFileListFail("file")
          return
        }


        let fileExtension;
        if (typeof file.name === "string") {
          fileExtension = file.name.split(".").slice(-1)[0];
        }
        let base64;
        if (
          ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(fileExtension)
        ) {
          base64 = await handleFileToBase64(file);
        }

        onUploadSuccess(
          jsonData.data.file_name,
          jsonData.data.id,
          base64,
          "上传完成"
        );
        return jsonData;
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <input
      type="file"
      ref={fileInputRef}
      style={{ display: "none" }}
      onChange={handleFileChange}
      accept={accept}
      // id="fileInput"
      ></input>
  );
});
