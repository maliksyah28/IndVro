import { getSession } from "next-auth/react";
import { useState } from "react";
import {
  Box,
  Text,
  Image,
  Flex,
  Button,
  Link,
  Icon,
  IconButton,
  CheckIcon,
} from "@chakra-ui/react";
import instance from "../../servee";

import CreateComment from "../PostComment";

export default function ContentDetail({ user, Postspecific }) {
  // console.log(Postspecific[0]);
  const [detail] = Postspecific;

  //   console.log(Postspecific[0]); // {idpost: 12, postan: '/public/content/weltqaz-26-1658751379083-content.png', caption: 'malu ah pake bahu', username: 'weltqaz', likes: 10, …}
  const [like, setLikes] = useState(detail.likes);
  const [komen, setKomen] = useState(detail.comment);
  const [post, setPost] = useState(detail.postan);

  const onLikeHandler = async () => {
    try {
      const session = await getSession();
      const { token } = session.user;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const responsGetAllPost = await instance.get("/post/GetContent/", config);
    } catch (error) {}
  };

  return (
    <Flex
      dir="column"
      rounded={5}
      boxShadow="md"
      marginBottom={2}
      marginInlineStart={"25%"}
    >
      <div className="w-[19vw] h-[25vw] flex flex-col items-start rounded-[1vh] border-gray-500 border mb-[1vh] relative overflow-hidden">
        <a href={""} className="z-[2]">
          <img
            className="w-[10vh] h-[10vw] rounded-[1vh] z-[2]"
            src={`http://localhost:2305${post}`}
          />
        </a>
        <Text marginStart={3} marginTop={2} fontSize="xl">
          {" "}
          @{detail.username}
          {/* <Icon as={IconButton} aria-label="LIKE" icon={<CheckIcon />} /> */}
        </Text>
        {/* <Icon as={MdReceipt} w={6} h={6} /> */}
      </div>
      <div>
        <CreateComment user={user} idpost={detail.idpost} />
      </div>
    </Flex>
  );
}
