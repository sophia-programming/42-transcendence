"use client";

import { UserDetailType } from "@/actions/user";
import Image from "next/image";
import { Container, Row, Col } from "react-bootstrap";

interface UserDetailProps {
  user: UserDetailType;
}

const UserDetail = ({ user }: UserDetailProps) => {
  return (
    <Container>
      <Row className="justify-content-center mb-5">
        <Col xs="auto">
          <div
            className="position-relative"
            style={{ width: "112px", height: "112px" }}
          >
            <Image
              src={user.avatar || "/default.png"}
              className="rounded-circle"
              alt={user.name || "avatar"}
              layout="fill"
              objectFit="cover"
            />
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center mb-5">
        <Col md={6} className="text-center">
          <h2 className="fw-bold fs-4">{user.name}</h2>
          <p className="lead">{user.introduction}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDetail;
