import { Flex, Text, Image, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Commented({ user, comment }) {
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
        <Flex direction={"column"} rounded={5} boxShadow="lg" marginBottom={2}>
          <Flex dir="row">
            <Image
              src={`http://localhost:2305${komen.profilepicture}`}
              height="45px"
              width="45px"
              objectFit={"cover"}
              rounded={"full"}
              margin={4}
              marginBottom={2}
              shadow={"outline"}
            ></Image>
            <Text marginStart={3} marginTop={3} marginRight={1} fontSize="xl">
              @{komen.username} :
            </Text>
            <Text
              marginStart={3}
              marginTop={3}
              marginRight={1}
              fontStyle="italic"
              fontSize="xl"
            >
              {komen.comment}
            </Text>
          </Flex>
          <Flex justifyContent={"end"}>
            <Flex dir="column" justifyContent={"end"}>
              <Text fontSize="xx-small"> {komen.createdAt.slice(0, 10)}</Text>
            </Flex>
          </Flex>
        </Flex>
      );
    });
    return (
      <Flex
        direction={"column"}
        rounded={5}
        boxShadow="md"
        marginBottom={5}
        marginInlineStart={"25%"}
      >
        {komenMap}
      </Flex>
    );
  }

  return <div>{renderCommentUser()}</div>;
}
