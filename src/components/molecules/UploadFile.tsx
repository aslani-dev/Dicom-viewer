import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileContext } from "../../Hooks/FileContextProvider";
import axios from "axios";
import { resetFile, setFileState } from "../../Store";
import UploadFileRenderer from "./UploadFileRenderer";
import { FileInitialState } from "../../Helper/constants";

function UploadFile() {
  const {
    triggerUpload,
    isUploadedSuccessfull,
    uploadProgress,
    isFaildUpload,
  }: FileInitialState = useSelector((state: any) => state.fileState);
  const { file } = useContext(FileContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (triggerUpload && file) uploadFile(file);
  }, [triggerUpload]);

  if (!triggerUpload) {
    return;
  }
  const handleDelete = () => {
    dispatch(resetFile());
  };
  const uploadFile = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post("https://api.escuelajs.co/api/v1/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
            );
            dispatch(setFileState([{ path: "uploadProgress", value: progress }]));
        },
      })
      .then(() => {
        dispatch(
          setFileState([
            { path: "isUploadedSuccessfull", value: true },
            { path: "isFaildUpload", value: false },
            { path: "uploadProgress", value: 100 },
          ])
        );
      })
      .catch(() => {
        dispatch(
          setFileState([
            { path: "isUploadedSuccessfull", value: false },
            { path: "isFaildUpload", value: true },
          ])
        );
      });
  };

  return (
    <UploadFileRenderer
      fileName={file?.name}
      handleDelete={handleDelete}
      isFaildUpload={isFaildUpload}
      isUploadedSuccessfull={isUploadedSuccessfull}
      uploadProgress={uploadProgress}
    />
  );
}

export default UploadFile;