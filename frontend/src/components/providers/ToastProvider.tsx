"use client";

import { useState } from "react";
import Toast from "react-bootstrap/Toast";

function ToastProvider() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  return (
    <Toast show={show} onClose={handleClose}>
      <Toast.Header>
        <strong className="me-auto">Bootstrap</strong>
        <small>11 mins ago</small>
      </Toast.Header>
      <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
    </Toast>
  );
}

export default ToastProvider;
