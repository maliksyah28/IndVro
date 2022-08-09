import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import instance from "../../servee";
import {
  Flex,
  Button,
  Input,
  Box,
  Image,
  Text,
  Textarea,
  IconButton,
} from "@chakra-ui/react";

const CreateComment = ({ user}) => {
  
  const router = useRouter();
  //   console.log(Postspecific[0].idpost)
  const { idpost } = router.query;

  const [comment, setComment] = useState();

  async function postComment(idpost) {
    // console.log(idpost)
    try {
      const session = await getSession();
      const { token } = session.user;

      const body = { comment };
      //   console.log(body, commentCreate);
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const responsPostComment = await instance.post(
        `/comment/CommentContent/${idpost}`,
        body,
        config
      );
      alert(responsPostComment.data.message);
      // window.location.reload();
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }
  return (
    <>
      {" "}
      <Box
        rounded={5}
        boxShadow="md"
        // marginBottom={2}
        // padding="1"
        // marginInlineStart={"25%"}
        // height="100px"
      >
        {" "}
        <Flex
          bgGradient={
            "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(244,244,244,1) 50%, rgba(249,249,249,1) 100%)"
          }
        >
          <Image
            src={`http://localhost:2305${user.profilepicture}`}
            height="45px"
            width="45px"
            objectFit={"cover"}
            rounded={"full"}
            margin={4}
            marginBottom={2}
            shadow={"outline"}
          ></Image>
          <Text marginStart={1} marginTop={2} marginRight={1} fontSize="xl">
            @{user.username}
          </Text>

          <Textarea
            type={"text"}
            marginStart={1}
            // marginEnd={4}
            width={"65%"}
            placeholder="Your Opinion Here"
            variant={"outline"}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
          <Button
            // marginEnd={2}
            marginLeft={6}
            px={"4"}
            py={"2"}
            rounded={"full"}
            onClick={() => {
              postComment(idpost);
            }}
          >
            Comment
          </Button>
          <IconButton />
        </Flex>
      </Box>
    </>
  );
};

export default CreateComment;
