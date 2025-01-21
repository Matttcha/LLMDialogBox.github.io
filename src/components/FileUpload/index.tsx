import React, { forwardRef, useImperativeHandle, useRef } from "react";

interface IProps {
  onUploadSuccess: () => void;
}

export default forwardRef((props: IProps, ref) => {
  const { onUploadSuccess } = props;
  const fileInputRef = useRef<any>("");
  //   const uploadData = useRef<any>({ // 如果支持多文件同时上传可能会用到
  //     list: [],
  //     uploading: false,
  //   });
  useImperativeHandle(ref, () => {
    return {
      click: onClickUpload,
    };
  });

  const onClickUpload = () => {
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  const handleFileChange = async () => {
    // 1.调用api接口上传文件，api地址 https://www.coze.cn/open/docs/developer_guides/upload_files#cd7682b8
    // 2.接口调用成功后获取到已上传的文件列表，并将其作为参数传给 onUploadSuccess，从而传递给父组件
    onUploadSuccess();
  };

  return (
    <input
      type="file"
      ref={fileInputRef}
      style={{ display: "none" }}
      onChange={handleFileChange}
    ></input>
  );
});
