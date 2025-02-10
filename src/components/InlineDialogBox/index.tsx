import React, { useEffect, useRef, useState } from 'react';
import { Tooltip, Input, Button, Modal } from "antd";
import getStyleName from "../../utils/getStyleName"
import { IconFile, IconFileImage, IconSend } from "@arco-design/web-react/icon";
import { SearchOutlined } from '@ant-design/icons';
import FileUpload from "../FileUpload";
import { useChatStore } from "../../store";
import { IInput, IImage, IFile } from "../../type";
import useConversation from "../../hooks/useConversation";
import { LoadingOutlined, FileWordOutlined, FileTextOutlined, FileExcelOutlined, FilePdfOutlined, FilePptOutlined, CloseCircleOutlined, DeleteFilled } from '@ant-design/icons';
import "./index.less";
import { IMessage } from "../../type";
import Markdown from "../Markdown";
import Message from '../Message';
import OriginalChat from "../OriginalChat";

const { TextArea } = Input;
const style = getStyleName("inlineDialogBox");
interface IProps {
}
interface IFileUploadRef {
    click: () => {};
}
/**
 * 内联形态对话框组件
 * @param props
 */
const InlineDialogBox = (props: IProps) => {

    const store = useChatStore();
    const [input, setInput] = useState<string>("");
    const [imageList, setImageList] = useState<IImage[]>([]);
    const [fileList, setFileList] = useState<IFile[]>([]);
    const { sendMessage } = useConversation();
    const fileUploadRef = useRef<IFileUploadRef>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const message = store.messages


    // console.log('message', message)
    // console.log('role',role)


    const onUploadSuccess = (file_name: string, id: string, base64?: string, uploadStatus?: string) => {
        let updatedImageList = [...imageList];
        let updatedFileList = [...fileList];


        if (base64) {
            // 如果是图片类型
            let newImageObject: IImage = { file_name, id, base64, status: uploadStatus };
            updatedImageList.push(newImageObject);
            setImageList(updatedImageList);

        } else {
            // 如果是其他文件类型
            let newFileObject: IFile = { file_name, id, status: uploadStatus };
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
    const deleteFile = (id, type) => {

        if (type === 'img') {
            let images = [...imageList].filter((item) => {
                return item.id !== id
            })
            setImageList(images)
        } else {
            let files = [...fileList].filter((item) => {
                return item.id !== id
            })
            setFileList(files)
        }

    }
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const suffix = (
        <Button  icon={<SearchOutlined />} style={{border:"none"}} onClick={showModal}/>
    );

    const messagesRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const messagesContainer = messagesRef.current;
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }, [message]);
    return (
        <>
            <div className={style("")}>
                {/* <Search placeholder="input search text" allowClear onClick={showModal} style={{ width: 200 }} /> */}
                <Input
                    placeholder="Search..."
                    onClick={showModal}
                    suffix={suffix}
                />

                <Modal open={isModalOpen} onCancel={handleCancel} width={"630px"} closable={false} footer={null} centered={true}>

                    <div className={style("textarea")}>
                        <Input
                            className={style("textarea-input")}
                            placeholder="Enter something"
                            style={{ height: 50, width: 580 }}
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                            }}
                            suffix={
                                <div className={style("textarea-input-btns")}>
                                    <div
                                        className={style("textarea-input-btns-btn")}
                                        onClick={() => {
                                            fileUploadRef.current?.click();
                                        }}
                                    >
                                        <Tooltip title="上传文件 单个最大512MB 支持doc、docs、pdf等">
                                            <IconFile />
                                        </Tooltip>
                                    </div>
                                    <div
                                        className={style("textarea-input-btns-btn")}
                                        onClick={() => {
                                            fileUploadRef.current?.click();
                                        }}
                                    >
                                        <Tooltip title="上传图片">
                                            <IconFileImage />
                                        </Tooltip>
                                    </div>
                                    <div
                                        className={`${style("textarea-input-btns-btn")} ${style("textarea-input-btns-send")}`}
                                        onClick={async () => {
                                            if (store.isLoading) { return }
                                            if (input.replace(/\s+/g, '') === '') { return }

                                            const fileStatusList = fileList.map(item => item.status)
                                            const imageStatusList = imageList.map(item => item.status)
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
                                        <IconSend className={style("textarea-input-btns-btn-send")} />
                                    </div>
                                </div>

                            }
                        />
                        <div className={style("textarea-files")}>

                            {imageList.map((img) => (
                                <div className={style("textarea-files-image")} key={img.id}>
                                    <div className={style("textarea-files-image-img")} >
                                        {img.base64 === 'base64' ? <LoadingOutlined /> : <img src={img.base64} />}
                                    </div>
                                    <CloseCircleOutlined className={style("textarea-files-image-delete")} onClick={() => {
                                        deleteFile(img.id, 'img')
                                    }} />
                                </div>
                            ))}

                            {fileList.map((file) => (
                                <div className={style("textarea-files-file")} key={file.id}>

                                    {file.status === '上传中' ? <LoadingOutlined /> : file.file_name.split('.').slice(-1)[0] === 'ppt' || 'pptx' ? <FilePptOutlined /> : file.file_name.split('.').slice(-1)[0] === 'pdf' ? <FilePdfOutlined /> : file.file_name.split('.').slice(-1)[0] === 'xls' || 'xlsx' ? <FileExcelOutlined /> : file.file_name.split('.').slice(-1)[0] === 'doc' || 'docx' ? <FileWordOutlined /> : <FileTextOutlined />}
                                    <div className={style("textarea-files-file-name")}>{file.file_name}</div>
                                    <div className={style("textarea-files-file-status")}>{file.status}</div>
                                    <CloseCircleOutlined className={style("textarea-files-file-delete")} onClick={() => {
                                        deleteFile(file.id, 'file')
                                    }} />


                                </div>
                            ))}
                        </div>
                    </div>
                    {!store.currentConversation ? <OriginalChat /> :
                        <div className={style("messages")} ref={messagesRef}>
                            {
                                message.map((message, index) => (
                                    <Message message={message} />

                                ))
                            }
                        </div>}
                </Modal>
            </div>



            <FileUpload ref={fileUploadRef} onUploadSuccess={onUploadSuccess} updateFileList={updateFileList} updateFileListFail={updateFileListFail} />
        </>

    )
}

export default InlineDialogBox;