import { Flex, Text, Image, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Commented({ id, comment }) {
  // 0: {user_Id: 26, username: 'weltqaz', comment: 'pertamax gan ini', createdAt: '2022-08-04T16:25:02.000Z'}
  //1: {user_Id: 26, username: 'weltqaz', comment: 'kedua gan ini', createdAt: '2022-
  // console.log(comment); // ini isi nya array
  const router = useRouter();
  const [komentar, setKomentar] = useState(comment);
  // console.log(komentar);

  function renderCommentUser() {
    if (!komentar.length) {
      return (
        <div className="flex items-center justify-center w-[100%] h-[100%]">
          <p>
            {" "}
            You havent post anything yet,{" "}
            {/* <a href="" className="text-blue-500 hover:underline"> */}
            Post your first image!
            {/* </a> */}
          </p>
        </div>
      );
    }
    const komenMap = komentar.map((komen) => {
      // console.log(komen.username);
      return (
        <Flex
          dir="column"
          mt="5px"
          _hover={{
            background: "#e8f5fe",
            borderRadius: "10px",
          }}
          transitionDuration="500ms"
        >
          <Box p={3}>
            <Flex dir="row">
              <Text marginStart={2}> {komen.username}</Text>
              <Text marginStart={3}> {komen.createdAt.slice(0, 10)}</Text>
              <Text marginStart={4}> {komen.comment}</Text>
            </Flex>
            <Text>{komen.comment}</Text>
          </Box>
        </Flex>
      );
    });
    return (
      <div className="flex flex-wrap items-start justify-evenly">
        {komenMap}
      </div>
    );
  }

  return <div>{renderCommentUser()}</div>;
}
