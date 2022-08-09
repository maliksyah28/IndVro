import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { getSession } from "next-auth/react";
import instance from "../../servee";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button, Input, Flex, Box, Badge, Textarea } from "@chakra-ui/react";
import { useRouter } from "next/router";
import styles from "../../styles/Home.module.css";
import { MdInsertPhoto } from "react-icons/md";
import { MdOutlineClose } from "react-icons/md";
import { DeleteIcon } from "@chakra-ui/icons";
import { BsHeartFill } from "react-icons/bs";
import { IconButton } from "@chakra-ui/react";

const FeedContent = ({ allPost, allPostedLength, user }) => {
  const router = useRouter();
  // console.log(user.username);
  //buat GET post
  const [content, setContent] = useState(allPost); // [{id : 1}, {id: 2}, {id: 3}]
  // console.log(content);
  const [ofset, setOfSet] = useState(1);
  // const [caption, setCaption] = useState();

  async function fetchMorePost() {
    try {
      const session = await getSession();
      const { token } = session.user;
      const getLimitedShow = { limit: 10 };
      const getOfSet = { ofset: (ofset - 1) * 10 };

      const config = {
        params: { getLimitedShow, getOfSet },
        headers: { Authorization: `Bearer ${token}` },
      };
      // console.log({ config });

      const responsGetAllPost = await instance.get(
        "/post/GetContent/", // endpoint nya di ubah, jangan pakai path variable :idpost, karena tidak digunakan
        config
      );
      //   console.log(responsGetAllPost);

      setContent(responsGetAllPost.data.data.result);
      setOfSet(ofset + 1);
    } catch (error) {
      console.log({ error });
    }
  }
  // buat ngepost
  const postCaption = () => {
    const [ContentImage, setContentImage] = useState(); // ini buat gambar post
    const [captionPost, setCaptionPost] = useState();

    async function Postcontent() {
      try {
        const session = await getSession();
        const { token } = session.user;

        const body = new FormData();
        body.append("content", ContentImage);
        body.append("caption", captionPost);
        const getLimitedShow = 10;
        const getOfSet = (ofset - 1) * 10;

        const config = {
          params: { getLimitedShow, getOfSet },
          headers: { Authorization: `Bearer ${token}` },
        };
        const responsNewContent = await instance.post(
          "/post/postContent",
          body,
          config
        );
        console.log(responsNewContent);
        alert(responsNewContent.data.message);

        const responsGetAllPost = await instance.get(
          "/post/GetContent/",
          config
        );
        // console.log({ responsGetAllPost });
        setContent(responsGetAllPost.data.data.result);
      } catch (error) {
        console.log(error);
        alert(error);
      }
    }
    return (
      <div>
        <Flex justifyContent={"space-between"}>
          <form>
            <Textarea
              type={"text"}
              marginStart={1}
              // marginEnd={4}
              variant={"outline"}
              marginLeft={"5px"}
              width={"280%"}
              placeholder="Describe your feel"
              value={captionPost}
              onChange={(event) => setCaptionPost(event.target.value)}
            />
            {ContentImage && (
              <Flex flexDirection="column">
                <MdOutlineClose onClick={() => setContentImage()} />
                <Image
                  width={"100%"}
                  height={"100%"}
                  // boxSize="100px"
                  objectFit="cover"
                  src={URL.createObjectURL(ContentImage)}
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
              <Button px={"5"} py={"2"} rounded={"full"} onClick={Postcontent}>
                POST
              </Button>
            </Flex>
          </form>
        </Flex>
      </div>
    );
  };

  // like
  // cara ambil param tuh begini contohnya
  async function likeContent(idpost) {
    // console.log({ props });
    try {
      const session = await getSession();
      // console.log({ session });

      const { token } = session.user;
      // console.log(token);
      const getLimitedShow = 10;
      const getOfSet = (ofset - 1) * 10;
      const config = {
        params: { getLimitedShow, getOfSet },
        headers: { Authorization: `Bearer ${token}` },
      };
      const getliked = await instance.get(`/likes/getlike/${idpost}`, config);
      // console.log(getliked);
      if (getliked.data.code == 400) return alert("You Have been liked");
      // } else if (getliked.data.code == 200) {
      //   // console.log(config.headers);
      // }
      alert("content Liked");
      await instance.post(`/likes/likedContent/${idpost}`, {}, config);
      // window.location.reload();
      // buat get kembali
      const responsGetAllPost = await instance.get("/post/GetContent/", config);
      // console.log({ responsGetAllPost });
      setContent(responsGetAllPost.data.data.result);
    } catch (error) {
      console.log({ error });
      alert(error);
    }
  }

  // delete post
  async function delContent(idpost) {
    try {
      const session = await getSession();
      const { token } = session.user;
      const getLimitedShow = 10;
      const getOfSet = (ofset - 1) * 10;
      const config = {
        params: { getLimitedShow, getOfSet },
        headers: { Authorization: `Bearer ${token}` },
      };
      await instance.delete(`/post/postdelete/${idpost}`, {}, config);
      alert("content Has Been Delete");

      const responsGetAllPost = await instance.get("/post/GetContent/", config);
      // console.log({ responsGetAllPost });
      setContent(responsGetAllPost.data.data.result);
    } catch (error) {
      console.log({ error });
      alert(error.response.data.message);
      // error.response.data.message
    }
  }

  // edit content caption
  async function editCaption(idpost) {
    try {
      const session = await getSession();
      const { token } = session.user;
      const getLimitedShow = 10;
      const getOfSet = (ofset - 1) * 10;
      const config = {
        params: { getLimitedShow, getOfSet },
        headers: { Authorization: `Bearer ${token}` },
      };
      const body = { caption };
      await instance.patch(`/post/editCaptionContent/${idpost}`, body, config);
      alert("caption updated");
      const responsGetAllPost = await instance.get(
        "/post/GetContent/:idpost",
        config
      );
      // console.log({ responsGetAllPost });
      setContent(responsGetAllPost.data.data.result);
    } catch (error) {
      onsole.log({ error });
      alert(error.response.data.message);
    }
  }

  // tampilan
  function renderContentUser() {
    if (!content.length) {
      return (
        <div className="flex items-center justify-center w-[100%] h-[100%]">
          <p>
            {" "}
            You havent post anything yet,{" "}
            <a href="/postan" className="text-blue-500 hover:underline">
              Post your first image!
            </a>
          </p>
        </div>
      );
    }
    const contentMap = content.map((post) => {
      if (user.username == post.username)
        return (
          <Box
            maxW="xl"
            borderWidth="2px"
            borderRadius="lg"
            borderColor={"grey"}
            overflow="hidden"
            // marginLeft={25}
            marginTop={5}
            justifyContent={"center"}
            alignItems={"center"}
            // pos="-webkit-sticky"
          >
            <a href={`/detailPost/${post.idpost}`}>
              <Image
                width={"950%"}
                height={`950%`}
                src={`http://localhost:2305${post.postan}`}
                alt={post.postan}
              />
            </a>

            <Box p="4" m={2}>
              <Box display="flex" alignItems="baseline">
                <Badge borderRadius="full" px="2" colorScheme="teal">
                  @{post.username}
                </Badge>
                <Box
                  color="gray.500"
                  fontWeight="semibold"
                  letterSpacing="wide"
                  fontSize="xs"
                  textTransform="uppercase"
                  ml="2"
                >
                  {post.likes} likes &bull;
                  <IconButton
                    // marginStart={10}
                    // marginTop={1}
                    // padding=""
                    marginLeft={3}
                    variant={"unstyled"}
                    color="red.400"
                    _hover={{
                      background: "#e8f5fe",
                      color: "red.400",
                      rounded: "full",
                    }}
                    icon={<BsHeartFill />}
                    onClick={() => {
                      likeContent(post.idpost);
                    }}
                  ></IconButton>
                  <IconButton
                    marginLeft={1}
                    // marginTop={1}
                    // padding=""
                    variant={"unstyled"}
                    marginBottom={2}
                    color="Black"
                    icon={<DeleteIcon />}
                    onClick={() => {
                      delContent(post.idpost);
                    }}
                  ></IconButton>
                </Box>
              </Box>

              <Box
                mt="1"
                fontWeight="semibold"
                as="h2"
                fontStyle={"italic"}
                lineHeight="tight"
                noOfLines={1}
              >
                {post.caption}
              </Box>

              <Box
                display="flex"
                mt="2"
                alignItems="center"
                justifyContent={"end"}
              >
                <Box as="span" ml="1" color="gray.600" fontSize="x-small">
                  {post.Timer.slice(0, 10)} createdAt
                </Box>
              </Box>
            </Box>
          </Box>
        );
    });
    return (
      <Flex direction={"column"} justifyContent={"center"}>
        {contentMap}
      </Flex>
    );
  }
  return (
    // <div>HEHE</div>
    <>
      <Flex justifyContent={"center"}>
        {/* <div className={styles.container}> */}
        {/* className="w-[10] h-[10] */}
        <div w={10} h={10}>
          {postCaption()}
          <InfiniteScroll
            dataLength={allPostedLength}
            next={() => {
              setTimeout(() => {
                fetchMorePost();
              }, 2000);
            }}
            //hasMore={content.length != allPostedLength}
            loader={
              <h4 className="w-[100%] flex items-center justify-center ">
                Loading
              </h4>
            }
            // className="overflow-auto scrollbar"
            endMessage={
              <div style={{ textAlign: "center" }}>
                <p className="font-[montserrat] font-[700]">
                  Yay! You have seen it all
                </p>
              </div>
            }
          >
            {renderContentUser()}
          </InfiniteScroll>
        </div>
      </Flex>
      <footer className={styles.footer}>
        Powered by{" "}
        <span className={styles.logo}>
          <Image src="/enigma.png" alt="Vercel Logo" width={72} height={16} />
        </span>
      </footer>
    </>
  );
};

// export async function getServerSideProps(context) {
//   try {
//     const session = await getSession({ req: context.req });
//     // console.log({ session });
//     // console.log(session);
//     if (!session) return { redirect: { destination: "/login" } };
//     console.log("tees");

//     const getLimitedShow = 10;
//     const getOfSet = 0;
//     // console.log({ getLimitedShow, getOfSet });
//     const { token } = session.user;
//     // console.log({ token });
//     // const { idpost } = context.params;
//     const config = {
//       params: { getLimitedShow, getOfSet },
//       headers: { Authorization: `Bearer ${token}` },
//     };
//     // console.log(config);
//     // user
//     const responsGetUser = await instance("/user/profile", config);

//     // buat ngambil data all post di API
//     const responsGetAllPost = await instance.get("/post/GetContent/", config);
//     // console.log({ allPost });
//     return {
//       props: {
//         user: responsGetUser.data.data.result,
//         session,
//         allPost: responsGetAllPost.data.data.result,
//         allPostedLength: responsGetAllPost.data.data.dataLength,
//       },
//     };
//   } catch (error) {
//     console.log(error);
//     const errorCaution = error.message;
//     return { props: { errorCaution } };
//   }
// }

export default FeedContent;
