import { Flex, Button, Input } from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import instance from "../../servee";
import { MdInsertPhoto } from "react-icons/md";
import { MdOutlineClose } from "react-icons/md";
import Image from "next/image";

const PostContent = (props) => {
  const router = useRouter();
  // console.log(allPost);
  const [ContentImage, setContentImage] = useState(); // ini buat gambar post
  const [captionPost, setCaptionPost] = useState(); // ini buat caption
  // const { user_Id } = props;
  async function postCaption() {
    try {
      const session = await getSession();
      const { token } = session.user;

      const body = new FormData();
      body.append("content", ContentImage);
      body.append("caption", captionPost);

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const responsNewContent = await instance.post(
        "/post/postContent",
        body,
        config
      );
      // console.log(responsNewContent);
      alert(responsNewContent.data.message);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }
  // tampilan
  return (
    <div>
      <Flex dir="row">
        <form>
          <input
            type={"text"}
            marginLeft={"5px"}
            width={"50%"}
            height={"50%"}
            placeholder="Describe your feel?"
            variant={"ghost"}
            value={captionPost}
            onChange={(event) => setCaptionPost(event.target.value)}
          />
          {ContentImage && (
            <Flex flexDirection="column">
              <MdOutlineClose onClick={() => setContentImage()} />
              <Image
                src={URL.createObjectURL(ContentImage)}
                width={"50%"}
                height={"50%"}
              />
            </Flex>
          )}
          <Flex marginLeft={"5px"} alignItems={"center"}>
            <label
              htmlFor="imagePost"
              style={{
                alignItems: "center",
                cursor: "pointer",
                marginLeft: "60px",
                marginTop: "5px",
              }}
            >
              <MdInsertPhoto />
              <input
                style={{ display: "none" }}
                type="file"
                id="imagePost"
                onChange={(event) => setContentImage(event.target.files[0])}
              />
            </label>
            <Button px={"5"} py={"2"} rounded={"full"} onClick={postCaption}>
              POST
            </Button>
          </Flex>
        </form>
      </Flex>
    </div>
  );
};

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });
    // console.log(session);
    if (!session) return { redirect: { destination: "/login" } };

    const { token } = session.user;
    // console.log({ token });
    const getLimitedShow = 10;
    const getOfSet = 0;
    const config = {
      params: { getLimitedShow, getOfSet },
      headers: { Authorization: `Bearer ${token}` },
    };
    const res = await instance.get("/user/profile", config);

    const responsGetAllPost = await instance.get("/post/GetContent/", config);
    return {
      props: {
        user: res.data.data.result[0],
        session,
        allPost: responsGetAllPost.data.data.result,
        allPostedLength: responsGetAllPost.data.data.dataLength,
      },
    };
  } catch (error) {
    console.log(error);
    return { props: {} };
  }
}
export default PostContent;
