import React, { useEffect, useRef, useState } from "react";
import "./index.less";
import getStyleName from "../../utils/getStyleName";
import { IconFile, IconFileImage, IconSend } from "@arco-design/web-react/icon";
import { Tooltip, Input } from "antd";
import FileUpload from "../FileUpload";

const { TextArea } = Input;

import { useChatStore } from "../../store";
import useConversation from "../../hooks/useConversation";
import { LoadingOutlined, FileWordOutlined, FileTextOutlined, FileExcelOutlined, FilePdfOutlined, FilePptOutlined, CloseCircleOutlined, DeleteFilled} from '@ant-design/icons';
import { IInput, IImage, IFile } from "../../type";
const style = getStyleName("chat-input");

interface IProps {}

interface IFileUploadRef {
  click: () => {};
}

/**
 * 对话输入框
 * @param props
 */
const ChatInput = (props: IProps) => {
  const store = useChatStore();
  const [input, setInput] = useState<string>("");
  const [imageList, setImageList] = useState<IImage[]>([]);
  const [fileList, setFileList] = useState<IFile[]>([]);
  const { sendMessage } = useConversation();
  const fileUploadRef = useRef<IFileUploadRef>(null);

  // 当前对话切换时，清空文本框、图片列表、文件列表
  useEffect(() => {
    setInput("");
    setImageList([]);
    setFileList([]);
  }, [store.currentConversation]);

  const deleteFile = (id, type) => {

    if (type === 'img') {
      let images = [...imageList].filter((item) => {
      return item.id!==id
    })
    setImageList(images)
    } else {
      let files = [...fileList].filter((item) => {
      return item.id!==id
    })
    setFileList(files)
    }
    
  }

  // 上传文件成功
  const onUploadSuccess = (file_name: string, id: string, base64?: string, uploadStatus?:string) => {
      let updatedImageList = [...imageList];
      let updatedFileList = [...fileList];

    
      if (base64) {
        // 如果是图片类型
        let newImageObject:IImage = { file_name, id, base64, status:uploadStatus};
        updatedImageList.push(newImageObject);
        setImageList(updatedImageList);
        
      } else {
        // 如果是其他文件类型
        let newFileObject:IFile = { file_name, id, status:uploadStatus}; 
        updatedFileList.push(newFileObject);
        setFileList(updatedFileList);
  
      }
  };

  const updateFileList = (type: string, file: IFile | IImage) => {
    if (type === 'img') {
      setImageList([...imageList as IImage[], file as IImage])
    }
    if (type === 'file') {
      setFileList([...fileList as IFile[], file as IFile])
    }
  }
  const updateFileListFail = (type: string) => {
    if (type === 'img') {
      setImageList([...imageList as IImage[]])
    }
    if (type === 'file') {
      setFileList([...fileList as IFile[]])
    }
  }


  return (
    <>
      <div className={style("")}>
        <div className={style("textarea")}>
          <div className={style("textarea-files")}>

            {imageList.map((img) => (
              <div  className={style("textarea-files-image")} key={img.id}>
                <div className={style("textarea-files-image-img")} >
                  {img.base64==='base64'?<LoadingOutlined />:<img src={img.base64} />}
                </div>
                <CloseCircleOutlined className={style("textarea-files-image-delete")} onClick={() => {
                  deleteFile(img.id, 'img')
                  }}/>
              </div>
            ))}
            
            {fileList.map((file) => (
              <div className={style("textarea-files-file")} key={file.id}>

                {file.status==='上传中'?<LoadingOutlined />:file.file_name.split('.').slice(-1)[0] === 'ppt'||'pptx' ? <FilePptOutlined /> : file.file_name.split('.').slice(-1)[0] === 'pdf' ? <FilePdfOutlined /> :file.file_name.split('.').slice(-1)[0] === 'xls'||'xlsx' ? <FileExcelOutlined /> :file.file_name.split('.').slice(-1)[0] === 'doc'||'docx' ? <FileWordOutlined /> :<FileTextOutlined />}
                <div className={style("textarea-files-file-name")}>{file.file_name}</div>
                <div className={style("textarea-files-file-status")}>{ file.status}</div>
                <CloseCircleOutlined className={style("textarea-files-file-delete")} onClick={() => {
                  deleteFile(file.id, 'file')
                }} />
                

              </div>
            ))}
          </div>
          <TextArea
            placeholder="Enter something"
            style={{ height: 80, width: 510 }}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
        </div>
        <div className={style("btns")}>
          <div
            className={style("btns-btn")}
            onClick={() => {
              fileUploadRef.current?.click();
            }}
          >
            <Tooltip title="上传文件 单个最大512MB 支持doc、docs、pdf等">
              <IconFile />
            </Tooltip>
          </div>
          <div
            className={style("btns-btn")}
            onClick={() => {
              fileUploadRef.current?.click();
            }}
          >
            <Tooltip title="上传图片">
              <IconFileImage />
            </Tooltip>
          </div>
          <div
            className={`${style("btns-btn")} ${style("btns-send")}`}
            onClick={async () => {
              if(store.isLoading){return}
              if(input.replace(/\s+/g, '')===''){return}

              const fileStatusList = fileList.map(item => item.status)
              const imageStatusList = imageList.map(item=> item.status)
              if ([...fileStatusList, ...imageStatusList].includes('上传中')) {

                return;
              }
              const messageInput: IInput = {
                text: input, 
                fileList: fileList,
                imageList: imageList
              };
              setFileList([])
              setImageList([])
              setInput('')
              await sendMessage(messageInput);
              
            }}
          >
            <IconSend className={style("btns-btn-send")} />
          </div>
        </div>
      </div>
      <FileUpload ref={fileUploadRef} onUploadSuccess={onUploadSuccess} updateFileList={updateFileList} updateFileListFail={updateFileListFail} />
    </>
  );
};

export default ChatInput;
