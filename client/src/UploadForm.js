import React from "react";
import { useMutation, gql } from "@apollo/client";

const UPLOAD_FILE = gql`
  mutation uploadFile($file: Upload!) {
    uploadFile(file: $file) {
      url
    }
  }
`;

const UploadForm = () => {
  const [uploadFile] = useMutation(UPLOAD_FILE, {
    onCompleted: (data) => console.log(data.uploadFile.url),
  });

  const fun = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    uploadFile({ variables: { file } });
  };

  return (
    <div>
      <h1>Upload File</h1>
      <input type="file" onChange={fun} />
    </div>
  );
};

export default UploadForm;
