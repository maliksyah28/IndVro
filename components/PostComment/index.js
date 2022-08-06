import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import instance from "../../servee";
import { Flex, Button, Input, Box, Image, Text } from "@chakra-ui/react";

const CreateComment = ({ user, idpost }) => {
  const router = useRouter();
  //   console.log(Postspecific[0].idpost)

  const [comment, setComment] = useState();

  async function postComment() {
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
      window.location.reload();
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
        marginBottom={2}
        padding="2"
        marginInlineStart={"25%"}
      >
        {" "}
        <Flex>
          <Image
            src={`http://localhost:2305${user.profilepicture}`}
            height="45px"
            width="45px"
            objectFit={"cover"}
            rounded={"full"}
            marginBottom={2}
          ></Image>
          <Text marginStart={3} marginTop={2} marginRight={2} fontSize="xl">
            @{user.username}
          </Text>
          <input
            type={"text"}
            marginStart={4}
            pading={"10px"}
            width={"100%"}
            placeholder="Give ur Advice"
            variant={"ghost"}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </Flex>
        <Button px={"5"} py={"2"} rounded={"full"} onClick={postComment}>
          Comment
        </Button>
      </Box>
    </>
  );
};

export default CreateComment;
