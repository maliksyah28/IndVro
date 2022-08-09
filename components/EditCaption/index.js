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

function EditCaption(props) {
  const { isOpen, onOpen, onClose, Postspecific, edCaption } = props;
  // console.log(Postspecific[0].caption);
  const [caption, setCaption] = useState(Postspecific[0].caption);
  console.log(caption);
  const onHandler = (e) => {
    setCaption(e.target.value);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>EditCaption</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            name="caption"
            type="text"
            value={caption}
            variant="filled"
            mb={3}
            onChange={onHandler}
          />
        </ModalBody>

        <ModalFooter>
          <Button onClick={() => edCaption(caption)}>Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EditCaption;
