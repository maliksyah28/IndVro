import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Heading,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";

function EditProfile({ isOpen, onClose, userProfile, onSaveDataUser }) {
  // console.log({ isOpen: isOpen });
  const [user, setUser] = useState(userProfile);
  const { username, email, Fullname, profilepicture, Bio } = user;
  const onHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            name="username"
            type="text"
            value={username}
            variant="filled"
            mb={3}
            onChange={onHandler}
          />
          <Input
            name="email"
            type="text"
            value={email}
            disabled
            variant="filled"
            mb={3}
            onChange={onHandler}
          />
          <Input
            name="Fullname"
            type="text"
            value={Fullname}
            variant="filled"
            mb={3}
            onChange={onHandler}
          />
          <Input
            name="Bio"
            type="text"
            value={Bio}
            variant="filled"
            mb={3}
            onChange={onHandler}
          />
        </ModalBody>

        <ModalFooter>
          <Button onClick={() => onSaveDataUser(user)}>Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EditProfile;
