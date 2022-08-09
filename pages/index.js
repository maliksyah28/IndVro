import {
  Button,
  Text,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Flex,
  Box,
  Badge,
  Textarea,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { BsHeartFill } from "react-icons/bs";
import { IconButton } from "@chakra-ui/react";
import { MdInsertPhoto } from "react-icons/md";
import { MdOutlineClose } from "react-icons/md";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { getSession } from "next-auth/react";
import instance from "../servee";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PostContent from "../components/postContent";
import FeedContent from "../components/FeedContent";
import { useRouter } from "next/router";
import EditCaption from "../components/EditCaption";

export default function Home(props) {
  // console.log(props);
  const { allPost } = props;
  const { user } = props;
  console.log(user);
  // console.log({ allPost });
  const { allPostedLength } = props;
  // console.log({ allPostedLength });
  const router = useRouter();
  const { idpost } = router.query;
  const { isOpen, onOpen, onClose } = useDisclosure();

  //buat GET post
  const [content, setContent] = useState(allPost); // [{id : 1}, {id: 2}, {id: 3}]
  const [ofset, setOfSet] = useState(1);
  const [caption, setCaption] = useState();
  const [ContentImage, setContentImage] = useState(); // ini buat gambar post
  const [captionPost, setCaptionPost] = useState();

  async function postCaption() {
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
      // console.log(responsNewContent);
      alert(responsNewContent.data.message);
      const responsGetAllPost = await instance.get("/post/GetContent/", config);
      // console.log({ responsGetAllPost });
      setContent(responsGetAllPost.data.data.result);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

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

      setContent(responsGetAllPost.data.data.result);
      setOfSet(ofset + 1);
    } catch (error) {
      console.log({ error });
    }
  }

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
        headers: { Authorization: `Bearer ${token}` },
        params: { getLimitedShow, getOfSet },
      };

      //get liked ?
      const getliked = await instance.get(
        `/likes/getlike/${idpost}`,
        config
      );
      // console.log(config)
      if (getliked.data.code == 400) {
        return alert("You Have been liked");
      } else if (getliked.data.code == 200) {
        // console.log(config.headers);
        alert("content Liked");
      }
      await instance.post(`/likes/likedContent/${idpost}`,{}, config);
      console.log(config);
      //buat get kembali
      const responsGetAllPost = await instance.get(
        "/post/GetContent/",
        
        config
      );
      // console.log({ responsGetAllPost });
      setContent(responsGetAllPost.data.data.result);
    } catch (error) {
      console.log({ error });
      alert(error.response.data.message);
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
      const responsGetAllPost = await instance.get("/post/GetContent/", config);
      // console.log({ responsGetAllPost });
      setContent(responsGetAllPost.data.data.result);
    } catch (error) {
      console.log({ error });
      alert(error.response.data.message);
    }
  }

  const onSaveNewCaption = async (caption) => {
    try {
      const session = await getSession();
      const { token } = session.user;
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      // const body = { caption };
      await instance.patch(`/post/editCaptionContent/${idpost}`, body, config);
      alert("thanks");
    } catch (error) {
      console.log({ error });
      alert(error.response.data.message);
    }
  };

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
      return (
        <Box
          maxW="xl"
          borderWidth="2px"
          borderRadius="lg"
          borderColor={"grey"}
          overflow="hidden"
          // marginLeft={25}
          // marginRight={25}
          marginTop={5}
          // pos="-webkit-sticky"
          justifyContent={"center"}
          alignItems={"center"}
          // margin={50}
        >
          <a href={`/detailPost/${post.idpost}`}>
            <Image
              width={"950%"}
              height={`950%`}
              src={`http://localhost:2305${post.postan}`}
              alt={post.postan}
            />
          </a>
          ​
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
            ​
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
            ​
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
    <div justifyContent={"center"} alignItems={"center"}>
      {/* className={styles.container} */}
      <Head>
        <title>Home</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="logo-enigma.ico" />
      </Head>
      <Flex
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {/* <div className="w-[100%] h-[100%]"> */}
        <div>
          <Flex dir="row" marginRight={"380px"} marginBottom={5}>
            <form>
              <Textarea
                type={"text"}
                // marginRight={"5px"}
                variant={"outline"}
                width={"290%"}
                height={"50%"}
                placeholder="Describe your feel?"
                value={captionPost}
                onChange={(event) => setCaptionPost(event.target.value)}
              />
              {ContentImage && (
                <Flex flexDirection="column">
                  <MdOutlineClose onClick={() => setContentImage()} />
                  <Image
                    src={URL.createObjectURL(ContentImage)}
                    width={"100%"}
                    height={"100%"}
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
                <Button
                  px={"5"}
                  py={"2"}
                  rounded={"full"}
                  onClick={postCaption}
                >
                  POST
                </Button>
              </Flex>
            </form>
          </Flex>
        </div>
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
          {/* <FeedContent
            allPost={allPost}
            allPostedLength={allPostedLength}
            user={user}
          /> */}
        </InfiniteScroll>
        {/* </div> */}
      </Flex>

      <footer className={styles.footer}>
        Powered by{" "}
        <span className={styles.logo}>
          <Image src="/enigma.png" alt="Vercel Logo" width={72} height={16} />
        </span>
      </footer>
    </div>
  );
}

// bikin yg belum login gabisa ke menu utama
export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });
    // console.log({ session });
    // console.log(session);
    if (!session) return { redirect: { destination: "/login" } };
    // console.log("here ?");

    const getLimitedShow = 10;
    const getOfSet = 0;
    // console.log({ getLimitedShow, getOfSet });
    const { token } = session.user;
    // console.log({ token });
    // const { idpost } = context.params;
    const config = {
      params: { getLimitedShow, getOfSet },
      headers: { Authorization: `Bearer ${token}` },
    };

    // user
    const responsGetUser = await instance("/user/profile", config);

    // buat ngambil data all post di API
    const responsGetAllPost = await instance.get("/post/GetContent/", config);
    return {
      props: {
        user: responsGetUser.data.data.result,
        session,
        allPost: responsGetAllPost.data.data.result,
        allPostedLength: responsGetAllPost.data.data.dataLength,
      },
    };
  } catch (error) {
    console.log(error);
    const errorCaution = error.message;
    return { props: { errorCaution } };
  }
}
