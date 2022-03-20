import React, { useRef, useState, useEffect } from "react";
import './imageUpload.css';
import Button from "./Button";

const ImageUpload = props => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    } else {
    const fileReader = new FileReader(); // Part of browser
    // Must load before calling
    fileReader.onload = () => {
      // Tricky API
      setPreviewUrl(fileReader.result);
    };
    // Extracts URL
    fileReader.readAsDataURL(file);
    }
  }, [file]);
  // opens the image picker
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
  // shows picked img
  const pickedHandler = event => {
    // should never be undefined
    let pickedFile;
    // temporary shrotcut to sending validity
    let fileIsValid = isValid;
    // If there is a single file picked, setFile state to picked file, and valid to true, then set props as id and file
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid)
  };

  return (
    <div className="form-control">
      <input 
        id={`${props.id} 'file-selector`} 
        ref={filePickerRef}
        style={{ display: 'none' }} 
        type="file" 
        accept=".jpg, .png, .jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;