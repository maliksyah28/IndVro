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
  CheckIcon,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { BsHeartFill } from "react-icons/bs";
import { IconButton } from "@chakra-ui/react";
import instance from "../../servee";
import { useRouter } from "next/router";

import CreateComment from "../PostComment";
import EditCaption from "../EditCaption";

const ContentDetail = ({ user, Postspecific, likedPost }) => {
  // console.log(Postspecific[0]);
  const router = useRouter();
  const [detail] = Postspecific;
  //detail.idpost
  const { idpost } = router.query;
  const { isOpen, onOpen, onClose } = useDisclosure();

  //   console.log(Postspecific[0]); // {idpost: 12, postan: '/public/content/weltqaz-26-1658751379083-content.png', caption: 'malu ah pake bahu', username: 'weltqaz', likes: 10, …}
  const [like, setLikes] = useState(likedPost);
  // console.log(detail);
  const [komen, setKomen] = useState(detail.comment);
  const [post, setPost] = useState(detail.postan);
  const [caption, setCaption] = useState(detail.caption);

  const getGetAllPost = async () => {
    try {
      const session = await getSession();
      const { token } = session.user;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const responsGetAllPost = await instance.get("/post/GetContent/", config);
      alert("succsess like");
    } catch (error) {
      console.log({ error });
      alert(error.response.data.message);
    }
  };
  const delContent = async () => {
    try {
      const session = await getSession();
      const { token } = session.user;
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await instance.delete(`/post/postdelete/${idpost}`, {}, config);
      alert("content Has Been Delete");
    } catch (error) {
      console.log({ error });
      alert("Is'nt YOUR");
      // error.response.data.message
    }
  };
  const edCaption = async (body) => {
    // console.log(body);
    try {
      const session = await getSession();
      const { token } = session.user;
      const input = {
        caption: body,
      };
      console.log(input);
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const responEditCap = await instance.patch(
        `/post/editCaptionContent/${idpost}`,
        input,
        config
      );
      // console.log(responEditCap);
      alert(responEditCap.data.message);
      window.location.reload();
    } catch (error) {
      console.log({ error });
      alert(error.response.data.message);
    }
  };
  const LikePost = async () => {
    try {
      const session = await getSession();
      const { token } = session.user;
      // console.log(token);
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      // console.log(config.headers);
      const getliked = await instance.get(`/likes/getlike/${idpost}`, config);
      // console.log(getliked);
      if (getliked.data.code == 400) return alert("You Have been liked");
      // } else if (getliked.data.code == 200) {
      //   // console.log(config.headers);
      // }
      alert("content Liked");
      await instance.post(`/likes/likedContent/${idpost}`, {}, config);
      window.location.reload();
      // setLikes(responsDetailPost.data.data.result);
    } catch (error) {
      console.log({ error });
      alert(error.response.data.message);
    }
  };
  return (
    <>
      <Flex
        dir="column"
        rounded={5}
        boxShadow="md"
        marginBottom={2}
        marginInlineStart={"25%"}
        bgGradient={
          "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(244,244,244,1) 50%, rgba(249,249,249,1) 100%)"
        }
      >
        {/* className="w-[19vw] h-[25vw] flex flex-col items-start rounded-[1vh] border-gray-500 border mb-[1vh] relative overflow-hidden" */}
        <div
          w={"25vw"}
          h={`25vw`}
          rounded={`1vh`}
          mb={`1vh`}
          relative="overflow-hidden"
        >
          <a href={""} className="z-[2]">
            <img
              w={"10vh"}
              h={`10vw`}
              rounded={`1vh`}
              z={2}
              // className="w-[10vh] h-[10vw] rounded-[1vh] z-[2]"
              src={`http://localhost:2305${post}`}
            />
          </a>
          <Flex dir="row" justifyContent={"space-between"}>
            {/* <Text marginStart={3} marginTop={2} fontSize="xl">
              {" "}
              @{detail.username}
              {/* <Icon as={IconButton} aria-label="LIKE" icon={<CheckIcon />} /> */}
            {/* </Text> */}

            <Text
              marginStart={3}
              marginTop={2}
              fontSize="xl"
              fontStyle="italic"
              fontWeight="bold"
            >
              Caption : {detail.caption}
            </Text>
            <Flex dir="row" justifyContent={"end"}>
              <Button
                variant={"ghost"}
                onClick={onOpen}
                marginStart={2}
                // marginTop={2}
              >
                {" "}
                :
              </Button>
              <EditCaption
                isOpen={isOpen}
                onClose={onClose}
                edCaption={edCaption}
                Postspecific={Postspecific}
              />
              <Text marginStart={1} marginTop={"1.5"} fontSize="xl">
                {" "}
                {like}
              </Text>
              <IconButton
                marginTop={1}
                variant={"unstyled"}
                color="red.400"
                _hover={{
                  background: "#e8f5fe",
                  color: "red.400",
                  rounded: "full",
                }}
                icon={<BsHeartFill />}
                onClick={LikePost}
              ></IconButton>
              <IconButton
                variant={"unstyled"}
                color="red.400"
                _hover={{
                  background: "#e8f5fe",
                  color: "red.400",
                  rounded: "full",
                }}
                icon={<DeleteIcon />}
                onClick={delContent}
              ></IconButton>
            </Flex>
          </Flex>
          <CreateComment user={user} />
        </div>
      </Flex>
    </>
  );
};

export default ContentDetail;
