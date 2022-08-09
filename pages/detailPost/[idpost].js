import {
  Flex,
  VStack,
  Box,
  Image,
  Text,
  Button,
  Divider,
  useDisclosure,
} from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import CreateComment from "../../components/PostComment";
import Commented from "../../components/Commented";
import ContentDetail from "../../components/ContentDetail";
import instance from "../../servee";
import EditCaption from "../../components/EditCaption";

function postDetail(props) {
  // console.log(props);
  const { Postspecific } = props;
  // console.log({ tes: props });
  const { PostComment } = props;
  // console.log(Postspecific);
  const { user } = props;
  // console.log(user);
  const { comment } = props;
  const { commentLength } = props;
  const { likedPost } = props;

  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const [listComment, setListComment] = useState(comment);
  // const [komenLength, setKomenLength] = useState(commentLength);
  const [limit, setLimit] = useState(5);
  const [offset, setOffset] = useState(0);
  const [commentCreate, setCommentCreate] = useState();

  // const renderComment = () => {
  //   return listComment.map((komen) => {
  //     return <Commented id={komen.idpost} comment={comment} />;
  //   });
  // };

  // const getComment = async () => {
  //   try {
  //     const session = await getSession();
  //     const { token } = session.user;
  //     const comentLimitedShow = 5;
  //     const comenttOfSet = 0;
  //     const config = {
  //       params: { comentLimitedShow, comenttOfSet },
  //       headers: { Authorization: `Bearer ${token}` },
  //     };
  //     const responsGetComment = await instance.get(
  //       `/comment/GetCommentContent/${idpost}`,
  //       config
  //     );
  //     setListComment(responsGetComment.data.data.result);
  //     setOffset(0);
  //   } catch (error) {
  //     console.log({ error });
  //     alert(error.response.data.message);
  //   }
  // };

  // const showMoreHandler = async () => {
  //   setOffset(offset + 1);
  //   try {
  //     const session = await getSession();
  //     const { token } = session.user;
  //     const config = {
  //       params: { offset: offset + 1, limit },
  //       headers: { Authorization: `Bearer ${token}` },
  //     };
  //     const responsGetComment = await instance.get(
  //       `/comment/GetCommentContent/${idpost}`,
  //       config
  //     );
  //     setListComment([...listComment, ...responsGetComment.data.data]);
  //   } catch (error) {
  //     console.log({ error });
  //     alert(error.response.data.message);
  //   }
  // };
  // async function postComment(idpost) {
  //   try {
  //     const session = await getSession();
  //     const { token } = session.user;

  //     const body = new FormData();
  //     body.append("comment", commentCreate);
  //     body.

  //     const config = {
  //       headers: { Authorization: `Bearer ${token}` },
  //     };

  //     const responsPostComment = await instance.post(
  //       `/comment/CommentContent/${idpost}`,
  //       body,
  //       config
  //     );
  //     alert(responsPostComment.data.message);
  //   } catch (error) {
  //     console.log(error);
  //     alert(error);
  //   }
  // }

  async function getDetailPost() {
    try {
      const session = await getSession();
      const { token } = session.user;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const responsDetailPost = await instance.get(
        `/post/DetailContent/${idpost}`,
        config
      );
    } catch (error) {}
  }

  return (
    <VStack>
      <Flex
        height="90vh"
        width="full"
        maxWidth="100vw"
        ms="auto"
        me="auto"
        padding="0 10px"
        // bgGradient={
        //   "linear(270deg, rgba(252,247,255,1) 28%, rgba(18,61,97,1) 70%, rgba(10,0,133,1) 98%)"
        // }
      >
        <Head>
          <title>DETAIL</title>
          <link rel="icon" href="../public/logo-enigma.ico" />
        </Head>
        <Flex flexGrow={"0.4"} w="70%" flexDirection="column" marginInline={2}>
          <ContentDetail
            user={user}
            Postspecific={Postspecific}
            likedPost={likedPost}
          />
          <Divider />
          <Commented user={user} comment={comment} />
        </Flex>
      </Flex>
    </VStack>
  );
}

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });
    // console.log(session);
    if (!session) return { redirect: { destination: "/login" } };
    // console.log("hehe");

    const { token } = session.user;
    // console.log({ token });

    const { idpost } = context.params;
    const comentLimitedShow = 5;
    const comenttOfSet = 0;

    const config = {
      params: { comentLimitedShow, comenttOfSet },
      headers: { Authorization: `Bearer ${token}` },
    };

    // console.log(config);
    const res = await instance.get("/user/profile", config);
    // console.log(res);

    // ambil data post detail
    const responsGetPostDetail = await instance.get(
      `/post/DetailContent/${idpost}`,
      config
    );
    // console.log({ dongo: responsGetPostDetail.data.data.result });

    // ambil komentar
    const responsComment = await instance.get(
      `/comment/GetCommentContent/${idpost}`,
      config
    );
    // console.log(responsComment.data.data.result);
    // console.log(responsComment.data.data.datalength);

    // post komentar
    const responsPostComment = await instance.post(
      `/comment/CommentContent/${idpost}`,
      {},
      config
    );

    // const getPostLikes = await instance.get(`/likes/getlike/${idpost}`, config);
    // console.log(getPostLikes.data);
    // console.log(responsPostComment.data.data.result);
    return {
      props: {
        user: res.data.data.result[0],
        session,
        Postspecific: responsGetPostDetail.data?.data.result,
        comment: responsComment?.data?.data.result,
        commentLength: responsComment?.data?.data.datalength,
        PostComment: responsPostComment?.data?.data.result,
        likedPost: responsGetPostDetail?.data?.data.likes,
      },
    };
  } catch (error) {
    console.log(error);
    return { props: {} };
  }
}
export default postDetail;
